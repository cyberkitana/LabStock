"use client";

/*
  INVENTORY DASHBOARD

  Purpose:
  Visual summary at the top of the Inventory page.

  It answers three quick questions:

  1. How much inventory do we have?
  2. What needs attention because stock is low?
  3. What needs attention because it is expiring?
*/

type Props = {
  inventoryItems: any[];
};

/*
  Determine whether an item is low stock.
*/
function isLowStock(item: any) {
  const quantity = item.quantity ?? 0;
  const minimumStock = item.minimumStock ?? 5;

  return quantity <= minimumStock;
}

/*
  Determine expiry state.
*/
function getExpiryState(item: any) {
  if (!item.expiryDate) {
    return "none";
  }

  const expiry = new Date(item.expiryDate);
  const today = new Date();

  const difference =
    expiry.getTime() - today.getTime();

  const daysRemaining = Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );

  if (daysRemaining < 0) {
    return "expired";
  }

  if (daysRemaining <= 30) {
    return "soon";
  }

  return "valid";
}

/*
  Reusable graduation marks for the bars.

  21 marks gives the bar a more obvious
  loading/progress-bar appearance.
*/
function BarGraduations() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex justify-between">
      {Array.from({ length: 21 }).map(
        (_, index) => (
          <span
            key={index}
            className="
              h-full
              w-px
              bg-white/60
              shadow-[0_0_1px_rgba(0,0,0,0.15)]
            "
          />
        )
      )}
    </div>
  );
}

/*
  Reusable animated highlight.
*/
function BarHighlight() {
  return (
    <div
  className="
    absolute
    inset-y-0
    -left-1/2
    w-1/3
    animate-[shimmer_4s_ease-in-out_infinite]
    bg-gradient-to-r
    from-transparent
    via-white/25
    to-transparent
      "
    />
  );
}

export default function InventoryDashboard({
  inventoryItems,
}: Props) {
  /*
    TOTAL ITEMS
  */
  const totalItems =
    inventoryItems.length;

  /*
    LOW STOCK
  */
  const lowStockItems =
    inventoryItems.filter((item) =>
      isLowStock(item)
    );

  /*
    EXPIRING SOON
  */
  const expiringItems =
    inventoryItems.filter(
      (item) =>
        getExpiryState(item) ===
        "soon"
    );

  /*
    EXPIRED
  */
  const expiredItems =
    inventoryItems.filter(
      (item) =>
        getExpiryState(item) ===
        "expired"
    );

  /*
    Percentage for low stock bar.
  */
  const lowStockPercentage =
    totalItems > 0
      ? Math.max(
          (lowStockItems.length /
            totalItems) *
            100,
          lowStockItems.length > 0
            ? 4
            : 0
        )
      : 0;

  /*
    Percentage for expiry bar.
  */
  const expiryPercentage =
    totalItems > 0
      ? Math.max(
          ((expiringItems.length +
            expiredItems.length) /
            totalItems) *
            100,
          expiringItems.length +
            expiredItems.length >
            0
            ? 4
            : 0
        )
      : 0;

  return (
    <div className="space-y-4">

      {/* =====================================================
          TOTAL INVENTORY
          ===================================================== */}

      <div className="grid grid-cols-[180px_1fr_40px] items-center gap-1">

        {/* Label */}

        <div>
          <p
            className="
              font-[var(--font-space-grotesk)]
              text-base
              font-semibold
              tracking-tight
              text-gray-800
            "
          >
            Total inventory:
          </p>
        </div>

        {/* Bar */}

        <div
          className="
            relative
            h-5
            overflow-hidden
            rounded-none
            border
            border-gray-300
            bg-gray-100
            shadow-inner
          "
        >

          {/* Full loading bar */}

          <div className="absolute inset-0 bg-blue-400" />

          {/* Highlight */}

          <BarHighlight />

          {/* Graduations */}

          <BarGraduations />

        </div>

        {/* Number */}

        <div className="text-right">
          <span className="font-data text-base font-medium text-gray-900">
            {totalItems}
          </span>
        </div>

      </div>


      {/* =====================================================
          LOW STOCK
          ===================================================== */}

      <div className="grid grid-cols-[180px_1fr_40px] items-center gap-1">

        {/* Label */}

        <div>
          <p
            className="
              font-[var(--font-space-grotesk)]
              text-base
              font-semibold
              tracking-tight
              text-gray-800
            "
          >
            Low Stock:
          </p>
        </div>

        {/* Bar */}

        <div
          className="
            relative
            h-5
            overflow-hidden
            rounded-none
            border
            border-gray-300
            bg-gray-100
            shadow-inner
          "
        >

          {/* Coloured progress */}

          <div
            className="
              relative
              h-full
              overflow-hidden
              bg-yellow-400
              transition-all
              duration-700
            "
            style={{
              width: `${lowStockPercentage}%`,
            }}
          >

            <BarHighlight />

          </div>

          {/* Graduations over entire bar */}

          <BarGraduations />

        </div>

        {/* Number */}

        <div className="text-right">
          <span className="font-data text-base font-medium text-gray-900">
            {lowStockItems.length}
          </span>
        </div>

      </div>


      {/* =====================================================
          EXPIRING
          ===================================================== */}

      <div className="grid grid-cols-[180px_1fr_40px] items-center gap-1">

        {/* Label */}

        <div>
          <p
            className="
              font-[var(--font-space-grotesk)]
              text-base
              font-semibold
              tracking-tight
              text-gray-800
            "
          >
            Expiring within 30 days:
          </p>
        </div>

        {/* Bar */}

        <div
          className="
            relative
            h-5
            overflow-hidden
            rounded-none
            border
            border-gray-300
            bg-gray-100
            shadow-inner
          "
        >

          {/* Coloured progress */}

          <div
            className="
              relative
              h-full
              overflow-hidden
              bg-red-400
              transition-all
              duration-700
            "
            style={{
              width: `${expiryPercentage}%`,
            }}
          >

            <BarHighlight />

          </div>

          {/* Graduations over entire bar */}

          <BarGraduations />

        </div>

        {/* Number */}

        <div className="text-right">

          <span className="font-data text-base font-medium text-gray-900">
            {expiringItems.length}
          </span>

          {expiredItems.length >
            0 && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {expiredItems.length} expired
            </p>
          )}

        </div>

      </div>

    </div>
  );
}