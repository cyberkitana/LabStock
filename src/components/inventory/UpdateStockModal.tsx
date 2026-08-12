"use client";

import { useState } from "react";
import { updateStock } from "@/actions/inventory";

type Props = {
  item: any;
  storageLocations?: any[];
  onClose: () => void;
};

export default function UpdateStockModal({
  item,
  storageLocations,
  onClose,
}: Props) {
  const [changeType, setChangeType] = useState<
    "ADD" | "REMOVE"
  >("ADD");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(formData: FormData) {
  setSubmitting(true);
  setError("");

  try {
    await updateStock(formData);
    onClose();
  } catch (error) {
    console.error(
      "Failed to update stock:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "Failed to update stock."
    );

    setSubmitting(false);
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
<div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
          {/* HEADER */}

        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
  Update stock
</h2>

          <p className="mt-1 text-sm text-gray-500">
            Adjust the stock quantity for this item.
          </p>
        </div>

        <form
          action={submit}
          className="space-y-4"
        >
          <input
            type="hidden"
            name="itemId"
            value={item.id}
          />

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

          {/* CHANGE TYPE */}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Stock change
            </label>

            <select
              name="changeType"
              value={changeType}
              onChange={(e) =>
                setChangeType(
                  e.target.value as
                    | "ADD"
                    | "REMOVE"
                )
              }
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

          {/* =================================================
              ADD STOCK
              ================================================= */}

          {changeType === "ADD" && (
            <>
              {/* STORAGE LOCATION */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">

</div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Storage location
                </label>

                <select
                  name="storageId"
                  required
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
                >
                  <option value="">
                    Select a storage location
                  </option>

                  {(storageLocations ?? []).map(
                    (location: any) => (
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {location.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* STATUS */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Item status
                </label>

                <select
                  name="opened"
                  required
                  defaultValue="UNKNOWN"
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
                >
                  <option value="OPENED">
                    Opened
                  </option>

                  <option value="UNOPENED">
                    Unopened
                  </option>

                  <option value="UNKNOWN">
                    Unknown
                  </option>
                </select>
              </div>
              </div>
            </>
          )}

          {/* =================================================
              REMOVE STOCK
              ================================================= */}

          {changeType === "REMOVE" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Stock location
                </label>

                <select
                  name="locationId"
                  required
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
                >
                  <option value="">
                    Select stock location
                  </option>

                  {item.locations?.map(
                    (location: any) => (
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {location.storage?.name ??
                          "Unknown location"}{" "}
                        •{" "}
                        {location.opened ===
                        "OPENED"
                          ? "Opened"
                          : location.opened ===
                            "UNOPENED"
                          ? "Unopened"
                          : "Unknown"}{" "}
                        • current:{" "}
                        {location.quantity}
                      </option>
                    )
                  )}
                </select>
              </div>
            </>
          )}

{/* =================================================
    QUANTITY + REASON
    ================================================= */}

<div className="grid grid-cols-1 gap-4 md:grid-cols-2">

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

    {changeType === "ADD" ? (
      <>
        <option value="New stock">
          New stock
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
      </>
    ) : (
      <>
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
      </>
    )}
  </select>
</div>
</div>
          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-2">
            <button
  type="button"
  onClick={onClose}
  disabled={submitting}
  className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
>
  Cancel
</button>

            <button
  type="submit"
  disabled={submitting}
  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {submitting
    ? "Updating..."
    : "Update Stock"}
</button>
          </div>
        </form>
      </div>
    </div>
  );
}