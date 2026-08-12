import ExcelJS from "exceljs";

import type {
  InventoryExportData,
} from "./inventoryExportData";

// =====================================================
// LABSTOCK EXCEL THEME
// =====================================================

const COLORS = {
  text: "FF1F2937",
  muted: "FF6B7280",

  header: "FFF3F4F6",
  headerBorder: "FFE5E7EB",

  rowEven: "FFFAFBFC",
  rowOdd: "FFFFFFFF",

  border: "FFE5E7EB",

  urgentText: "FF991B1B",
  urgentBackground: "FFFEE2E2",

  lowText: "FF92400E",
  lowBackground: "FFFEF3C7",

  inStockText: "FF166534",
  inStockBackground: "FFF0FDF4",

  neutralBackground: "FFF9FAFB",
};

// =====================================================
// GENERAL CELL STYLING
// =====================================================

function applyBaseCellStyle(
  cell: ExcelJS.Cell
) {
  cell.font = {
    size: 10,
    color: {
      argb: COLORS.text,
    },
  };

  cell.alignment = {
    vertical: "middle",
    horizontal: "left",
    wrapText: true,
  };

  cell.border = {
    bottom: {
      style: "hair",
      color: {
        argb: COLORS.border,
      },
    },
  };
}

// =====================================================
// HEADER STYLING
// =====================================================

function applyHeaderStyle(
  row: ExcelJS.Row
) {
  row.height = 30;

  row.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 10,
      color: {
        argb: COLORS.text,
      },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: COLORS.header,
      },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
    };

    cell.border = {
      top: {
        style: "thin",
        color: {
          argb: COLORS.headerBorder,
        },
      },
      bottom: {
        style: "thin",
        color: {
          argb: COLORS.headerBorder,
        },
      },
    };
  });
}

// =====================================================
// ALTERNATING ROWS
// =====================================================

function applyAlternatingRows(
  worksheet: ExcelJS.Worksheet,
  startRow: number,
  endRow: number
) {
  for (
    let rowNumber = startRow;
    rowNumber <= endRow;
    rowNumber++
  ) {
    const row =
      worksheet.getRow(rowNumber);

    row.height = 23;

    row.eachCell((cell) => {
      applyBaseCellStyle(cell);

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb:
            rowNumber % 2 === 0
              ? COLORS.rowEven
              : COLORS.rowOdd,
        },
      };
    });
  }
}

// =====================================================
// WORKBOOK TITLE
// =====================================================

function addWorkbookTitle(
  worksheet: ExcelJS.Worksheet,
  title: string,
  generatedAt: Date,
  columnCount: number
) {
  // ---------------------------------------------------
  // TITLE
  // ---------------------------------------------------

  worksheet.mergeCells(
    1,
    1,
    1,
    columnCount
  );

  const titleCell =
    worksheet.getCell(1, 1);

  titleCell.value =
    `LabStock  |  ${title}`;

  titleCell.font = {
    bold: true,
    size: 18,
    color: {
      argb: COLORS.text,
    },
  };

  titleCell.alignment = {
    vertical: "middle",
    horizontal: "left",
  };

  worksheet.getRow(1).height = 32;

  // ---------------------------------------------------
  // GENERATED DATE
  // ---------------------------------------------------

  worksheet.mergeCells(
    2,
    1,
    2,
    columnCount
  );

  const dateCell =
    worksheet.getCell(2, 1);

  dateCell.value =
    `Generated ${generatedAt.toLocaleString(
      "en-ZA"
    )}`;

  dateCell.font = {
    size: 9,
    italic: true,
    color: {
      argb: COLORS.muted,
    },
  };

  dateCell.alignment = {
    vertical: "middle",
    horizontal: "left",
  };

  worksheet.getRow(2).height = 20;
}

// =====================================================
// SUMMARY BAR
// =====================================================

function addSummaryBar(
  worksheet: ExcelJS.Worksheet,
  data: InventoryExportData,
  columnCount: number
) {
  const urgentCount =
    data.orderList.filter(
      (item) =>
        item.priority === "URGENT"
    ).length;

  const lowCount =
    data.orderList.filter(
      (item) =>
        item.priority === "LOW"
    ).length;

  const totalItems =
    data.inventoryDetails.length;

  worksheet.mergeCells(
    3,
    1,
    3,
    columnCount
  );

  const summaryCell =
    worksheet.getCell(3, 1);

  summaryCell.value =
    `Items requiring order: ${data.orderList.length}    |    ` +
    `Urgent: ${urgentCount}    |    ` +
    `Low stock: ${lowCount}    |    ` +
    `Total inventory items: ${totalItems}`;

  summaryCell.font = {
    bold: true,
    size: 9,
    color: {
      argb: COLORS.text,
    },
  };

  summaryCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: COLORS.neutralBackground,
    },
  };

  summaryCell.alignment = {
    vertical: "middle",
    horizontal: "left",
  };

  summaryCell.border = {
    top: {
      style: "thin",
      color: {
        argb: COLORS.border,
      },
    },
    bottom: {
      style: "thin",
      color: {
        argb: COLORS.border,
      },
    },
  };

  worksheet.getRow(3).height = 24;
}

// =====================================================
// PRIORITY STYLING
// =====================================================

function stylePriorityCell(
  cell: ExcelJS.Cell,
  priority: string
) {
  cell.font = {
    bold: true,
    size: 9,
    color: {
      argb:
        priority === "URGENT"
          ? COLORS.urgentText
          : COLORS.lowText,
    },
  };

  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb:
        priority === "URGENT"
          ? COLORS.urgentBackground
          : COLORS.lowBackground,
    },
  };

  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  cell.border = {
    bottom: {
      style: "hair",
      color: {
        argb: COLORS.border,
      },
    },
  };
}

// =====================================================
// STATUS STYLING
// =====================================================

function styleStatusCell(
  cell: ExcelJS.Cell,
  status: string
) {
  let textColor = COLORS.text;
  let background = COLORS.neutralBackground;

  if (status === "Out of stock") {
    textColor = COLORS.urgentText;
    background =
      COLORS.urgentBackground;
  }

  if (status === "Low stock") {
    textColor = COLORS.lowText;
    background =
      COLORS.lowBackground;
  }

  if (status === "In stock") {
    textColor = COLORS.inStockText;
    background =
      COLORS.inStockBackground;
  }

  cell.font = {
    bold: true,
    size: 9,
    color: {
      argb: textColor,
    },
  };

  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: background,
    },
  };

  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  cell.border = {
    bottom: {
      style: "hair",
      color: {
        argb: COLORS.border,
      },
    },
  };
}

// =====================================================
// EMPTY STATE
// =====================================================

function addEmptyStateRow(
  worksheet: ExcelJS.Worksheet,
  columnCount: number,
  message: string
) {
  const values = new Array(
    columnCount
  ).fill("");

  values[0] = message;

  const row =
    worksheet.addRow(values);

  row.height = 28;

  row.eachCell((cell) => {
    cell.font = {
      italic: true,
      size: 10,
      color: {
        argb: COLORS.muted,
      },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: COLORS.neutralBackground,
      },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
    };
  });

  return row;
}

// =====================================================
// PAGE SETUP
// =====================================================

function applyPageSetup(
  worksheet: ExcelJS.Worksheet
) {
  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };
}

// =====================================================
// EXPORT
// =====================================================

export async function exportInventoryToExcel(
  data: InventoryExportData
) {
  const workbook =
    new ExcelJS.Workbook();

  workbook.creator = "LabStock";
  workbook.lastModifiedBy =
    "LabStock";

  workbook.created =
    data.generatedAt;

  workbook.modified =
    data.generatedAt;

  // ===================================================
  // ORDER LIST
  // ===================================================

  const orderSheet =
    workbook.addWorksheet(
      "Order List"
    );

  orderSheet.views = [
    {
      state: "frozen",
      ySplit: 4,
    },
  ];

  addWorkbookTitle(
    orderSheet,
    "Order List",
    data.generatedAt,
    7
  );

  addSummaryBar(
    orderSheet,
    data,
    7
  );

  // ---------------------------------------------------
  // HEADERS
  // ---------------------------------------------------

  orderSheet.addRow([
    "Priority",
    "Item",
    "Supplier",
    "Category",
    "Current Stock",
    "Minimum Stock",
    "Unit",
  ]);

  applyHeaderStyle(
    orderSheet.getRow(4)
  );

  // ---------------------------------------------------
  // DATA
  // ---------------------------------------------------

  if (data.orderList.length === 0) {
    addEmptyStateRow(
      orderSheet,
      7,
      "No items currently require ordering"
    );
  } else {
    data.orderList.forEach(
      (item) => {
        const row =
          orderSheet.addRow([
            item.priority,
            item.item,
            item.supplier,
            item.category,
            item.currentStock,
            item.minimumStock,
            item.unit,
          ]);

        applyBaseCellStyle(
          row.getCell(1)
        );

        applyBaseCellStyle(
          row.getCell(2)
        );

        applyBaseCellStyle(
          row.getCell(3)
        );

        applyBaseCellStyle(
          row.getCell(4)
        );

        applyBaseCellStyle(
          row.getCell(5)
        );

        applyBaseCellStyle(
          row.getCell(6)
        );

        applyBaseCellStyle(
          row.getCell(7)
        );

        stylePriorityCell(
          row.getCell(1),
          item.priority
        );

        // Stock numbers
        row.getCell(5).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        row.getCell(6).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        // Unit
        row.getCell(7).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      }
    );

    applyAlternatingRows(
      orderSheet,
      5,
      orderSheet.rowCount
    );

    // Reapply priority styling after
    // alternating-row styling.
    for (
      let rowNumber = 5;
      rowNumber <=
      orderSheet.rowCount;
      rowNumber++
    ) {
      const row =
        orderSheet.getRow(rowNumber);

      stylePriorityCell(
        row.getCell(1),
        String(
          row.getCell(1).value ?? ""
        )
      );

      row.getCell(5).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      row.getCell(6).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      row.getCell(7).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    }
  }

  // ---------------------------------------------------
  // COLUMNS
  // ---------------------------------------------------

  orderSheet.columns = [
    {
      key: "priority",
      width: 14,
    },
    {
      key: "item",
      width: 32,
    },
    {
      key: "supplier",
      width: 28,
    },
    {
      key: "category",
      width: 22,
    },
    {
      key: "currentStock",
      width: 17,
    },
    {
      key: "minimumStock",
      width: 17,
    },
    {
      key: "unit",
      width: 14,
    },
  ];

  // ---------------------------------------------------
  // FILTER
  // ---------------------------------------------------

  orderSheet.autoFilter = {
    from: "A4",
    to: "G4",
  };

  // ---------------------------------------------------
  // PRINT
  // ---------------------------------------------------

  orderSheet.pageSetup.printTitlesRow =
    "1:4";

  applyPageSetup(orderSheet);

  // ===================================================
  // INVENTORY DETAILS
  // ===================================================

  const detailsSheet =
    workbook.addWorksheet(
      "Inventory Details"
    );

  detailsSheet.views = [
    {
      state: "frozen",
      ySplit: 4,
    },
  ];

  addWorkbookTitle(
    detailsSheet,
    "Inventory Details",
    data.generatedAt,
    11
  );

  addSummaryBar(
    detailsSheet,
    data,
    11
  );

  // ---------------------------------------------------
  // HEADERS
  // ---------------------------------------------------

  detailsSheet.addRow([
    "Item",
    "Category",
    "Supplier",
    "Current Stock",
    "Minimum Stock",
    "Unit",
    "Status",
    "Storage Location",
    "Opened Status",
    "Batch",
    "Expiry",
  ]);

  applyHeaderStyle(
    detailsSheet.getRow(4)
  );

  // ---------------------------------------------------
  // DATA
  // ---------------------------------------------------

  if (
    data.inventoryDetails.length ===
    0
  ) {
    addEmptyStateRow(
      detailsSheet,
      11,
      "No inventory items available"
    );
  } else {
    data.inventoryDetails.forEach(
      (item) => {
        const row =
          detailsSheet.addRow([
            item.name,
            item.category,
            item.supplier,
            item.quantity,
            item.minimumStock,
            item.unit,
            item.status,
            item.storageLocation,
            item.openedStatus,
            item.batch,
            item.expiry,
          ]);

        row.eachCell((cell) => {
          applyBaseCellStyle(cell);
        });

        // Stock numbers
        row.getCell(4).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        row.getCell(5).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        // Unit
        row.getCell(6).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        // Status
        styleStatusCell(
          row.getCell(7),
          item.status
        );

        // Opened status
        row.getCell(9).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        // Expiry
        row.getCell(11).alignment = {
          horizontal: "left",
          vertical: "middle",
        };
      }
    );

    applyAlternatingRows(
      detailsSheet,
      5,
      detailsSheet.rowCount
    );

    // Reapply status styling after
    // alternating-row styling.
    for (
      let rowNumber = 5;
      rowNumber <=
      detailsSheet.rowCount;
      rowNumber++
    ) {
      const row =
        detailsSheet.getRow(rowNumber);

      const status =
        String(
          row.getCell(7).value ?? ""
        );

      styleStatusCell(
        row.getCell(7),
        status
      );

      row.getCell(4).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      row.getCell(5).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      row.getCell(6).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      row.getCell(9).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    }
  }

  // ---------------------------------------------------
  // COLUMNS
  // ---------------------------------------------------

  detailsSheet.columns = [
    {
      key: "item",
      width: 32,
    },
    {
      key: "category",
      width: 22,
    },
    {
      key: "supplier",
      width: 28,
    },
    {
      key: "currentStock",
      width: 17,
    },
    {
      key: "minimumStock",
      width: 17,
    },
    {
      key: "unit",
      width: 14,
    },
    {
      key: "status",
      width: 18,
    },
    {
      key: "storageLocation",
      width: 45,
    },
    {
      key: "openedStatus",
      width: 20,
    },
    {
      key: "batch",
      width: 20,
    },
    {
      key: "expiry",
      width: 16,
    },
  ];

  // ---------------------------------------------------
  // FILTER
  // ---------------------------------------------------

  detailsSheet.autoFilter = {
    from: "A4",
    to: "K4",
  };

  // ---------------------------------------------------
  // PRINT
  // ---------------------------------------------------

  detailsSheet.pageSetup.printTitlesRow =
    "1:4";

  applyPageSetup(detailsSheet);

  // ===================================================
  // DOWNLOAD
  // ===================================================

  const buffer =
    await workbook.xlsx.writeBuffer();

  const blob = new Blob(
    [buffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "labstock-inventory.xlsx";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}