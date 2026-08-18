export function pluralizeUnit(
  unit: string,
  quantity: number
): string {
  const cleanUnit =
    unit?.trim() || "unit";

  const lowerUnit =
    cleanUnit.toLowerCase();

  // Singular
  if (quantity === 1) {
    return cleanUnit;
  }

  // Common laboratory / inventory units
  const pluralMap: Record<string, string> = {
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

    dish: "Dishes",
    dishes: "Dishes",

    well: "Wells",
    wells: "Wells",

    box: "Boxes",
    boxes: "Boxes",

    pack: "Packs",
    packs: "Packs",

    packet: "Packets",
    packets: "Packets",

    kit: "Kits",
    kits: "Kits",

    container: "Containers",
    containers: "Containers",

    reagent: "Reagents",
    reagents: "Reagents",

    bag: "Bags",
    bags: "Bags",

    roll: "Rolls",
    rolls: "Rolls",

    pair: "Pairs",
    pairs: "Pairs",

    ampoule: "Ampoules",
    ampoules: "Ampoules",

    ampule: "Ampules",
    ampules: "Ampules",

    syringe: "Syringes",
    syringes: "Syringes",

    pipette: "Pipettes",
    pipettes: "Pipettes",

    cartridge: "Cartridges",
    cartridges: "Cartridges",

    cassette: "Cassettes",
    cassettes: "Cassettes",

    slide: "Slides",
    slides: "Slides",
  };

  if (pluralMap[lowerUnit]) {
    return pluralMap[lowerUnit];
  }

  // Measurement units do not get pluralised.
  // Examples:
  // 10 mL, 25 µL, 5 mg, 2 kg
  const measurementUnits = [
    "ml",
    "µl",
    "ul",
    "μl",
    "l",
    "g",
    "mg",
    "kg",
    "µg",
    "μg",
    "ug",
    "ng",
    "mm",
    "cm",
    "m",
  ];

  if (
    measurementUnits.includes(
      lowerUnit
    )
  ) {
    return cleanUnit;
  }

  // Already plural
  if (lowerUnit.endsWith("s")) {
    return cleanUnit;
  }

  // Basic English pluralisation
  if (
    lowerUnit.endsWith("x") ||
    lowerUnit.endsWith("z") ||
    lowerUnit.endsWith("ch") ||
    lowerUnit.endsWith("sh")
  ) {
    return `${cleanUnit}es`;
  }

  // Generic fallback
  return `${cleanUnit}s`;
}