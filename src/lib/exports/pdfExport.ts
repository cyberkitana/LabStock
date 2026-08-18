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
  // PDF-SAFE TEXT
  // =====================================================
  //
  // jsPDF's built-in Helvetica font does not reliably
  // support the Unicode micro symbol (µ).
  //
  // We therefore convert µ -> u only in the PDF.
  // The actual inventory data remains unchanged.
  //
  // Example:
  // "Pipette Tips: 200 µL"
  // becomes
  // "Pipette Tips: 200 uL"
  //
  // =====================================================

  const pdfSafeText = (
    value: string | number | null | undefined
  ) => {
    return String(value ?? "")
      .replace(/µ/g, "u")
      .replace(/μ/g, "u");
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const addPageHeader = (
    title: string
  ) => {
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(18);

    doc.setTextColor(
      ...darkText
    );

    doc.text(
      `LabStock | ${title}`,
      14,
      16
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8.5);

    doc.setTextColor(
      ...mutedText
    );

    doc.text(
      `Generated: ${data.generatedAt.toLocaleString(
        "en-ZA"
      )}`,
      14,
      22
    );

    doc.setDrawColor(
      ...lightBorder
    );

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

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);

    doc.setTextColor(
      ...mutedText
    );

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
    if (
      priority === "URGENT"
    ) {
      return {
        fill: [
          254,
          226,
          226,
        ] as [
          number,
          number,
          number
        ],

        text: [
          153,
          27,
          27,
        ] as [
          number,
          number,
          number
        ],
      };
    }

    return {
      fill: [
        254,
        243,
        199,
      ] as [
        number,
        number,
        number
      ],

      text: [
        146,
        64,
        14,
      ] as [
        number,
        number,
        number
      ],
    };
  };

  const getStatusStyle = (
    status: string
  ) => {
    if (
      status === "Out of stock"
    ) {
      return {
        fill: [
          254,
          226,
          226,
        ] as [
          number,
          number,
          number
        ],

        text: [
          153,
          27,
          27,
        ] as [
          number,
          number,
          number
        ],
      };
    }

    if (
      status === "Low stock"
    ) {
      return {
        fill: [
          254,
          243,
          199,
        ] as [
          number,
          number,
          number
        ],

        text: [
          146,
          64,
          14,
        ] as [
          number,
          number,
          number
        ],
      };
    }

    return {
      fill: [
        240,
        253,
        244,
      ] as [
        number,
        number,
        number
      ],

      text: [
        22,
        101,
        52,
      ] as [
        number,
        number,
        number
      ],
    };
  };

  // =====================================================
  // ORDER LIST
  // =====================================================

  addPageHeader(
    "Order List"
  );

  if (
    data.orderList.length === 0
  ) {
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.setTextColor(
      ...mutedText
    );

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

      // -------------------------------------------------
      // PDF-SAFE ORDER DATA
      // -------------------------------------------------

      body: data.orderList.map(
        (item) => [
          pdfSafeText(
            item.priority
          ),

          pdfSafeText(
            item.item
          ),

          pdfSafeText(
            item.supplier
          ),

          pdfSafeText(
            item.category
          ),

          String(
            item.currentStock
          ),

          String(
            item.minimumStock
          ),

          pdfSafeText(
            item.unit
          ),
        ]
      ),

      theme: "grid",

      styles: {
        font: "helvetica",

        fontSize: 8.5,

        textColor:
          darkText,

        cellPadding: 3,

        lineColor:
          lightBorder,

        lineWidth: 0.2,

        valign: "middle",

        overflow: "linebreak",

        cellWidth:
          "wrap",
      },

      headStyles: {
        fillColor: navy,

        textColor: [
          255,
          255,
          255,
        ],

        fontStyle:
          "bold",

        fontSize: 8.5,

        halign: "left",

        valign: "middle",
      },

      alternateRowStyles: {
        fillColor:
          lightBackground,
      },

      columnStyles: {
        0: {
          cellWidth: 25,
          halign: "center",
        },

        1: {
          cellWidth: 55,
          overflow: "linebreak",
        },

        2: {
          cellWidth: 48,
          overflow: "linebreak",
        },

        3: {
          cellWidth: 38,
          overflow: "linebreak",
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

      didParseCell:
        (hookData) => {
          if (
            hookData.section ===
              "body" &&
            hookData.column.index ===
              0
          ) {
            const priority =
              String(
                hookData.cell.raw
              );

            const style =
              getPriorityStyle(
                priority
              );

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

  // =====================================================
  // INVENTORY DETAILS
  // =====================================================

  doc.addPage();

  addPageHeader(
    "Inventory Details"
  );

  // -----------------------------------------------------
  // ALPHABETICAL SORT
  // -----------------------------------------------------
  //
  // Sort by item name before sending the data to
  // AutoTable. localeCompare gives a much cleaner
  // alphabetical ordering than relying on database order.
  //
  // -----------------------------------------------------

  const sortedInventory =
    [
      ...data.inventoryDetails,
    ].sort(
      (a, b) =>
        pdfSafeText(
          a.name
        ).localeCompare(
          pdfSafeText(
            b.name
          ),
          undefined,
          {
            sensitivity:
              "base",
            numeric: true,
          }
        )
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

    // ---------------------------------------------------
    // SORTED + PDF-SAFE DATA
    // ---------------------------------------------------

    body: sortedInventory.map(
      (item) => [
        pdfSafeText(
          item.name
        ),

        pdfSafeText(
          item.category
        ),

        pdfSafeText(
          item.supplier
        ),

        String(
          item.quantity
        ),

        String(
          item.minimumStock
        ),

        pdfSafeText(
          item.unit
        ),

        pdfSafeText(
          item.status
        ),

        pdfSafeText(
          item.storageLocation
        ),

        pdfSafeText(
          item.openedStatus
        ),

        pdfSafeText(
          item.batch
        ),

        pdfSafeText(
          item.expiry
        ),
      ]
    ),

    theme: "grid",

    styles: {
      font: "helvetica",

      fontSize: 7.2,

      textColor:
        darkText,

      cellPadding: 2.5,

      lineColor:
        lightBorder,

      lineWidth: 0.2,

      valign: "middle",

      overflow: "linebreak",

      cellWidth:
        "wrap",
    },

    headStyles: {
      fillColor: navy,

      textColor: [
        255,
        255,
        255,
      ],

      fontStyle:
        "bold",

      fontSize: 7.2,

      halign: "left",

      valign: "middle",
    },

    alternateRowStyles: {
      fillColor:
        lightBackground,
    },

    // ---------------------------------------------------
    // COLUMN WIDTHS
    // ---------------------------------------------------
    //
    // The Item column is slightly wider and is explicitly
    // configured to wrap. This prevents long names from
    // visually running into the Status column.
    //
    // ---------------------------------------------------

    columnStyles: {
      0: {
        cellWidth: 40,
        overflow: "linebreak",
      },

      1: {
        cellWidth: 25,
        overflow: "linebreak",
      },

      2: {
        cellWidth: 35,
        overflow: "linebreak",
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
        overflow: "linebreak",
      },

      6: {
        cellWidth: 27,
        overflow: "linebreak",
      },

      7: {
        cellWidth: 45,
        overflow: "linebreak",
      },

      8: {
        cellWidth: 28,
        overflow: "linebreak",
      },

      9: {
        cellWidth: 25,
        overflow: "linebreak",
      },

      10: {
        cellWidth: 23,
        overflow: "linebreak",
      },
    },

    didParseCell:
      (hookData) => {
        if (
          hookData.section ===
            "body" &&
          hookData.column.index ===
            6
        ) {
          const status =
            String(
              hookData.cell.raw
            );

          const style =
            getStatusStyle(
              status
            );

          hookData.cell.styles.fillColor =
            style.fill;

          hookData.cell.styles.textColor =
            style.text;

          hookData.cell.styles.fontStyle =
            "bold";

          hookData.cell.styles.overflow =
            "linebreak";
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
