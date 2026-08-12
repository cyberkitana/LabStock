"use client";

import { updateStock } from "@/actions/inventory";

type Props = {
  item: any;
  onClose: () => void;
};

export default function UpdateStockModal({
  item,
  onClose,
}: Props) {
  async function submit(formData: FormData) {
    await updateStock(formData);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Update Stock
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Adjust the stock quantity for this item.
          </p>
        </div>

        <form action={submit} className="space-y-5">
          {/* ITEM */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Item
            </label>

            <input
              disabled
              value={item.name}
              className="mt-1 w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm"
            />
          </div>

          {/* STORAGE LOCATION */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Storage location
            </label>

            <select
              name="storageId"
              required
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              {item.locations?.map((location: any) => (
                <option
                  key={location.id}
                  value={location.storageId}
                >
                  {location.storage?.name ?? "Unknown location"}{" "}
                  (current: {location.quantity})
                </option>
              ))}
            </select>
          </div>

          {/* CHANGE TYPE */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Stock change
            </label>

            <select
              name="changeType"
              required
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="ADD">
                Add stock
              </option>

              <option value="REMOVE">
                Remove stock
              </option>
            </select>
          </div>

          {/* QUANTITY */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>

            <input
              name="quantity"
              type="number"
              min="1"
              step="1"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* REASON */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Reason
            </label>

            <select
              name="reason"
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="">
                Select a reason
              </option>

              <option value="New stock">
                New stock
              </option>

              <option value="Stock used">
                Stock used
              </option>

              <option value="Stock adjustment">
                Stock adjustment
              </option>

              <option value="Correction">
                Correction
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}