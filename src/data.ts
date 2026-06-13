import { Product, Category, Blog, Coupon, HeroBanner } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat1',
    name: 'Skin Elixirs',
    slug: 'skincare',
    description: 'Ancient youth-preserving formulas enriched with saffron, sandalwood, and organic botanicals.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'cat2',
    name: 'Kesh Therapy',
    slug: 'haircare',
    description: 'Bhringraj, amla, and organic oils cooked over slow flames to revitalize and strengthen hair.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'cat3',
    name: 'Daily Wellness',
    slug: 'wellness',
    description: 'Adaptogens, rasayanas, and single herbs to balance your doshas and build ojas (vital life force).',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'Kumkumadi Royal Glow Facial Elixir',
    tagline: 'Saffron & Sandalwood Youth Serum',
    description: 'A legendary oil-based serum prescribed in Ashtanga Hridaya. Infused with 26 Kashmiri saffron filaments, red sandalwood, and wild laksha. It deeply brightens dull skin, reduces pigmentation, and smoothes fine lines, restoring the natural golden glow of youth.',
    price: 45,
    originalPrice: 60,
    rating: 4.9,
    reviewsCount: 148,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    category: 'skincare',
    stock: 24,
    featured: true,
    bestSeller: true,
    benefits: [
      'De-pigmentation and dark circle reduction',
      'Intense brightening of dull, tired skin',
      'Smoothes texture and fine lines overnight',
      'Improves dermal elasticity and firmness'
    ],
    ingredients: [
      'Kashmiri Kesar (Saffron) - Gold rating skin brightener',
      'Rakta Chandan (Red Sandalwood) - Highly soothing, purges heat',
      'Yashtimadhu (Licorice extract) - Evens skin tone naturally',
      'Goat Milk infusion - Hydrates deeply with natural vitamins'
    ],
    usage: 'After cleansing your face at night, take 3-4 drops on your palm. Gently pump with fingertips over your face and neck. Massage in light, upward strokes until fully absorbed. Leave overnight.',
    reviews: [
      {
        id: 'rev1-1',
        author: 'Nisha Sharma',
        rating: 5,
        text: 'This is pure liquid gold! In just two weeks, the dark patches around my chin and under my eyes are visibly lighter. The fragrance of sandalwood and saffron is therapeutic.',
        date: '2026-05-18',
        verified: true
      },
      {
        id: 'rev1-2',
        author: 'Arjun Mehta',
        rating: 5,
        text: 'Instantly elevates skincare. Highly premium feeling. My dry skin absolutely drinks this up!',
        date: '2026-05-10',
        verified: true
      }
    ]
  },
  {
    id: 'prod2',
    name: 'Amrit Kesh Hair Vitality Booster Oil',
    tagline: 'Bhringraj & Brahmi Hair Growth Therapy',
    description: 'A powerful, traditional Ayurvedic recipe simmered slowly over 12 hours with fresh Bhringraj leaves, Amalaki, and cooling Brahmi. This potent oil balances the Pitta dosha at the hair roots, halts seasonal fall, prevents premature graying, and triggers voluminous growth.',
    price: 28,
    originalPrice: 35,
    rating: 4.8,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600',
    category: 'haircare',
    stock: 45,
    featured: true,
    bestSeller: true,
    benefits: [
      'Prevents hair thinning and heavy seasonal fall',
      'Balances scalp pH and eliminates dry dandruff',
      'Delays premature graying by strengthening melanin production',
      'Induces peaceful sleep when massaged at night'
    ],
    ingredients: [
      'Bhringraj (King of Hair Herbs) - Revitalizes hair follicles',
      'Brahmi - Calms brain cells, cools scalp Pitta',
      'Amla (Gooseberry) - High Vit-C to boost Keratin production',
      'Sesame & Coconut Base - Extracted fresh and cold-pressed'
    ],
    usage: 'Warm the oil slightly. Partition your hair and apply liberally to the scalp and lengths. Massage with gentle circles for 10-15 minutes. Leave on for at least 2 hours or overnight. Wash with a mild Ayurvedic natural shampoo.',
    reviews: [
      {
        id: 'rev2-1',
        author: 'Priya Iyer',
        rating: 5,
        text: 'My hair fall has completely stopped! It used to fall out in bunches, but now it feels strong and has a gorgeous organic shine. Worth every penny.',
        date: '2026-05-22',
        verified: true
      }
    ]
  },
  {
    id: 'prod3',
    name: 'Ojas Shodhan Advanced Chyawanprash',
    tagline: 'Swarna Bhasma, Saffron & Wild Amla',
    description: 'An elite strength restorative jam containing pure Swarna Bhasma (Gold Dust), Silver flakes, Kesari Saffron, and 45 adaptogenic green pharmacy herbs. Made strictly according to ancient texts, it fires up Agni (metabolic fire), builds Ojas (absolute immunity), and fights seasonal viruses.',
    price: 39,
    originalPrice: 48,
    rating: 4.9,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
    category: 'wellness',
    stock: 12,
    featured: true,
    bestSeller: false,
    benefits: [
      'Accelerates immune cell defense and natural immunity',
      'Enhances breathing capacity and clears respiratory pathways',
      'Restores raw physical energy, stamina, and intellectual focus',
      'Acts as a master cellular rejuvenator (Rasayana)'
    ],
    ingredients: [
      'Swarna Bhasma (Pure Gold) - Bio-available cell rejuvenator',
      'Wild-Harvested Amalaki - Cold-pulped rich natural vitamin source',
      'Kashmiri Saffron - Uplifts mood, heart-health tonic',
      'Organic Forest Honey & A2 Ghee - Vehicles for perfect assimilation'
    ],
    usage: 'Take 1 level teaspoon twice daily. Adults: Have it directly or dissolve in warm whole milk/almond milk. Children above 4: Take half teaspoon. Best consumed on an empty stomach in the morning.',
    reviews: [
      {
        id: 'rev3-1',
        author: 'Rajesh Pate',
        rating: 5,
        text: 'Extraordinary quality. You can see the organic fiber and taste the authentic kick of strong spices like pippali, unlike commercial sweet syrup. Builds great energy.',
        date: '2026-05-15',
        verified: true
      }
    ]
  },
  {
    id: 'prod4',
    name: 'Tejas Glow Neem, Haldi & Saffron Cleanser',
    tagline: 'Gentle Purifying Face Wash for Balanced Skin',
    description: 'A sulfate-free, non-drying foaming cleanser featuring therapeutic neem extract, healing organic turmeric (Haldi), and skin-polishing Kashmiri saffron. It purges excess sebum, neutralizes acne-causing bacteria, and restores a calm, clear complexion without stripping essential hydration.',
    price: 18,
    originalPrice: 22,
    rating: 4.7,
    reviewsCount: 74,
    image: 'https://images.unsplash.com/photo-1607006342411-1013a80b3db6?auto=format&fit=crop&q=80&w=600',
    category: 'skincare',
    stock: 50,
    featured: false,
    bestSeller: true,
    benefits: [
      'Fights active acne outbreaks and clears congestion',
      'Gentle, soap-free formula does not deplete moisture barrier',
      'Fades dull spots and leaves a cooling post-wash glow',
      'Soothes skin redness and Pitta irritation'
    ],
    ingredients: [
      'Organic Neem Leaf Extract - Deep antibacterial cleansing',
      'Hariyal Turmeric (Haldi) - Reduces scars, anti-inflammatory',
      'Aloe Vera Juice - Cools, hydrates, and retains moisture',
      'Vetiver Root Extract - Calms and tightens skin cells'
    ],
    usage: 'Wet your face and neck. Take a small pump of the cleanser and massage gently in circular, upward motions. Pay extra attention to the nose and forehead. Wash off with cool water and pat dry with a soft towel.',
    reviews: [
      {
        id: 'rev4-1',
        author: 'Sneha Vyas',
        rating: 4,
        text: 'Very mild and smells unbelievably good of pure vetiver. My hormonal acne has settled down completely.',
        date: '2026-05-12',
        verified: true
      }
    ]
  },
  {
    id: 'prod5',
    name: 'Shanti Pure Ashwagandha Max Drops',
    tagline: 'KSM-66 Adaptogen Extract for Stress & Sleep',
    description: 'A super-concentrated, hydro-extracted tincture representing the pure essence of wild-harvested stress-busting Ashwagandha root. Boosted with calming Shankhpushpi, standard Ashwagandha drops assist in cortisol balance, deeply soothing mind fatigue, and facilitating deep REM sleep.',
    price: 22,
    originalPrice: 28,
    rating: 4.8,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600',
    category: 'wellness',
    stock: 30,
    featured: false,
    bestSeller: false,
    benefits: [
      'Drastically lowers stress levels and excessive modern anxiety',
      'Fosters easy transition to natural restful sleep cycles',
      'Protects neural system from chronic fatigue oxidation',
      'Supports healthy testosterone levels and active physical recovery'
    ],
    ingredients: [
      'Ashwagandha Root Extract (10:1 concentration) - Elite adaptogen',
      'Shankhpushpi Leaf - Restores neurological balance and cognitive calm',
      'Licorice Root extract - Improves absorption and sweetens naturally',
      'Pure Spring Ionized Water & Vegetable Glycerin Base'
    ],
    usage: 'Mix 10-15 drops in a small cup of lukewarm water or warm milk. Drink 30 minutes before bedtime or during high-pressure daytime events. Hold under the tongue for 20 seconds before swallowing for faster absorption.',
    reviews: [
      {
        id: 'rev5-1',
        author: 'David Wright',
        rating: 5,
        text: 'A game changer. My daily restless sleep is gone. I wake up incredibly refreshed and energized.',
        date: '2026-05-24',
        verified: true
      }
    ]
  },
  {
    id: 'prod6',
    name: 'Triphala Lax Digestive Reset Caps',
    tagline: 'Pure Amla, Baheda & Haritaki Detox',
    description: 'The cornerstone of Ayurvedic gut healing, Triphala translates to "Three Fruits". Our premium capsules contain organically farmed Amalki, Bibhitaki, and Haritaki. Working in synergy, they tone the digestive colon wall, cleanse toxins (Ama), remove gut congestion, and optimize absorption.',
    price: 19,
    originalPrice: 25,
    rating: 4.7,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600',
    category: 'wellness',
    stock: 8,
    featured: false,
    bestSeller: false,
    benefits: [
      'Regulates chronic sluggish bowels and natural evacuation',
      'Flushes out deep systemic metabolic waste (Ama)',
      'Rich antioxidant vitamin profiles nourish ocular tissues',
      'Assists in healthy weight management by boosting metabolic tone'
    ],
    ingredients: [
      'Amla (Emblica officinalis) - balances Pitta, rich in Vitamin C',
      'Haritaki (Terminalia chebula) - balances Vata, clears colon blockages',
      'Bibhitaki (Terminalia bellirica) - balances Kapha, clears respiratory and gut mucus'
    ],
    usage: 'Take 2 capsules with warm water right before bedtime, or 1 capsule before healthy meals. Do not drink dairy milk immediately after. Stay hydrated for optimal cleansing.',
    reviews: [
      {
        id: 'rev6-1',
        author: 'Meenakshi K.',
        rating: 5,
        text: 'I struggled with bloating for 5 years. Triphala caps have cured it entirely. Feels so light-weight and clear.',
        date: '2026-05-20',
        verified: true
      }
    ]
  }
];

export const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog1',
    title: 'Understanding the Tri Dosha: A Beginners Guide to Ayurvedic Types',
    summary: 'Discover Vata, Pitta, and Kapha—the three cellular forces driving your physical structure. Learn how to pinpoint your constitution and customize your wellness.',
    content: `In ancient Ayurvedic medicine, we understand that everything in the cosmos is made of five basic elements: Space, Air, Fire, Water, and Earth. Within the human body, these element energies combine into three distinct biological humors, known as the **Doshas**: **Vata** (Air + Space), **Pitta** (Fire + Water), and **Kapha** (Earth + Water).

### The Three Pillars of Ayurvedic Balance

#### 1. Vata (The Force of Motion)
Vata manifests as dry, light, cold, rough, and mobile. If Vata is your dominant dosha, you are likely creative, quick-witted, and active, but prone to dry skin, anxiety, gas, and erratic sleep when out of balance.
* **Balanced**: Artistic vitality, flexible joints, regular digestion.
* **Imbalance Remedy**: Warm cooked oils, grounding herbs like Ashwagandha, and hot herbal teas.

#### 2. Pitta (The Force of Transformation)
Pitta represents hot, piercing, sharp, and highly active attributes. Pitta-dominant types are usually charismatic, intensely analytical, and natural leaders. However, stress triggers heartburn, skin rashes, angry outbreaks, and early hair loss.
* **Balanced**: Outstanding analytical intelligence, warm digestive fire (Agni), glowing complexion.
* **Imbalance Remedy**: Fresh cooling herbs (Neem, Mint, Aloe Vera), sweet oils, and avoiding direct midday sun.

#### 3. Kapha (The Force of Structure & Lubrication)
Kapha introduces thick, heavy, stable, oily, and sweet qualities. Kapha-dominant constitutions are calm, loving, incredibly patient, and possess amazing immune strength. When clogged, they experience lethargy, weight gain, congestion, and stubborn complacency.
* **Balanced**: Dense core strength, lubricating fluid joints, boundless stamina.
* **Imbalance Remedy**: Bitter and pungent spices (Ginger, Pippali, Triphala), energetic physical routines, and steam baths.

### Pinpointing Your Dominant Dosha

Most individuals are a combination of two doshas (e.g., Vata-Pitta or Pitta-Kapha). Living in synergy with your current biological type avoids systemic stress, strengthens the immunity defense grid, and promotes radiant wellness. Try our AI Ayurvedic Companion (AyuBot) on our home page to run a personalized analysis today!`,
    category: 'Ayurvedic Lifestyle',
    date: '2026-05-22',
    author: 'Dr. Vaidya Ramanathan (BAMS)',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400',
    readTime: '5 min read'
  },
  {
    id: 'blog2',
    title: 'Kumkumadi Oil: The Ancient Beauty Secrets of Kashmiri Saffron',
    summary: 'An explore into the Ashtanga Hridaya prescription. Why Kashmiri Saffron in oil extract is hailed as the ultimate "liquid gold" for facial glow.',
    content: `Dating back thousands of years to the classical Ayurvedic compendium **Ashtanga Hridaya**, the recipe of **Kumkumadi Tailam** is revered as the ultimate *Kanti Vardhaka* (complexion enhancer) serum.

Traditional Kumkumadi oil is cooked slowly with goats milk, Kashmiri saffron filaments, sandalwood dust, floral extracts, and deep detox root bark powders. It is designed to emulate the natural radiant heat glow of pure Kashmiri hills.

### Saffron’s Science-Backed Skin Rejuvenation

Unlike modern chemical skin whitening creams that strip the dermal biome, Saffron restores cellular repair peacefully:
1. **Melastatin Inhibitor**: Natural saffron phytochemicals reduce melanin synthesis, calming pigmentation spots and dark circles under eyes from stress.
2. **Deep-Dermal Hydration**: Goats milk acts as a rich bio-available carrier, feeding nourishing lactic acid, vitamins A, D, and E directly into skin cells.
3. **Oxygenation**: Red Sandalwood draws excess inflammatory Pitta heat away from dermal capillaries, smoothing out fine wrinkles and swelling.

### How to Correctly Use Ayurvedic Face Oils
To experience 100% of Kashmiri saffron’s organic potency, always apply at night:
* Wash the face with a soap-free, mild Ayurvedic wash.
* Mist with pure rosewater or vetiver distillate.
* While the skin is warm and damp, massage 3-4 drops using upward circular motions. 

Massage facilitates lymphatic drainage and moves active bio-ingredients into deeper skin layers peacefully.`,
    category: 'Organic Skincare',
    date: '2026-05-15',
    author: 'Vaidya Arundhati Roy',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400',
    readTime: '4 min read'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'AYU20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 30,
    active: true
  },
  {
    id: 'c2',
    code: 'OJAS10',
    discountType: 'fixed',
    discountValue: 10,
    minPurchase: 50,
    active: true
  }
];

export const INITIAL_HERO: HeroBanner = {
  id: 'h1',
  title: 'Experience Pure Ayurvedic Alchemy',
  subtitle: '100% Organic formulas cooked over slow flame using Kashmiri Saffron, Bhringraj and Swarna Bhasma to bring you back into absolute balance.',
  bgImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
  ctaText: 'Shop the Ayurvedic Elixirs',
  link: 'shop',
  showTraditionalWisdom: true
};
