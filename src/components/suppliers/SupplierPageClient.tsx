"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import SupplierManager from "@/components/suppliers/SupplierManager";

type Props = {
  suppliers: any[];
};

export default function SupplierPageClient({
  suppliers,
}: Props) {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">

          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-gray-900">
              Suppliers
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage suppliers and view the inventory they provide.
            </p>
          </div>

          <div className="flex items-center gap-2">

            {/* Back to Lab Room */}
            <Link
              href="/lab-room"
              className="
                inline-flex
                cursor-pointer
                items-center
                gap-2
                rounded-lg
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:border-gray-300
                hover:bg-gray-50
              "
            >
              ← Back to Lab Room
            </Link>

            {/* Add Supplier */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-add-supplier")
                );
              }}
              className="
                inline-flex
                cursor-pointer
                items-center
                gap-2
                rounded-lg
                bg-gray-900
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-gray-800
              "
            >
              <Plus size={17} />
              Add Supplier
            </button>

          </div>
        </div>

        {/* Supplier Management */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SupplierManager
            suppliers={suppliers}
          />
        </div>

      </div>
    </main>
  );
}
