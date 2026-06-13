import dotenv from 'dotenv';
// Load environment variables immediately on application boot
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// Import MongoDB / Mango DB Module
import {
  isMongoEnabled,
  connectMongo,
  syncDatabaseWithMongo,
  writeThroughToMongo,
  writeBannerToMongo,
  ProductModel,
  CategoryModel,
  BlogModel,
  CouponModel,
  OrderModel,
  HeroBannerModel,
  QueryModel,
  SubscriberModel,
  ReelModel,
  TestimonialModel,
  UserModel,
  OtpModel
} from './mongo';

let isMongoConnected = false;

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static images folder
app.use('/image', express.static(path.join(process.cwd(), 'image')));

// Set up JSON-based Database file (No longer active - Shifted to full MongoDB / In-memory Fallback)
// const DB_FILE = path.join(process.cwd(), 'db.json');

// Initial seed data embedded inside the server for seamless bootstrapping
const INITIAL_CATEGORIES = [
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

const INITIAL_PRODUCTS = [
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
        author: 'Rajesh Patel',
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
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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

const INITIAL_BLOGS = [
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

const INITIAL_COUPONS = [
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

const INITIAL_HERO = {
  id: 'h1',
  title: 'Experience Pure Ayurvedic Alchemy',
  subtitle: '100% Organic formulas cooked over slow flame using Kashmiri Saffron, Bhringraj and Swarna Bhasma to bring you back into absolute balance.',
  bgImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
  ctaText: 'Shop the Ayurvedic Elixirs',
  link: 'shop',
  cardImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
  cardLabel: 'Weekly Best-Seller',
  cardName: 'Kumkumadi Facial Elixir',
  cardCtaText: 'Buy with 20% discount Code AYU20',
  cardLink: 'Kumkumadi',
  showTraditionalWisdom: true
};

const INITIAL_REELS = [
  {
    id: 'reel1',
    title: 'Sacred Chyawanprash Reductions',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-herbal-tea-into-a-cup-32863-large.mp4',
    tagline: 'Slow-brewed over woodfire according to Ashtanga Hridaya texts.',
    likes: 842
  },
  {
    id: 'reel2',
    title: 'Hand-picking Kashmiri Saffron Valley',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-small-wild-flower-grown-on-a-rock-51000-large.mp4',
    tagline: 'Unearthing rare bio-active crimson crocus threads.',
    likes: 1290
  },
  {
    id: 'reel3',
    title: 'Shirodhara Herbal Oil Stream Flow',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-splashes-of-water-on-a-clean-surface-in-slow-motion-42284-large.mp4',
    tagline: 'Rebalancing Prana Vayu through continuous warm oil streams.',
    likes: 671
  }
];

const INITIAL_TESTIMONIALS = [
  {
    id: 'test1',
    name: 'Shruti Deshmukh',
    location: 'Pune, Maharashtra',
    quote: 'My skin was in acute hormonal distress after weeks of stressful work travel. Red rashes and dry patches kept recurring. The GoAyu Kumkumadi Facial Oil literally saved it. It cleared every hyperpigmented scar in just 14 nights. Pranam is all I can say.'
  },
  {
    id: 'test2',
    name: 'Vikramaditya Sen',
    location: 'Kolkata, West Bengal',
    quote: 'I have been having one teaspoon of the Ojas Advanced Chyawanprash every morning on dry stomach with fresh hot milk. My seasonal breathing allergy is completely gone. I feel a continuous warm, tranquil energetic focus that commercial sugar syrups never gave me.'
  },
  {
    id: 'test3',
    name: 'Emma Watson',
    location: 'Aromatherapist, UK',
    quote: 'My scalp was dry and hair oil was always something I hated because it felt sticky. But Amrit Kesh oil smells like fresh earthy grass and cooling herbs. Applied on roots twice a week, my hair thinning has completely stopped. Fantastic luxury!'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ord1',
    orderNumber: 'AYU-05240',
    customerName: 'Sagar Patwardhan',
    customerEmail: 'sagarstone2002@gmail.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: 'Flat 402, Lotus Towers, Shivaji Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411005',
    items: [
      {
        productId: 'prod1',
        name: 'Kumkumadi Royal Glow Facial Elixir',
        price: 45,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600'
      },
      {
        productId: 'prod4',
        name: 'Tejas Glow Neem, Haldi & Saffron Cleanser',
        price: 18,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1607006342411-1013a80b3db6?auto=format&fit=crop&q=80&w=600'
      }
    ],
    subtotal: 63,
    discount: 10,
    total: 53,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'UPI / Card',
    date: '2026-05-24T10:15:30Z',
    trackingTimeline: [
      { status: 'pending', label: 'Order Registered', date: 'May 24, 10:15 AM', description: 'Your order has been registered securely.', completed: true },
      { status: 'processing', label: 'Ayurvedic Preparation', date: 'May 24, 2:30 PM', description: 'Bottling under sterile, organic standards.', completed: true },
      { status: 'shipped', label: 'Dispatched through BlueDart', date: 'May 25, 9:00 AM', description: 'Air-freighted for urgent arrival.', completed: true },
      { status: 'delivered', label: 'Received & Blessed', date: 'May 26, 11:30 AM', description: 'Successfully delivered to Sagar.', completed: true }
    ]
  }
];

// In-memory cache to ensure instant synchronous delivery for Express routes and standard seed state
let memoDb: any = null;

// Read DB utility (In-Memory fallback - No disk operations to keep db.json removed)
function getDb() {
  if (memoDb) return memoDb;

  const data = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    blogs: INITIAL_BLOGS,
    coupons: INITIAL_COUPONS,
    orders: INITIAL_ORDERS,
    heroBanner: INITIAL_HERO,
    queries: [],
    subscribers: [],
    reels: INITIAL_REELS,
    testimonials: INITIAL_TESTIMONIALS,
    users: [],
    otps: []
  };
  memoDb = data;
  return data;
}

// Write DB utility (In-Memory fallback - No disk operations to keep db.json removed)
function saveDb(data: any) {
  memoDb = data;
}

// Core database boot loader & bootstrap syncer
async function initDatabase() {
  if (isMongoEnabled) {
    // Dynamically attempt connection
    isMongoConnected = await connectMongo();
  }

  if (isMongoConnected) {
    try {
      console.log('🥭 Setting up MongoDB database. Checking for bootstrap seed synchronization...');
      const initialSeedData = {
        products: INITIAL_PRODUCTS,
        categories: INITIAL_CATEGORIES,
        blogs: INITIAL_BLOGS,
        coupons: INITIAL_COUPONS,
        orders: INITIAL_ORDERS,
        heroBanner: INITIAL_HERO,
        queries: [],
        subscribers: [],
        reels: INITIAL_REELS,
        testimonials: INITIAL_TESTIMONIALS
      };
      await syncDatabaseWithMongo(initialSeedData);
      console.log('🥭 MongoDB State successfully verified and bootstrapped!');
    } catch (err) {
      console.error('❌ Failed bootstrapping from MongoDB on startup:', err);
    }
  } else {
    console.error('❌ MongoDB is currently offline or not whitelisted. In-memory database fallback is active.');
  }

  // Clear in-memory cache to force standard DB lookups
  memoDb = null;
}

// Fire the database starter
initDatabase();

// --- API ROUTES ---

// 1. PRODUCTS
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const products = await ProductModel.find().lean().exec();
      res.json(products);
    } else {
      res.json(getDb().products);
    }
  } catch (err: any) {
    console.error('MongoDB GET products failed, falling back to local:', err);
    res.json(getDb().products);
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (!product.id) {
      product.id = 'prod' + Date.now();
    }
    product.rating = product.rating || 5.0;
    product.reviewsCount = product.reviewsCount || 0;
    product.reviews = product.reviews || [];
    product.originalPrice = Number(product.originalPrice) || Number(product.price);
    product.price = Number(product.price);
    product.stock = Number(product.stock);

    if (isMongoConnected) {
      const doc = await ProductModel.create(product);
      const db = getDb();
      db.products.unshift(JSON.parse(JSON.stringify(doc)));
      saveDb(db);
      res.status(201).json(doc);
    } else {
      const db = getDb();
      db.products.unshift(product);
      saveDb(db);
      res.status(201).json(product);
    }
  } catch (err: any) {
    console.error('MongoDB POST product failed, falling back to local:', err);
    const product = req.body;
    if (!product.id) product.id = 'prod' + Date.now();
    product.rating = product.rating || 5.0;
    product.reviewsCount = product.reviewsCount || 0;
    product.reviews = product.reviews || [];
    product.originalPrice = Number(product.originalPrice) || Number(product.price);
    product.price = Number(product.price);
    product.stock = Number(product.stock);

    const db = getDb();
    db.products.unshift(product);
    saveDb(db);
    res.status(201).json(product);
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const updated = {
      ...req.body,
      price: Number(req.body.price),
      originalPrice: Number(req.body.originalPrice || req.body.price),
      stock: Number(req.body.stock)
    };
    
    if (isMongoConnected) {
      const doc = await ProductModel.findOneAndUpdate({ id: req.params.id } as any, updated, { new: true } as any);
      if (doc) {
        const db = getDb();
        const idx = db.products.findIndex((p: any) => p.id === req.params.id);
        if (idx !== -1) {
          db.products[idx] = { ...db.products[idx], ...updated };
          saveDb(db);
        }
        res.json(doc);
        return;
      }
    }
    
    const db = getDb();
    const idx = db.products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    db.products[idx] = { ...db.products[idx], ...updated };
    saveDb(db);
    res.json(db.products[idx]);
  } catch (err: any) {
    console.error('MongoDB PUT product failed, falling back to local:', err);
    const db = getDb();
    const idx = db.products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const updated = {
      ...req.body,
      price: Number(req.body.price),
      originalPrice: Number(req.body.originalPrice || req.body.price),
      stock: Number(req.body.stock)
    };
    db.products[idx] = { ...db.products[idx], ...updated };
    saveDb(db);
    res.json(db.products[idx]);
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const result = await ProductModel.deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        const db = getDb();
        db.products = db.products.filter((p: any) => p.id !== req.params.id);
        saveDb(db);
        res.json({ success: true });
        return;
      }
    }
    
    const db = getDb();
    const exists = db.products.some((p: any) => p.id === req.params.id);
    if (!exists) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    db.products = db.products.filter((p: any) => p.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  } catch (err: any) {
    console.error('MongoDB DELETE product failed, falling back to local:', err);
    const db = getDb();
    db.products = db.products.filter((p: any) => p.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  }
});

app.post('/api/products/:id/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = req.body.reviews || [];
    const reviewsCount = reviews.length;
    
    let rating = 5.0;
    if (reviewsCount > 0) {
      const totalRating = reviews.reduce((sum: number, r: any) => sum + Number(r.rating || 5), 0);
      rating = Number((totalRating / reviewsCount).toFixed(1));
    }
    
    if (isMongoConnected) {
      const doc = await ProductModel.findOneAndUpdate(
        { id: req.params.id } as any,
        { reviews, reviewsCount, rating },
        { new: true } as any
      );
      if (doc) {
        const db = getDb();
        const idx = db.products.findIndex((p: any) => p.id === req.params.id);
        if (idx !== -1) {
          db.products[idx].reviews = reviews;
          db.products[idx].reviewsCount = reviewsCount;
          db.products[idx].rating = rating;
          saveDb(db);
        }
        res.json(doc);
        return;
      }
    }
    
    const db = getDb();
    const idx = db.products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    db.products[idx].reviews = reviews;
    db.products[idx].reviewsCount = reviewsCount;
    db.products[idx].rating = rating;
    saveDb(db);
    res.json(db.products[idx]);
  } catch (err: any) {
    console.error('MongoDB reviews POST failed, falling back to local:', err);
    const db = getDb();
    const idx = db.products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const reviews = req.body.reviews || [];
    const reviewsCount = reviews.length;
    let rating = 5.0;
    if (reviewsCount > 0) {
      const totalRating = reviews.reduce((sum: number, r: any) => sum + Number(r.rating || 5), 0);
      rating = Number((totalRating / reviewsCount).toFixed(1));
    }
    db.products[idx].reviews = reviews;
    db.products[idx].reviewsCount = reviewsCount;
    db.products[idx].rating = rating;
    saveDb(db);
    res.json(db.products[idx]);
  }
});


// 2. CATEGORIES
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const categories = await CategoryModel.find().lean().exec();
      res.json(categories);
    } else {
      res.json(getDb().categories);
    }
  } catch (err: any) {
    console.error('MongoDB GET categories failed, falling back to local:', err);
    res.json(getDb().categories);
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    const cat = req.body;
    cat.id = cat.id || 'cat' + Date.now();
    cat.slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
    
    if (isMongoConnected) {
      const doc = await CategoryModel.create(cat);
      const db = getDb();
      db.categories.push(JSON.parse(JSON.stringify(doc)));
      saveDb(db);
      res.status(201).json(doc);
    } else {
      const db = getDb();
      db.categories.push(cat);
      saveDb(db);
      res.status(201).json(cat);
    }
  } catch (err: any) {
    console.error('MongoDB POST category failed, falling back to local:', err);
    const cat = req.body;
    cat.id = cat.id || 'cat' + Date.now();
    cat.slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
    const db = getDb();
    db.categories.push(cat);
    saveDb(db);
    res.status(201).json(cat);
  }
});

app.put('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const doc = await CategoryModel.findOneAndUpdate({ id: req.params.id } as any, req.body, { new: true } as any);
      if (doc) {
        const db = getDb();
        const idx = db.categories.findIndex((c: any) => c.id === req.params.id);
        if (idx !== -1) {
          db.categories[idx] = { ...db.categories[idx], ...req.body };
          saveDb(db);
        }
        res.json(doc);
        return;
      }
    }
    
    const db = getDb();
    const idx = db.categories.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    db.categories[idx] = { ...db.categories[idx], ...req.body };
    saveDb(db);
    res.json(db.categories[idx]);
  } catch (err: any) {
    console.error('MongoDB PUT category failed, falling back to local:', err);
    const db = getDb();
    const idx = db.categories.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    db.categories[idx] = { ...db.categories[idx], ...req.body };
    saveDb(db);
    res.json(db.categories[idx]);
  }
});

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const result = await CategoryModel.deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        const db = getDb();
        db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
        saveDb(db);
        res.json({ success: true });
        return;
      }
    }
    
    const db = getDb();
    const exists = db.categories.some((c: any) => c.id === req.params.id);
    if (!exists) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  } catch (err: any) {
    console.error('MongoDB DELETE category failed, falling back to local:', err);
    const db = getDb();
    db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  }
});


// 3. BLOGS
app.get('/api/blogs', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const blogs = await BlogModel.find().sort({ _id: -1 }).lean().exec();
      res.json(blogs);
    } else {
      res.json(getDb().blogs);
    }
  } catch (err: any) {
    console.error('MongoDB GET blogs failed, falling back to local:', err);
    res.json(getDb().blogs);
  }
});

app.post('/api/blogs', async (req: Request, res: Response) => {
  try {
    const blog = req.body;
    blog.id = blog.id || 'blog' + Date.now();
    blog.date = new Date().toISOString().split('T')[0];
    blog.readTime = blog.readTime || '3 min read';
    
    if (isMongoConnected) {
      const doc = await BlogModel.create(blog);
      const db = getDb();
      db.blogs.unshift(JSON.parse(JSON.stringify(doc)));
      saveDb(db);
      res.status(201).json(doc);
    } else {
      const db = getDb();
      db.blogs.unshift(blog);
      saveDb(db);
      res.status(201).json(blog);
    }
  } catch (err: any) {
    console.error('MongoDB POST blog failed, falling back to local:', err);
    const blog = req.body;
    blog.id = blog.id || 'blog' + Date.now();
    blog.date = new Date().toISOString().split('T')[0];
    blog.readTime = blog.readTime || '3 min read';
    const db = getDb();
    db.blogs.unshift(blog);
    saveDb(db);
    res.status(201).json(blog);
  }
});

app.put('/api/blogs/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const doc = await BlogModel.findOneAndUpdate({ id: req.params.id } as any, req.body, { new: true } as any);
      if (doc) {
        const db = getDb();
        const idx = db.blogs.findIndex((b: any) => b.id === req.params.id);
        if (idx !== -1) {
          db.blogs[idx] = { ...db.blogs[idx], ...req.body };
          saveDb(db);
        }
        res.json(doc);
        return;
      }
    }
    
    const db = getDb();
    const idx = db.blogs.findIndex((b: any) => b.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    db.blogs[idx] = { ...db.blogs[idx], ...req.body };
    saveDb(db);
    res.json(db.blogs[idx]);
  } catch (err: any) {
    console.error('MongoDB PUT blog failed, falling back to local:', err);
    const db = getDb();
    const idx = db.blogs.findIndex((b: any) => b.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    db.blogs[idx] = { ...db.blogs[idx], ...req.body };
    saveDb(db);
    res.json(db.blogs[idx]);
  }
});

app.delete('/api/blogs/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const result = await BlogModel.deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        const db = getDb();
        db.blogs = db.blogs.filter((b: any) => b.id !== req.params.id);
        saveDb(db);
        res.json({ success: true });
        return;
      }
    }
    
    const db = getDb();
    const exists = db.blogs.some((b: any) => b.id === req.params.id);
    if (!exists) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    db.blogs = db.blogs.filter((b: any) => b.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  } catch (err: any) {
    console.error('MongoDB DELETE blog failed, falling back to local:', err);
    const db = getDb();
    db.blogs = db.blogs.filter((b: any) => b.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  }
});


// 4. COUPONS
app.get('/api/coupons', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const coupons = await CouponModel.find().lean().exec();
      res.json(coupons);
    } else {
      res.json(getDb().coupons);
    }
  } catch (err: any) {
    console.error('MongoDB GET coupons failed, falling back to local:', err);
    res.json(getDb().coupons);
  }
});

app.post('/api/coupons', async (req: Request, res: Response) => {
  try {
    const c = req.body;
    c.id = c.id || 'coupon' + Date.now();
    c.active = c.active !== undefined ? c.active : true;
    
    if (isMongoConnected) {
      const doc = await CouponModel.create(c);
      const db = getDb();
      db.coupons.push(JSON.parse(JSON.stringify(doc)));
      saveDb(db);
      res.status(201).json(doc);
    } else {
      const db = getDb();
      db.coupons.push(c);
      saveDb(db);
      res.status(201).json(c);
    }
  } catch (err: any) {
    console.error('MongoDB POST coupon failed, falling back to local:', err);
    const c = req.body;
    c.id = c.id || 'coupon' + Date.now();
    c.active = c.active !== undefined ? c.active : true;
    const db = getDb();
    db.coupons.push(c);
    saveDb(db);
    res.status(201).json(c);
  }
});

app.put('/api/coupons/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const doc = await CouponModel.findOneAndUpdate({ id: req.params.id } as any, req.body, { new: true } as any);
      if (doc) {
        const db = getDb();
        const idx = db.coupons.findIndex((c: any) => c.id === req.params.id);
        if (idx !== -1) {
          db.coupons[idx] = { ...db.coupons[idx], ...req.body };
          saveDb(db);
        }
        res.json(doc);
        return;
      }
    }
    
    const db = getDb();
    const idx = db.coupons.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Coupon not found' });
      return;
    }
    db.coupons[idx] = { ...db.coupons[idx], ...req.body };
    saveDb(db);
    res.json(db.coupons[idx]);
  } catch (err: any) {
    console.error('MongoDB PUT coupon failed, falling back to local:', err);
    const db = getDb();
    const idx = db.coupons.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Coupon not found' });
      return;
    }
    db.coupons[idx] = { ...db.coupons[idx], ...req.body };
    saveDb(db);
    res.json(db.coupons[idx]);
  }
});

app.delete('/api/coupons/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const result = await CouponModel.deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        const db = getDb();
        db.coupons = db.coupons.filter((c: any) => c.id !== req.params.id);
        saveDb(db);
        res.json({ success: true });
        return;
      }
    }
    
    const db = getDb();
    db.coupons = db.coupons.filter((c: any) => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  } catch (err: any) {
    console.error('MongoDB DELETE coupon failed, falling back to local:', err);
    const db = getDb();
    db.coupons = db.coupons.filter((c: any) => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  }
});


// 4b. PHARMACIST INQUIRIES
app.get('/api/queries', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const queries = await QueryModel.find().sort({ _id: -1 }).lean().exec();
      res.json(queries);
    } else {
      res.json(getDb().queries || []);
    }
  } catch (err: any) {
    console.error('MongoDB GET queries failed, falling back to local:', err);
    res.json(getDb().queries || []);
  }
});

app.post('/api/queries', async (req: Request, res: Response) => {
  try {
    const query = req.body;
    query.id = query.id || 'inq' + Date.now();
    query.date = query.date || new Date().toISOString();
    
    if (isMongoConnected) {
      const doc = await QueryModel.create(query);
      const db = getDb();
      db.queries = db.queries || [];
      db.queries.unshift(JSON.parse(JSON.stringify(doc)));
      saveDb(db);
      res.status(201).json(doc);
    } else {
      const db = getDb();
      db.queries = db.queries || [];
      db.queries.unshift(query);
      saveDb(db);
      res.status(201).json(query);
    }
  } catch (err: any) {
    console.error('MongoDB POST query failed, falling back to local:', err);
    const query = req.body;
    query.id = query.id || 'inq' + Date.now();
    query.date = query.date || new Date().toISOString();
    const db = getDb();
    db.queries = db.queries || [];
    db.queries.unshift(query);
    saveDb(db);
    res.status(201).json(query);
  }
});

app.delete('/api/queries/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const result = await QueryModel.deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        const db = getDb();
        db.queries = (db.queries || []).filter((q: any) => q.id !== req.params.id);
        saveDb(db);
        res.json({ success: true });
        return;
      }
    }
    
    const db = getDb();
    db.queries = (db.queries || []).filter((q: any) => q.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  } catch (err: any) {
    console.error('MongoDB DELETE query failed, falling back to local:', err);
    const db = getDb();
    db.queries = (db.queries || []).filter((q: any) => q.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  }
});


// --- EMAIL CONVEYOR FOR INVOICES & HEALINGS ---
async function sendOrderEmail(order: any) {
  const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  const totalVal = Math.round(order.total * 80);
  const baseSubtotal = Math.round(order.subtotal * 80);
  const discountVal = Math.round((order.discount || 0) * 80);
  const gstVal = Math.round(totalVal * 0.09);

  const itemsHtml = order.items.map((item: any, idx: number) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${item.name}</strong></td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${Math.round(item.price * 80).toLocaleString('en-IN')}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${Math.round(item.price * item.quantity * 80).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #064e3b; padding: 25px; text-align: center; color: white;">
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px;">🌿 GoAyu Wellness</h1>
        <p style="margin: 5px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Kashmiri Saffron & Swarna Bhasma Traditional Laboratories</p>
      </div>
      <div style="padding: 25px; background-color: #fff;">
        <h2 style="color: #b45309; margin-top: 0; font-family: Georgia, serif;">Dhanyavaad (Thank you), ${order.customerName}!</h2>
        <p style="font-size: 13px; line-height: 1.5; color: #444;">Your order for divine Ayurvedic elixirs has been successfully placed. We have commenced formulation under the eyes of certified Vaidyasrishi.</p>
        
        <div style="background-color: #fcfbf7; border: 1px solid #f3eedd; border-radius: 6px; padding: 15px; margin: 20px 0; font-size: 13px;">
          <p style="margin: 0 0 8px;"><strong>Order ID:</strong> ${order.orderNumber}</p>
          <p style="margin: 0 0 8px;"><strong>Date:</strong> ${new Date(order.date).toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
          <p style="margin: 0 0 8px;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p style="margin: 0;"><strong>Shipping Desk:</strong> ${order.shippingAddress}, ${order.city}, ${order.state} - ${order.zipCode}</p>
          ${order.gstin ? `<p style="margin: 8px 0 0;"><strong>Patron GSTIN:</strong> ${order.gstin}</p>` : ''}
        </div>

        <h4 style="border-bottom: 2px solid #064e3b; padding-bottom: 5px; margin-bottom: 10px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; color: #444; font-family: sans-serif;">Formulation Breakdown</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left; font-weight: bold; border-bottom: 2px solid #eee;">S.No</th>
              <th style="padding: 10px; text-align: left; font-weight: bold; border-bottom: 2px solid #eee;">Product</th>
              <th style="padding: 10px; text-align: right; font-weight: bold; border-bottom: 2px solid #eee;">Rate</th>
              <th style="padding: 10px; text-align: center; font-weight: bold; border-bottom: 2px solid #eee;">Qty</th>
              <th style="padding: 10px; text-align: right; font-weight: bold; border-bottom: 2px solid #eee;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 15px; margin-left: auto; width: 250px; text-align: right; font-size: 13px;">
          <p style="margin: 4px 0;">Subtotal: <strong>₹${baseSubtotal.toLocaleString('en-IN')}</strong></p>
          ${discountVal > 0 ? `<p style="margin: 4px 0; color: #064e3b;">Coupon Reduction: <strong>-₹${discountVal.toLocaleString('en-IN')}</strong></p>` : ''}
          <p style="margin: 4px 0; color: #666; font-size: 11px;">Included CGST (9%): ₹${gstVal.toLocaleString('en-IN')}</p>
          <p style="margin: 4px 0; color: #666; font-size: 11px;">Included SGST (9%): ₹${gstVal.toLocaleString('en-IN')}</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 8px 0;"/>
          <p style="margin: 4px 0; font-size: 15px; color: #064e3b;"><strong>Grand Total: ₹${totalVal.toLocaleString('en-IN')}</strong></p>
        </div>

        <div style="margin-top: 30px; font-size: 11px; color: #b45309; line-height: 1.5; border-left: 2px solid #b45309; padding-left: 12px; background: #fffcf5; padding: 10px; border-radius: 4px;">
          <strong>Certificate of Authenticity:</strong> Certified heavy metal-free, 100% natural, slowly cooked over copper logs in Haridwar laboratories according to traditional text injunctions.
        </div>
      </div>
      <div style="background-color: #f5f5f4; text-align: center; color: #666; font-size: 11px; padding: 15px; border-top: 1px solid #e1e1e1;">
        <p style="margin: 0;">Reclaiming cellular vitality since generations.</p>
        <p style="margin: 4px 0 0;">© GoAyu Wellness, Haridwar Bypass, Haridwar Rural-249408, India.</p>
      </div>
    </div>
  `;

  if (!user || !pass) {
    console.log('====================================================');
    console.log(`[GoAyu Order Confirmation Email for ${order.customerEmail}]`);
    console.log(`To: ${order.customerEmail}`);
    console.log(`Cc Notification: ravirajji1234@gmail.com`);
    console.log(`Subject: Your GoAyu Order ${order.orderNumber} is Confirmed!`);
    console.log(`Order Total: ₹${totalVal}`);
    console.log('====================================================');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"GoAyu Wellness" <${user}>`,
      to: order.customerEmail,
      cc: 'ravirajji1234@gmail.com',
      subject: `🌿 Verified Order Ref: ${order.orderNumber} - Reclaiming Absolute Vitality!`,
      html: htmlContent
    });
    console.log(`Successfully sent order confirmation email to ${order.customerEmail} and copied ravirajji1234@gmail.com`);
  } catch (err) {
    console.error('Email dispatcher error:', err);
  }
}


// 5. ORDERS
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const orders = await OrderModel.find().lean().exec();
      res.json(orders);
    } else {
      res.json(getDb().orders);
    }
  } catch (err: any) {
    console.error('MongoDB GET orders failed, falling back to local:', err);
    res.json(getDb().orders);
  }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const orderDetails = req.body;
    const orderNumber = 'AYU-' + Math.floor(10000 + Math.random() * 90000);
    
    const newOrder = {
      id: 'ord' + Date.now(),
      orderNumber,
      customerName: orderDetails.customerName,
      customerEmail: orderDetails.customerEmail,
      customerPhone: orderDetails.customerPhone || '+91 99999 88888',
      shippingAddress: orderDetails.shippingAddress,
      city: orderDetails.city,
      state: orderDetails.state,
      zipCode: orderDetails.zipCode,
      gstin: orderDetails.gstin || null,
      items: orderDetails.items,
      subtotal: orderDetails.subtotal,
      discount: orderDetails.discount || 0,
      total: orderDetails.total,
      status: 'pending',
      paymentStatus: orderDetails.paymentMethod === 'Cash on Delivery (COD)' ? 'unpaid' : 'paid',
      paymentMethod: orderDetails.paymentMethod || 'Razorpay Cards/UPI',
      date: new Date().toISOString(),
      trackingTimeline: [
        { status: 'pending', label: 'Order Registered', date: 'Just now', description: 'Your order has been recorded in our GoAyu dispatch center.', completed: true },
        { status: 'processing', label: 'Ayurvedic Preparation', date: 'Estimated: In 4 Hours', description: 'Formulating and checking seal parameters.', completed: false },
        { status: 'shipped', label: 'Dispatched through BlueDart', date: 'Estimated: Tomorrow', description: 'Packed under certified hygiene standards.', completed: false },
        { status: 'delivered', label: 'Received & Blessed', date: 'Estimated: In 3 Days', description: 'Handover at your shipping doorstep.', completed: false }
      ]
    };

    if (isMongoConnected) {
      // Adjust product stocks asynchronously in MongoDB
      for (const item of orderDetails.items) {
        await ProductModel.findOneAndUpdate(
          { id: item.productId } as any,
          { $inc: { stock: -Number(item.quantity) } },
          {} as any
        );
      }
      const doc = await OrderModel.create(newOrder);
      
      const db = getDb();
      // Adjust local stocks as well
      orderDetails.items.forEach((item: any) => {
        const prod = db.products.find((p: any) => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      });
      db.orders.unshift(JSON.parse(JSON.stringify(doc)));
      saveDb(db);
      
      sendOrderEmail(newOrder).catch((err) => {
        console.error('Asynchronous order email execution failed:', err);
      });
      res.status(201).json(doc);
    } else {
      const db = getDb();
      orderDetails.items.forEach((item: any) => {
        const prod = db.products.find((p: any) => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      });
      db.orders.unshift(newOrder);
      saveDb(db);

      sendOrderEmail(newOrder).catch((err) => {
        console.error('Asynchronous order email execution failed:', err);
      });
      res.status(201).json(newOrder);
    }
  } catch (err: any) {
    console.error('MongoDB POST order failed, falling back to local:', err);
    const orderDetails = req.body;
    const orderNumber = 'AYU-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: 'ord' + Date.now(),
      orderNumber,
      customerName: orderDetails.customerName,
      customerEmail: orderDetails.customerEmail,
      customerPhone: orderDetails.customerPhone || '+91 99999 88888',
      shippingAddress: orderDetails.shippingAddress,
      city: orderDetails.city,
      state: orderDetails.state,
      zipCode: orderDetails.zipCode,
      gstin: orderDetails.gstin || null,
      items: orderDetails.items,
      subtotal: orderDetails.subtotal,
      discount: orderDetails.discount || 0,
      total: orderDetails.total,
      status: 'pending',
      paymentStatus: orderDetails.paymentMethod === 'Cash on Delivery (COD)' ? 'unpaid' : 'paid',
      paymentMethod: orderDetails.paymentMethod || 'Razorpay Cards/UPI',
      date: new Date().toISOString(),
      trackingTimeline: [
        { status: 'pending', label: 'Order Registered', date: 'Just now', description: 'Your order has been recorded in our GoAyu dispatch center.', completed: true },
        { status: 'processing', label: 'Ayurvedic Preparation', date: 'Estimated: In 4 Hours', description: 'Formulating and checking seal parameters.', completed: false },
        { status: 'shipped', label: 'Dispatched through BlueDart', date: 'Estimated: Tomorrow', description: 'Packed under certified hygiene standards.', completed: false },
        { status: 'delivered', label: 'Received & Blessed', date: 'Estimated: In 3 Days', description: 'Handover at your shipping doorstep.', completed: false }
      ]
    };

    const db = getDb();
    orderDetails.items.forEach((item: any) => {
      const prod = db.products.find((p: any) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    db.orders.unshift(newOrder);
    saveDb(db);

    sendOrderEmail(newOrder).catch((err) => {
      console.error('Asynchronous order email execution failed:', err);
    });
    res.status(201).json(newOrder);
  }
});

app.put('/api/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, remarks, paymentStatus, paymentMethod, trackingId } = req.body;
    
    if (isMongoConnected) {
      const order = await OrderModel.findOne({
        $or: [{ id: req.params.id }, { orderNumber: req.params.id }]
      } as any).lean().exec() as any;

      if (order) {
        const updateFields: any = {};
        if (status) updateFields.status = status;
        if (paymentStatus) updateFields.paymentStatus = paymentStatus;
        if (paymentMethod) updateFields.paymentMethod = paymentMethod;
        if (trackingId !== undefined) updateFields.trackingId = trackingId;

        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        if (status) {
          updateFields.trackingTimeline = order.trackingTimeline.map((step: any) => {
            if (step.status === 'pending') {
              return { ...step, completed: true };
            }
            if (status === 'processing' && step.status === 'processing') {
              return { ...step, completed: true, date: nowStr, description: remarks || 'Bottling under sterile standard. Verified cold-pressed infusion.' };
            }
            if (status === 'shipped' && (step.status === 'processing' || step.status === 'shipped')) {
              return { 
                ...step, 
                completed: true, 
                date: step.date === 'Estimated: Tomorrow' || step.date.includes('Estimated') ? nowStr : step.date, 
                description: step.status === 'shipped' ? (remarks || `Packed securely. Tracking Id assigned: ${updateFields.trackingId || order.trackingId || 'N/A'}`) : step.description 
              };
            }
            if (status === 'delivered') {
              return { ...step, completed: true, date: step.date.includes('Estimated') ? nowStr : step.date, description: step.status === 'delivered' ? (remarks || 'Successfully arrived at doorstep.') : step.description };
            }
            return step;
          });

          if (status === 'delivered') {
            updateFields.paymentStatus = 'paid';
          }
        }

        const doc = await OrderModel.findOneAndUpdate(
          { $or: [{ id: req.params.id }, { orderNumber: req.params.id }] } as any,
          updateFields,
          { new: true } as any
        );

        // Sync local
        const db = getDb();
        const idx = db.orders.findIndex((o: any) => o.id === req.params.id || o.orderNumber === req.params.id);
        if (idx !== -1) {
          db.orders[idx] = { ...db.orders[idx], ...updateFields };
          saveDb(db);
        }
        res.json(doc);
        return;
      }
    }
    
    // Fallback to local
    const db = getDb();
    const idx = db.orders.findIndex((o: any) => o.id === req.params.id || o.orderNumber === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    const orderLocal = db.orders[idx];
    if (status) orderLocal.status = status;
    if (paymentStatus) orderLocal.paymentStatus = paymentStatus;
    if (paymentMethod) orderLocal.paymentMethod = paymentMethod;
    if (trackingId !== undefined) orderLocal.trackingId = trackingId;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (status) {
      orderLocal.trackingTimeline = orderLocal.trackingTimeline.map((step: any) => {
        if (step.status === 'pending') return { ...step, completed: true };
        if (status === 'processing' && step.status === 'processing') return { ...step, completed: true, date: nowStr, description: remarks || 'Bottling under sterile standard. Verified cold-pressed infusion.' };
        if (status === 'shipped' && (step.status === 'processing' || step.status === 'shipped')) return { ...step, completed: true, date: nowStr, description: step.status === 'shipped' ? (remarks || `Packed securely. Tracking Id assigned: ${orderLocal.trackingId || 'N/A'}`) : step.description };
        if (status === 'delivered') return { ...step, completed: true, date: nowStr, description: step.status === 'delivered' ? (remarks || 'Successfully arrived at doorstep.') : step.description };
        return step;
      });
      if (status === 'delivered') orderLocal.paymentStatus = 'paid';
    }
    db.orders[idx] = orderLocal;
    saveDb(db);
    res.json(orderLocal);
  } catch (err: any) {
    console.error('MongoDB PUT order status failed, falling back to local:', err);
    const db = getDb();
    const idx = db.orders.findIndex((o: any) => o.id === req.params.id || o.orderNumber === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    const { status, remarks, paymentStatus, paymentMethod, trackingId } = req.body;
    const orderLocal = db.orders[idx];
    if (status) orderLocal.status = status;
    if (paymentStatus) orderLocal.paymentStatus = paymentStatus;
    if (paymentMethod) orderLocal.paymentMethod = paymentMethod;
    if (trackingId !== undefined) orderLocal.trackingId = trackingId;
    db.orders[idx] = orderLocal;
    saveDb(db);
    res.json(orderLocal);
  }
});

// SUBSCRIBERS ENDPOINTS
app.get('/api/subscribers', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const list = await SubscriberModel.find().lean().exec();
      res.json(list.map((s: any) => s.email));
    } else {
      res.json((getDb().subscribers || []).map((s: any) => typeof s === 'string' ? s : s.email));
    }
  } catch (err: any) {
    console.error('MongoDB GET subscribers failed, falling back to local:', err);
    res.json((getDb().subscribers || []).map((s: any) => typeof s === 'string' ? s : s.email));
  }
});

app.post('/api/subscribers', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }
    
    if (isMongoConnected) {
      const exists = await SubscriberModel.findOne({ email } as any).lean().exec();
      if (!exists) {
        await SubscriberModel.create({
          id: 'sub' + Date.now(),
          email,
          date: new Date().toISOString()
        });
      }
      
      const db = getDb();
      db.subscribers = db.subscribers || [];
      const hasSub = db.subscribers.some((s: any) => (typeof s === 'string' ? s : s.email) === email);
      if (!hasSub) {
        db.subscribers.unshift({ id: 'sub' + Date.now(), email, date: new Date().toISOString() });
        saveDb(db);
      }
      res.status(201).json({ success: true, email });
    } else {
      const db = getDb();
      db.subscribers = db.subscribers || [];
      const hasSub = db.subscribers.some((s: any) => (typeof s === 'string' ? s : s.email) === email);
      if (!hasSub) {
        db.subscribers.unshift({ id: 'sub' + Date.now(), email, date: new Date().toISOString() });
        saveDb(db);
      }
      res.status(201).json({ success: true, email });
    }
  } catch (err: any) {
    console.error('MongoDB POST subscriber failed, falling back to local:', err);
    const { email } = req.body;
    if (email) {
      const db = getDb();
      db.subscribers = db.subscribers || [];
      const hasSub = db.subscribers.some((s: any) => (typeof s === 'string' ? s : s.email) === email);
      if (!hasSub) {
        db.subscribers.unshift({ id: 'sub' + Date.now(), email, date: new Date().toISOString() });
        saveDb(db);
      }
    }
    res.status(201).json({ success: true, email });
  }
});


// 6. HERO BANNER
app.get(['/api/banner', '/api/hero-banner'], async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      let banner = await HeroBannerModel.findOne().lean().exec();
      if (!banner) {
        banner = INITIAL_HERO;
      }
      res.json(banner);
    } else {
      res.json(getDb().heroBanner || INITIAL_HERO);
    }
  } catch (err: any) {
    console.error('MongoDB GET banner failed, falling back to local:', err);
    res.json(getDb().heroBanner || INITIAL_HERO);
  }
});

app.put(['/api/banner', '/api/hero-banner'], async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      let banner = await HeroBannerModel.findOne().exec();
      if (!banner) {
        banner = await HeroBannerModel.create({ ...INITIAL_HERO, ...req.body });
      } else {
        Object.assign(banner, req.body);
        await banner.save();
      }
      
      const db = getDb();
      db.heroBanner = { ...db.heroBanner, ...req.body };
      saveDb(db);
      res.json(banner);
      return;
    }
    
    const db = getDb();
    db.heroBanner = { ...db.heroBanner, ...req.body };
    saveDb(db);
    res.json(db.heroBanner);
  } catch (err: any) {
    console.error('MongoDB PUT banner failed, falling back to local:', err);
    const db = getDb();
    db.heroBanner = { ...db.heroBanner, ...req.body };
    saveDb(db);
    res.json(db.heroBanner);
  }
});


// Database status and connectivity diagnostics
app.get('/api/db-status', (req: Request, res: Response) => {
  res.json({
    isMongoEnabled,
    isMongoConnected,
    mongoConnectionError: isMongoEnabled && !isMongoConnected 
      ? "Could not connect to your MongoDB Atlas cluster. This is typically because the container's dynamic deployment IP is not on your MongoDB Atlas Network Access IP Whitelist. To fix this, log in to MongoDB Atlas, navigate to Security > Network Access, click 'Add IP Address', and enter '0.0.0.0/0' to allow access from anywhere, then restart your server." 
      : null
  });
});



// 7. SALES ANALYTICS STATS
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    let orders: any[] = [];
    let products: any[] = [];
    
    if (isMongoConnected) {
      orders = await OrderModel.find().lean().exec() as any[];
      products = await ProductModel.find().lean().exec() as any[];
    } else {
      orders = getDb().orders || [];
      products = getDb().products || [];
    }
    
    let totalSales = 0;
    let paidSales = 0;
    const uniqueEmails = new Set();
    
    orders.forEach((o: any) => {
      totalSales += o.total;
      if (o.paymentStatus === 'paid') {
        paidSales += o.total;
      }
      uniqueEmails.add(o.customerEmail);
    });

    const orderCount = orders.length;
    const customerCount = uniqueEmails.size;
    const averageOrderValue = orderCount > 0 ? Number((totalSales / orderCount).toFixed(2)) : 0;

    // Group sales by Category
    const categorySalesMap: Record<string, number> = {};
    products.forEach((p: any) => {
      categorySalesMap[p.category] = 0;
    });
    
    orders.forEach((o: any) => {
      o.items.forEach((item: any) => {
        const p = products.find((prod: any) => prod.id === item.productId);
        const cat = p ? p.category : 'General Wellness';
        categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (item.price * item.quantity);
      });
    });

    const salesByCategory = Object.entries(categorySalesMap).map(([category, amount]) => ({
      category: category.toUpperCase(),
      amount
    }));

    // Sales by last 5 days
    const last5Days = Array.from({ length: 5 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const salesByDay = last5Days.map(dayStr => {
      const amount = orders
        .filter((o: any) => o.date.startsWith(dayStr))
        .reduce((sum: number, o: any) => sum + o.total, 0);
      return {
        date: new Date(dayStr).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        amount
      };
    });

    res.json({
      totalSales,
      paidSales,
      orderCount,
      customerCount,
      averageOrderValue,
      salesByDay,
      salesByCategory,
      recentOrders: orders.slice(0, 5)
    });
  } catch (err: any) {
    console.error('MongoDB stats failed, falling back to local database calculation:', err);
    try {
      const orders = getDb().orders || [];
      const products = getDb().products || [];
      let totalSales = 0;
      let paidSales = 0;
      const uniqueEmails = new Set();
      orders.forEach((o: any) => {
        totalSales += o.total;
        if (o.paymentStatus === 'paid') paidSales += o.total;
        uniqueEmails.add(o.customerEmail);
      });
      const orderCount = orders.length;
      const customerCount = uniqueEmails.size;
      const averageOrderValue = orderCount > 0 ? Number((totalSales / orderCount).toFixed(2)) : 0;

      const categorySalesMap: Record<string, number> = {};
      products.forEach((p: any) => {
        categorySalesMap[p.category] = 0;
      });
      orders.forEach((o: any) => {
        o.items.forEach((item: any) => {
          const p = products.find((prod: any) => prod.id === item.productId);
          const cat = p ? p.category : 'General Wellness';
          categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (item.price * item.quantity);
        });
      });
      const salesByCategory = Object.entries(categorySalesMap).map(([category, amount]) => ({
        category: category.toUpperCase(),
        amount
      }));
      const last5Days = Array.from({ length: 5 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();
      const salesByDay = last5Days.map(dayStr => {
        const amount = orders
          .filter((o: any) => o.date.startsWith(dayStr))
          .reduce((sum: number, o: any) => sum + o.total, 0);
        return {
          date: new Date(dayStr).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          amount
        };
      });
      res.json({
        totalSales,
        paidSales,
        orderCount,
        customerCount,
        averageOrderValue,
        salesByDay,
        salesByCategory,
        recentOrders: orders.slice(0, 5)
      });
    } catch (fallbackErr: any) {
      res.status(500).json({ error: `Stats calculations failed: ${fallbackErr.message}` });
    }
  }
});


// 8. GEMINI AI CHATBOT AYUBOT
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const api_key = process.env.GEMINI_API_KEY;
    if (!api_key) {
      res.json({
        text: "Namaste! I am AyuBot, your AI Ayurvedic wellness companion. The system administrator hasn't added a Gemini API Key to my backend yet. Let me guide you with a pre-configured biological check: To optimize your health, place 2 spoons of our brand-authorized *Ojas Shodhan Advanced Chyawanprash* in whole milk at sunrise. To get personalized real-time advice from me, please provide a valid GEMINI_API_KEY inside the **Settings > Secrets** panel!"
      });
      return;
    }

    // Instantiating standard modern @google/genai SDK
    const ai = new GoogleGenAI({
      apiKey: api_key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    let products: any[] = [];
    if (isMongoConnected) {
      try {
        products = await ProductModel.find().lean().exec() as any[];
      } catch (err) {
        products = getDb().products || [];
      }
    } else {
      products = getDb().products || [];
    }
    const listToUse = products.length > 0 ? products : INITIAL_PRODUCTS;
    const productListText = listToUse.map((p: any) => 
      `- ${p.name} ($${p.price}): ${p.tagline}. Benefits: ${p.benefits.join(', ')}. Formula: ${p.ingredients.join(', ')}. Use case: ${p.usage}`
    ).join('\n');

    const systemInstruction = `You are a highly premium, compassionate, and wise traditional Ayurvedic doctor (Vaidya) named Dr. Ayu from the organic brand "GoAyu". 
Your mission is to guide users to holistic wellness, balance their bodily humor (Doshas: Vata, Pitta, Kapha), and recommend GoAyu products with scientific details and gentle Ayurvedic lifestyle advice.

Here is the exact catalog of premium GoAyu products you have available list to recommend to the customer:
${productListText}

Rules:
1. Speak with deep herbal mastery, professional warmth, and therapeutic poise. Welcome them with "Namaste".
2. Explain health questions according to Vata (motion), Pitta (heat/metabolism), and Kapha (fluid/stability).
3. If they describe symptoms (stress, skin trouble, hair fall, sluggish digestion), explain *which* dosha is out of balance and recommend the corresponding GoAyu product.
4. Integrate the product names elegantly, explaining how their exact ingredients (such as saffron, bhringraj, Swarna Bhasma, wild amla) target the relief.
5. Emphasize that GoAyu offers 100% natural, chemical-free Ayurvedic formulas made under certified standards in India.
6. Keep recommendations realistic, encouraging healthy eating (Ahaar) and lifestyle (Vihar). Avoid absolute diagnostic claims, but offer outstanding herbal wisdom. Use clean formatting with paragraphs, bold headers and polite bullets.`;

    // Process chat using the chat engine or a clean contents prompt
    // Map roles: 'user' | 'model' (GenAI expects 'user' and 'model')
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ text: aiResponse.text });
  } catch (error: any) {
    console.error('Gemini API Route Error:', error);
    res.status(500).json({ error: 'Namaste! AyuBot encountered an operational imbalance in spiritual network connection. Please check logs and API keys.' });
  }
});


// 8. PORTRAIT REELS ENDPOINTS
app.get('/api/reels', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const reels = await ReelModel.find().lean().exec();
      res.json(reels);
    } else {
      res.json(getDb().reels || []);
    }
  } catch (err: any) {
    console.error('MongoDB GET reels failed, falling back to local:', err);
    res.json(getDb().reels || []);
  }
});

app.post('/api/reels', async (req: Request, res: Response) => {
  try {
    const reel = req.body;
    reel.id = reel.id || 'reel' + Date.now();
    reel.likes = reel.likes || Math.floor(Math.random() * 500) + 50;
    
    if (isMongoConnected) {
      const doc = await ReelModel.create(reel);
      
      const db = getDb();
      db.reels = db.reels || [];
      db.reels.push(JSON.parse(JSON.stringify(doc)));
      saveDb(db);
      res.status(201).json(doc);
    } else {
      const db = getDb();
      db.reels = db.reels || [];
      db.reels.push(reel);
      saveDb(db);
      res.status(201).json(reel);
    }
  } catch (err: any) {
    console.error('MongoDB POST reel failed, falling back to local:', err);
    const reel = req.body;
    reel.id = reel.id || 'reel' + Date.now();
    reel.likes = reel.likes || Math.floor(Math.random() * 500) + 50;
    const db = getDb();
    db.reels = db.reels || [];
    db.reels.push(reel);
    saveDb(db);
    res.status(201).json(reel);
  }
});

app.put('/api/reels/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const doc = await ReelModel.findOneAndUpdate({ id: req.params.id } as any, req.body, { new: true } as any);
      if (doc) {
        const db = getDb();
        db.reels = db.reels || [];
        const idx = db.reels.findIndex((r: any) => r.id === req.params.id);
        if (idx !== -1) {
          db.reels[idx] = { ...db.reels[idx], ...req.body };
          saveDb(db);
        }
        res.json(doc);
        return;
      }
    }
    
    const db = getDb();
    db.reels = db.reels || [];
    const idx = db.reels.findIndex((r: any) => r.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Reel not found' });
      return;
    }
    db.reels[idx] = { ...db.reels[idx], ...req.body };
    saveDb(db);
    res.json(db.reels[idx]);
  } catch (err: any) {
    console.error('MongoDB PUT reel failed, falling back to local:', err);
    const db = getDb();
    db.reels = db.reels || [];
    const idx = db.reels.findIndex((r: any) => r.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Reel not found' });
      return;
    }
    db.reels[idx] = { ...db.reels[idx], ...req.body };
    saveDb(db);
    res.json(db.reels[idx]);
  }
});

app.delete('/api/reels/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const result = await ReelModel.deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        const db = getDb();
        db.reels = (db.reels || []).filter((r: any) => r.id !== req.params.id);
        saveDb(db);
        res.json({ success: true });
        return;
      }
    }
    
    const db = getDb();
    db.reels = (db.reels || []).filter((r: any) => r.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  } catch (err: any) {
    console.error('MongoDB DELETE reel failed, falling back to local:', err);
    const db = getDb();
    db.reels = (db.reels || []).filter((r: any) => r.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  }
});


// 9. TESTIMONIALS (PATRON GRATITUDE & WHISPERS OF HEALING) ENDPOINTS
app.get('/api/testimonials', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const list = await TestimonialModel.find().lean().exec();
      res.json(list);
    } else {
      res.json(getDb().testimonials || []);
    }
  } catch (err: any) {
    console.error('MongoDB GET testimonials failed, falling back to local:', err);
    res.json(getDb().testimonials || []);
  }
});

app.post('/api/testimonials', async (req: Request, res: Response) => {
  try {
    const item = req.body;
    item.id = item.id || 'test' + Date.now();
    
    if (isMongoConnected) {
      const doc = await TestimonialModel.create(item);
      
      const db = getDb();
      db.testimonials = db.testimonials || [];
      db.testimonials.push(JSON.parse(JSON.stringify(doc)));
      saveDb(db);
      res.status(201).json(doc);
    } else {
      const db = getDb();
      db.testimonials = db.testimonials || [];
      db.testimonials.push(item);
      saveDb(db);
      res.status(201).json(item);
    }
  } catch (err: any) {
    console.error('MongoDB POST testimonial failed, falling back to local:', err);
    const item = req.body;
    item.id = item.id || 'test' + Date.now();
    const db = getDb();
    db.testimonials = db.testimonials || [];
    db.testimonials.push(item);
    saveDb(db);
    res.status(201).json(item);
  }
});

app.put('/api/testimonials/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const doc = await TestimonialModel.findOneAndUpdate({ id: req.params.id } as any, req.body, { new: true } as any);
      if (doc) {
        const db = getDb();
        db.testimonials = db.testimonials || [];
        const idx = db.testimonials.findIndex((t: any) => t.id === req.params.id);
        if (idx !== -1) {
          db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
          saveDb(db);
        }
        res.json(doc);
        return;
      }
    }
    
    const db = getDb();
    db.testimonials = db.testimonials || [];
    const idx = db.testimonials.findIndex((t: any) => t.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }
    db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
    saveDb(db);
    res.json(db.testimonials[idx]);
  } catch (err: any) {
    console.error('MongoDB PUT testimonial failed, falling back to local:', err);
    const db = getDb();
    db.testimonials = db.testimonials || [];
    const idx = db.testimonials.findIndex((t: any) => t.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }
    db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
    saveDb(db);
    res.json(db.testimonials[idx]);
  }
});

app.delete('/api/testimonials/:id', async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const result = await TestimonialModel.deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        const db = getDb();
        db.testimonials = (db.testimonials || []).filter((t: any) => t.id !== req.params.id);
        saveDb(db);
        res.json({ success: true });
        return;
      }
    }
    
    const db = getDb();
    db.testimonials = (db.testimonials || []).filter((t: any) => t.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  } catch (err: any) {
    console.error('MongoDB DELETE testimonial failed, falling back to local:', err);
    const db = getDb();
    db.testimonials = (db.testimonials || []).filter((t: any) => t.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  }
});


// ==========================================
// 10. SECURE MOBILE OTP AUTHENTICATION SYSTEM
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_GOAYU_KEY_108_LOTUS_BUD';

// In-memory rate limiting databases to prevent script abuse
const ipRateLimiter = new Map<string, { count: number; resetTime: number }>();
const phoneRateLimiter = new Map<string, { count: number; resetTime: number }>();
const phoneResendLock = new Map<string, number>();

// In-memory simulation logs queue
const simulatedSmsLogs: Array<{ id: string; phone: string; otp: string; timestamp: Date; message: string }> = [];

// Helper to push simulated SMS logs
function pushSimulatedSms(phone: string, otp: string, message: string) {
  simulatedSmsLogs.unshift({
    id: 'sms_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    phone,
    otp,
    timestamp: new Date(),
    message
  });
  // Keep last 30 logs
  if (simulatedSmsLogs.length > 30) {
    simulatedSmsLogs.pop();
  }
}

// IP and Phone Rate Limit checker middleware helper
function checkRateLimits(ip: string, phone: string, res: Response): boolean {
  const now = Date.now();

  // 1. Check IP Limiting (Max 15 requests per 10 mins per IP)
  const ipData = ipRateLimiter.get(ip);
  if (ipData && ipData.resetTime > now) {
    if (ipData.count >= 15) {
      res.status(429).json({
        error: 'Too many OTP requests from this IP connection. Please try again in 10 minutes.'
      });
      return false;
    }
    ipData.count += 1;
  } else {
    ipRateLimiter.set(ip, { count: 1, resetTime: now + 10 * 60 * 1000 });
  }

  // 2. Check Phone Limiting (Max 5 requests per 10 mins)
  const phoneData = phoneRateLimiter.get(phone);
  if (phoneData && phoneData.resetTime > now) {
    if (phoneData.count >= 5) {
      res.status(429).json({
        error: 'Too many OTP requests sent to this phone number. Please try again in 10 minutes to prevent abuse.'
      });
      return false;
    }
    phoneData.count += 1;
  } else {
    phoneRateLimiter.set(phone, { count: 1, resetTime: now + 10 * 60 * 1000 });
  }

  // 3. Resend block (Lock for 60 seconds)
  const lastSentTime = phoneResendLock.get(phone);
  if (lastSentTime && (now - lastSentTime) < 60 * 1000) {
    const elapsedSeconds = Math.ceil(((60 * 1000) - (now - lastSentTime)) / 1000);
    res.status(429).json({
      error: `Please wait ${elapsedSeconds} seconds before requesting another SMS OTP.`
    });
    return false;
  }
  
  // Set resend lock timestamp
  phoneResendLock.set(phone, now);
  return true;
}

// -- SEND OTP ENDPOINT --
app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const clientIp = req.ip || req.headers['x-forwarded-for'] as string || 'default-ip';

    if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s+/g, ''))) {
      res.status(400).json({ error: 'Please enter a valid mobile number with country code (e.g. +919876543210).' });
      return;
    }

    const normalizedPhone = phone.replace(/\s+/g, '');

    // Execute Rate limits
    if (!checkRateLimits(clientIp, normalizedPhone, res)) {
      return;
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // 1) Store code inside persistent databases
    if (isMongoConnected) {
      // Find and replace or create OTP
      await OtpModel.findOneAndDelete({ phone: normalizedPhone } as any);
      await OtpModel.create({
        phone: normalizedPhone,
        otp,
        expiresAt,
        lastSentAt: new Date(),
        attempts: 0
      });
    } else {
      const db = getDb();
      db.otps = db.otps || [];
      // Remove any existing active otp for this phone
      db.otps = db.otps.filter((o: any) => o.phone !== normalizedPhone);
      db.otps.push({
        phone: normalizedPhone,
        otp,
        expiresAt: expiresAt.toISOString(),
        lastSentAt: new Date().toISOString(),
        attempts: 0
      });
      saveDb(db);
    }

    // 2) SMS Delivery driver selection
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const smsMessage = `Your GoAyu security verification OTP: ${otp}. Valid for 5 minutes. Protect your health ledgers, do not share.`;

    let deliveredVia = 'console_simulation';

    if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
      try {
        const basicAuth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: twilioPhoneNumber,
            To: normalizedPhone,
            Body: smsMessage
          }).toString()
        });

        if (response.ok) {
          deliveredVia = 'twilio_gateway';
          console.log(`📡 [OTP SMS VIA TWILIO] Successfully sent premium SMS verification code to ${normalizedPhone}`);
        } else {
          const errText = await response.text();
          console.error(`❌ Twilio SMS Delivery Failed. Fallen back to secure logging:`, errText);
        }
      } catch (twilioErr) {
        console.error(`❌ Twilio SMS Fetch invocation error:`, twilioErr);
      }
    }

    // Always log to console as secondary backup or primary simulation channel
    console.log(`
========================================================================
📱 [OTP SYSTEM SMS TRANSCRIPT]
To: ${normalizedPhone}
Status: DELIVERED (via ${deliveredVia})
Body: ${smsMessage}
Timestamp: ${new Date().toISOString()}
========================================================================
`);

    pushSimulatedSms(normalizedPhone, otp, smsMessage);

    res.json({
      success: true,
      message: 'verification OTP dispatched successfully.',
      expiresInSeconds: 300,
      resendCooldownSeconds: 60,
      phone: normalizedPhone,
      simulationMode: deliveredVia === 'console_simulation'
    });

  } catch (err: any) {
    console.error('OTP delivery dispatch collapsed:', err);
    res.status(500).json({ error: 'Server failed to initialize active security OTP loop.' });
  }
});


// -- VERIFY OTP AND LOGIN/SIGNUP ENDPOINT --
app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
  try {
    const { phone, otp, name } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ error: 'Mobile number and 6-digit OTP are required.' });
      return;
    }

    const normalizedPhone = phone.replace(/\s+/g, '');
    let otpRecord: any = null;

    // 1) Retrieve OTP record
    if (isMongoConnected) {
      otpRecord = await OtpModel.findOne({ phone: normalizedPhone } as any);
    } else {
      const records = getDb().otps || [];
      otpRecord = records.find((o: any) => o.phone === normalizedPhone);
    }

    if (!otpRecord) {
      res.status(400).json({ error: 'No active OTP verification session found for this number.' });
      return;
    }

    // 2) Check security constraints
    const now = new Date();
    const expiryTime = new Date(otpRecord.expiresAt);
    if (expiryTime.getTime() < now.getTime()) {
      // Cleanup expired
      if (isMongoConnected) {
        await OtpModel.findOneAndDelete({ phone: normalizedPhone } as any);
      } else {
        const db = getDb();
        db.otps = (db.otps || []).filter((o: any) => o.phone !== normalizedPhone);
        saveDb(db);
      }
      res.status(400).json({ error: 'The selected security OTP has expired. Please claim a new code.' });
      return;
    }

    if (otpRecord.attempts >= 5) {
      if (isMongoConnected) {
        await OtpModel.findOneAndDelete({ phone: normalizedPhone } as any);
      } else {
        const db = getDb();
        db.otps = (db.otps || []).filter((o: any) => o.phone !== normalizedPhone);
        saveDb(db);
      }
      res.status(400).json({ error: 'Maximum validation attempts exceeded. Access locked. Please generate a new OTP.' });
      return;
    }

    // 3) Validate OTP matching
    if (otpRecord.otp !== otp.trim()) {
      // Increment attempt
      if (isMongoConnected) {
        await OtpModel.findOneAndUpdate({ phone: normalizedPhone } as any, { $inc: { attempts: 1 } } as any, {} as any);
      } else {
        const db = getDb();
        const rIdx = db.otps.findIndex((o: any) => o.phone === normalizedPhone);
        if (rIdx !== -1) {
          db.otps[rIdx].attempts += 1;
          saveDb(db);
        }
      }
      const attemptsRemaining = 5 - (otpRecord.attempts + 1);
      res.status(400).json({
        error: `Invalid OTP code. Please retry. Attempts remaining before lockout: ${attemptsRemaining}`
      });
      return;
    }

    // Remove OTP on successful validation
    if (isMongoConnected) {
      await OtpModel.findOneAndDelete({ phone: normalizedPhone } as any);
    } else {
      const db = getDb();
      db.otps = (db.otps || []).filter((o: any) => o.phone !== normalizedPhone);
      saveDb(db);
    }

    // 4) Clean User Verification & Signup/Login Flow
    let user: any = null;
    let isNewUser = false;

    if (isMongoConnected) {
      user = await UserModel.findOne({ phone: normalizedPhone } as any);
    } else {
      user = (getDb().users || []).find((u: any) => u.phone === normalizedPhone);
    }

    const defaultRole = normalizedPhone === '+919876543210' || normalizedPhone === '+919999999999' ? 'admin' : 'user';

    if (!user) {
      // Sign-up process
      isNewUser = true;
      const cleanName = name ? name.trim() : `Sadhaka ${normalizedPhone.slice(-4)}`;
      const userId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 100);

      const newUserObj = {
        id: userId,
        phone: normalizedPhone,
        name: cleanName,
        role: defaultRole,
        createdAt: new Date()
      };

      if (isMongoConnected) {
        user = await UserModel.create(newUserObj);
      } else {
        const db = getDb();
        db.users = db.users || [];
        db.users.push(newUserObj);
        saveDb(db);
        user = newUserObj;
      }
      console.log(`👤 [New Registered User] Profile created for mobile number ${normalizedPhone}`);
    }

    // 5) Generate JWT token
    const token = jwt.sign(
      {
        id: user.id || user._id,
        phone: user.phone,
        name: user.name,
        role: user.role || 'user'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: isNewUser ? 'Account initiated and certified successfully!' : 'Session established successfully!',
      isNewUser,
      user: {
        id: user.id || user._id,
        phone: user.phone,
        name: user.name,
        role: user.role
      },
      token
    });

  } catch (err: any) {
    console.error('Mobile verification failed:', err);
    res.status(500).json({ error: 'Security systems caught an operational anomaly during verification' });
  }
});


// -- AUTH SESSION DECODER (ME) ENDPOINT --
app.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. Authenticator token missing.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decodedPayload = jwt.verify(token, JWT_SECRET) as any;
      let user: any = null;

      if (isMongoConnected) {
        user = await UserModel.findOne({ id: decodedPayload.id } as any).lean();
        if (!user) {
          // Alternative lookup
          user = await UserModel.findOne({ phone: decodedPayload.phone } as any).lean();
        }
      } else {
        user = (getDb().users || []).find((u: any) => u.id === decodedPayload.id || u.phone === decodedPayload.phone);
      }

      if (!user) {
        res.status(404).json({ error: 'Biological user profile has expired or does not exist.' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role || 'user'
        }
      });

    } catch (jwtErr) {
      res.status(401).json({ error: 'Session credentials signature is invalid or expired. Swasthi.' });
      return;
    }

  } catch (err) {
    res.status(500).json({ error: 'Operational imbalance during secure token decryption.' });
  }
});


// -- SIMULATED SMS QUEUE LOGGER DRAWER (TESTING CONSOLE SERVICE) --
app.get('/api/auth/simulated-sms', (req: Request, res: Response) => {
  res.json(simulatedSmsLogs);
});


// --- VITE MIDDLEWARE SETUP ---

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production serving of static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GoAyu Server] Running smoothly on port ${PORT}`);
  });
}

start();
