import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type {
  InventoryExportData,
} from "./inventoryExportData";

export async function exportInventoryToPDF(
  data: InventoryExportData
) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  // =====================================================
  // COLOURS
  // =====================================================

  const navy: [number, number, number] = [
    31,
    78,
    121,
  ];

  const darkText: [number, number, number] = [
    31,
    41,
    55,
  ];

  const mutedText: [number, number, number] = [
    107,
    114,
    128,
  ];

  const lightBorder: [number, number, number] = [
    229,
    231,
    235,
  ];

  const lightBackground: [number, number, number] = [
    247,
    249,
    252,
  ];

  // =====================================================
  // HELPERS
  // =====================================================

  const addPageHeader = (
    title: string
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...darkText);

    doc.text(
      `LabStock | ${title}`,
      14,
      16
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedText);

    doc.text(
      `Generated: ${data.generatedAt.toLocaleString(
        "en-ZA"
      )}`,
      14,
      22
    );

    doc.setDrawColor(...lightBorder);

    doc.line(
      14,
      26,
      pageWidth - 14,
      26
    );
  };

  const addFooter = () => {
    const pageNumber =
      doc.getNumberOfPages();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);

    doc.text(
      `LabStock • Page ${pageNumber}`,
      pageWidth - 14,
      pageHeight - 8,
      {
        align: "right",
      }
    );
  };

  const getPriorityStyle = (
    priority: string
  ) => {
    if (priority === "URGENT") {
      return {
        fill: [254, 226, 226] as [
          number,
          number,
          number
        ],
        text: [153, 27, 27] as [
          number,
          number,
          number
        ],
      };
    }

    return {
      fill: [254, 243, 199] as [
        number,
        number,
        number
      ],
      text: [146, 64, 14] as [
        number,
        number,
        number
      ],
    };
  };

  const getStatusStyle = (
    status: string
  ) => {
    if (status === "Out of stock") {
      return {
        fill: [254, 226, 226] as [
          number,
          number,
          number
        ],
        text: [153, 27, 27] as [
          number,
          number,
          number
        ],
      };
    }

    if (status === "Low stock") {
      return {
        fill: [254, 243, 199] as [
          number,
          number,
          number
        ],
        text: [146, 64, 14] as [
          number,
          number,
          number
        ],
      };
    }

    return {
      fill: [240, 253, 244] as [
        number,
        number,
        number
      ],
      text: [22, 101, 52] as [
        number,
        number,
        number
      ],
    };
  };

  // =====================================================
  // ORDER LIST
  // =====================================================

  addPageHeader("Order List");

  if (data.orderList.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...mutedText);

    doc.text(
      "No items currently require ordering.",
      14,
      38
    );
  } else {
    autoTable(doc, {
      startY: 32,

      head: [[
        "Priority",
        "Item",
        "Supplier",
        "Category",
        "Current Stock",
        "Minimum Stock",
        "Unit",
      ]],

      body: data.orderList.map(
        (item) => [
          item.priority,
          item.item,
          item.supplier,
          item.category,
          String(item.currentStock),
          String(item.minimumStock),
          item.unit,
        ]
      ),

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 8.5,
        textColor: darkText,
        cellPadding: 3,
        lineColor: lightBorder,
        lineWidth: 0.2,
        valign: "middle",
      },

      headStyles: {
        fillColor: navy,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8.5,
        halign: "left",
      },

      alternateRowStyles: {
        fillColor: lightBackground,
      },

      columnStyles: {
        0: {
          cellWidth: 25,
          halign: "center",
        },
        1: {
          cellWidth: 55,
        },
        2: {
          cellWidth: 48,
        },
        3: {
          cellWidth: 38,
        },
        4: {
          cellWidth: 28,
          halign: "right",
        },
        5: {
          cellWidth: 28,
          halign: "right",
        },
        6: {
          cellWidth: 22,
        },
      },

      didParseCell: (hookData) => {
        if (
          hookData.section === "body" &&
          hookData.column.index === 0
        ) {
          const priority =
            String(hookData.cell.raw);

          const style =
            getPriorityStyle(priority);

          hookData.cell.styles.fillColor =
            style.fill;

          hookData.cell.styles.textColor =
            style.text;

          hookData.cell.styles.fontStyle =
            "bold";

          hookData.cell.styles.halign =
            "center";
        }
      },

      margin: {
        left: 14,
        right: 14,
      },
    });
  }

  addFooter();

  // =====================================================
  // INVENTORY DETAILS
  // =====================================================

  doc.addPage();

  addPageHeader(
    "Inventory Details"
  );

  autoTable(doc, {
    startY: 32,

    head: [[
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
    ]],

    body: data.inventoryDetails.map(
      (item) => [
        item.name,
        item.category,
        item.supplier,
        String(item.quantity),
        String(item.minimumStock),
        item.unit,
        item.status,
        item.storageLocation,
        item.openedStatus,
        item.batch,
        item.expiry,
      ]
    ),

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 7.2,
      textColor: darkText,
      cellPadding: 2.5,
      lineColor: lightBorder,
      lineWidth: 0.2,
      valign: "middle",
    },

    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.2,
      halign: "left",
    },

    alternateRowStyles: {
      fillColor: lightBackground,
    },

    columnStyles: {
      0: {
        cellWidth: 34,
      },
      1: {
        cellWidth: 25,
      },
      2: {
        cellWidth: 35,
      },
      3: {
        cellWidth: 23,
        halign: "right",
      },
      4: {
        cellWidth: 23,
        halign: "right",
      },
      5: {
        cellWidth: 18,
      },
      6: {
        cellWidth: 27,
      },
      7: {
        cellWidth: 48,
      },
      8: {
        cellWidth: 28,
      },
      9: {
        cellWidth: 28,
      },
      10: {
        cellWidth: 23,
      },
    },

    didParseCell: (hookData) => {
      if (
        hookData.section === "body" &&
        hookData.column.index === 6
      ) {
        const status =
          String(hookData.cell.raw);

        const style =
          getStatusStyle(status);

        hookData.cell.styles.fillColor =
          style.fill;

        hookData.cell.styles.textColor =
          style.text;

        hookData.cell.styles.fontStyle =
          "bold";
      }
    },

    margin: {
      left: 14,
      right: 14,
    },
  });

  // =====================================================
  // FOOTERS ON ALL PAGES
  // =====================================================

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);
    addFooter();
  }

  // =====================================================
  // DOWNLOAD
  // =====================================================

  doc.save(
    "labstock-inventory.pdf"
  );
}