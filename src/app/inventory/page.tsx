/*
INVENTORY PAGE

Server component.

Fetches:
- Inventory items
- Suppliers
- Categories
- Storage locations

Passes all data to InventoryPageClient.
*/

import { prisma } from "@/lib/prisma";
import InventoryPageClient from "@/components/inventory/InventoryPageClient";

export default async function InventoryPage() {
  const inventoryItems =
    await prisma.inventoryItem.findMany({
      include: {
        supplier: true,

        category: true,

        records: {
          orderBy: {
            createdAt: "desc",
          },
        },

        locations: {
          include: {
            storage: true,
          },
        },
      },

      orderBy: {
        name: "asc",
      },
    });

  const suppliers =
    await prisma.supplier.findMany({
      orderBy: {
        name: "asc",
      },
    });

  const categories =
    await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

  const storageLocations =
    await prisma.storageLocation.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return (
    <InventoryPageClient
      inventoryItems={inventoryItems}
      suppliers={suppliers}
      categories={categories}
      storageLocations={storageLocations}
    />
  );
}