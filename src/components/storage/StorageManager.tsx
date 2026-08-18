"use client";

import { useEffect, useState } from "react";

import {
  createStorageLocation,
  updateStorageLocation,
  deleteStorageLocation,
} from "@/actions/storage";

import {
  Trash2,
  Snowflake,
  Refrigerator,
  Package,
  Plus,
  Pencil,
  ChevronDown,
  Box,
  X,
} from "lucide-react";

type Props = {
  storageLocations: any[];
};

export default function StorageManager({
  storageLocations,
}: Props) {
  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
  const handleOpenAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  window.addEventListener(
    "open-add-storage",
    handleOpenAdd
  );

  return () => {
    window.removeEventListener(
      "open-add-storage",
      handleOpenAdd
    );
  };
}, []);

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(location: any) {
    setEditing(location);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
  }

  async function submit(formData: FormData) {
    if (editing) {
      await updateStorageLocation(formData);
    } else {
      await createStorageLocation(formData);
    }

    closeModal();
  }

  async function confirmDelete() {
    if (!deleting) return;

    await deleteStorageLocation(deleting.id);
    setDeleting(null);
  }

  function getIcon(type: string) {
    if (type === "Freezer") {
      return <Snowflake size={24} />;
    }

    if (type === "Fridge") {
      return <Refrigerator size={24} />;
    }

    return <Package size={24} />;
  }

  function getIconStyle(type: string) {
    if (type === "Freezer") {
      return "bg-blue-50 text-blue-600";
    }

    if (type === "Fridge") {
      return "bg-cyan-50 text-cyan-600";
    }

    if (type === "Room") {
      return "bg-amber-50 text-amber-600";
    }

    if (type === "Cabinet") {
      return "bg-purple-50 text-purple-600";
    }

    return "bg-gray-100 text-gray-600";
  }

  return (
    <div className="space-y-6">


      {/* Storage Locations */}
      {storageLocations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <Package size={24} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-800">
            No storage locations yet
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Add your first freezer, fridge, shelf, cabinet, or room
            to start organising laboratory inventory.
          </p>

          <button
            onClick={openAdd}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <Plus size={17} />
            Add Storage
          </button>

        </div>
      ) : (

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {storageLocations.map((location) => {

            const itemCount =
              location.items?.length ?? 0;

            const totalQuantity =
              location.items?.reduce(
                (sum: number, item: any) =>
                  sum + (item.quantity ?? 0),
                0
              ) ?? 0;

            const isOpen =
              expanded.includes(location.id);

            return (

              <div
                key={location.id}
                className="
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >

                {/* Card */}
                <div className="p-5">

                  {/* Location Header */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${getIconStyle(location.type)}
                        `}
                      >
                        {getIcon(location.type)}
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate font-semibold text-gray-800">
                          {location.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">

                          <span>
                            {location.type ?? "Storage"}
                          </span>

                          <span>•</span>

                          <span>
                            {location.temperature ??
                              "Temperature not set"}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* Statistics */}
                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-lg bg-gray-50 px-3 py-3">

                      <div className="flex items-center gap-2 text-gray-500">

                        <Box size={15} />

                        <span className="text-xs font-medium">
                          Items
                        </span>

                      </div>

                      <p className="mt-1 text-lg font-semibold text-gray-800">
                        {itemCount}
                      </p>

                    </div>


                    <div className="rounded-lg bg-gray-50 px-3 py-3">

                      <div className="flex items-center gap-2 text-gray-500">

                        <Package size={15} />

                        <span className="text-xs font-medium">
                          Quantity
                        </span>

                      </div>

                      <p className="mt-1 text-lg font-semibold text-gray-800">
                        {totalQuantity}
                      </p>

                    </div>

                  </div>


                  {/* View Inventory */}
                  <button
                    onClick={() => {
                      setExpanded((current) =>
                        isOpen
                          ? current.filter(
                              (id) => id !== location.id
                            )
                          : [...current, location.id]
                      );
                    }}
                    className="
                      mt-4
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-50
                    "
                  >

                    <span>
                      {isOpen
                        ? "Hide Inventory"
                        : "View Inventory"}
                    </span>

                    <ChevronDown
                      size={17}
                      className={`
                        transition-transform
                        ${isOpen ? "rotate-180" : ""}
                      `}
                    />

                  </button>

                </div>


                {/* Inventory */}
                {isOpen && (

                  <div className="border-t border-gray-200 bg-gray-50 px-5 py-4">

                    {itemCount === 0 ? (

                      <div className="py-4 text-center">

                        <Package
                          size={22}
                          className="mx-auto text-gray-400"
                        />

                        <p className="mt-2 text-sm text-gray-500">
                          No inventory stored here.
                        </p>

                      </div>

                    ) : (

                      <div>

                        <div className="mb-3 flex items-center justify-between">

                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Inventory
                          </p>

                          <span className="text-xs text-gray-400">
                            {itemCount} item
                            {itemCount === 1 ? "" : "s"}
                          </span>

                        </div>


                        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">

                          {location.items.map((entry: any) => (

                            <div
                              key={entry.id}
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                px-3
                                py-2.5
                              "
                            >

                              <div className="min-w-0 max-w-[75%]">

                                <p className="text-xs font-medium leading-5 text-gray-800">
                                  {entry.item.name}
                                </p>

                                {entry.item.specific && (
                                  <p className="text-[11px] leading-4 text-gray-400">
                                    {entry.item.specific}
                                  </p>
                                )}

                              </div>

                              <span className="shrink-0 pt-0.5 text-xs font-medium text-gray-400">
                                {entry.quantity}
                              </span>

                            </div>

                          ))}

                        </div>

                      </div>

                    )}

                  </div>

                )}


                {/* Card Actions */}
                <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">

                  <button
                    onClick={() => openEdit(location)}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-gray-500
                      transition
                      hover:bg-gray-100
                      hover:text-gray-800
                    "
                  >
                    <Pencil size={15} />
                    Edit
                  </button>


                  <button
                    onClick={() => setDeleting(location)}
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      text-gray-400
                      transition
                      hover:bg-red-50
                      hover:text-red-600
                    "
                    title="Delete storage location"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      )}


      {/* ADD / EDIT MODAL */}
      {open && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
            backdrop-blur-sm
          "
          onMouseDown={closeModal}
        >

          <div
            className="
              w-full
              max-w-lg
              rounded-2xl
              bg-white
              shadow-xl
            "
            onMouseDown={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <div>

                <h2 className="text-lg font-semibold text-gray-800">
                  {editing
                    ? "Edit Storage Location"
                    : "Add Storage Location"}
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  {editing
                    ? "Update the details for this storage location."
                    : "Add a new laboratory storage location."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >
                <X size={18} />
              </button>

            </div>


            {/* Modal Form */}
            <form
              action={submit}
              className="space-y-5 p-6"
            >

              <input
                type="hidden"
                name="id"
                value={editing?.id ?? ""}
              />


              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Storage Name
                </label>

                <input
                  name="name"
                  required
                  defaultValue={editing?.name ?? ""}
                  placeholder="e.g. Main Freezer 1"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Type
                  </label>

                  <select
                    name="type"
                    defaultValue={editing?.type ?? ""}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >

                    <option value="">
                      Select type
                    </option>

                    <option>Freezer</option>
                    <option>Fridge</option>
                    <option>Shelf</option>
                    <option>Room</option>
                    <option>Cabinet</option>

                  </select>

                </div>


                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Temperature
                  </label>

                  <select
                    name="temperature"
                    defaultValue={editing?.temperature ?? ""}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  >

                    <option value="">
                      Select temperature
                    </option>

                    <option>-80°C</option>
                    <option>-20°C</option>
                    <option>4°C</option>
                    <option>Room temperature</option>

                  </select>

                </div>

              </div>


              {/* Modal Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-2
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
                  type="submit"
                  className="
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  {editing
                    ? "Save Changes"
                    : "Add Storage"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* DELETE CONFIRMATION MODAL */}
      {deleting && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
            backdrop-blur-sm
          "
          onMouseDown={() => setDeleting(null)}
        >

          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              shadow-xl
            "
            onMouseDown={(e) => e.stopPropagation()}
          >

            <div className="p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Trash2 size={20} />
                </div>

                <div>

                  <h2 className="font-semibold text-gray-800">
                    Delete Storage Location
                  </h2>

                  <p className="mt-2 text-sm leading-5 text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-700">
                      {deleting.name}
                    </span>
                    ?
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    This action cannot be undone.
                  </p>

                </div>

              </div>


              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setDeleting(null)}
                  className="
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-2
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
                  onClick={confirmDelete}
                  className="
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-red-700
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}