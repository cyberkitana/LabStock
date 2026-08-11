"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ======================================================
// TYPES
// ======================================================

type LocationStatus = "OPENED" | "UNOPENED" | "UNKNOWN";

type SubmittedLocation = {
  storageId: string;
  quantity: number;
  opened: LocationStatus;
};

// ======================================================
// HELPER FUNCTIONS
// ======================================================

// ------------------------------------------------------
// Parse expiry date safely
// Prevents timezone conversion problems
// HTML date input returns YYYY-MM-DD
// ------------------------------------------------------

function parseDate(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );
}

// ------------------------------------------------------
// Get or create supplier
// ------------------------------------------------------

async function getSupplierId(name: string) {
  if (!name) {
    return undefined;
  }

  const supplier = await prisma.supplier.upsert({
    where: {
      name,
    },

    update: {},

    create: {
      name,
    },
  });

  return supplier.id;
}

// ------------------------------------------------------
// Get category
// ------------------------------------------------------

async function getCategoryId(name: string) {
  if (!name) {
    return undefined;
  }

  const category = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  return category?.id;
}

// ------------------------------------------------------
// Read storage locations from form
// ------------------------------------------------------

function getLocations(formData: FormData): SubmittedLocation[] {
  const raw = String(
    formData.get("locations") || "[]"
  );

  let locations: any[];

  try {
    locations = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(locations)) {
    return [];
  }

  return locations
    .filter(
      (location: any) =>
        location?.storageId &&
        Number(location.quantity) > 0
    )
    .map(
      (location: any): SubmittedLocation => ({
        storageId: String(location.storageId),

        quantity: Number(location.quantity),

   opened:
  location.opened === "OPENED" ||
  location.opened === "UNOPENED"
    ? location.opened
    : "UNKNOWN",
  })
    );
}

// ------------------------------------------------------
// Calculate total quantity
// ------------------------------------------------------

function calculateTotalQuantity(
  locations: Array<{ quantity: number }>
) {
  return locations.reduce(
    (total, location) =>
      total + location.quantity,
    0
  );
}

// ======================================================
// CREATE INVENTORY ITEM
// ======================================================

export async function addInventoryItem(
  formData: FormData
) {
  // ------------------------------------------------------
  // READ SUPPLIER + CATEGORY
  // ------------------------------------------------------

  const supplierId = await getSupplierId(
    String(
      formData.get("supplier") || ""
    ).trim()
  );

  const categoryId = await getCategoryId(
    String(
      formData.get("category") || ""
    ).trim()
  );

  // ------------------------------------------------------
  // BUILD STORAGE LOCATION DATA
  // ------------------------------------------------------

  const locations = getLocations(formData);

  // ------------------------------------------------------
  // CALCULATE TOTAL QUANTITY
  // ------------------------------------------------------

  const totalQuantity =
    calculateTotalQuantity(locations);

  // ------------------------------------------------------
  // CREATE INVENTORY ITEM
  // ------------------------------------------------------

  const item =
    await prisma.inventoryItem.create({
      data: {
        name: String(
          formData.get("name") || ""
        ),

        description: String(
          formData.get("description") || ""
        ),

        quantity: totalQuantity,

        minimumStock: Number(
          formData.get("minimumStock") || 5
        ),

        unit: String(
          formData.get("unit") || "Unit"
        ),

        specific: String(
          formData.get("specific") || ""
        ),

        batchNumber: String(
          formData.get("batchNumber") || ""
        ) || null,

        expiryDate: parseDate(
          String(
            formData.get("expiryDate") || ""
          )
        ),

        supplierId,

        categoryId,
      },
    });

  // ------------------------------------------------------
  // CREATE STORAGE LOCATIONS
  // ------------------------------------------------------

  if (locations.length > 0) {
    await prisma.itemLocation.createMany({
      data: locations.map(
        (location) => ({
          itemId: item.id,

          storageId:
            location.storageId,

          quantity:
            location.quantity,

            opened:
  location.opened === "OPENED"
    ? true
    : location.opened === "UNOPENED"
    ? false
    : undefined,
        })
      ),
    });
  }

  // ------------------------------------------------------
  // CREATE INVENTORY HISTORY
  // ------------------------------------------------------

  await prisma.inventoryRecord.create({
    data: {
      itemId: item.id,

      type: "CREATED",

      quantity: totalQuantity,

      previousQuantity: 0,

      newQuantity: totalQuantity,

      reason: "Initial stock",
    },
  });

  // ------------------------------------------------------
  // REFRESH UI
  // ------------------------------------------------------

  revalidatePath("/inventory");
  revalidatePath("/storage");
}

// ======================================================
// UPDATE INVENTORY ITEM
// ======================================================

export async function updateInventoryItem(
  formData: FormData
) {
  // ------------------------------------------------------
  // READ ITEM ID
  // ------------------------------------------------------

  const id = String(
    formData.get("id") || ""
  );

  if (!id) {
    return;
  }

  // ------------------------------------------------------
  // READ SUPPLIER + CATEGORY
  // ------------------------------------------------------

  const supplierId = await getSupplierId(
    String(
      formData.get("supplier") || ""
    ).trim()
  );

  const categoryId = await getCategoryId(
    String(
      formData.get("category") || ""
    ).trim()
  );

  // ------------------------------------------------------
  // BUILD UPDATED STORAGE DATA
  // ------------------------------------------------------

  const locations = getLocations(formData);

  const totalQuantity =
    calculateTotalQuantity(locations);

  // ------------------------------------------------------
  // FIND EXISTING ITEM
  // ------------------------------------------------------

  const previousItem =
    await prisma.inventoryItem.findUnique({
      where: {
        id,
      },
    });

  if (!previousItem) {
    return;
  }

  // ------------------------------------------------------
  // UPDATE MAIN INVENTORY ITEM
  // ------------------------------------------------------

  await prisma.inventoryItem.update({
    where: {
      id,
    },

    data: {
      name: String(
        formData.get("name") || ""
      ),

      description: String(
        formData.get("description") || ""
      ),

      quantity: totalQuantity,

      minimumStock: Number(
        formData.get("minimumStock") || 5
      ),

      unit: String(
        formData.get("unit") || "Unit"
      ),

      specific: String(
        formData.get("specific") || ""
      ),

      batchNumber: String(
        formData.get("batchNumber") || ""
      ) || null,

      expiryDate: parseDate(
        String(
          formData.get("expiryDate") || ""
        )
      ),

      supplierId,

      categoryId,
    },
  });

  // ------------------------------------------------------
  // REMOVE OLD STORAGE LOCATIONS
  // ------------------------------------------------------

  await prisma.itemLocation.deleteMany({
    where: {
      itemId: id,
    },
  });

  // ------------------------------------------------------
  // CREATE UPDATED STORAGE LOCATIONS
  // ------------------------------------------------------

  if (locations.length > 0) {
    await prisma.itemLocation.createMany({
      data: locations.map(
        (location) => ({
          itemId: id,

          storageId:
            location.storageId,

          quantity:
            location.quantity,

  opened:
  location.opened === "OPENED"
    ? true
    : location.opened === "UNOPENED"
    ? false
    : undefined,
        })
      ),
    });
  }

  // ------------------------------------------------------
  // CREATE UPDATE HISTORY
  // ------------------------------------------------------

  await prisma.inventoryRecord.create({
    data: {
      itemId: id,

      type: "UPDATED",

      quantity: totalQuantity,

      previousQuantity:
        previousItem.quantity,

      newQuantity: totalQuantity,

      reason:
        "Inventory item updated",
    },
  });

  // ------------------------------------------------------
  // REFRESH UI
  // ------------------------------------------------------

  revalidatePath("/inventory");
  revalidatePath("/storage");
}

// ======================================================
// UPDATE STOCK QUANTITY
// ======================================================

export async function updateStock(
  formData: FormData
) {
  // ------------------------------------------------------
  // READ STOCK CHANGE REQUEST
  // ------------------------------------------------------

  const itemId = String(
    formData.get("itemId") || ""
  );

  const storageId = String(
    formData.get("storageId") || ""
  );

  const change = Number(
    formData.get("quantity")
  );

  if (
    !itemId ||
    !storageId ||
    !change
  ) {
    return;
  }

  // ------------------------------------------------------
  // FIND INVENTORY ITEM
  // ------------------------------------------------------

  const item =
    await prisma.inventoryItem.findUnique({
      where: {
        id: itemId,
      },
    });

  if (!item) {
    return;
  }

  // ------------------------------------------------------
  // READ LOCATION STATUS
  // ------------------------------------------------------

  const rawStatus =
    String(
      formData.get("status") ||
      formData.get("opened") ||
      ""
    );

  const status: LocationStatus =
    rawStatus === "OPENED" ||
    rawStatus === "opened"
      ? "OPENED"
      : rawStatus === "UNOPENED" ||
          rawStatus === "unopened"
        ? "UNOPENED"
        : "UNKNOWN";

  // ------------------------------------------------------
  // FIND STORAGE LOCATION
  // ------------------------------------------------------

  const location =
    await prisma.itemLocation.findFirst({
      where: {
        itemId,

        storageId,
      },
    });

  if (!location) {
    return;
  }

  // ------------------------------------------------------
  // CALCULATE NEW LOCATION QUANTITY
  // ------------------------------------------------------

  const newLocationQuantity =
    location.quantity + change;

  if (newLocationQuantity < 0) {
    return;
  }

  // ------------------------------------------------------
  // UPDATE STORAGE LOCATION
  // ------------------------------------------------------

  await prisma.itemLocation.update({
    where: {
      id: location.id,
    },

    data: {
      quantity:
        newLocationQuantity,
    },
  });

  // ------------------------------------------------------
  // RECALCULATE TOTAL INVENTORY
  // ------------------------------------------------------

  const locations =
    await prisma.itemLocation.findMany({
      where: {
        itemId,
      },
    });

  const totalQuantity =
    calculateTotalQuantity(locations);

  // ------------------------------------------------------
  // UPDATE INVENTORY TOTAL
  // ------------------------------------------------------

  await prisma.inventoryItem.update({
    where: {
      id: itemId,
    },

    data: {
      quantity: totalQuantity,
    },
  });

  // ------------------------------------------------------
  // CREATE STOCK HISTORY
  // ------------------------------------------------------

  await prisma.inventoryRecord.create({
    data: {
      itemId,

      type:
        change > 0
          ? "STOCK ADDED"
          : "STOCK REMOVED",

      quantity:
        Math.abs(change),

      previousQuantity:
        item.quantity,

      newQuantity:
        totalQuantity,

      reason: String(
        formData.get("reason") || ""
      ),
    },
  });

  // ------------------------------------------------------
  // REFRESH UI
  // ------------------------------------------------------

  revalidatePath("/inventory");
  revalidatePath("/storage");
}

// ======================================================
// DELETE INVENTORY ITEM
// ======================================================

export async function deleteInventoryItem(
  formData: FormData
) {
  // ------------------------------------------------------
  // READ ITEM ID
  // ------------------------------------------------------

  const id = String(
    formData.get("id") || ""
  );

  if (!id) {
    return;
  }

  // ------------------------------------------------------
  // DELETE STORAGE LOCATIONS
  // ------------------------------------------------------

  await prisma.itemLocation.deleteMany({
    where: {
      itemId: id,
    },
  });

  // ------------------------------------------------------
  // DELETE INVENTORY HISTORY
  // ------------------------------------------------------

  await prisma.inventoryRecord.deleteMany({
    where: {
      itemId: id,
    },
  });

  // ------------------------------------------------------
  // DELETE INVENTORY ITEM
  // ------------------------------------------------------

  await prisma.inventoryItem.delete({
    where: {
      id,
    },
  });

  // ------------------------------------------------------
  // REFRESH UI
  // ------------------------------------------------------

  revalidatePath("/inventory");
  revalidatePath("/storage");
}