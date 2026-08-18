import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normaliseUnit } from "@/lib/normaliseUnit";

type StorageAllocationInput = {
  storageId: string;
  opened: "OPENED" | "UNOPENED" | "UNKNOWN";
  quantity: number;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      quantity,
      minimumStock,
      unit,
      specific,
      batchNumber,
      expiryDate,
      categoryId,
      supplierId,
      storageAllocations,
    } = body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Item name is required." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Quantity must be a whole number of 0 or greater.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(minimumStock) ||
      minimumStock < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Minimum stock must be a whole number of 0 or greater.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(storageAllocations)) {
      return NextResponse.json(
        {
          error: "Storage allocations are invalid.",
        },
        { status: 400 }
      );
    }

    // -------------------------------------------------
    // NORMALISE STORAGE ALLOCATIONS
    // -------------------------------------------------

    const allocations: StorageAllocationInput[] =
      storageAllocations.map((allocation: any) => {
        const allocationQuantity = Number(
          allocation.quantity
        );

        if (
          !Number.isInteger(allocationQuantity) ||
          allocationQuantity < 0
        ) {
          throw new Error(
            "Storage quantities must be whole numbers of 0 or greater."
          );
        }

        const status =
          allocation.opened === "OPENED" ||
          allocation.opened === "UNOPENED" ||
          allocation.opened === "UNKNOWN"
            ? allocation.opened
            : "UNKNOWN";

        return {
          storageId: allocation.storageId || "",
          opened: status,
          quantity: allocationQuantity,
        };
      });

    // -------------------------------------------------
    // CHECK ALLOCATION TOTAL
    // -------------------------------------------------

    const allocatedQuantity =
      allocations.reduce(
        (
          total: number,
          allocation: StorageAllocationInput
        ) => total + allocation.quantity,
        0
      );

    if (allocatedQuantity !== quantity) {
      return NextResponse.json(
        {
          error:
            `Storage allocation total (${allocatedQuantity}) ` +
            `must match item quantity (${quantity}).`,
        },
        { status: 400 }
      );
    }

    // -------------------------------------------------
    // FIND EXISTING ITEM
    // -------------------------------------------------

    const existingItem =
      await prisma.inventoryItem.findUnique({
        where: { id },
        include: {
          locations: true,
        },
      });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Inventory item not found." },
        { status: 404 }
      );
    }

    // -------------------------------------------------
    // DETERMINE STOCK MOVEMENT
    // -------------------------------------------------

    const quantityChanged =
      quantity !== existingItem.quantity;

    const quantityDifference =
      quantity - existingItem.quantity;

    // -------------------------------------------------
    // UPDATE ITEM + LOCATIONS + HISTORY
    // -------------------------------------------------

    const item = await prisma.$transaction(
      async (tx) => {
        await tx.inventoryItem.update({
          where: { id },

          data: {
            name: name.trim(),

            description:
              description?.trim() || null,

            quantity,

            minimumStock,

            unit: normaliseUnit(unit),

            specific:
              specific?.trim() || null,

            batchNumber:
              batchNumber?.trim() || null,

            expiryDate: expiryDate
              ? new Date(expiryDate)
              : null,

            categoryId:
              categoryId || null,

            supplierId:
              supplierId || null,
          },
        });

        // -------------------------------------------------
        // CREATE HISTORY ENTRY
        // -------------------------------------------------

        if (quantityChanged) {
          await tx.inventoryRecord.create({
            data: {
              itemId: id,

              type:
                quantityDifference > 0
                  ? "STOCK_ADDED"
                  : "STOCK_REMOVED",

              quantity:
                Math.abs(quantityDifference),

              previousQuantity:
                existingItem.quantity,

              newQuantity:
                quantity,

              reason:
                quantityDifference > 0
                  ? "Stock increased during item edit."
                  : "Stock decreased during item edit.",
            },
          });
        } else {
          // Item details changed but stock did not.
          await tx.inventoryRecord.create({
            data: {
              itemId: id,

              type: "UPDATED",

              quantity: 0,

              previousQuantity:
                existingItem.quantity,

              newQuantity:
                quantity,

              reason:
                "Inventory item details updated.",
            },
          });
        }

        // -------------------------------------------------
        // REMOVE OLD LOCATION ALLOCATIONS
        // -------------------------------------------------

        await tx.itemLocation.deleteMany({
          where: {
            itemId: id,
          },
        });

        // -------------------------------------------------
        // RECREATE LOCATION ALLOCATIONS
        // -------------------------------------------------

        const validAllocations =
          allocations.filter(
            (allocation) =>
              allocation.storageId &&
              allocation.quantity > 0
          );

        if (validAllocations.length > 0) {
          await tx.itemLocation.createMany({
            data: validAllocations.map(
              (allocation) => ({
                itemId: id,

                storageId:
                  allocation.storageId,

                quantity:
                  allocation.quantity,

                opened:
                  allocation.opened,
              })
            ),
          });
        }

        // -------------------------------------------------
        // RETURN UPDATED ITEM
        // -------------------------------------------------

        return tx.inventoryItem.findUnique({
          where: { id },

          include: {
            category: true,

            supplier: true,

            locations: {
              include: {
                storage: true,
              },
            },

            records: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
      }
    );

    return NextResponse.json(
      { item },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Failed to update inventory item:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update inventory item.",
      },
      { status: 500 }
    );
  }
}