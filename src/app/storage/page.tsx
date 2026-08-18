import { prisma } from "@/lib/prisma";
import StoragePageClient from "@/components/storage/StoragePageClient";

export default async function StoragePage() {
  const storageLocations =
    await prisma.storageLocation.findMany({
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

  return (
    <StoragePageClient
      storageLocations={storageLocations}
    />
  );
}