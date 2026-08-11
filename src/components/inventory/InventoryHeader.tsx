"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import AddItemModal from "@/components/inventory/AddItemModal";

type InventoryHeaderProps = {
  suppliers: any[];
  categories: any[];
  storageLocations?: any[];

  search: string;
  setSearch: (value: string) => void;

  categoryFilter: string;
  setCategoryFilter: (value: string) => void;

  supplierFilter: string;
  setSupplierFilter: (value: string) => void;

  statusFilter: string;
  setStatusFilter: (value: string) => void;

  expiryFilter: string;
  setExpiryFilter: (value: string) => void;

  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;

  addItemOpen: boolean;
  setAddItemOpen: (value: boolean) => void;
};

export default function InventoryHeader({
  suppliers,
  categories,
  storageLocations,

  search,
  setSearch,

  categoryFilter,
  setCategoryFilter,

  supplierFilter,
  setSupplierFilter,

  statusFilter,
  setStatusFilter,

  expiryFilter,
  setExpiryFilter,

  searchOpen,
  setSearchOpen,

  addItemOpen,
  setAddItemOpen,
}: InventoryHeaderProps) {
  return (
    <>
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex items-center justify-between gap-4">
        {/* PAGE TITLE */}

        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-gray-900">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track, monitor and manage your laboratory stock.
          </p>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex items-center gap-2">
          {/* SEARCH */}

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
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
            <Search size={17} />
            Search
          </button>

          {/* ADD ITEM */}

          <button
            type="button"
            onClick={() => setAddItemOpen(true)}
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
            Add Item
          </button>
        </div>
      </div>

      {/* =====================================================
          SEARCH MODAL
          ===================================================== */}

      {searchOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-gray-900/30
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSearchOpen(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-2xl
            "
          >
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <Search size={18} className="text-gray-500" />

                  <h2 className="font-heading text-xl font-semibold tracking-tight text-gray-900">
                    Search inventory
                  </h2>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Find laboratory stock using the fields below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="
                  rounded-lg
                  p-2
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL CONTENT */}

            <div className="space-y-5 px-6 py-6">
              {/* SEARCH */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Search
                </label>

                <div className="relative">
                  <Search
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by item name..."
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>
              </div>

              {/* FILTER GRID */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </label>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-3
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >
                    <option value="ALL">All categories</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SUPPLIER */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Supplier
                  </label>

                  <select
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-3
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >
                    <option value="ALL">All suppliers</option>

                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STOCK */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Stock status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-3
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >
                    <option value="ALL">All stock</option>
                    <option value="IN">In stock</option>
                    <option value="LOW">Low stock</option>
                    <option value="OUT">Out of stock</option>
                  </select>
                </div>

                {/* EXPIRY */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Expiry
                  </label>

                  <select
                    value={expiryFilter}
                    onChange={(e) => setExpiryFilter(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-3
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >
                    <option value="ALL">All expiry</option>
                    <option value="VALID">Valid</option>
                    <option value="SOON">Expiring soon</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("ALL");
                  setSupplierFilter("ALL");
                  setStatusFilter("ALL");
                  setExpiryFilter("ALL");
                }}
                className="
                  text-sm
                  font-medium
                  text-gray-500
                  transition
                  hover:text-gray-900
                "
              >
                Clear filters
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="
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
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="
                    rounded-lg
                    bg-gray-900
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                  "
                >
                  Search inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD ITEM MODAL
          ===================================================== */}

      <AddItemModal
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        suppliers={suppliers}
        categories={categories}
        storageLocations={storageLocations ?? []}
      />
    </>
  );
}