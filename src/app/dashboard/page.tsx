import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const inventoryItems = await prisma.inventoryItem.findMany();

  const totalItems = inventoryItems.length;

  const lowStock = inventoryItems.filter(
    (item) => item.quantity <= item.minimumStock
  ).length;

  const expiringSoon = inventoryItems.filter(
    (item) =>
      item.expiryDate &&
      item.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <main className="min-h-screen bg-zinc-50 p-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Dashboard
          </h1>

          <p className="mt-2 text-zinc-500">
            Welcome back. Here's an overview of your laboratory inventory.
          </p>
        </div>


        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">
              Low Stock
            </p>

            <h2 className="mt-3 text-4xl font-bold text-red-600">
              {lowStock}
            </h2>
          </div>


          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">
              Expiring Soon
            </p>

            <h2 className="mt-3 text-4xl font-bold text-amber-500">
              {expiringSoon}
            </h2>
          </div>


          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">
              Inventory Items
            </p>

            <h2 className="mt-3 text-4xl font-bold text-blue-600">
              {totalItems}
            </h2>
          </div>


          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">
              Opened Items
            </p>

            <h2 className="mt-3 text-4xl font-bold text-emerald-600">
              0
            </h2>
          </div>

        </div>


        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-xl font-semibold text-zinc-900">
            Recent Activity
          </h2>


          <div className="space-y-4">

            <div className="flex items-center justify-between rounded-lg border border-zinc-100 p-4">
              <span>DMEM High Glucose updated</span>
              <span className="text-sm text-zinc-400">
                2 hours ago
              </span>
            </div>


            <div className="flex items-center justify-between rounded-lg border border-zinc-100 p-4">
              <span>MTT marked as opened</span>
              <span className="text-sm text-zinc-400">
                Yesterday
              </span>
            </div>


            <div className="flex items-center justify-between rounded-lg border border-zinc-100 p-4">
              <span>FBS stock increased</span>
              <span className="text-sm text-zinc-400">
                2 days ago
              </span>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}