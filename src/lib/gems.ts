// Random artifact documents in the format of the Gem Maker sheet:
// a crystalline manifestation blurb followed by structured gemstone details.

const OPENERS = [
  "A crystalline manifestation of the ancient horadric mechanism that once bound tal rasha's tomb. This gemstone holds the extracted spatial energy of the Orifice Chamber, resonating with the same power that unlocks forbidden passageways.",
  "A drowned shard recovered from the tide-vaults beneath the Sunken Cathedral. The stone still breathes salt, and its facets fog with an unspent storm.",
  "A cinder-locked relic pulled from the throat of a dormant caldera. Its core has never cooled, and heat runs along the cleavage planes like veins.",
  "A stone grown inside a root-cairn, layered like sediment. It remembers every mountain that stood above it and insists on rebuilding them.",
  "A weightless crystal that hovers a finger's width above any surface. Airborne currents thread through its hollow chambers and sing.",
  "A fused conjunction of four lesser stones, bound by a horadric seal. Each quadrant argues with the others for dominion over the space around it.",
  "A scrying shard chipped from the Modal Lattice. When set on parchment it casts a grid of light and insists the world be drawn inside it.",
];

const TYPES = [
  "Horadric Artifact",
  "Tidal Reliquary",
  "Ember Sigil",
  "Terrestrial Core",
  "Zephyr Prism",
  "Lattice Fragment",
  "Wayfarer's Keystone",
];

const SHAPES = [
  "Octagonal (8-Point Focus)",
  "Hexagonal (6-Point Focus)",
  "Teardrop (Single-Point Flow)",
  "Rhombic Dodecahedron (12-Face Bloom)",
  "Fractured Cube (Broken Axis)",
  "Spiral Cabochon (Continuous Face)",
  "Trine Pyramid (3-Point Ascent)",
];

const COLORS = [
  "Ancient Topaz / Ember Core",
  "Abyssal Sapphire / Tidewhite Veining",
  "Cinderglass Red / Black Ash Inclusions",
  "Moss Jade / Ironstone Banding",
  "Stormpale Quartz / Silver Static",
  "Void Amethyst / Aurora Bloom",
  "Sunbleached Amber / Drifting Motes",
];

const COMPOSITIONS = [
  "Arcane Crystal, Horadric Essence, Imbued Flame",
  "Deep Ice, Pressed Brine, Leviathan Resin",
  "Obsidian Glass, Living Cinder, Sulphur Thread",
  "Petrified Heartwood, Ore Marrow, Root Salt",
  "Cloud Silica, Lightning Residue, Hollow Air",
  "Fused Quartz, Tidewater, Ash, Wind-Salt",
  "Lattice Silver, Cartographer's Ink, Dust of Maps",
];

const PROPERTIES = [
  "Resonates with the Horadric Orifice. Reacts to the Horadric Staff",
  "Draws standing water toward it. Freezes at the touch of open flame",
  "Ignites dry air within arm's reach. Cannot be quenched by rain",
  "Grows heavier near buried stone. Raises ridgelines where it rests",
  "Lifts loose objects in a slow orbit. Whistles before a storm",
  "Splits light into four elemental bands. Each band seeks its own quarter",
  "Projects a survey grid onto any flat surface. The grid persists until dawn",
];

const BIASES = [
  "Dominant resonance: Water — flooded basins, long coasts, island chains.",
  "Dominant resonance: Fire — a molten core, scorched ridges, ember rivers.",
  "Dominant resonance: Earth — broad continents, highland spines, deep valleys.",
  "Dominant resonance: Air — floating spires, wind corridors, thin open sky.",
  "Balanced resonance: all four elements hold equal ground.",
  "Split resonance: fire and water contest a fractured coastline.",
  "Split resonance: earth and air layer into terraced mesas and sky bridges.",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomBetween(min: number, max: number, digits = 1) {
  return (Math.random() * (max - min) + min).toFixed(digits);
}

export function randomGemDocument(): string {
  return `${pick(OPENERS)}

Gemstone details:

Type : ${pick(TYPES)}

Shape : ${pick(SHAPES)}

Color : ${pick(COLORS)}

Dimension : ~${randomBetween(1.4, 7.8)} cm diameter

Weight : ~${randomBetween(8, 180)} g

Composition : ${pick(COMPOSITIONS)}

Properties : ${pick(PROPERTIES)}

${pick(BIASES)}`;
}
