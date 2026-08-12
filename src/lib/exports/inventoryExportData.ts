export type InventoryExportItem = {
  name: string;
  quantity: number;
  minimumStock: number;
  unit: string;
  category: string;
  supplier: string;
  status: "Out of stock" | "Low stock" | "In stock";
  storageLocation: string;
  openedStatus: string;
  batch: string;
  expiry: string;
};

export type OrderExportItem = {
  priority: "URGENT" | "LOW";
  item: string;
  supplier: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  orderQuantity: number;
  unit: string;
};

export type InventoryExportData = {
  generatedAt: Date;
  orderList: OrderExportItem[];
  inventoryDetails: InventoryExportItem[];
};

function getStockStatus(
  item: any
): InventoryExportItem["status"] {
  const quantity = item.quantity ?? 0;
  const minimumStock = item.minimumStock ?? 5;

  if (quantity <= 0) {
    return "Out of stock";
  }

  if (quantity <= minimumStock) {
    return "Low stock";
  }

  return "In stock";
}

function getPriority(
  item: any
): OrderExportItem["priority"] {
  const quantity = item.quantity ?? 0;

  return quantity <= 0 ? "URGENT" : "LOW";
}

function getOrderQuantity(item: any): number {
  const quantity = item.quantity ?? 0;
  const minimumStock = item.minimumStock ?? 5;

  return Math.max(minimumStock - quantity, 0);
}

function formatExpiryDate(
  expiryDate: any
): string {
  if (!expiryDate) {
    return "";
  }

  return new Date(expiryDate).toLocaleDateString(
    "en-ZA"
  );
}

function formatStorageLocations(
  item: any
): string {
  const locations = item.locations ?? [];

  return locations
    .map((location: any) => {
      const locationName =
        location.storage?.name ??
        "Unknown location";

      const quantity =
        Number(location.quantity ?? 0);

      const unit =
        item.unit ?? "Unit";

      // Pluralise storage unit based on the quantity
      const pluralUnits: Record<string, string> = {
        unit: "Units",
        units: "Units",
        item: "Items",
        items: "Items",
        vial: "Vials",
        vials: "Vials",
        tube: "Tubes",
        tubes: "Tubes",
        bottle: "Bottles",
        bottles: "Bottles",
        flask: "Flasks",
        flasks: "Flasks",
        plate: "Plates",
        plates: "Plates",
        well: "Wells",
        wells: "Wells",
        box: "Boxes",
        boxes: "Boxes",
        pack: "Packs",
        packs: "Packs",
        packet: "Packets",
        packets: "Packets",
        container: "Containers",
        containers: "Containers",
        kit: "Kits",
        kits: "Kits",
        bag: "Bags",
        bags: "Bags",
        reagent: "Reagents",
        reagents: "Reagents",
      };

      const measurementUnits = [
        "ml",
        "µl",
        "ul",
        "l",
        "g",
        "mg",
        "kg",
        "µg",
        "ug",
        "ng",
        "mm",
        "cm",
      ];

      const lowerUnit =
        unit.trim().toLowerCase();

      let displayUnit = unit;

      if (quantity !== 1) {
        if (
          pluralUnits[lowerUnit]
        ) {
          displayUnit =
            pluralUnits[lowerUnit];
        } else if (
          measurementUnits.includes(
            lowerUnit
          )
        ) {
          // Measurement units don't get pluralised
          displayUnit = unit;
        } else if (
          !lowerUnit.endsWith("s")
        ) {
          displayUnit = `${unit}s`;
        }
      }

      return `${locationName} (${quantity} ${displayUnit})`;
    })
    .join(", ");
}
function formatOpenedStatus(
  item: any
): string {
  const locations = item.locations ?? [];

  return locations
    .map((location: any) => {
      if (location.opened === true) {
        return "Opened";
      }

      if (location.opened === false) {
        return "Unopened";
      }

      return "Unknown";
    })
    .join(", ");
}

export function prepareInventoryExportData(
  inventoryItems: any[]
): InventoryExportData {
  // =====================================================
  // ORDER LIST
  // =====================================================

  const orderList = inventoryItems
    .filter((item) => {
      const quantity = item.quantity ?? 0;
      const minimumStock =
        item.minimumStock ?? 5;

      return quantity <= minimumStock;
    })
    .sort((a, b) => {
      const aQuantity = a.quantity ?? 0;
      const bQuantity = b.quantity ?? 0;

      // Out-of-stock items first
      if (
        aQuantity <= 0 &&
        bQuantity > 0
      ) {
        return -1;
      }

      if (
        aQuantity > 0 &&
        bQuantity <= 0
      ) {
        return 1;
      }

      // Then lowest stock first
      return aQuantity - bQuantity;
    })
    .map((item) => ({
      priority: getPriority(item),

      item:
        item.name ?? "",

      supplier:
        item.supplier?.name ?? "",

      category:
        item.category?.name ?? "",

      currentStock:
        item.quantity ?? 0,

      minimumStock:
        item.minimumStock ?? 5,

      orderQuantity:
        getOrderQuantity(item),

      unit:
        item.unit ?? "Unit",
    }));

  // =====================================================
  // INVENTORY DETAILS
  // =====================================================

  const inventoryDetails = inventoryItems
    .map((item) => ({
      name:
        item.name ?? "",

      category:
        item.category?.name ?? "",

      supplier:
        item.supplier?.name ?? "",

      quantity:
        item.quantity ?? 0,

      minimumStock:
        item.minimumStock ?? 5,

      unit:
        item.unit ?? "Unit",

      status:
        getStockStatus(item),

      storageLocation:
        formatStorageLocations(item) ||
        "Not assigned",

      openedStatus:
        formatOpenedStatus(item) ||
        "Unknown",

      batch:
        item.batchNumber ?? "",

      expiry:
        formatExpiryDate(
          item.expiryDate
        ),
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name)
    );

  // =====================================================
  // RETURN EXPORT DATA
  // =====================================================

  return {
    generatedAt: new Date(),
    orderList,
    inventoryDetails,
  };
}