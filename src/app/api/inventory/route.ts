import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type StorageAllocationInput = {
  storageId: string | null;
  opened: "OPENED" | "UNOPENED" | "UNKNOWN";
  quantity: number;
};

export async function POST(request: Request) {
  try {
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
    // VALIDATE STORAGE ALLOCATIONS
    // -------------------------------------------------

    const allocations: StorageAllocationInput[] =
      storageAllocations.map(
        (allocation: any): StorageAllocationInput => {
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

          const opened =
            allocation.opened === "OPENED"
              ? "OPENED"
              : allocation.opened === "UNOPENED"
                ? "UNOPENED"
                : "UNKNOWN";

          return {
            storageId:
              allocation.storageId || null,

            opened,

            quantity: allocationQuantity,
          };
        }
      );

    // -------------------------------------------------
    // CHECK THAT ALLOCATED QUANTITY MATCHES TOTAL
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
    // CREATE ITEM
    // -------------------------------------------------

    const item = await prisma.inventoryItem.create({
      data: {
        name: name.trim(),

        description:
          description?.trim() || null,

        quantity,

        minimumStock,

        unit:
          unit?.trim() || "Unit",

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

        locations: {
          create: allocations
            .filter(
              (
                allocation: StorageAllocationInput
              ) =>
                allocation.storageId &&
                allocation.quantity > 0
            )
            .map(
              (
                allocation: StorageAllocationInput
              ) => ({
                storage: {
                  connect: {
                    id: allocation.storageId!,
                  },
                },

                quantity:
                  allocation.quantity,

                opened:
                  allocation.opened,
              })
            ),
        },
      },

      include: {
        category: true,

        supplier: true,

        locations: {
          include: {
            storage: true,
          },
        },
      },
    });

    // -------------------------------------------------
    // CREATE HISTORY RECORD
    // -------------------------------------------------

    await prisma.inventoryRecord.create({
      data: {
        itemId: item.id,

        type: "CREATED",

        quantity,

        previousQuantity: 0,

        newQuantity: quantity,

        reason: "Initial stock",
      },
    });

    // -------------------------------------------------
    // REFRESH INVENTORY PAGES
    // -------------------------------------------------

    return NextResponse.json(
      { item },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to create inventory item:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create inventory item.",
      },
      { status: 500 }
    );
  }
}