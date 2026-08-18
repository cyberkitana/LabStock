"use client";

import { useEffect, useState } from "react";
import { normaliseUnit } from "@/lib/normaliseUnit";
import { pluralizeUnit } from "@/lib/pluralise";

import {
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/actions/supplier";

import {
  Trash2,
  User,
  Mail,
  Phone,
  Globe,
  Package,
  Pencil,
  Plus,
  X,
} from "lucide-react";

type Props = {
  suppliers: any[];
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}

export default function SupplierManager({
  suppliers,
}: Props) {
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [flipped, setFlipped] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenAdd = () => {
      setEditing(null);
      setOpen(true);
    };

    window.addEventListener(
      "open-add-supplier",
      handleOpenAdd
    );

    return () => {
      window.removeEventListener(
        "open-add-supplier",
        handleOpenAdd
      );
    };
  }, []);

  function startEdit(supplier: any) {
    setEditing(supplier);
    setOpen(true);
  }

  function startAdd() {
    setEditing(null);
    setOpen(true);
  }

  function closeForm() {
    setEditing(null);
    setOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteSupplier(id);
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const term = search.toLowerCase().trim();

    if (!term) return true;

    return (
      supplier.name?.toLowerCase().includes(term) ||
      supplier.contact?.toLowerCase().includes(term) ||
      supplier.email?.toLowerCase().includes(term) ||
      supplier.phone?.toLowerCase().includes(term) ||
      supplier.website?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">

      {/* =====================================================
          CONTROLS
          ===================================================== */}

      <div className="flex items-center gap-3">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search suppliers..."
          className="
            w-full
            rounded-lg
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            text-gray-800
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-gray-400
            focus:ring-2
            focus:ring-gray-100
          "
        />

      </div>


      {/* =====================================================
          SUMMARY / SUPPLIER NETWORK
          ===================================================== */}

      <div
        className="
          relative
          h-[190px]
          overflow-hidden
          rounded-2xl
          bg-gradient-to-br
          from-slate-900
          via-blue-900
          to-blue-700
          px-6
          py-5
          shadow-lg
        "
      >

        {/* Decorative network globe */}

        <div
          className="
            pointer-events-none
            absolute
            right-[-90px]
            top-1/2
            h-[285px]
            w-[285px]
            -translate-y-1/2
            rounded-full
            border
            border-blue-300/20
            bg-blue-400/5
          "
        >

          <div
            className="
              absolute
              inset-[14px]
              rounded-full
              border
              border-blue-200/15
            "
          />

          <div
            className="
              absolute
              inset-[35px]
              rounded-full
              border
              border-blue-200/10
            "
          />

          {/* Longitude */}

          <div
            className="
              absolute
              inset-x-[78px]
              inset-y-0
              rounded-full
              border
              border-blue-200/15
            "
          />

          <div
            className="
              absolute
              inset-x-[125px]
              inset-y-0
              rounded-full
              border
              border-blue-200/10
            "
          />

          {/* Latitude */}

          <div
            className="
              absolute
              inset-y-[78px]
              inset-x-0
              rounded-full
              border
              border-blue-200/15
            "
          />

          <div
            className="
              absolute
              inset-y-[125px]
              inset-x-0
              rounded-full
              border
              border-blue-200/10
            "
          />

          {/* Connection lines */}

          <div
            className="
              absolute
              left-[78px]
              top-[105px]
              h-px
              w-[180px]
              rotate-[18deg]
              bg-blue-200/20
            "
          />

          <div
            className="
              absolute
              left-[100px]
              top-[150px]
              h-px
              w-[160px]
              rotate-[-22deg]
              bg-blue-200/15
            "
          />

          <div
            className="
              absolute
              left-[135px]
              top-[60px]
              h-px
              w-[130px]
              rotate-[42deg]
              bg-blue-200/15
            "
          />

          {/* Network nodes */}

          <span className="absolute left-[72px] top-[95px] h-2.5 w-2.5 rounded-full bg-blue-200 shadow-[0_0_12px_rgba(191,219,254,0.8)]" />
          <span className="absolute left-[145px] top-[65px] h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(147,197,253,0.8)]" />
          <span className="absolute left-[190px] top-[125px] h-2.5 w-2.5 rounded-full bg-blue-100 shadow-[0_0_12px_rgba(219,234,254,0.8)]" />
          <span className="absolute left-[125px] top-[160px] h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(147,197,253,0.8)]" />
          <span className="absolute left-[220px] top-[85px] h-2 w-2 rounded-full bg-blue-200 shadow-[0_0_10px_rgba(191,219,254,0.8)]" />

        </div>


        {/* Banner glow */}

        <div
          className="
            pointer-events-none
            absolute
            right-[110px]
            top-1/2
            h-[240px]
            w-[240px]
            -translate-y-1/2
            rounded-full
            bg-blue-400/10
            blur-3xl
          "
        />


        {/* Banner text */}

        <div className="relative z-10 flex h-full items-center">

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-blue-200
              "
            >
              Supplier Network
            </p>

            <div className="mt-2 flex items-end gap-3">

              <p className="text-5xl font-bold text-white">
                {suppliers.length}
              </p>

              <p className="mb-1 text-sm text-blue-100">
                research partners
              </p>

            </div>

            <p className="mt-3 max-w-sm text-sm text-blue-200/80">
              Laboratory suppliers and their associated inventory.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          CARDS
          ===================================================== */}

      {filteredSuppliers.length === 0 ? (

        <div
          className="
            rounded-xl
            border
            border-dashed
            border-gray-300
            bg-gray-50
            px-6
            py-12
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-500
            "
          >
            <Package size={24} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-800">
            No suppliers found
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            {search
              ? "No suppliers match your search."
              : "Add your first supplier to start managing your laboratory suppliers."}
          </p>

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

          {filteredSuppliers.map((supplier) => {

            const domain = supplier.website
              ? getDomain(supplier.website)
              : null;

            const hasContactDetails =
              Boolean(
                supplier.contact ||
                supplier.email ||
                supplier.phone ||
                supplier.website
              );

            const isFlipped =
              flipped === supplier.id;

            const itemCount =
              supplier.items?.length ?? 0;

            return (

              <div
                key={supplier.id}
                className="
                  perspective
                  h-[390px]
                  w-full
                "
                onMouseEnter={() =>
                  setFlipped(supplier.id)
                }
                onMouseLeave={() =>
                  setFlipped(null)
                }
              >

                <div
                  className={`
                    relative
                    h-full
                    w-full
                    transition-transform
                    duration-700
                    ease-in-out
                    transform-style-preserve-3d
                    ${isFlipped ? "rotate-y-180" : ""}
                  `}
                >

                  {/* =================================================
                      FRONT
                      ================================================= */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      shadow-sm
                      backface-hidden
                    "
                  >

                    <div className="flex-1 p-5">

                      {/* Header */}

                      <div className="flex items-start gap-3">

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                          "
                        >

                          {domain ? (

                            <img
                              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=256`}
                              alt=""
                              width={32}
                              height={32}
                              className="object-contain p-1"
                            />

                          ) : (

                            <span
                              className="
                                text-lg
                                font-bold
                                text-blue-600
                              "
                            >
                              LS
                            </span>

                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3
                            className="
                              break-words
                              text-lg
                              font-semibold
                              leading-6
                              tracking-tight
                              text-gray-900
                            "
                          >
                            {supplier.name}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            Laboratory Supplier
                          </p>

                        </div>

                      </div>


                      {/* Contact Details */}

                      <div
                        className="
                          mt-5
                          border-t
                          border-gray-200
                          pt-4
                        "
                      >

                        <div className="mb-3 flex items-center gap-2">

                          <User
                            size={15}
                            className="text-gray-400"
                          />

                          <p
                            className="
                              text-xs
                              font-semibold
                              uppercase
                              tracking-wide
                              text-gray-500
                            "
                          >
                            Contact Details
                          </p>

                        </div>


                        {hasContactDetails ? (

                          <div className="space-y-2.5">

                            {supplier.contact && (
                              <div className="flex items-start gap-2 text-sm text-gray-600">

                                <User
                                  size={15}
                                  className="mt-0.5 shrink-0 text-gray-400"
                                />

                                <span className="break-words">
                                  {supplier.contact}
                                </span>

                              </div>
                            )}

                            {supplier.email && (
                              <div className="flex items-start gap-2 text-sm text-gray-600">

                                <Mail
                                  size={15}
                                  className="mt-0.5 shrink-0 text-gray-400"
                                />

                                <span className="break-all">
                                  {supplier.email}
                                </span>

                              </div>
                            )}

                            {supplier.phone && (
                              <div className="flex items-start gap-2 text-sm text-gray-600">

                                <Phone
                                  size={15}
                                  className="mt-0.5 shrink-0 text-gray-400"
                                />

                                <span className="break-words">
                                  {supplier.phone}
                                </span>

                              </div>
                            )}

                            {supplier.website && (
                              <div className="flex items-start gap-2 text-sm text-gray-600">

                                <Globe
                                  size={15}
                                  className="mt-0.5 shrink-0 text-gray-400"
                                />

                                <span className="break-all">
                                  {domain ?? supplier.website}
                                </span>

                              </div>
                            )}

                          </div>

                        ) : (

                          <p className="text-sm text-gray-400">
                            No contact details available.
                          </p>

                        )}

                      </div>

                    </div>


                    {/* Footer */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-t
                        border-gray-200
                        px-5
                        py-3
                      "
                    >

                      <p className="text-xs text-gray-400">
                        Hover to view inventory
                      </p>

                      <span className="text-xs font-medium text-gray-500">
                        {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      BACK: INVENTORY
                      ================================================= */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      overflow-hidden
                      rounded-xl
                      bg-blue-600
                      text-white
                      shadow-xl
                      backface-hidden
                      rotate-y-180
                    "
                  >

                    {/* Inventory Header */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-white/20
                        px-5
                        py-4
                      "
                    >

                      <div className="flex items-center gap-2">

                        <Package
                          size={18}
                          className="text-blue-200"
                        />

                        <div>

                          <p className="text-sm font-semibold">
                            Inventory
                          </p>

                          <p className="text-xs text-blue-200">
                            {itemCount}{" "}
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* Inventory List */}

                    <div className="min-h-0 flex-1 px-5 py-4">

                      {itemCount === 0 ? (

                        <div className="flex h-full flex-col items-center justify-center text-center">

                          <Package
                            size={28}
                            className="text-blue-200"
                          />

                          <p className="mt-3 text-sm text-blue-100">
                            No inventory supplied by this supplier.
                          </p>

                        </div>

                      ) : (

                        <div className="h-full space-y-2 overflow-y-auto pr-1">

                          {supplier.items.map((item: any) => (

                            <div
                              key={item.id}
                              className="
                                rounded-lg
                                border
                                border-white/15
                                bg-white/10
                                px-3
                                py-2.5
                              "
                            >

                              <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                  <p
                                    className="
                                      break-words
                                      text-sm
                                      font-medium
                                      text-white
                                    "
                                  >
                                    {item.name}
                                  </p>

                                  {item.specific && (
                                    <p
                                      className="
                                        mt-0.5
                                        break-words
                                        text-[11px]
                                        leading-4
                                        text-blue-200
                                      "
                                    >
                                      {item.specific}
                                    </p>
                                  )}

                                </div>


                                {item.quantity !== null &&
                                  item.quantity !== undefined && (

                                    <span
                                      className="
                                        shrink-0
                                        pt-0.5
                                        text-xs
                                        font-medium
                                        text-blue-100
                                      "
                                    >
                                      {item.quantity}{" "}
                                      {item.unit
                                        ? pluralizeUnit(
                                            normaliseUnit(
                                              item.unit
                                            ),
                                            item.quantity
                                          )
                                        : "Unit"}
                                    </span>

                                  )}

                              </div>

                            </div>

                          ))}

                        </div>

                      )}

                    </div>


                    {/* Back Actions */}

                    <div
                      className="
                        flex
                        items-center
                        justify-end
                        gap-2
                        border-t
                        border-white/20
                        px-5
                        py-3
                      "
                    >

                      {/* Edit */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(supplier);
                        }}
                        className="
                          inline-flex
                          cursor-pointer
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-white/30
                          bg-white/10
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-white
                          transition
                          hover:bg-white/20
                        "
                      >
                        <Pencil size={15} />
                        Edit
                      </button>


                      {/* Delete */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(supplier.id);
                        }}
                        className="
                          inline-flex
                          cursor-pointer
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-white/30
                          bg-white/10
                          p-2
                          text-white
                          transition
                          hover:bg-white/20
                        "
                        title="Delete supplier"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}


      {/* =====================================================
          ADD / EDIT MODAL
          ===================================================== */}

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
            p-4
            backdrop-blur-sm
          "
          onMouseDown={closeForm}
        >

          <div
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-xl
            "
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-200
                px-6
                py-4
              "
            >

              <div>

                <h2 className="text-lg font-semibold text-gray-800">
                  {editing
                    ? "Edit Supplier"
                    : "Add Supplier"}
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  {editing
                    ? "Update the supplier's contact details."
                    : "Add a new laboratory supplier."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                className="
                  flex
                  h-8
                  w-8
                  cursor-pointer
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


            {/* Form */}

            <form
              action={async (formData) => {

                if (editing) {
                  await updateSupplier(formData);
                } else {
                  await createSupplier(formData);
                }

                closeForm();

              }}
              className="p-6"
            >

              <input
                type="hidden"
                name="id"
                value={editing?.id ?? ""}
              />


              <div className="space-y-4">

                {/* Supplier Name */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Supplier Name
                  </label>

                  <input
                    name="name"
                    required
                    defaultValue={editing?.name ?? ""}
                    placeholder="e.g. Thermo Fisher Scientific"
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


                {/* Contact + Email */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Contact Person
                    </label>

                    <input
                      name="contact"
                      defaultValue={editing?.contact ?? ""}
                      placeholder="Contact person"
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


                  <div>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>

                    <input
                      name="email"
                      type="email"
                      defaultValue={editing?.email ?? ""}
                      placeholder="Email address"
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

                </div>


                {/* Phone + Website */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>

                    <input
                      name="phone"
                      defaultValue={editing?.phone ?? ""}
                      placeholder="Phone number"
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


                  <div>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Website
                    </label>

                    <input
                      name="website"
                      defaultValue={editing?.website ?? ""}
                      placeholder="https://example.com"
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

                </div>

              </div>


              {/* Actions */}

              <div
                className="
                  mt-6
                  flex
                  justify-end
                  gap-3
                  border-t
                  border-gray-100
                  pt-5
                "
              >

                <button
                  type="button"
                  onClick={closeForm}
                  className="
                    cursor-pointer
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
                    cursor-pointer
                    rounded-lg
                    bg-gray-900
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                  "
                >
                  {editing
                    ? "Save Changes"
                    : "Add Supplier"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}