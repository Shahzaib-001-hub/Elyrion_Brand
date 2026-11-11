export interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  volume: number;
  bottleType: string;
  origin: string;
  concentration: 'EDP' | 'EDT' | 'Parfum';
  gender: 'men' | 'women' | 'unisex';
  categories: string[];
  moods: string[];
  images: string[];
  price: number; // minor units (pence)
  compareAtPrice?: number;
  currency: string;
  stock: number;
  sku: string;
  barcode?: string;
  weight: number;
  tags: string[];
  seo: {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
  };
  status: 'draft' | 'active' | 'archived';
  rating: {
    average: number;
    count: number;
  };
}

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    _id: '6651a1b2c3d4e5f6a7b8c901',
    name: 'Oud Impérial',
    slug: 'oud-imperial',
    brand: 'Elyrion',
    description:
      'An opulent coronation of smoky Royal Cambodian Oud, wrapped in crimson Bulgarian Damask rose petals and aged leather. Poured into our signature 50ml transparent flacon with a heavy champagne gold cap, Oud Impérial commands boardroom authority and regal night-time prestige.',
    notes: {
      top: ['Sicilian Bergamot', 'Pink Peppercorn', 'Cardamom Pods'],
      heart: ['Bulgarian Damask Rose', 'Smoky Leather', 'Atlas Cedar'],
      base: ['Royal Cambodian Oud', 'White Ambergris', 'Smoked Birch'],
    },
    volume: 50,
    bottleType: 'Transparent glass with champagne gold collar',
    origin: 'London, UK',
    concentration: 'Parfum',
    gender: 'unisex',
    categories: ['Unisex', 'Signature', 'Best Sellers'],
    moods: ['Opulent', 'Mysterious', 'Regal'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 21000, // £210.00
    compareAtPrice: 24000,
    currency: 'GBP',
    stock: 45,
    sku: 'ELY-OUD-50ML',
    barcode: '5060123456781',
    weight: 380,
    tags: ['oud', 'leather', 'rose', 'luxury', 'parfum', 'evening'],
    seo: {
      title: 'Oud Impérial Parfum 50ml | Elyrion Fragrances',
      description: 'Experience Oud Impérial by Elyrion. Pure Cambodian Oud and Damask Rose.',
    },
    status: 'active',
    rating: { average: 4.95, count: 48 },
  },
  {
    _id: '6651a1b2c3d4e5f6a7b8c902',
    name: 'Rose Saphir',
    slug: 'rose-saphir',
    brand: 'Elyrion',
    description:
      'A poetic reverie of morning dew on May Centifolia roses. Soft lychee nectar weaves into velvety Moroccan neroli before descending into an embrace of cashmere woods and warm French iris. Romantic, ethereal, and quietly seductive.',
    notes: {
      top: ['Sparkling Mandarin', 'Turkish Lychee', 'Morning Dew'],
      heart: ['Centifolia Rose de Mai', 'Moroccan Neroli', 'Velvet Peony'],
      base: ['Cashmere Woods', 'French Orris', 'Praline Musk'],
    },
    volume: 50,
    bottleType: 'Transparent glass with champagne gold collar',
    origin: 'London, UK',
    concentration: 'EDP',
    gender: 'women',
    categories: ['Women', 'Signature', 'Best Sellers'],
    moods: ['Sensual', 'Romantic', 'Serene'],
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 18500, // £185.00
    currency: 'GBP',
    stock: 62,
    sku: 'ELY-ROS-50ML',
    barcode: '5060123456782',
    weight: 380,
    tags: ['rose', 'floral', 'romantic', 'lychee', 'sensual'],
    seo: {
      title: 'Rose Saphir Eau de Parfum 50ml | Elyrion Fragrances',
      description: 'Rose Saphir EDP: Dewy Centifolia rose, lychee, and French iris.',
    },
    status: 'active',
    rating: { average: 4.88, count: 34 },
  },
  {
    _id: '6651a1b2c3d4e5f6a7b8c903',
    name: 'Santal Nuit',
    slug: 'santal-nuit',
    brand: 'Elyrion',
    description:
      'The hypnotic warmth of pure Mysore sandalwood tempered by green papyrus and crushed cardamom pods. A velvety dry-down of smoky amber and Bourbon vanilla creates an addictive trail that lingers effortlessly on cashmere and skin.',
    notes: {
      top: ['Guatemalan Cardamom', 'Violet Leaf', 'Crisp Cypress'],
      heart: ['Mysore Sandalwood', 'Egyptian Papyrus', 'Florentine Iris'],
      base: ['Bourbon Vanilla', 'Smoked Amber', 'Cedarwood Flakes'],
    },
    volume: 50,
    bottleType: 'Transparent glass with champagne gold collar',
    origin: 'London, UK',
    concentration: 'EDP',
    gender: 'unisex',
    categories: ['Unisex', 'Signature', 'New Arrivals'],
    moods: ['Mysterious', 'Sensual', 'Avant-Garde'],
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 19500, // £195.00
    currency: 'GBP',
    stock: 38,
    sku: 'ELY-SAN-50ML',
    barcode: '5060123456783',
    weight: 380,
    tags: ['sandalwood', 'cardamom', 'vanilla', 'woody', 'evening'],
    seo: {
      title: 'Santal Nuit Eau de Parfum 50ml | Elyrion Fragrances',
      description: 'Santal Nuit: Mysore sandalwood, cardamom, and Bourbon vanilla.',
    },
    status: 'active',
    rating: { average: 4.92, count: 52 },
  },
  {
    _id: '6651a1b2c3d4e5f6a7b8c904',
    name: 'Bergamote Céleste',
    slug: 'bergamote-celeste',
    brand: 'Elyrion',
    description:
      'Sun-drenched Calabrian bergamot infused with wild green fig leaves and aromatic petitgrain. Heart notes of handpicked Grasse orange blossom and white imperial tea rest on a clean foundation of Haitian vetiver and transparent amber.',
    notes: {
      top: ['Calabrian Bergamot', 'Green Fig Leaf', 'Italian Petitgrain'],
      heart: ['Grasse Orange Blossom', 'White Imperial Tea', 'Water Jasmine'],
      base: ['Haitian Vetiver', 'Sun-bleached Driftwood', 'Transparent Amber'],
    },
    volume: 50,
    bottleType: 'Transparent glass with champagne gold collar',
    origin: 'London, UK',
    concentration: 'EDP',
    gender: 'unisex',
    categories: ['Unisex', 'Signature', 'Best Sellers'],
    moods: ['Fresh', 'Serene', 'Invigorating'],
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 16500, // £165.00
    currency: 'GBP',
    stock: 58,
    sku: 'ELY-BER-50ML',
    barcode: '5060123456784',
    weight: 380,
    tags: ['bergamot', 'citrus', 'tea', 'fresh', 'summer'],
    seo: {
      title: 'Bergamote Céleste Eau de Parfum 50ml | Elyrion Fragrances',
      description: 'Calabrian bergamot, green fig, and Grasse orange blossom.',
    },
    status: 'active',
    rating: { average: 4.86, count: 27 },
  },
  {
    _id: '6651a1b2c3d4e5f6a7b8c905',
    name: 'Vétiver Sauvage',
    slug: 'vetiver-sauvage',
    brand: 'Elyrion',
    description:
      'An arresting study of dark, smoky vetiver roots harvested in Les Cayes. Crisp pink grapefruit and cracked pink peppercorn open the composition, unveiling a bold heart of dark roasted Arabica and wild clary sage on damp oakmoss.',
    notes: {
      top: ['Pink Grapefruit Zest', 'Cracked Pink Pepper', 'Nutmeg'],
      heart: ['Dark Roasted Coffee', 'Clary Sage', 'Bourbon Geranium'],
      base: ['Smoky Haitian Vetiver', 'Mountain Oakmoss', 'Black Patchouli'],
    },
    volume: 50,
    bottleType: 'Transparent glass with champagne gold collar',
    origin: 'London, UK',
    concentration: 'EDP',
    gender: 'men',
    categories: ['Men', 'Signature'],
    moods: ['Regal', 'Mysterious', 'Bold'],
    images: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 17500, // £175.00
    currency: 'GBP',
    stock: 31,
    sku: 'ELY-VET-50ML',
    barcode: '5060123456785',
    weight: 380,
    tags: ['vetiver', 'earthy', 'masculine', 'coffee', 'smoky'],
    seo: {
      title: 'Vétiver Sauvage Eau de Parfum 50ml | Elyrion Fragrances',
      description: 'Smoky Haitian Vetiver, roasted coffee, and pink grapefruit.',
    },
    status: 'active',
    rating: { average: 4.91, count: 29 },
  },
  {
    _id: '6651a1b2c3d4e5f6a7b8c906',
    name: 'Fleur Blanche',
    slug: 'fleur-blanche',
    brand: 'Elyrion',
    description:
      'A nocturnal bouquet of radiant white blossoms. Creamy Grasse tuberose, night-blooming gardenia, and sambac jasmine petals unfold over velvety peach nectar, grounded by golden benzoin and sensual musk.',
    notes: {
      top: ['Italian Mandarin', 'White Peach Nectar', 'Aldehydic Breeze'],
      heart: ['Grasse Tuberose', 'Night Gardenia', 'Jasmine Sambac'],
      base: ['Creamy Sandalwood', 'Skin Musks', 'Golden Siam Benzoin'],
    },
    volume: 50,
    bottleType: 'Transparent glass with champagne gold collar',
    origin: 'London, UK',
    concentration: 'EDP',
    gender: 'women',
    categories: ['Women', 'Signature', 'New Arrivals'],
    moods: ['Sensual', 'Opulent', 'Radiant'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 18000, // £180.00
    currency: 'GBP',
    stock: 44,
    sku: 'ELY-FLE-50ML',
    barcode: '5060123456786',
    weight: 380,
    tags: ['floral', 'tuberose', 'jasmine', 'white floral', 'feminine'],
    seo: {
      title: 'Fleur Blanche Eau de Parfum 50ml | Elyrion Fragrances',
      description: 'Grasse Tuberose, night gardenia, and white peach nectar.',
    },
    status: 'active',
    rating: { average: 4.89, count: 21 },
  },
  {
    _id: '6651a1b2c3d4e5f6a7b8c907',
    name: 'Ambre Noir Réserve',
    slug: 'ambre-noir-reserve',
    brand: 'Elyrion',
    description:
      'Our master perfumer’s highest distillation of midnight amber. Infused with bitter Sicilian almond and French fine cognac accord, followed by crimson saffron and precious myrrh incense. Deep, intoxicating, and unforgettable.',
    notes: {
      top: ['Bitter Almond', 'Fine Cognac Accord', 'Saffron Threads'],
      heart: ['Roasted Tonka Bean', 'Spanish Labdanum', 'Incense Olibanum'],
      base: ['Black Royal Amber', 'Sweet Myrrh', 'Madagascar Vanilla Pod'],
    },
    volume: 50,
    bottleType: 'Transparent glass with champagne gold collar',
    origin: 'London, UK',
    concentration: 'Parfum',
    gender: 'unisex',
    categories: ['Unisex', 'Signature', 'Limited'],
    moods: ['Opulent', 'Mysterious', 'Seductive'],
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 24000, // £240.00
    compareAtPrice: 28000,
    currency: 'GBP',
    stock: 19,
    sku: 'ELY-AMB-50ML',
    barcode: '5060123456787',
    weight: 380,
    tags: ['amber', 'cognac', 'vanilla', 'limited', 'parfum', 'evening'],
    seo: {
      title: 'Ambre Noir Réserve Parfum 50ml | Elyrion Fragrances',
      description: 'Black Royal Amber, fine cognac accord, and saffron threads.',
    },
    status: 'active',
    rating: { average: 4.98, count: 39 },
  },
  {
    _id: '6651a1b2c3d4e5f6a7b8c908',
    name: 'Cèdre Lumineux',
    slug: 'cedre-lumineux',
    brand: 'Elyrion',
    description:
      'Crisp alpine juniper berries and crystalline lemon caviar greet high-altitude Virginia cedarwood. Smoked hinoki cypress and supple suede finish this modern aristocratic silhouette with understated luxury.',
    notes: {
      top: ['Alpine Juniper Berries', 'Lemon Caviar', 'Fresh Elemi'],
      heart: ['Virginia Cedarwood', 'Smoked Hinoki Wood', 'Pine Needles'],
      base: ['Crystal Amber', 'Supple Suede', 'Tonka Bean Absolu'],
    },
    volume: 50,
    bottleType: 'Transparent glass with champagne gold collar',
    origin: 'London, UK',
    concentration: 'EDP',
    gender: 'men',
    categories: ['Men', 'Signature', 'New Arrivals'],
    moods: ['Fresh', 'Regal', 'Confident'],
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 17000, // £170.00
    currency: 'GBP',
    stock: 28,
    sku: 'ELY-CED-50ML',
    barcode: '5060123456788',
    weight: 380,
    tags: ['cedar', 'woody', 'juniper', 'fresh', 'executive'],
    seo: {
      title: 'Cèdre Lumineux Eau de Parfum 50ml | Elyrion Fragrances',
      description: 'Virginia cedarwood, alpine juniper, and smoked hinoki.',
    },
    status: 'active',
    rating: { average: 4.87, count: 18 },
  },
];

export const INITIAL_CATEGORIES = [
  {
    name: 'Men',
    slug: 'men',
    description: 'Commanding woods, aromatic resins, and smoky vetivers tailored for masculine refinement.',
    order: 1,
    isCollection: false,
  },
  {
    name: 'Women',
    slug: 'women',
    description: 'Luminous florals, velvety ambers, and sensual dewy petals of radiant femininity.',
    order: 2,
    isCollection: false,
  },
  {
    name: 'Unisex',
    slug: 'unisex',
    description: 'Boundary-defying olfactory masterpieces crafted for those who define their own aura.',
    order: 3,
    isCollection: false,
  },
  {
    name: 'Corporate Gifting',
    slug: 'corporate-gifting',
    description: 'Bespoke corporate concierge sets, tailored ribboning, and engraved crystal flacons.',
    order: 4,
    isCollection: false,
  },
  {
    name: 'Best Sellers',
    slug: 'best-sellers',
    description: 'Our most coveted signatures celebrated in London and Paris.',
    order: 5,
    isCollection: true,
  },
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'The latest distillations from the Elyrion private laboratory.',
    order: 6,
    isCollection: true,
  },
  {
    name: 'Limited Reserve',
    slug: 'limited-reserve',
    description: 'Small-batch, numbered flacons featuring rare Grasse harvests.',
    order: 7,
    isCollection: true,
  },
];

export const INITIAL_CURATED_BUNDLES = [
  {
    title: 'The Royal Sovereign Trio',
    slug: 'royal-sovereign-trio',
    tagline: 'Three 50ml Masterpieces: Oud Impérial, Santal Nuit & Ambre Noir',
    description:
      'Immerse in the pinnacle of quiet luxury. A magnificent presentation box housing our three most prized evening parfums in transparent 50ml flacons with champagne gold closures.',
    productIds: ['6651a1b2c3d4e5f6a7b8c901', '6651a1b2c3d4e5f6a7b8c903', '6651a1b2c3d4e5f6a7b8c907'],
    price: 52000, // £520.00 (Savings of £125)
    compareAtPrice: 64500,
    badge: 'Save 20% + Bespoke Presentation Box',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
    stock: 20,
    featured: true,
  },
  {
    title: 'The Riviera Dawn & Dusk Discovery Set',
    slug: 'riviera-dawn-dusk-set',
    tagline: 'Two 50ml Signatures: Bergamote Céleste & Rose Saphir',
    description:
      'From the sunlit morning zest of Calabrian bergamot to the sensual evening romance of Centifolia rose. The definitive day-to-night olfactory wardrobe.',
    productIds: ['6651a1b2c3d4e5f6a7b8c904', '6651a1b2c3d4e5f6a7b8c902'],
    price: 29500, // £295.00
    compareAtPrice: 35000,
    badge: 'Save 16%',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
    stock: 35,
    featured: true,
  },
];

export const INITIAL_TIER_RULES = [
  {
    itemCount: 3,
    discountPercent: 10,
    label: 'Connoisseur’s Trio (10% Savings)',
  },
  {
    itemCount: 5,
    discountPercent: 15,
    label: 'Grand Curator Quintet (15% Savings)',
  },
  {
    itemCount: 7,
    discountPercent: 20,
    label: 'Imperial Treasury Heptad (20% Savings)',
  },
];

export const INITIAL_QUIZ_CONFIG = {
  version: 1,
  steps: [
    {
      stepNumber: 1,
      question: 'What is the signature occasion you wish to crown?',
      subtitle: 'Select the moment where your scent trail will leave its indelible impression.',
      options: [
        {
          id: 'evening_gala',
          label: 'Grand Evening Gala',
          tagline: 'Black tie, candlelight, and magnetic allure.',
          associatedMoods: ['Opulent', 'Regal', 'Mysterious'],
          associatedNotes: ['Royal Cambodian Oud', 'Black Royal Amber', 'Saffron Threads'],
        },
        {
          id: 'intimate_date',
          label: 'Intimate Rendezvous',
          tagline: 'Whispered secrets and close proximity warmth.',
          associatedMoods: ['Sensual', 'Romantic', 'Seductive'],
          associatedNotes: ['Centifolia Rose de Mai', 'Bourbon Vanilla', 'Mysore Sandalwood'],
        },
        {
          id: 'boardroom_presence',
          label: 'Executive Boardroom',
          tagline: 'Unshakable confidence, poise, and sharp intellect.',
          associatedMoods: ['Regal', 'Confident', 'Bold'],
          associatedNotes: ['Smoky Haitian Vetiver', 'Virginia Cedarwood', 'Sicilian Bergamot'],
        },
        {
          id: 'sunlit_morning',
          label: 'Sunlit Coastal Morning',
          tagline: 'Crisp linen, Mediterranean breeze, and vibrant energy.',
          associatedMoods: ['Fresh', 'Serene', 'Invigorating'],
          associatedNotes: ['Calabrian Bergamot', 'Green Fig Leaf', 'White Imperial Tea'],
        },
      ],
    },
    {
      stepNumber: 2,
      question: 'Which emotional aura best embodies your character?',
      subtitle: 'Perfume is the unspoken language of your innermost spirit.',
      options: [
        {
          id: 'mysterious_seductive',
          label: 'Mysterious & Enigmatic',
          tagline: 'Shadowed, alluring, and impossible to forget.',
          associatedMoods: ['Mysterious', 'Seductive', 'Opulent'],
          associatedNotes: ['Royal Cambodian Oud', 'Black Royal Amber', 'Fine Cognac Accord'],
        },
        {
          id: 'sensual_radiant',
          label: 'Sensual & Luminous',
          tagline: 'Warm, blooming, and irresistibly inviting.',
          associatedMoods: ['Sensual', 'Radiant', 'Romantic'],
          associatedNotes: ['Grasse Tuberose', 'Centifolia Rose de Mai', 'White Peach Nectar'],
        },
        {
          id: 'avant_garde',
          label: 'Bespoke & Avant-Garde',
          tagline: 'Distinctive, rare, and rebellious quiet luxury.',
          associatedMoods: ['Avant-Garde', 'Mysterious', 'Bold'],
          associatedNotes: ['Guatemalan Cardamom', 'Egyptian Papyrus', 'Smoked Birch'],
        },
        {
          id: 'pure_serenity',
          label: 'Serene & Harmonious',
          tagline: 'Tranquil, balanced, and effortless purity.',
          associatedMoods: ['Serene', 'Fresh', 'Invigorating'],
          associatedNotes: ['White Imperial Tea', 'Calabrian Bergamot', 'Driftwood'],
        },
      ],
    },
    {
      stepNumber: 3,
      question: 'What olfactory intensity and seasonal warmth calls to you?',
      subtitle: 'The weight of the vapor against your skin.',
      options: [
        {
          id: 'velvet_winter',
          label: 'Velvet Winter Frost & Fireside',
          tagline: 'Parfum strength: deep spices, aged spirits, and resins.',
          associatedMoods: ['Opulent', 'Regal', 'Mysterious'],
          associatedNotes: ['Black Royal Amber', 'Fine Cognac Accord', 'Royal Cambodian Oud'],
        },
        {
          id: 'sultry_summer',
          label: 'Sultry Summer Evening',
          tagline: 'Warm blossoms that come alive when twilight falls.',
          associatedMoods: ['Sensual', 'Romantic'],
          associatedNotes: ['Grasse Tuberose', 'Jasmine Sambac', 'Centifolia Rose de Mai'],
        },
        {
          id: 'crisp_spring',
          label: 'Crisp Spring Dawn',
          tagline: 'Bright sparkling citrus, green shoots, and clean rain.',
          associatedMoods: ['Fresh', 'Invigorating', 'Serene'],
          associatedNotes: ['Calabrian Bergamot', 'Green Fig Leaf', 'Alpine Juniper Berries'],
        },
        {
          id: 'amber_autumn',
          label: 'Golden Autumn Woods',
          tagline: 'Golden leaves, creamy sandalwood, and toasted cardamoms.',
          associatedMoods: ['Mysterious', 'Sensual', 'Confident'],
          associatedNotes: ['Mysore Sandalwood', 'Virginia Cedarwood', 'Bourbon Vanilla'],
        },
      ],
    },
  ],
};

export const INITIAL_COUPONS = [
  {
    code: 'ELYRION10',
    discountType: 'percentage' as const,
    discountValue: 10,
    minSpend: 15000, // £150
    active: true,
  },
  {
    code: 'WELCOME25',
    discountType: 'fixed' as const,
    discountValue: 2500, // £25 off
    minSpend: 18000, // £180
    active: true,
  },
  {
    code: 'CONCIERGE',
    discountType: 'free_shipping' as const,
    discountValue: 0,
    minSpend: 0,
    active: true,
  },
];
