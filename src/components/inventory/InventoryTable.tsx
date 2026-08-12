"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  PackagePlus,
  PackageMinus,
  ChevronDown,
  ChevronUp,
  Pencil,
  Boxes,
  Trash2,
  History,
  MapPin,
} from "lucide-react";

import AddItemModal from "@/components/inventory/AddItemModal";
import UpdateStockModal from "@/components/UpdateStockModal";

import { formatDate, formatDateTime } from "@/lib/date";
import { pluralizeUnit } from "@/lib/pluralise";
import { deleteInventoryItem } from "@/actions/inventory";

type Props = {
  inventoryItems: any[];
  suppliers: any[];
  categories: any[];
  storageLocations: any[];
};

function formatStock(item: any) {
  const quantity = item.quantity ?? 0;

  const specific = item.specific
    ? `${item.specific} `
    : "";

  const unit = pluralizeUnit(
    item.unit ?? "Unit",
    quantity
  );

  return {
    quantity,
    specific,
    unit,
  };
}

function getStockStatus(item: any) {
  const quantity = item.quantity ?? 0;
  const minimum = item.minimumStock ?? 5;

  if (quantity <= 0) {
    return {
      label: "Out of stock",
      className: "bg-red-50 text-red-700",
    };
  }

  if (quantity <= minimum) {
    return {
      label: "Low stock",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "In stock",
    className: "bg-emerald-50 text-emerald-700",
  };
}

function getExpiryStatus(date: any) {
  if (!date) {
    return null;
  }

  const expiry = new Date(date);
  const today = new Date();

  const difference =
    expiry.getTime() - today.getTime();

  const days = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days < 0) {
    return {
      label: "Expired",
      className: "bg-red-50 text-red-700",
    };
  }

  if (days <= 30) {
    return {
      label: "Expiring soon",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Valid",
    className: "bg-emerald-50 text-emerald-700",
  };
}

export default function InventoryTable({
  inventoryItems,
  suppliers,
  categories,
  storageLocations,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);

  const [editItem, setEditItem] =
    useState<any>(null);

  const [stockItem, setStockItem] =
    useState<any>(null);

  const [openItem, setOpenItem] =
    useState<string | null>(null);

  const [openHistory, setOpenHistory] =
    useState<string | null>(null);

  const [openActions, setOpenActions] =
    useState<string | null>(null);

  return (
    <div className="space-y-5">

      {/* TABLE */}

      <div className="overflow-visible rounded-xl border border-gray-200 bg-white">

        {/* TABLE HEADER */}

        <div
          className="
            hidden
            grid-cols-[minmax(0,2fr)_minmax(180px,1fr)_130px_52px]
            items-center
            border-b
            border-gray-200
            bg-gray-50/70
            px-5
            py-3
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-gray-500
            md:grid
          "
        >
          <div>Item</div>

          <div>Total stock</div>

          <div>Stock status</div>

          <div />
        </div>

        {/* EMPTY STATE */}

        {inventoryItems.length === 0 && (
          <div className="px-6 py-12 text-center">

            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Boxes
                size={20}
                className="text-gray-500"
              />
            </div>

            <p className="font-medium text-gray-900">
              No inventory items found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add an inventory item to get started.
            </p>

          </div>
        )}

        {/* ROWS */}

        <div className="divide-y divide-gray-100">

          {inventoryItems.map((item) => {

            const stockStatus =
              getStockStatus(item);

            const expiryStatus =
              getExpiryStatus(
                item.expiryDate
              );

            const stock =
              formatStock(item);

            const expanded =
              openItem === item.id;

            const actionsOpen =
              openActions === item.id;

            return (
              <div key={item.id}>

                {/* MAIN ROW */}

                <div
className={`
  relative
  grid
  grid-cols-1
  items-center
  gap-4
  border-l-4
  px-5
  py-4
  transition
  hover:bg-gray-50
  md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)_130px_52px]
  ${expanded ? "" : "border-transparent"}
`}
style={
  expanded && item.category?.colour
    ? {
        borderLeftColor: item.category.colour,
        backgroundColor: `${item.category.colour}20`,
      }
    : undefined
}
                >

                  {/* ITEM */}

                  <button
                    type="button"
                    onClick={() =>
                      setOpenItem(
                        expanded
                          ? null
                          : item.id
                      )
                    }
                    className="
                      min-w-0
                      text-left
                      outline-none
                    "
                  >

                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Boxes
                          size={17}
                          className="text-gray-500"
                        />
                      </div>

                      <div className="min-w-0">

                        {/* NAME + CATEGORY */}

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="truncate font-semibold text-gray-900">
                            {item.name}
                          </h3>

                          {item.category?.name && (
                            <span
                              style={{
                                backgroundColor:
                                  `${item.category.colour}18`,
                                color:
                                  item.category.colour,
                              }}
                              className="
                                inline-flex
                                rounded-full
                                px-2
                                py-0.5
                                text-[11px]
                                font-medium
                              "
                            >
                              {item.category.name}
                            </span>
                          )}

                        </div>

                        {/* EXPIRY WARNING */}

                        {expiryStatus &&
                          expiryStatus.label !==
                            "Valid" && (
                          <div className="mt-1">

                            <span
                              className={`
                                inline-flex
                                rounded-full
                                px-2
                                py-0.5
                                text-[11px]
                                font-medium
                                ${expiryStatus.className}
                              `}
                            >
                              {expiryStatus.label}
                            </span>

                          </div>
                        )}

                      </div>

                    </div>

                  </button>

                  {/* TOTAL STOCK */}

                  <button
                    type="button"
                    onClick={() =>
                      setOpenItem(
                        expanded
                          ? null
                          : item.id
                      )
                    }
                    className="
                      flex
                      min-w-0
                      items-center
                      justify-start
                      gap-2
                      text-left
                      outline-none
                    "
                  >

                    <span className="text-base font-semibold text-gray-900">
                      {stock.quantity}
                    </span>

                    <span className="text-sm text-gray-400">
                      ×
                    </span>

                    <span className="truncate text-sm text-gray-600">
                      {stock.specific}
                      {stock.unit}
                    </span>

                    <span className="ml-1 shrink-0 text-gray-400">
                      {expanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>

                  </button>

                  {/* STOCK STATUS */}

                  <div className="flex items-center">

                    <span
                      className={`
                        inline-flex
                        whitespace-nowrap
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        ${stockStatus.className}
                      `}
                    >
                      {stockStatus.label}
                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex justify-end">

                    <div className="relative">

                      <button
                        type="button"
                        onClick={() =>
                          setOpenActions(
                            actionsOpen
                              ? null
                              : item.id
                          )
                        }
                        className="
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          text-gray-500
                          transition
                          hover:bg-gray-50
                          hover:text-gray-900
                        "
                        aria-label={`Actions for ${item.name}`}
                      >

                        <MoreHorizontal
                          size={18}
                        />

                      </button>

                      {actionsOpen && (
                        <div
                          className="
                            absolute
                            right-0
                            top-11
                            z-30
                            w-48
                            overflow-hidden
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            py-1
                            shadow-lg
                          "
                        >

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => {
  console.log("EDIT ITEM:", item);
  setEditItem(item);
  setOpenActions(null);
}}
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              px-3
                              py-2.5
                              text-left
                              text-sm
                              text-gray-700
                              hover:bg-gray-50
                            "
                          >

                            <Pencil size={16} />

                            Edit item

                          </button>

                          {/* UPDATE STOCK */}

                          <button
                            type="button"
                            onClick={() => {
                              setStockItem(item);
                              setOpenActions(null);
                            }}
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              px-3
                              py-2.5
                              text-left
                              text-sm
                              text-gray-700
                              hover:bg-gray-50
                            "
                          >

                            <PackagePlus size={16} />

                            Update stock

                          </button>

                          {/* HISTORY */}

                          <button
                            type="button"
                            onClick={() => {
                              setOpenItem(item.id);
                              setOpenActions(null);
                              setOpenHistory(item.id);
                            }}
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              px-3
                              py-2.5
                              text-left
                              text-sm
                              text-gray-700
                              hover:bg-gray-50
                            "
                          >

                            <History size={16} />

                            View history

                          </button>

                          <div className="my-1 border-t border-gray-100" />

                          {/* DELETE */}

                          <form
                            action={
                              deleteInventoryItem
                            }
                          >

                            <input
                              type="hidden"
                              name="id"
                              value={item.id}
                            />

                            <button
                              type="submit"
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                text-red-600
                                hover:bg-red-50
                              "
                            >

                              <Trash2 size={16} />

                              Delete item

                            </button>

                          </form>

                        </div>
                      )}

                    </div>

                  </div>

                </div>

                {/* EXPANDED DETAILS */}

                {expanded && (
  <div
    className="border-t px-5 py-5"
    style={{
      backgroundColor: item.category?.colour
        ? `${item.category.colour}08`
        : "#f9fafb",
      borderTopColor: item.category?.colour
        ? `${item.category.colour}25`
        : "#e5e7eb",
    }}
  >

                    <div className="grid gap-5 md:grid-cols-3">

                      {/* DESCRIPTION */}

                      {item.description && (
                        <div className="md:col-span-3">

                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Description
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            {item.description}
                          </p>

                        </div>
                      )}

                      {/* SUPPLIER */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Supplier
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {item.supplier?.name ??
                            "Not specified"}
                        </p>

                      </div>

                      {/* MINIMUM STOCK */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Minimum stock
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">

                          {item.minimumStock ?? 5}{" "}

                          {pluralizeUnit(
                            item.unit ?? "Unit",
                            item.minimumStock ?? 5
                          )}

                        </p>

                      </div>

                      {/* EXPIRY */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Expiry
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">

                          {item.expiryDate
                            ? formatDate(
                                item.expiryDate
                              )
                            : "No expiry date"}

                        </p>

                      </div>

                    </div>

                    {/* STORAGE */}

                    <div className="mt-5 border-t border-gray-200 pt-5">

                      <div className="mb-3 flex items-center gap-2">

                        <MapPin
                          size={16}
                          className="text-gray-400"
                        />

                        <p className="text-sm font-semibold text-gray-900">
                          Storage
                        </p>

                      </div>

                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">

                        {item.locations?.length ? (

                          item.locations.map(
                            (location: any) => (

                              <div
                                key={location.id}
                                className="
                                  rounded-lg
                                  border
                                  border-gray-200
                                  bg-white
                                  px-3
                                  py-3
                                "
                              >

                                <div className="flex items-center justify-between gap-3">

                                  <p className="text-sm font-medium text-gray-900">
                                    {location.storage
                                      ?.name ??
                                      "Unknown location"}
                                  </p>

                                  <span className="text-sm font-semibold text-gray-700">
                                    {location.quantity}
                                  </span>

                                </div>

                                <p className="mt-1 text-xs text-gray-500">
  {location.opened === "OPENED"
    ? "Opened"
    : location.opened === "UNOPENED"
    ? "Unopened"
    : "Unknown"}
</p>

                              </div>

                            )
                          )

                        ) : (

                          <p className="text-sm text-gray-500">
                            No storage locations recorded.
                          </p>

                        )}

                      </div>

                    </div>

                    {/* HISTORY */}

                    <div className="mt-5 border-t border-gray-200 pt-5">

                      <button
                        type="button"
                        onClick={() =>
                          setOpenHistory(
                            openHistory ===
                              item.id
                              ? null
                              : item.id
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >

                        <History size={16} />

                        Stock history

                        {openHistory ===
                        item.id ? (
                          <ChevronUp size={15} />
                        ) : (
                          <ChevronDown size={15} />
                        )}

                      </button>

                      {openHistory ===
                        item.id && (

                        <div className="mt-4">

                          {item.records?.length ===
                            0 && (
                            <p className="text-sm text-gray-500">
                              No stock history yet.
                            </p>
                          )}

                          <div className="space-y-4">

                            {item.records?.map(
                              (
                                record: any,
                                index: number
                              ) => (

                                <div
                                  key={record.id}
                                  className="relative flex gap-3"
                                >

                                  {index !==
                                    item.records
                                      .length -
                                      1 && (

                                    <div
                                      className="
                                        absolute
                                        left-3
                                        top-7
                                        bottom-[-16px]
                                        w-px
                                        bg-gray-200
                                      "
                                    />

                                  )}

                                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">

                                    {record.type ===
                                    "STOCK_REMOVED" ? (

                                      <PackageMinus
                                        size={17}
                                        className="text-red-500"
                                      />

                                    ) : (

                                      <PackagePlus
                                        size={17}
                                        className="text-emerald-500"
                                      />

                                    )}

                                  </div>

                                  <div className="min-w-0 flex-1">

                                    <div className="flex flex-wrap items-start justify-between gap-2">

                                      <div>

                                        <p className="text-sm font-semibold text-gray-900">
                                          {record.type}
                                        </p>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                          {formatDateTime(
                                            record.createdAt
                                          )}
                                        </p>

                                      </div>

                                      <p className="text-sm font-semibold text-gray-700">

                                        {record.quantity}{" "}

                                        {pluralizeUnit(
                                          item.unit ??
                                            "Unit",
                                          record.quantity
                                        )}

                                      </p>

                                    </div>

                                    <div className="mt-3 rounded-lg bg-white px-3 py-2">

                                      <p className="text-xs text-gray-500">
                                        Stock change
                                      </p>

                                      <p className="mt-0.5 text-sm font-medium text-gray-900">

                                        {record.previousQuantity ??
                                          "-"}{" "}
                                        →{" "}
                                        {record.newQuantity ??
                                          "-"}

                                      </p>

                                    </div>

                                    {record.reason && (
                                      <div className="mt-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-600">

                                        <span className="font-medium text-gray-800">
                                          Reason:
                                        </span>{" "}

                                        {record.reason}

                                      </div>
                                    )}

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      )}

                    </div>

                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>

      {/* ADD / EDIT MODAL */}

<AddItemModal
  open={addOpen || !!editItem}
  onClose={() => {
    setAddOpen(false);
    setEditItem(null);
  }}
  editItem={editItem}
  suppliers={suppliers}
  categories={categories}
  storageLocations={storageLocations}
/>

      {/* UPDATE STOCK */}

      {stockItem && (
        <UpdateStockModal
          item={stockItem}
          onClose={() =>
            setStockItem(null)
          }
        />
      )}

    </div>
  );
}