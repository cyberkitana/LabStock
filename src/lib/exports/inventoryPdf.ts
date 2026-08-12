import jsPDF from "jspdf";

import type {
  InventoryExportData,
} from "./inventoryExportData";

// =====================================================
// LABSTOCK PDF THEME
// =====================================================

const COLORS = {
  navy: [31, 41, 55] as [number, number, number],
  dark: [17, 24, 39] as [number, number, number],
  text: [55, 65, 81] as [number, number, number],
  muted: [100, 110, 123] as [number, number, number],

  white: [255, 255, 255] as [number, number, number],
  background: [248, 250, 252] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],

  blue: [37, 99, 235] as [number, number, number],

  red: [185, 28, 28] as [number, number, number],
  redLight: [254, 242, 242] as [number, number, number],

  amber: [180, 83, 9] as [number, number, number],
  amberLight: [255, 251, 235] as [number, number, number],

  green: [22, 101, 52] as [number, number, number],
  greenLight: [240, 253, 244] as [number, number, number],
};

// =====================================================
// CONSTANTS
// =====================================================

const PAGE_MARGIN = 16;

const PAGE_WIDTH = 210;

const CONTENT_WIDTH =
  PAGE_WIDTH - PAGE_MARGIN * 2;

const COLUMN_GAP = 8;

const COLUMN_WIDTH =
  (CONTENT_WIDTH - COLUMN_GAP) / 2;

const FOOTER_SPACE = 20;

const HEADER_HEIGHT = 28;

// =====================================================
// UNIT PLURALISATION
// =====================================================

function pluraliseUnit(
  quantity: number,
  unit: string
) {
  const cleanUnit =
    unit?.trim() || "unit";

  if (quantity === 1) {
    return cleanUnit;
  }

  const lower =
    cleanUnit.toLowerCase();

  const irregular: Record<
    string,
    string
  > = {
    vial: "vials",
    tube: "tubes",
    bottle: "bottles",
    flask: "flasks",
    plate: "plates",
    dish: "dishes",
    box: "boxes",
    pack: "packs",
    packet: "packets",
    kit: "kits",
    container: "containers",
    ampoule: "ampoules",
    ampule: "ampules",
    syringe: "syringes",
    pipette: "pipettes",
    cartridge: "cartridges",
    cassette: "cassettes",
    slide: "slides",
    well: "wells",
  };

  if (irregular[lower]) {
    return irregular[lower];
  }

  if (
    lower.endsWith("s") ||
    lower.endsWith("x") ||
    lower.endsWith("z") ||
    lower.endsWith("ch") ||
    lower.endsWith("sh")
  ) {
    return cleanUnit;
  }

  return `${cleanUnit}s`;
}

function formatQuantity(
  quantity: number,
  unit: string
) {
  return `${quantity} ${pluraliseUnit(
    quantity,
    unit
  )}`;
}

function formatMinimum(
  minimum: number,
  unit: string
) {
  return `Minimum ${minimum} ${pluraliseUnit(
    minimum,
    unit
  )}`;
}

// =====================================================
// PAGE HEADER
// =====================================================

function addPageHeader(
  doc: jsPDF,
  _title: string,
  generatedAt: Date
) {
  const pageWidth =
    doc.internal.pageSize.getWidth();

  doc.setFillColor(
    ...COLORS.navy
  );

  doc.rect(
    0,
    0,
    pageWidth,
    HEADER_HEIGHT,
    "F"
  );

  // LabStock
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(18);

  doc.setTextColor(
    ...COLORS.white
  );

  doc.text(
    "LabStock",
    PAGE_MARGIN,
    12
  );

  // Descriptor
  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(7.2);

  doc.setTextColor(
    203,
    213,
    225
  );

  doc.text(
    "LABORATORY INVENTORY MANAGEMENT",
    PAGE_MARGIN,
    19
  );

  // Generated date
  doc.setFontSize(7.6);

  doc.setTextColor(
    218,
    226,
    237
  );

  doc.text(
    `Generated ${generatedAt.toLocaleString(
      "en-ZA"
    )}`,
    pageWidth - PAGE_MARGIN,
    19,
    {
      align: "right",
    }
  );
}

// =====================================================
// PAGE FOOTER
// =====================================================

function addPageFooter(
  doc: jsPDF
) {
  const pageCount =
    doc.getNumberOfPages();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  for (
    let page = 1;
    page <= pageCount;
    page++
  ) {
    doc.setPage(page);

    doc.setDrawColor(
      ...COLORS.border
    );

    doc.setLineWidth(0.25);

    doc.line(
      PAGE_MARGIN,
      pageHeight - 15,
      pageWidth - PAGE_MARGIN,
      pageHeight - 15
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7.1);

    doc.setTextColor(
      ...COLORS.muted
    );

    doc.text(
      "LabStock Inventory Report",
      PAGE_MARGIN,
      pageHeight - 8
    );

    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - PAGE_MARGIN,
      pageHeight - 8,
      {
        align: "right",
      }
    );
  }
}

// =====================================================
// REPORT INTRO
// =====================================================

function addReportIntro(
  doc: jsPDF,
  title: string,
  description: string,
  y: number
) {
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(17);

  doc.setTextColor(
    ...COLORS.dark
  );

  doc.text(
    title,
    PAGE_MARGIN,
    y
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8.7);

  doc.setTextColor(
    ...COLORS.muted
  );

  const descriptionLines =
    doc.splitTextToSize(
      description,
      CONTENT_WIDTH
    );

  doc.text(
    descriptionLines,
    PAGE_MARGIN,
    y + 8
  );

  return (
    y +
    8 +
    descriptionLines.length * 4.2
  );
}

// =====================================================
// SECTION HEADING
// =====================================================

function addSectionHeading(
  doc: jsPDF,
  number: string,
  title: string,
  subtitle: string,
  y: number
) {
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(13.5);

  doc.setTextColor(
    ...COLORS.blue
  );

  doc.text(
    number,
    PAGE_MARGIN,
    y
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(13);

  doc.setTextColor(
    ...COLORS.dark
  );

  doc.text(
    title,
    PAGE_MARGIN + 15,
    y
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8.3);

  doc.setTextColor(
    ...COLORS.muted
  );

  doc.text(
    subtitle,
    PAGE_MARGIN + 15,
    y + 6
  );

  doc.setDrawColor(
    ...COLORS.border
  );

  doc.setLineWidth(0.3);

  doc.line(
    PAGE_MARGIN,
    y + 11,
    doc.internal.pageSize.getWidth() -
      PAGE_MARGIN,
    y + 11
  );

  return y + 18;
}

// =====================================================
// EMPTY STATE
// =====================================================

function addEmptyState(
  doc: jsPDF,
  title: string,
  description: string,
  y: number,
  type: "success" | "neutral"
) {
  const background =
    type === "success"
      ? COLORS.greenLight
      : COLORS.background;

  const accent =
    type === "success"
      ? COLORS.green
      : COLORS.muted;

  doc.setFillColor(
    ...background
  );

  doc.roundedRect(
    PAGE_MARGIN,
    y,
    CONTENT_WIDTH,
    28,
    3,
    3,
    "F"
  );

  doc.setFillColor(
    ...accent
  );

  doc.roundedRect(
    PAGE_MARGIN,
    y,
    2,
    28,
    1,
    1,
    "F"
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9.5);

  doc.setTextColor(
    ...accent
  );

  doc.text(
    title,
    PAGE_MARGIN + 7,
    y + 11
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8);

  doc.setTextColor(
    ...COLORS.text
  );

  doc.text(
    description,
    PAGE_MARGIN + 7,
    y + 18
  );
}

// =====================================================
// STATUS COLOURS
// =====================================================

function getStatusColors(
  status: string
) {
  if (
    status ===
    "Out of stock"
  ) {
    return {
      text: COLORS.red,
      background:
        COLORS.redLight,
    };
  }

  if (
    status ===
    "Low stock"
  ) {
    return {
      text: COLORS.amber,
      background:
        COLORS.amberLight,
    };
  }

  return {
    text: COLORS.green,
    background:
      COLORS.greenLight,
  };
}

// =====================================================
// ORDER LIST
// =====================================================

function addOrderList(
  doc: jsPDF,
  data: InventoryExportData
) {
  addPageHeader(
    doc,
    "Order Requirements",
    data.generatedAt
  );

  let y = 39;

  y = addReportIntro(
    doc,
    "Order requirements",
    "Items currently at or below their defined minimum stock level and requiring attention.",
    y
  );

  y += 9;

  y = addSectionHeading(
    doc,
    "01",
    "Items to order",
    "Items currently below their minimum stock threshold.",
    y
  );

  if (
    data.orderList.length === 0
  ) {
    addEmptyState(
      doc,
      "Stock levels are currently healthy.",
      "No inventory items currently require ordering.",
      y + 2,
      "success"
    );

    return;
  }

  // ---------------------------------------------------
  // TABLE DIMENSIONS
  // ---------------------------------------------------

  // Deliberate whitespace on both sides
  // so the table does not feel pressed against
  // the page edges.

  const TABLE_SIDE_SPACE = 7;

  const tableX =
    PAGE_MARGIN +
    TABLE_SIDE_SPACE;

  const tableWidth =
    CONTENT_WIDTH -
    TABLE_SIDE_SPACE * 2;

  const columnWidths = [
    27, // Stock Status
    51, // Item
    38, // Supplier
    21, // Current stock
    21, // Minimum units
  ];

  const headers = [
    "Stock status",
    "Item",
    "Supplier",
    "Current stock",
    "Minimum units",
  ];

  const rows =
    data.orderList.map(
      (item) => [
        item.priority,
        item.item,
        item.supplier,
        String(
          item.currentStock
        ),
        String(
          item.minimumStock
        ),
      ]
    );

  let currentY = y + 2;

  // ---------------------------------------------------
  // TABLE HEADER
  // ---------------------------------------------------

  function drawTableHeader(
    headerY: number
  ) {
    const headerHeight = 11;

    doc.setFillColor(
      ...COLORS.navy
    );

    doc.roundedRect(
      tableX,
      headerY,
      tableWidth,
      headerHeight,
      1.5,
      1.5,
      "F"
    );

    let x = tableX;

    headers.forEach(
      (
        header,
        index
      ) => {
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(7.2);

        doc.setTextColor(
          ...COLORS.white
        );

        const centered =
          index === 0 ||
          index >= 3;

        if (centered) {
          doc.text(
            header,
            x +
              columnWidths[
                index
              ] /
                2,
            headerY + 7,
            {
              align: "center",
            }
          );
        } else {
          doc.text(
            header,
            x + 4,
            headerY + 7
          );
        }

        x +=
          columnWidths[
            index
          ];
      }
    );

    return (
      headerY +
      headerHeight
    );
  }

  currentY =
    drawTableHeader(
      currentY
    );

  // ---------------------------------------------------
  // TABLE ROWS
  // ---------------------------------------------------

  rows.forEach(
    (row, rowIndex) => {
      const rowHeight = 14;

      if (
        currentY +
          rowHeight >
        doc.internal.pageSize.getHeight() -
          FOOTER_SPACE
      ) {
        doc.addPage();

        addPageHeader(
          doc,
          "Order Requirements",
          data.generatedAt
        );

        currentY = 38;

        currentY =
          drawTableHeader(
            currentY
          );
      }

      // Alternating background
      if (
        rowIndex % 2 === 1
      ) {
        doc.setFillColor(
          249,
          250,
          251
        );

        doc.rect(
          tableX,
          currentY,
          tableWidth,
          rowHeight,
          "F"
        );
      }

      // Bottom border
      doc.setDrawColor(
        ...COLORS.border
      );

      doc.setLineWidth(
        0.18
      );

      doc.line(
        tableX,
        currentY +
          rowHeight,
        tableX +
          tableWidth,
        currentY +
          rowHeight
      );

      let x = tableX;

      row.forEach(
        (
          value,
          columnIndex
        ) => {
          const width =
            columnWidths[
              columnIndex
            ];

          const centered =
            columnIndex === 0 ||
            columnIndex >= 3;

          // -------------------------------------------
          // STOCK STATUS
          // -------------------------------------------

          if (
            columnIndex === 0
          ) {
            const priority =
              String(value);

            const isUrgent =
              priority ===
              "URGENT";

            const background =
              isUrgent
                ? COLORS.redLight
                : COLORS.amberLight;

            const text =
              isUrgent
                ? COLORS.red
                : COLORS.amber;

            // Full cell colour
            doc.setFillColor(
              ...background
            );

            doc.rect(
              x,
              currentY,
              width,
              rowHeight,
              "F"
            );

            doc.setFont(
              "helvetica",
              "bold"
            );

            doc.setFontSize(
              6.7
            );

            doc.setTextColor(
              ...text
            );

            doc.text(
              priority,
              x +
                width / 2,
              currentY +
                8.3,
              {
                align:
                  "center",
              }
            );
          }

          // -------------------------------------------
          // NORMAL CELLS
          // -------------------------------------------

          else {
            doc.setFont(
              "helvetica",
              columnIndex ===
                1
                ? "bold"
                : "normal"
            );

            doc.setFontSize(
              columnIndex ===
                1
                ? 7.7
                : 7.3
            );

            doc.setTextColor(
              ...COLORS.text
            );

            const lines =
              doc.splitTextToSize(
                String(value),
                width - 8
              );

            const textY =
              currentY +
              (lines.length > 1
                ? 5
                : 8.3);

            if (
              centered
            ) {
              doc.text(
                lines.slice(
                  0,
                  2
                ),
                x +
                  width / 2,
                textY,
                {
                  align:
                    "center",
                }
              );
            } else {
              doc.text(
                lines.slice(
                  0,
                  2
                ),
                x + 4,
                textY
              );
            }
          }

          x += width;
        }
      );

      currentY +=
        rowHeight;
    }
  );
}

// =====================================================
// INVENTORY CATEGORY HEADING
// =====================================================

function drawCategoryHeading(
  doc: jsPDF,
  category: string,
  y: number
) {
  const pageWidth =
    doc.internal.pageSize.getWidth();

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8.2);

  doc.setTextColor(
    ...COLORS.blue
  );

  doc.text(
    category.toUpperCase(),
    PAGE_MARGIN,
    y
  );

  doc.setDrawColor(
    ...COLORS.border
  );

  doc.setLineWidth(
    0.25
  );

  doc.line(
    PAGE_MARGIN,
    y + 3,
    pageWidth -
      PAGE_MARGIN,
    y + 3
  );

  return y + 9;
}

// =====================================================
// INVENTORY ITEM
// =====================================================

function drawInventoryItem(
  doc: jsPDF,
  item: InventoryExportData["inventoryDetails"][number],
  index: number,
  x: number,
  y: number,
  width: number
) {
  const status =
    getStatusColors(
      item.status
    );

  const contentWidth =
    width - 2;

  // -----------------------------------------------
  // ITEM HEADER
  // -----------------------------------------------

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8.8);

  doc.setTextColor(
    ...COLORS.muted
  );

  doc.text(
    String(index + 1).padStart(
      2,
      "0"
    ),
    x,
    y
  );

  const numberWidth = 9;

  // -----------------------------------------------
  // STATUS BADGE
  // -----------------------------------------------

  const statusText =
    item.status.toUpperCase();

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(5.9);

  const statusWidth =
    Math.max(
      25,
      doc.getTextWidth(
        statusText
      ) + 8
    );

  doc.setFillColor(
    ...status.background
  );

  doc.roundedRect(
    x +
      width -
      statusWidth,
    y - 5.5,
    statusWidth,
    8,
    2,
    2,
    "F"
  );

  doc.setTextColor(
    ...status.text
  );

  doc.text(
    statusText,
    x +
      width -
      statusWidth / 2,
    y - 0.2,
    {
      align:
        "center",
    }
  );

  // -----------------------------------------------
  // ITEM NAME
  // -----------------------------------------------

  const nameX =
    x + numberWidth;

  const nameWidth =
    width -
    numberWidth -
    statusWidth -
    3;

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8.8);

  doc.setTextColor(
    ...COLORS.dark
  );

  const nameLines =
    doc.splitTextToSize(
      item.name,
      nameWidth
    );

  doc.text(
    nameLines.slice(
      0,
      2
    ),
    nameX,
    y
  );

  let currentY =
    y +
    Math.min(
      nameLines.length,
      2
    ) *
      3.9 +
    1.5;

  // -----------------------------------------------
  // CATEGORY + SUPPLIER
  // -----------------------------------------------

  doc.setFont(
    "helvetica",
    "italic"
  );

  doc.setFontSize(6.8);

  doc.setTextColor(
    ...COLORS.muted
  );

  const classification =
    `${item.category} · ${item.supplier}`;

  const classificationLines =
    doc.splitTextToSize(
      classification,
      contentWidth
    );

  doc.text(
    classificationLines.slice(
      0,
      2
    ),
    nameX,
    currentY
  );

  currentY +=
    Math.min(
      classificationLines.length,
      2
    ) *
      3.4 +
    2.5;

  // -----------------------------------------------
  // BULLET DETAILS
  // -----------------------------------------------

  const bulletX =
    nameX;

  const valueX =
    nameX + 8;

  function drawBullet(
    label: string,
    value: string
  ) {
    // Bullet
    doc.setFillColor(
      ...COLORS.blue
    );

    doc.circle(
      bulletX + 1,
      currentY - 1.2,
      0.8,
      "F"
    );

    // Label
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(6.2);

    doc.setTextColor(
      ...COLORS.muted
    );

    doc.text(
      `${label}:`,
      valueX,
      currentY
    );

    const labelWidth =
      doc.getTextWidth(
        `${label}:`
      );

    // Value
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(6.7);

    doc.setTextColor(
      ...COLORS.text
    );

    const availableWidth =
      width -
      (valueX - x) -
      2;

    const lines =
      doc.splitTextToSize(
        value || "—",
        availableWidth -
          labelWidth -
          2
      );

    doc.text(
      lines.slice(
        0,
        2
      ),
      valueX +
        labelWidth +
        2,
      currentY
    );

    currentY +=
      Math.max(
        3.6,
        Math.min(
          lines.length,
          2
        ) *
          3.3
      );
  }

  // Stock + minimum
  const quantity = Number(item.quantity);
const minimumStock = Number(item.minimumStock);

const pluraliseUnit = (
  unit: string,
  amount: number
) => {
  const cleanUnit = unit.trim();

  if (amount === 1) {
    return cleanUnit;
  }

  const pluralMap: Record<string, string> = {
    unit: "units",
    units: "units",
    item: "items",
    items: "items",
    vial: "vials",
    vials: "vials",
    tube: "tubes",
    tubes: "tubes",
    bottle: "bottles",
    bottles: "bottles",
    flask: "flasks",
    flasks: "flasks",
    plate: "plates",
    plates: "plates",
    well: "wells",
    wells: "wells",
    box: "boxes",
    boxes: "boxes",
    pack: "packs",
    packs: "packs",
    packet: "packets",
    packets: "packets",
    container: "containers",
    containers: "containers",
    kit: "kits",
    kits: "kits",
    reagent: "reagents",
    reagents: "reagents",
    bag: "bags",
    bags: "bags",
    roll: "rolls",
    rolls: "rolls",
    pair: "pairs",
    pairs: "pairs",
  };

  const lowerUnit = cleanUnit.toLowerCase();

  if (pluralMap[lowerUnit]) {
    return pluralMap[lowerUnit];
  }

  // Don't pluralise measurement units such as mL, µL, L, g, mg, kg
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

  if (
    measurementUnits.includes(
      lowerUnit
    )
  ) {
    return cleanUnit;
  }

  // Generic fallback
  if (cleanUnit.endsWith("s")) {
    return cleanUnit;
  }

  return `${cleanUnit}s`;
};

drawBullet(
  "Stock",
  `${quantity} ${pluraliseUnit(
    item.unit || "unit",
    quantity
  )} · Minimum ${minimumStock} ${pluraliseUnit(
    item.unit || "unit",
    minimumStock
  )}`
);

  // Storage + opened
  drawBullet(
    "Storage",
    `${item.storageLocation || "—"} · ${
      item.openedStatus || "Unknown"
    }`
  );

  // Batch + expiry
  drawBullet(
    "Batch",
    `${item.batch || "—"} · Expiry ${
      item.expiry || "—"
    }`
  );

  // -----------------------------------------------
  // DIVIDER
  // -----------------------------------------------

  const bottomY =
    currentY + 1;

  doc.setDrawColor(
    ...COLORS.border
  );

  doc.setLineWidth(
    0.2
  );

  doc.line(
    x,
    bottomY,
    x + width,
    bottomY
  );

  return bottomY + 7;
}

// =====================================================
// INVENTORY DETAILS
// =====================================================

function addInventoryDetails(
  doc: jsPDF,
  data: InventoryExportData
) {
  doc.addPage();

  addPageHeader(
    doc,
    "Inventory Register",
    data.generatedAt
  );

  let y = 39;

  y = addReportIntro(
    doc,
    "Inventory details",
    "A detailed register of current laboratory stock, including classification, storage location, opening status, batch information and expiry dates.",
    y
  );

  y += 9;

  y = addSectionHeading(
    doc,
    "02",
    "Current inventory",
    `${data.inventoryDetails.length} inventory item${
      data.inventoryDetails.length === 1
        ? ""
        : "s"
    } recorded in LabStock.`,
    y
  );

  if (
    data.inventoryDetails.length ===
    0
  ) {
    addEmptyState(
      doc,
      "No inventory items available.",
      "There are currently no inventory records to display.",
      y + 2,
      "neutral"
    );

    return;
  }

  // ---------------------------------------------------
  // GROUP BY CATEGORY
  // ---------------------------------------------------

  const grouped =
    new Map<
      string,
      InventoryExportData["inventoryDetails"]
    >();

  data.inventoryDetails.forEach(
    (item) => {
      const category =
        item.category ||
        "Uncategorised";

      if (
        !grouped.has(
          category
        )
      ) {
        grouped.set(
          category,
          []
        );
      }

      grouped
        .get(category)!
        .push(item);
    }
  );

  let globalIndex = 0;

  // ---------------------------------------------------
  // CATEGORY GROUPS
  // ---------------------------------------------------

  for (
    const [
      category,
      items,
    ] of grouped
  ) {
    if (
      y + 15 >
      doc.internal.pageSize.getHeight() -
        FOOTER_SPACE
    ) {
      doc.addPage();

      addPageHeader(
        doc,
        "Inventory Register",
        data.generatedAt
      );

      y = 39;
    }

    y =
      drawCategoryHeading(
        doc,
        category,
        y
      );

    // -----------------------------------------------
    // TWO COLUMNS
    // -----------------------------------------------

    let leftY = y;
    let rightY = y;

    let columnIndex = 0;

    for (
      const item of items
    ) {
      const useLeft =
        columnIndex % 2 === 0;

      const x = useLeft
        ? PAGE_MARGIN
        : PAGE_MARGIN +
          COLUMN_WIDTH +
          COLUMN_GAP;

      let itemY = useLeft
        ? leftY
        : rightY;

      // Start a new page if this column
      // cannot comfortably fit another item.
      if (
        itemY >
        doc.internal.pageSize.getHeight() -
          55
      ) {
        doc.addPage();

        addPageHeader(
          doc,
          "Inventory Register",
          data.generatedAt
        );

        leftY = 38;
        rightY = 38;

        itemY = 38;
      }

      const nextY =
        drawInventoryItem(
          doc,
          item,
          globalIndex,
          x,
          itemY,
          COLUMN_WIDTH
        );

      if (
        useLeft
      ) {
        leftY = nextY;
      } else {
        rightY = nextY;
      }

      globalIndex++;

      columnIndex++;

      y = Math.max(
        leftY,
        rightY
      );
    }

    y =
      Math.max(
        leftY,
        rightY
      ) + 2;
  }
}

// =====================================================
// MAIN EXPORT
// =====================================================

export function exportInventoryToPdf(
  data: InventoryExportData
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  addOrderList(
    doc,
    data
  );

  addInventoryDetails(
    doc,
    data
  );

  addPageFooter(
    doc
  );

  doc.save(
    "labstock-inventory.pdf"
  );
}