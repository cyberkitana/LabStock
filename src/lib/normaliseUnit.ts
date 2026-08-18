export function normaliseUnit(
  unit?: string | null
): string {
  const value = unit?.trim();

  if (!value) {
    return "Unit";
  }

  const lower = value.toLowerCase();

  // =====================================================
  // SCIENTIFIC / MEASUREMENT UNITS
  // =====================================================

  const measurementUnits: Record<string, string> = {
    ml: "mL",

    µl: "µL",
    ul: "µL",
    μl: "µL",

    l: "L",

    g: "g",
    mg: "mg",
    kg: "kg",

    µg: "µg",
    μg: "µg",
    ug: "µg",

    ng: "ng",

    mm: "mm",
    cm: "cm",
    m: "m",
  };

  if (measurementUnits[lower]) {
    return measurementUnits[lower];
  }

  // =====================================================
  // COMMON INVENTORY UNITS
  // =====================================================

  const inventoryUnits: Record<string, string> = {
    unit: "Unit",
    units: "Unit",

    item: "Item",
    items: "Item",

    vial: "Vial",
    vials: "Vial",

    tube: "Tube",
    tubes: "Tube",

    bottle: "Bottle",
    bottles: "Bottle",

    flask: "Flask",
    flasks: "Flask",

    plate: "Plate",
    plates: "Plate",

    dish: "Dish",
    dishes: "Dish",

    well: "Well",
    wells: "Well",

    box: "Box",
    boxes: "Box",

    pack: "Pack",
    packs: "Pack",

    packet: "Packet",
    packets: "Packet",

    kit: "Kit",
    kits: "Kit",

    container: "Container",
    containers: "Container",

    reagent: "Reagent",
    reagents: "Reagent",

    bag: "Bag",
    bags: "Bag",

    roll: "Roll",
    rolls: "Roll",

    pair: "Pair",
    pairs: "Pair",

    ampoule: "Ampoule",
    ampoules: "Ampoule",

    ampule: "Ampule",
    ampules: "Ampule",

    syringe: "Syringe",
    syringes: "Syringe",

    pipette: "Pipette",
    pipettes: "Pipette",

    cartridge: "Cartridge",
    cartridges: "Cartridge",

    cassette: "Cassette",
    cassettes: "Cassette",

    slide: "Slide",
    slides: "Slide",
  };

  if (inventoryUnits[lower]) {
    return inventoryUnits[lower];
  }

  // =====================================================
  // GENERIC FALLBACK
  // =====================================================

  return (
    lower.charAt(0).toUpperCase() +
    lower.slice(1)
  );
}