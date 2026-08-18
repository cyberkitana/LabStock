import { prisma } from "@/lib/prisma";
import SupplierPageClient from "@/components/suppliers/SupplierPageClient";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      items: {
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          specific: true,
          quantity: true,
          unit: true,
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  return (
    <SupplierPageClient
      suppliers={suppliers}
    />
  );
}
