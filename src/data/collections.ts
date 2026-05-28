/**
 * Central collection catalog. Imported by both the public collections page
 * and the inquiry "Add to inquiry" flow.
 */

export type Category =
  | "Senator Wear"
  | "Shirts"
  | "Suits"
  | "Casual"
  | "Traditional"
  | "Corporate";

export interface CollectionItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  gradient: string;
}

export const CATEGORIES: Array<Category | "All"> = [
  "All",
  "Senator Wear",
  "Suits",
  "Shirts",
  "Traditional",
  "Corporate",
  "Casual",
];

/**
 * Each category gets a poetic intro line that surfaces above its filtered grid.
 */
export const CATEGORY_INTRO: Record<Category, string> = {
  "Senator Wear":
    "The garment of statesmen - cut for those who shape rooms simply by entering them.",
  Suits:
    "A second skin in worsted wool. Built to follow your shoulders, not the other way around.",
  Shirts:
    "Egyptian cotton. French linen. The quiet luxury that lives closest to you.",
  Casual:
    "Off-duty, never off-form. Comfort that still speaks in full sentences.",
  Traditional:
    "Heritage rendered in thread - hand-woven Aso-Oke, ceremonial gold, ancestral pride.",
  Corporate:
    "The boardroom uniform reimagined - structured authority, lined in subtle Ankara.",
};

export const COLLECTION_ITEMS: CollectionItem[] = [
  {
    id: "senator-statesman",
    name: "The Statesman",
    category: "Senator Wear",
    description: "Ivory senator with whisper-fine gold embroidery on the placket.",
    gradient: "from-emerald to-emerald-dark",
  },
  {
    id: "senator-diplomat",
    name: "The Diplomat",
    category: "Senator Wear",
    description: "Onyx black senator with tone-on-tone motif and brushed gold buttons.",
    gradient: "from-black to-emerald-dark",
  },
  {
    id: "senator-elder",
    name: "The Elder",
    category: "Senator Wear",
    description: "Deep navy senator with traditional detailing - a quiet titan.",
    gradient: "from-emerald-dark to-black",
  },
  {
    id: "senator-executive",
    name: "The Executive",
    category: "Senator Wear",
    description: "Slate grey senator for the modern leader.",
    gradient: "from-emerald to-black",
  },
  {
    id: "shirt-oxford-classic",
    name: "Oxford Classic",
    category: "Shirts",
    description: "Crisp Egyptian-cotton oxford with French cuffs and hand-rolled collar.",
    gradient: "from-emerald-light to-emerald",
  },
  {
    id: "shirt-artisan",
    name: "The Artisan",
    category: "Shirts",
    description: "Patterned shirt with Ankara-inspired print and contrast inner placket.",
    gradient: "from-emerald to-emerald-light",
  },
  {
    id: "shirt-linen-breeze",
    name: "Linen Breeze",
    category: "Shirts",
    description: "French linen for tropical elegance - cooler than the Harmattan.",
    gradient: "from-emerald-dark to-emerald-light",
  },
  {
    id: "suit-chairman",
    name: "The Chairman",
    category: "Suits",
    description: "Double-breasted charcoal Italian wool. Boardroom-built.",
    gradient: "from-black to-emerald",
  },
  {
    id: "suit-maverick",
    name: "The Maverick",
    category: "Suits",
    description: "Slim emerald suit, peak lapels, silk lining cut on the bias.",
    gradient: "from-emerald to-emerald-dark",
  },
  {
    id: "suit-pinnacle",
    name: "The Pinnacle",
    category: "Suits",
    description: "Three-piece navy with discreet gold buttons - the celebration suit.",
    gradient: "from-emerald-dark to-black",
  },
  {
    id: "casual-weekend-luxe",
    name: "Weekend Luxe",
    category: "Casual",
    description: "Relaxed kaftan in premium cotton, hand-stitched neckline.",
    gradient: "from-emerald-light to-emerald",
  },
  {
    id: "casual-wanderer",
    name: "The Wanderer",
    category: "Casual",
    description: "Contemporary set with subtle Igbo motifs - elegant in motion.",
    gradient: "from-emerald to-emerald-light",
  },
  {
    id: "casual-lounger",
    name: "The Lounger",
    category: "Casual",
    description: "Premium agbada-inspired loungewear for slow afternoons.",
    gradient: "from-emerald-dark to-emerald",
  },
  {
    id: "traditional-igbo-heritage",
    name: "Igbo Heritage",
    category: "Traditional",
    description: "Hand-woven Aso-Oke isiagu paired with traditional cap.",
    gradient: "from-emerald to-black",
  },
  {
    id: "traditional-chieftain",
    name: "The Chieftain",
    category: "Traditional",
    description: "Royal agbada with bullion gold thread and ceremonial trim.",
    gradient: "from-black to-emerald",
  },
  {
    id: "traditional-ancestral",
    name: "Ancestral Pride",
    category: "Traditional",
    description: "Ceremonial attire with hand-laid gold thread work.",
    gradient: "from-emerald-dark to-emerald",
  },
  {
    id: "corporate-authority",
    name: "Boardroom Authority",
    category: "Corporate",
    description: "Power suit with structured shoulders and mohair-blend wool.",
    gradient: "from-black to-emerald-dark",
  },
  {
    id: "corporate-director",
    name: "The Director",
    category: "Corporate",
    description: "Tailored blazer with matching trousers and bone-button details.",
    gradient: "from-emerald-dark to-black",
  },
  {
    id: "corporate-edge",
    name: "Executive Edge",
    category: "Corporate",
    description: "Modern corporate ensemble with African-print inner lining.",
    gradient: "from-emerald to-emerald-dark",
  },
];
