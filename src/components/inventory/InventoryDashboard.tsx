"use client";

/*
  INVENTORY DASHBOARD

  Purpose:
  Visual summary at the top of the Inventory page.
  It does NOT display individual inventory records.
  It answers three quick questions:

  1. How much inventory do we have?
  2. What needs attention because stock is low?
  3. What needs attention because it is expiring?

  We will connect the search/filter system underneath
  this dashboard later.
*/


type Props = {
  inventoryItems: any[];
};

/*
  This function determines whether an item is considered
  low stock.

  We use the item's minimumStock value.

  Example:

  quantity = 3
  minimumStock = 5

  3 <= 5
  Therefore the item is low stock.
*/
function isLowStock(item: any) {
  const quantity = item.quantity ?? 0;
  const minimumStock = item.minimumStock ?? 5;

  return quantity <= minimumStock;
}


/*
  This function determines whether an item is expiring soon.

  For now we define "expiring soon" as within 30 days.

  Expired items are handled separately.
*/
function getExpiryState(item: any) {
  if (!item.expiryDate) {
    return "none";
  }

  const expiry = new Date(item.expiryDate);
  const today = new Date();

  const difference =
    expiry.getTime() - today.getTime();

  const daysRemaining =
    Math.ceil(
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


export default function InventoryDashboard({
  inventoryItems,
}: Props) {

    /*
    TOTAL ITEMS

    This is the number of different inventory records,
    not the total number of physical units.

    Example:

    Trypsin
    MTT
    PBS

    = 3 inventory items.
  */
  const totalItems =
    inventoryItems.length;


  /*
    LOW STOCK

    Filter the inventory down to only items whose
    quantity is at or below their minimum stock level.
  */
  const lowStockItems =
    inventoryItems.filter(
      item => isLowStock(item)
    );


  /*
    EXPIRING SOON

    These are items with an expiry date within
    the next 30 days.
  */
  const expiringItems =
    inventoryItems.filter(
      item =>
        getExpiryState(item) === "soon"
    );


  /*
    EXPIRED

    These have already passed their expiry date.
  */
  const expiredItems =
    inventoryItems.filter(
      item =>
        getExpiryState(item) === "expired"
    );

    return (
  <div className="space-y-3">

    {/* =====================================================
        TOTAL INVENTORY BAR

        This is our baseline. The bar is always full because
        it represents the inventory currently being tracked.
        ===================================================== */}

    <div className="grid grid-cols-[180px_1fr_40px] items-center gap-1">

      {/* Label */}
      <div>
        <p
  className="
    font-[var(--font-space-grotesk)]
    text-sm
    font-semibold
    tracking-tight
    text-gray-800
  "
>
  Total inventory:
</p>

      </div>


      {/* Bar */}

      <div className="relative h-6 overflow-hidden rounded-none border border-gray-300 bg-gray-100">

        {/* Full baseline bar */}
        <div className="absolute inset-0 bg-blue-400" />

        {/* Moving highlight */}
        <div
          className="
            absolute
            inset-y-0
            -left-1/2
            w-1/2
            animate-[shimmer_2s_infinite]
            bg-gradient-to-r
            from-transparent
            via-white/30
            to-transparent
          "
        />

        {/* Graduation lines ON the bar */}
        <div className="pointer-events-none absolute inset-0 flex justify-between">

          {Array.from({ length: 11 }).map((_, index) => (
            <span
              key={index}
              className="h-full w-px bg-white/50"
            />
          ))}

        </div>

      </div>


      {/* Number */}

      <div className="text-right">
        <span className="font-data text-sm font-medium text-gray-900">
  {totalItems}
</span>
      </div>

    </div>


    {/* =====================================================
        LOW STOCK BAR

        The width represents the proportion of inventory
        items that are at or below their minimum stock level.

        Example:

        10 total items
        2 low-stock items

        Bar width = 20%
        ===================================================== */}

    <div className="grid grid-cols-[180px_1fr_40px] items-center gap-1">

      {/* Label */}

      <div>
        <p
  className="
    font-[var(--font-space-grotesk)]
    text-sm
    font-semibold
    tracking-tight
    text-gray-800
  "
>
  Low Stock:
</p>

      </div>


      {/* Bar */}

      <div className="relative h-6 overflow-hidden rounded-none border border-gray-300 bg-gray-100">

        {/* Coloured portion */}

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
            width:
              totalItems > 0
                ? `${Math.max(
                    (lowStockItems.length / totalItems) * 100,
                    lowStockItems.length > 0 ? 4 : 0
                  )}%`
                : "0%",
          }}
        >

          {/* Moving highlight */}

          <div
            className="
              absolute
              inset-y-0
              -left-1/2
              w-1/2
              animate-[shimmer_2s_infinite]
              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
            "
          />

        </div>


        {/* Graduation lines ON THE WHOLE BAR */}

        <div className="pointer-events-none absolute inset-0 flex justify-between">

          {Array.from({ length: 11 }).map((_, index) => (
            <span
              key={index}
              className="h-full w-px bg-white/60"
            />
          ))}

        </div>

      </div>


      {/* Number */}

      <div className="text-right">

        <span className="font-data text-sm font-medium text-gray-900">
          {lowStockItems.length}
        </span>

      </div>

    </div>


    {/* =====================================================
        EXPIRY BAR

        Expiring soon + expired items contribute to the
        visual warning bar.

        The displayed number remains the number of items
        expiring soon.

        Expired items are shown separately underneath.
        ===================================================== */}

    <div className="grid grid-cols-[180px_1fr_40px] items-center gap-1">

      {/* Label */}

      <div>

        <p
  className="
    font-[var(--font-space-grotesk)]
    text-sm
    font-semibold
    tracking-tight
    text-gray-800
  "
>
  Expiring within 30 days:
</p>
 </div>


      {/* Bar */}

      <div className="relative h-6 overflow-hidden rounded-none border border-gray-300 bg-gray-100">

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
            width:
              totalItems > 0
                ? `${Math.max(
                    (
                      (expiringItems.length +
                        expiredItems.length) /
                      totalItems
                    ) * 100,
                    expiringItems.length +
                      expiredItems.length >
                      0
                      ? 4
                      : 0
                  )}%`
                : "0%",
          }}
        >

          {/* Moving highlight */}

          <div
            className="
              absolute
              inset-y-0
              -left-1/2
              w-1/2
              animate-[shimmer_2s_infinite]
              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
            "
          />

        </div>


        {/* Graduation lines ON THE BAR */}

        <div className="pointer-events-none absolute inset-0 flex justify-between">

          {Array.from({ length: 11 }).map((_, index) => (
            <span
              key={index}
              className="h-full w-px bg-white/60"
            />
          ))}

        </div>

      </div>


      {/* Number */}

      <div className="text-right">

        <span className="font-data text-sm font-medium text-gray-900">
          {expiringItems.length}
        </span>


        {expiredItems.length > 0 && (

          <p className="mt-1 text-xs font-medium text-red-600">
            {expiredItems.length} expired
          </p>

        )}

  </div>

</div>

  </div>
);
}