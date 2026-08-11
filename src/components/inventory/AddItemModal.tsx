"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

type StorageLocation = {
  id: string;
  name: string;
};

type StorageAllocation = {
  id: string;
  storageId: string;
  opened: "OPENED" | "UNOPENED" | "UNKNOWN";
  quantity: string;
};

type AddItemModalProps = {
  open: boolean;
  editItem: any | null;
  onClose: () => void;
  suppliers: any[];
  categories: any[];
  storageLocations: StorageLocation[];
};
export default function AddItemModal({
  open,
  editItem,
  onClose,
  suppliers,
  categories,
  storageLocations,
}: AddItemModalProps) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState("5");
  const [unit, setUnit] = useState("Unit");
  const [specific, setSpecific] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [storageAllocations, setStorageAllocations] = useState<
    StorageAllocation[]
  >([
    {
      id: crypto.randomUUID(),
      storageId: "",
      opened: "UNKNOWN",
      quantity: "1",
    },
  ]);
  useEffect(() => {
  if (!open) return;

  if (!editItem) {
    setItemName("");
    setDescription("");
    setQuantity("");
    setMinimumStock("5");
    setUnit("Unit");
    setSpecific("");
    setBatchNumber("");
    setExpiryDate("");
    setCategoryId("");
    setSupplierId("");

    setStorageAllocations([
      {
        id: crypto.randomUUID(),
        storageId: "",
        opened: "UNKNOWN",
        quantity: "1",
      },
    ]);

    return;
  }

  setItemName(editItem.name ?? "");
  setDescription(editItem.description ?? "");
  setQuantity(String(editItem.quantity ?? 0));
  setMinimumStock(String(editItem.minimumStock ?? 5));
  setUnit(editItem.unit ?? "Unit");
  setSpecific(editItem.specific ?? "");
  setBatchNumber(editItem.batchNumber ?? "");
  setExpiryDate(
    editItem.expiryDate
      ? new Date(editItem.expiryDate)
          .toISOString()
          .split("T")[0]
      : ""
  );
  setCategoryId(editItem.categoryId ?? "");
  setSupplierId(editItem.supplierId ?? "");

  setStorageAllocations(
    editItem.locations?.length
      ? editItem.locations.map((location: any) => ({
          id: crypto.randomUUID(),
          storageId: location.storageId,
          opened:
            location.opened === true
              ? "OPENED"
              : location.opened === false
              ? "UNOPENED"
              : "UNKNOWN",
          quantity: String(location.quantity ?? 0),
        }))
      : [
          {
            id: crypto.randomUUID(),
            storageId: "",
            opened: "UNKNOWN",
            quantity: "0",
          },
        ]
  );
}, [open, editItem]);

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
useEffect(() => {
  if (!open) return;

  if (!editItem) {
    setItemName("");
    setDescription("");
    setQuantity("");
    setMinimumStock("5");
    setUnit("Unit");
    setSpecific("");
    setBatchNumber("");
    setExpiryDate("");
    setCategoryId("");
    setSupplierId("");

    setStorageAllocations([
      {
        id: crypto.randomUUID(),
        storageId: "",
        opened: "UNKNOWN",
        quantity: "1",
      },
    ]);

    return;
  }

  setItemName(editItem.name ?? "");
  setDescription(editItem.description ?? "");
  setQuantity(String(editItem.quantity ?? 0));
  setMinimumStock(String(editItem.minimumStock ?? 5));
  setUnit(editItem.unit ?? "Unit");
  setSpecific(editItem.specific ?? "");
  setBatchNumber(editItem.batchNumber ?? "");

  setExpiryDate(
    editItem.expiryDate
      ? new Date(editItem.expiryDate)
          .toISOString()
          .split("T")[0]
      : ""
  );

  setCategoryId(editItem.categoryId ?? "");
  setSupplierId(editItem.supplierId ?? "");

  setStorageAllocations(
    editItem.locations?.length
      ? editItem.locations.map((location: any) => ({
          id: crypto.randomUUID(),
          storageId: location.storageId,
          opened:
            location.opened === true
              ? "OPENED"
              : location.opened === false
              ? "UNOPENED"
              : "UNKNOWN",
          quantity: String(location.quantity ?? 0),
        }))
      : [
          {
            id: crypto.randomUUID(),
            storageId: "",
            opened: "UNKNOWN",
            quantity: "0",
          },
        ]
  );
}, [open, editItem]);

  if (!open) {
    return null;
  }

  const addStorageAllocation = () => {
    setStorageAllocations((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        storageId: "",
        opened: "UNKNOWN",
        quantity: "1",
      },
    ]);
  };

  const updateStorageAllocation = (
    id: string,
    field: keyof Omit<StorageAllocation, "id">,
    value: string
  ) => {
    setStorageAllocations((current) =>
      current.map((allocation) =>
        allocation.id === id
          ? {
              ...allocation,
              [field]: value,
            }
          : allocation
      )
    );
  };

  const removeStorageAllocation = (id: string) => {
    setStorageAllocations((current) =>
      current.length === 1
        ? current
        : current.filter((allocation) => allocation.id !== id)
    );
  };

  const allocatedQuantity = storageAllocations.reduce(
    (total, allocation) =>
      total + (Number(allocation.quantity) || 0),
    0
  );

  const handleSubmit = async () => {
    setFormError("");

    if (!itemName.trim()) {
      setFormError("Item name is required.");
      return;
    }

    const quantityValue = Number(quantity);
    const minimumStockValue = Number(minimumStock);

    if (
      quantity === "" ||
      !Number.isInteger(quantityValue) ||
      quantityValue < 0
    ) {
      setFormError(
        "Quantity must be a whole number of 0 or greater."
      );
      return;
    }

    if (
      minimumStock === "" ||
      !Number.isInteger(minimumStockValue) ||
      minimumStockValue < 0
    ) {
      setFormError(
        "Minimum stock must be a whole number of 0 or greater."
      );
      return;
    }

    if (allocatedQuantity !== quantityValue) {
      setFormError(
        `Storage allocation total (${allocatedQuantity}) must match item quantity (${quantityValue}).`
      );
      return;
    }

    const invalidAllocation = storageAllocations.some(
      (allocation) =>
        !allocation.storageId ||
        !Number.isInteger(Number(allocation.quantity)) ||
        Number(allocation.quantity) < 0
    );

    if (invalidAllocation) {
      setFormError(
        "Please select a storage location and enter a valid quantity for each allocation."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
  editItem
    ? `/api/inventory/${editItem.id}`
    : "/api/inventory",
  {
    method: editItem ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: itemName.trim(),
          description: description.trim() || null,
          quantity: quantityValue,
          minimumStock: minimumStockValue,
          unit: unit.trim() || "Unit",
          specific: specific.trim() || null,
          batchNumber: batchNumber.trim() || null,
          expiryDate: expiryDate || null,
          categoryId: categoryId || null,
          supplierId: supplierId || null,
          storageAllocations: storageAllocations.map(
            (allocation) => ({
              storageId: allocation.storageId,
              opened: allocation.opened,
              quantity: Number(allocation.quantity),
            })
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(
          data.error ||
  (editItem
    ? "Failed to update inventory item."
    : "Failed to add inventory item.")
        );
        return;
      }

      console.log("Item created:", data.item);

      onClose();
    } catch (error) {
      console.error(error);
      setFormError(
        "Something went wrong while adding the item."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
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
backdrop-blur-sm      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
<div
  className="
    flex
    w-full
    max-w-6xl
    h-[92vh]
max-h-[94vh]
    flex-col
    overflow-hidden
    rounded-2xl
    border
    border-gray-200
    bg-white
    shadow-2xl
    "
      >
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-gray-100 px-7 pt-5 pb-2">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-gray-900">
              Add inventory item
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
            aria-label="Close add item"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="min-h-0 flex-1 overflow-y-auto px-7 pt-3 pb-5">
        <div className="grid grid-cols-2 gap-x-10 gap-y-3">
        {/* BASIC INFORMATION */}

            <section>
              <div className="mb-1.5">
                <h3 className="text-sm font-semibold text-gray-900">
                  Basic information
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
  Add the item name, category, and supplier details.
  </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* ITEM NAME */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Item name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) =>
                      setItemName(e.target.value)
                    }
                    placeholder="e.g. Trypsin-EDTA"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Description
                  </label>

                  <input
                    type="text"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Optional description..."
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </label>

                  <select
                    value={categoryId}
                    onChange={(e) =>
                      setCategoryId(e.target.value)
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SUPPLIER */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Supplier
                  </label>

                  <select
                    value={supplierId}
                    onChange={(e) =>
                      setSupplierId(e.target.value)
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >
                    <option value="">
                      Select supplier
                    </option>

                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

{/* STOCK */}

<section className="border-t border-gray-100 pt-5">
  <div className="mb-3">
    <h3 className="text-sm font-semibold text-gray-900">
      Stock information
    </h3>

    <p className="mt-0.5 text-xs text-gray-500">
      Define the current quantity, unit, and stock monitoring settings.
    </p>
  </div>

  <div className="grid grid-cols-[0.65fr_0.65fr_1.15fr_1fr] gap-2">

    {/* QUANTITY */}

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
        Quantity
      </label>

      <input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) =>
          setQuantity(e.target.value)
        }
        placeholder="0"
        className="
          w-full
          rounded-lg
          border
          border-gray-200
          px-3
          py-2.5
          text-sm
          outline-none
          focus:border-blue-400
          focus:ring-2
          focus:ring-blue-100
        "
      />
    </div>

    {/* MINIMUM STOCK */}

    <div>
<label className="mb-1.5 block whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-gray-500">        Minimum stock
      </label>

      <input
        type="number"
        min="0"
        value={minimumStock}
        onChange={(e) =>
          setMinimumStock(e.target.value)
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-200
          px-3
          py-2.5
          text-sm
          outline-none
          focus:border-blue-400
          focus:ring-2
          focus:ring-blue-100
        "
      />
    </div>

    {/* SPECIFIC */}

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
        Specific
      </label>

      <input
        type="text"
        value={specific}
        onChange={(e) =>
          setSpecific(e.target.value)
        }
        placeholder="500 mL, 6-well..."
        className="
          w-full
          rounded-lg
          border
          border-gray-200
          px-3
          py-2.5
          text-sm
          outline-none
          focus:border-blue-400
          focus:ring-2
          focus:ring-blue-100
        "
      />
    </div>

    {/* UNIT */}

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
        Unit
      </label>

      <select
        value={unit}
        onChange={(e) =>
          setUnit(e.target.value)
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          py-2.5
          text-sm
          text-gray-700
          outline-none
          transition
          focus:border-blue-400
          focus:ring-2
          focus:ring-blue-100
        "
      >
        <option value="Unit">Unit</option>
        <option value="µL">µL</option>
        <option value="mL">mL</option>
        <option value="L">L</option>
        <option value="µg">µg</option>
        <option value="mg">mg</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="vial">Vial</option>
        <option value="bottle">Bottle</option>
        <option value="tube">Tube</option>
        <option value="pack">Pack</option>
        <option value="box">Box</option>
        <option value="kit">Kit</option>
      </select>
    </div>

  </div>
</section>
{/* STORAGE */}

<section className="border-t border-gray-100 pt-4 mt-2">
  <div className="mb-3 flex items-start justify-between gap-3">
    <div>
      <h3 className="text-sm font-semibold text-gray-900">
        Storage
      </h3>

      <p className="mt-0.5 text-xs text-gray-500">
        Record where this stock is stored and whether it has been opened.
      </p>
    </div>

    <div className="flex shrink-0 items-center gap-3">
      <div
        className={`text-xs ${
          allocatedQuantity === Number(quantity || 0)
            ? "text-gray-500"
            : "text-red-600"
        }`}
      >
        Allocated:
        <span className="ml-1 font-semibold">
          {allocatedQuantity} {unit.trim() || "Unit"}
        </span>

        <span className="mx-1">/</span>

        <span className="font-semibold">
          {Number(quantity || 0)} {unit.trim() || "Unit"}
        </span>
      </div>

      <button
        type="button"
        onClick={addStorageAllocation}
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          py-2
          text-xs
          font-medium
          text-gray-700
          transition
          hover:bg-gray-50
        "
      >
        <Plus size={14} />
        Add location
      </button>
    </div>
  </div>

  {/* SCROLLABLE LOCATION LIST */}

  <div className="max-h-64 overflow-y-auto pr-2">
    <div className="space-y-3">
      {storageAllocations.map((allocation, index) => (
        <div
          key={allocation.id}
          className="
            grid
            grid-cols-[minmax(0,1.5fr)_minmax(130px,1fr)_110px_36px]
            items-end
            gap-2
            rounded-lg
            border
            border-gray-200
            bg-gray-50/50
            p-3
          "
        >
          {/* STORAGE LOCATION */}

          <div>
            {index === 0 && (
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Storage location
              </label>
            )}

            <select
              value={allocation.storageId}
              onChange={(e) =>
                updateStorageAllocation(
                  allocation.id,
                  "storageId",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-700
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="">Select location</option>

              {storageLocations.map((location) => (
                <option
                  key={location.id}
                  value={location.id}
                >
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* OPENED */}

          <div>
            {index === 0 && (
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Status
              </label>
            )}

            <select
              value={allocation.opened}
              onChange={(e) =>
                updateStorageAllocation(
                  allocation.id,
                  "opened",
                  e.target.value as StorageAllocation["opened"]
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-700
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="UNKNOWN">Unknown</option>
              <option value="UNOPENED">Unopened</option>
              <option value="OPENED">Opened</option>
            </select>
          </div>

          {/* QUANTITY */}

          <div>
            {index === 0 && (
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Quantity
              </label>
            )}

            <input
              type="number"
              min="0"
              step="1"
              value={allocation.quantity}
              onChange={(e) =>
                updateStorageAllocation(
                  allocation.id,
                  "quantity",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-900
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* REMOVE */}

          <button
            type="button"
            onClick={() =>
              removeStorageAllocation(allocation.id)
            }
            disabled={storageAllocations.length === 1}
            className="
              mb-0.5
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-red-500
              disabled:pointer-events-none
              disabled:opacity-0
            "
            aria-label={`Remove allocation ${index + 1}`}
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  </div>
</section>

            {/* PRODUCT DETAILS */}

            <section className="border-t border-gray-100 pt-4 mt-2">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Product details
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
  Optional information used to identify this item.
</p>
              </div>

              <div className="grid grid-cols-[1.1fr_1.1fr_1.4fr_1.1fr] gap-2">
                {/* BATCH */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Batch number
                  </label>

                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) =>
                      setBatchNumber(e.target.value)
                    }
                    placeholder="Optional"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>

                {/* EXPIRY */}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Expiry date
                  </label>

                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) =>
                      setExpiryDate(e.target.value)
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-7 py-4">
          <div>
            {formError && (
              <p className="max-w-xl text-sm font-medium text-red-600">
                {formError}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
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
              onClick={handleSubmit}
              disabled={saving}
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
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving
  ? editItem
    ? "Saving..."
    : "Adding..."
  : editItem
  ? "Save changes"
  : "Add item"}
            </button>
            </div>
          </div>
        </div>
      </div>
  );
}