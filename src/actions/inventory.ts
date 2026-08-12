"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ======================================================
// TYPES
// ======================================================

type LocationStatus =
  | "OPENED"
  | "UNOPENED"
  | "UNKNOWN";

type SubmittedLocation = {
  storageId: string;
  quantity: number;
  opened: LocationStatus;
};

// ======================================================
// HELPER FUNCTIONS
// ======================================================

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
// Supplier
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
// Category
// ------------------------------------------------------

async function getCategoryId(name: string) {
  if (!name) {
    return undefined;
  }

  const category =
    await prisma.category.findUnique({
      where: {
        name,
      },
    });

  return category?.id;
}

// ------------------------------------------------------
// Read locations
// ------------------------------------------------------

function getLocations(
  formData: FormData
): SubmittedLocation[] {
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
      (location: any): SubmittedLocation => {
        let opened: LocationStatus =
          "UNKNOWN";

        if (location.opened === "OPENED") {
          opened = "OPENED";
        } else if (
          location.opened === "UNOPENED"
        ) {
          opened = "UNOPENED";
        }

        return {
          storageId: String(
            location.storageId
          ),

          quantity: Number(
            location.quantity
          ),

          opened,
        };
      }
    );
}

// ------------------------------------------------------
// Calculate total
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
// ADD INVENTORY ITEM
// ======================================================

export async function addInventoryItem(
  formData: FormData
) {
  const supplierId =
    await getSupplierId(
      String(
        formData.get("supplier") || ""
      ).trim()
    );

  const categoryId =
    await getCategoryId(
      String(
        formData.get("category") || ""
      ).trim()
    );

  const locations =
    getLocations(formData);

  const totalQuantity =
    calculateTotalQuantity(locations);

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

        batchNumber:
          String(
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

  // ----------------------------------------------------
  // CREATE STORAGE LOCATIONS
  // ----------------------------------------------------

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
            location.opened,
        })
      ),
    });
  }

  // ----------------------------------------------------
  // HISTORY
  // ----------------------------------------------------

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

  revalidatePath("/inventory");
  revalidatePath("/storage");
}

// ======================================================
// UPDATE INVENTORY ITEM
// ======================================================

export async function updateInventoryItem(
  formData: FormData
) {
  const id = String(
    formData.get("id") || ""
  );

  if (!id) {
    return;
  }

  const supplierId =
    await getSupplierId(
      String(
        formData.get("supplier") || ""
      ).trim()
    );

  const categoryId =
    await getCategoryId(
      String(
        formData.get("category") || ""
      ).trim()
    );

  const locations =
    getLocations(formData);

  const totalQuantity =
    calculateTotalQuantity(locations);

  const previousItem =
    await prisma.inventoryItem.findUnique({
      where: {
        id,
      },
    });

  if (!previousItem) {
    return;
  }

  // ----------------------------------------------------
  // UPDATE ITEM
  // ----------------------------------------------------

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

      batchNumber:
        String(
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

  // ----------------------------------------------------
  // REPLACE LOCATIONS
  // ----------------------------------------------------

  await prisma.itemLocation.deleteMany({
    where: {
      itemId: id,
    },
  });

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
            location.opened,
        })
      ),
    });
  }

  // ----------------------------------------------------
  // HISTORY
  // ----------------------------------------------------

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

  revalidatePath("/inventory");
  revalidatePath("/storage");
}

// ======================================================
// UPDATE STOCK
// ======================================================

export async function updateStock(
  formData: FormData
) {
  const itemId = String(
    formData.get("itemId") || ""
  );

  const storageId = String(
    formData.get("storageId") || ""
  );

  const quantity = Number(
    formData.get("quantity")
  );

  if (
    !itemId ||
    !storageId ||
    !quantity
  ) {
    return;
  }

  // ----------------------------------------------------
  // CHANGE TYPE
  // ----------------------------------------------------

  const changeType = String(
    formData.get("changeType") || "ADD"
  );

  const change =
    changeType === "REMOVE"
      ? -Math.abs(quantity)
      : Math.abs(quantity);

  // ----------------------------------------------------
  // STATUS
  // ----------------------------------------------------

  const rawStatus = String(
    formData.get("opened") ||
      "UNKNOWN"
  );

  let status: LocationStatus =
    "UNKNOWN";

  if (rawStatus === "OPENED") {
    status = "OPENED";
  } else if (
    rawStatus === "UNOPENED"
  ) {
    status = "UNOPENED";
  }

  // ----------------------------------------------------
  // FIND ITEM
  // ----------------------------------------------------

  const item =
    await prisma.inventoryItem.findUnique({
      where: {
        id: itemId,
      },
    });

  if (!item) {
    return;
  }

  // ----------------------------------------------------
  // FIND LOCATION
  // ----------------------------------------------------

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

  // ----------------------------------------------------
  // CALCULATE NEW QUANTITY
  // ----------------------------------------------------

  const newLocationQuantity =
    location.quantity + change;

  if (newLocationQuantity < 0) {
    return;
  }

  // ----------------------------------------------------
  // UPDATE LOCATION
  // ----------------------------------------------------

  await prisma.itemLocation.update({
    where: {
      id: location.id,
    },

    data: {
      quantity:
        newLocationQuantity,

      opened: status,
    },
  });

  // ----------------------------------------------------
  // RECALCULATE TOTAL
  // ----------------------------------------------------

  const locations =
    await prisma.itemLocation.findMany({
      where: {
        itemId,
      },
    });

  const totalQuantity =
    calculateTotalQuantity(
      locations
    );

  // ----------------------------------------------------
  // UPDATE ITEM TOTAL
  // ----------------------------------------------------

  await prisma.inventoryItem.update({
    where: {
      id: itemId,
    },

    data: {
      quantity: totalQuantity,
    },
  });

  // ----------------------------------------------------
  // HISTORY
  // ----------------------------------------------------

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

  // ----------------------------------------------------
  // REFRESH
  // ----------------------------------------------------

  revalidatePath("/inventory");
  revalidatePath("/storage");
}

// ======================================================
// DELETE INVENTORY ITEM
// ======================================================

export async function deleteInventoryItem(
  formData: FormData
) {
  const id = String(
    formData.get("id") || ""
  );

  if (!id) {
    return;
  }

  await prisma.itemLocation.deleteMany({
    where: {
      itemId: id,
    },
  });

  await prisma.inventoryRecord.deleteMany({
    where: {
      itemId: id,
    },
  });

  await prisma.inventoryItem.delete({
    where: {
      id,
    },
  });

  revalidatePath("/inventory");
  revalidatePath("/storage");
}