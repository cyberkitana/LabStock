import SupplierFiles from "@/components/SupplierFiles";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const suppliers = await prisma.supplier.findMany({
    include: {
      items: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            LabStock
          </h1>

          <p className="mt-1 text-gray-500">
            Laboratory inventory management
          </p>
        </div>

        {/* SUPPLIER FILES */}

        <SupplierFiles
          suppliers={suppliers}
        />

      </div>
    </main>
  );
}