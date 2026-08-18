"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import StorageManager from "@/components/storage/StorageManager";

type Props = {
  storageLocations: any[];
};

export default function StoragePageClient({
  storageLocations,
}: Props) {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-4">
          {/* PAGE TITLE */}
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-gray-900">
              Storage
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage storage locations and view where inventory is stored.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">

            {/* BACK TO LAB */}
            <Link
              href="/lab-room"
              className="
                inline-flex
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

            {/* ADD STORAGE */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-add-storage")
                );
              }}
              className="
                inline-flex
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
              Add Storage
            </button>

          </div>
        </div>

        {/* STORAGE LOCATIONS */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <StorageManager
            storageLocations={storageLocations}
          />
        </div>

      </div>
    </main>
  );
}