"use client";

import { useMemo, useState } from "react";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryDashboard from "@/components/inventory/InventoryDashboard";
import InventoryTable from "@/components/inventory/InventoryTable";
import { prepareInventoryExportData } from "@/lib/exports/inventoryExportData";
import { exportInventoryToExcel } from "@/lib/exports/excelExport";
import { exportInventoryToPdf } from "@/lib/exports/inventoryPdf";

type Props = {
  inventoryItems: any[];
  suppliers: any[];
  categories: any[];
  storageLocations: any[];
};

export default function InventoryPageClient({
  inventoryItems,
  suppliers,
  categories,
  storageLocations,
}: Props) {
  // =====================================================
  // SEARCH + FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [supplierFilter, setSupplierFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [expiryFilter, setExpiryFilter] =
    useState("ALL");

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [addItemOpen, setAddItemOpen] =
    useState(false);

  // =====================================================
  // FILTER INVENTORY
  // =====================================================

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      const matchesSearch =
        item.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      // -------------------------------------------------
      // CATEGORY
      // -------------------------------------------------

      const matchesCategory =
        categoryFilter === "ALL" ||
        item.category?.id === categoryFilter;

      // -------------------------------------------------
      // SUPPLIER
      // -------------------------------------------------

      const matchesSupplier =
        supplierFilter === "ALL" ||
        item.supplier?.id === supplierFilter;

      // -------------------------------------------------
      // STOCK STATUS
      // -------------------------------------------------

      const quantity = item.quantity ?? 0;

      const minimumStock =
        item.minimumStock ?? 5;

      const stockStatus =
        quantity <= 0
          ? "OUT"
          : quantity <= minimumStock
          ? "LOW"
          : "IN";

      const matchesStatus =
        statusFilter === "ALL" ||
        statusFilter === stockStatus;

      // -------------------------------------------------
      // EXPIRY STATUS
      // -------------------------------------------------

      let expiryStatus = "NONE";

      if (item.expiryDate) {
        const expiry =
          new Date(item.expiryDate);

        const today =
          new Date();

        const days = Math.ceil(
          (expiry.getTime() -
            today.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (days < 0) {
          expiryStatus = "EXPIRED";
        } else if (days <= 30) {
          expiryStatus = "SOON";
        } else {
          expiryStatus = "VALID";
        }
      }

      const matchesExpiry =
        expiryFilter === "ALL" ||
        expiryFilter === expiryStatus;

      // -------------------------------------------------
      // FINAL RESULT
      // -------------------------------------------------

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSupplier &&
        matchesStatus &&
        matchesExpiry
      );
    });
  }, [
    inventoryItems,
    search,
    categoryFilter,
    supplierFilter,
    statusFilter,
    expiryFilter,
  ]);

  // =====================================================
  // EXCEL EXPORT
  // =====================================================

  const handleExportExcel = async () => {
    const exportData =
      prepareInventoryExportData(
        inventoryItems
      );

    await exportInventoryToExcel(
      exportData
    );
  };
  const handleExportPdf = () => {
  const data =
    prepareInventoryExportData(inventoryItems);

  exportInventoryToPdf(data);
};

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="space-y-6">

        {/* =================================================
            INVENTORY HEADER
            ================================================= */}

        <InventoryHeader
  suppliers={suppliers}
  onExportExcel={handleExportExcel}
  onExportPdf={handleExportPdf}
  categories={categories}
  storageLocations={storageLocations}

          search={search}
          setSearch={setSearch}

          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}

          supplierFilter={supplierFilter}
          setSupplierFilter={setSupplierFilter}

          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}

          expiryFilter={expiryFilter}
          setExpiryFilter={setExpiryFilter}

          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}

          addItemOpen={addItemOpen}
          setAddItemOpen={setAddItemOpen}
        />

        {/* =================================================
            INVENTORY DASHBOARD
            ================================================= */}

        <InventoryDashboard
          inventoryItems={inventoryItems}
        />

        {/* =================================================
            INVENTORY TABLE
            ================================================= */}

        <InventoryTable
          inventoryItems={filteredItems}
          suppliers={suppliers}
          categories={categories}
          storageLocations={storageLocations}
        />

      </div>
    </div>
  );
}