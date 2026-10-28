export const PRODUCTS = [
  {
    id: "soren-lounge-chair",
    name: "Soren Sculptural Lounge Chair",
    category: "Lounge Seating",
    tagline: "Low-profile lounge silhouette with curved solid oak arms",
    price: "$2,450",
    priceNote: "Sample catalog price",
    dimensions: {
      width: "82 cm (32.3 in)",
      depth: "78 cm (30.7 in)",
      height: "74 cm (29.1 in)",
      seatHeight: "42 cm (16.5 in)",
      clearanceNeeded: "60 cm circulation",
    },
    materials: "Solid White Oak · Textured Oatmeal Bouclé",
    origin: "Copenhagen Atelier (Sample design)",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
    cutoutImage: "/cutouts/soren-chair.png",
    hasCutout: true,
    fallbackColor: "#EAE5DC",
    description:
      "Crafted with hand-shaped curved arms and high-density wool bouclé upholstery. Designed to anchor minimalist reading corners while preserving spatial flow.",
    spatialNotes: "Recommended placement: 45° angle to primary natural light source for soft textile contrast.",
    inStockSample: "Sample made-to-order lead time: 4–6 weeks",
    cutoutNote: "Isolated transparent cutout available for 2D staging with contact shadow."
  },
  {
    id: "alabaster-coffee-table",
    name: "Alabaster Fluted Plinth Table",
    category: "Low Tables",
    tagline: "Monolithic Roman travertine with beveled perimeter edges",
    price: "$1,820",
    priceNote: "Sample catalog price",
    dimensions: {
      width: "120 cm (47.2 in)",
      depth: "65 cm (25.6 in)",
      height: "38 cm (15.0 in)",
      weight: "68 kg (150 lbs)",
      clearanceNeeded: "45 cm sofa clearance",
    },
    materials: "Honed Roman Travertine · Natural Matte Sealant",
    origin: "Tivoli Quarry, Italy (Sample design)",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80",
    cutoutImage: "/cutouts/alabaster-table.png",
    hasCutout: true,
    fallbackColor: "#E5E0D5",
    description:
      "Cut from a single quarried block of porous Roman travertine, hand-filled and honed to a soft velvety finish that captures shifting indoor natural illumination.",
    spatialNotes: "Recommended clearance: Maintain minimum 45 cm distance from sofa edge for natural walkway ergonomics.",
    inStockSample: "Sample atelier edition · 12 pieces cataloged",
    cutoutNote: "Isolated transparent cutout available for 2D staging with contact shadow."
  },
  {
    id: "njord-modular-sofa",
    name: "Njord Three-Seat Tailored Sofa",
    category: "Modular Seating",
    tagline: "Generously proportioned low sofa draped in unbleached Belgian linen",
    price: "$4,100",
    priceNote: "Sample catalog price",
    dimensions: {
      width: "240 cm (94.5 in)",
      depth: "98 cm (38.6 in)",
      height: "76 cm (29.9 in)",
      seatDepth: "66 cm (26.0 in)",
      clearanceNeeded: "90 cm primary room axis",
    },
    materials: "Belgian Unbleached Linen · Kiln-Dried European Beech",
    origin: "Antwerp Studio (Sample design)",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    cutoutImage: "/cutouts/njord-sofa.png",
    hasCutout: true,
    fallbackColor: "#E2DCD2",
    description:
      "A quiet luxury centerpiece with layered natural feather and down cushions resting upon a low-profile recessed plinth. Calibrated for long sightlines and open-concept living.",
    spatialNotes: "Recommended scale: Anchors living rooms 18m² and larger without dominating peripheral sightlines.",
    inStockSample: "Sample custom textile options available",
    cutoutNote: "Isolated transparent cutout available for 2D staging with contact shadow."
  }
];

export const HERO_ROOM = {
  title: "Sample Scandinavian Residence",
  location: "Stockholms län, Sweden (Demo Scene)",
  architect: "Nordic Minimalist Pavilion",
  image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80",
  dimensions: {
    roomWidth: "4.80 m (15.7 ft)",
    roomDepth: "6.20 m (20.3 ft)",
    ceilingHeight: "3.20 m (10.5 ft)",
    sofaSpan: "240 cm span (Sample)",
    tableClearance: "48 cm walkway clearance (Sample)",
    daylightExposure: "Simulated natural lighting"
  },
  hotspots: [
    {
      id: "sofa-hotspot",
      x: "48%",
      y: "62%",
      label: "Njord Three-Seat Sofa",
      dimension: "W: 240 cm · D: 98 cm (Sample)",
      targetProductId: "njord-modular-sofa"
    },
    {
      id: "table-hotspot",
      x: "42%",
      y: "78%",
      label: "Alabaster Plinth Table",
      dimension: "W: 120 cm · D: 65 cm (Sample)",
      targetProductId: "alabaster-coffee-table"
    },
    {
      id: "chair-hotspot",
      x: "78%",
      y: "66%",
      label: "Soren Lounge Chair",
      dimension: "W: 82 cm · D: 78 cm (Sample)",
      targetProductId: "soren-lounge-chair"
    }
  ]
};
