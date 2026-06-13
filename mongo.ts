import mongoose, { Schema } from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

export const isMongoEnabled = !!MONGODB_URI;
export let isMongoConnected = false;

export async function connectMongo(): Promise<boolean> {
  if (!isMongoEnabled) {
    isMongoConnected = false;
    return false;
  }
  try {
    console.log('🥭 MONGODB_URI is specified. Connecting to MongoDB (Mango DB) with 5s timeout...');
    
    // Disable query buffering so that we do not hang and time out if MongoDB is temporarily down/buffering
    mongoose.set('bufferCommands', false);

    await mongoose.connect(MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isMongoConnected = true;
    console.log('🥭 MongoDB connection established successfully!');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed. Falling back gracefully to local JSON database.', err);
    isMongoConnected = false;
    return false;
  }
}

// 1. PRODUCT
const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  category: String,
  tagline: String,
  description: String,
  price: Number,
  originalPrice: Number,
  stock: Number,
  image: String,
  images: [String],
  benefits: [String],
  ingredients: [String],
  usage: String,
  usagePoints: [String],
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  reviews: [{
    id: String,
    name: String,
    rating: Number,
    quote: String,
    date: String,
    location: String
  }]
}, { strict: false });

export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// 2. CATEGORY
const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  slug: String,
  description: String,
  image: String
}, { strict: false });

export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// 3. BLOG
const BlogSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  image: String,
  date: String,
  readTime: String,
  author: String
}, { strict: false });

export const BlogModel = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// 4. COUPON
const CouponSchema = new Schema({
  id: { type: String, required: true, unique: true },
  code: String,
  type: String,
  value: Number,
  min: Number,
  active: { type: Boolean, default: true },
  productId: String
}, { strict: false });

export const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

// 5. ORDER
const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: String,
  date: String,
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String,
    state: String
  },
  items: [{
    id: String,
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: Number,
  status: { type: String, default: 'pending' },
  paymentStatus: { type: String, default: 'pending' },
  paymentMethod: String,
  trackingId: String,
  remarks: String,
  trackingTimeline: [{
    status: String,
    label: String,
    date: String,
    description: String,
    completed: Boolean
  }]
}, { strict: false });

export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// 6. HERO BANNER
const HeroBannerSchema = new Schema({
  title: String,
  subtitle: String,
  bgImage: String,
  ctaText: String,
  link: String,
  cardImage: String,
  cardLabel: String,
  cardName: String,
  cardCtaText: String,
  cardLink: String,
  logoUrl: String
}, { strict: false });

export const HeroBannerModel = mongoose.models.HeroBanner || mongoose.model('HeroBanner', HeroBannerSchema);

// 7. INQUIRY
const QuerySchema = new Schema({
  id: { type: String, required: true, unique: true },
  date: String,
  name: String,
  email: String,
  query: String,
  topic: String,
  solved: { type: Boolean, default: false }
}, { strict: false });

export const QueryModel = mongoose.models.Query || mongoose.model('Query', QuerySchema);

// 8. SUBSCRIBER
const SubscriberSchema = new Schema({
  id: { type: String, required: true, unique: true },
  email: String,
  date: String
}, { strict: false });

export const SubscriberModel = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

// 9. REEL
const ReelSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  url: String,
  tagline: String,
  likes: { type: Number, default: 0 }
}, { strict: false });

export const ReelModel = mongoose.models.Reel || mongoose.model('Reel', ReelSchema);

// 10. TESTIMONIAL
const TestimonialSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  location: String,
  quote: String
}, { strict: false });

export const TestimonialModel = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

// 11. USER MODEL
const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

// 12. OTP MODEL
const OtpSchema = new Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  lastSentAt: { type: Date, default: Date.now },
  attempts: { type: Number, default: 0 }
}, { strict: false });

export const OtpModel = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);

// Bulk Synchronization utility to copy existing db.json or memory data to MongoDB
export async function syncDatabaseWithMongo(localData: any) {
  if (!isMongoConnected) return;

  try {
    console.log('🥭 Checking MongoDB (Mango DB) database counts for bootstrapping...');
    
    // Check if Product has documents
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0 && localData.products?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.products.length} products to MongoDB...`);
      await ProductModel.insertMany(localData.products);
    }

    const catCount = await CategoryModel.countDocuments();
    if (catCount === 0 && localData.categories?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.categories.length} categories to MongoDB...`);
      await CategoryModel.insertMany(localData.categories);
    }

    const blogCount = await BlogModel.countDocuments();
    if (blogCount === 0 && localData.blogs?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.blogs.length} blogs to MongoDB...`);
      await BlogModel.insertMany(localData.blogs);
    }

    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0 && localData.coupons?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.coupons.length} coupons to MongoDB...`);
      await CouponModel.insertMany(localData.coupons);
    }

    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0 && localData.orders?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.orders.length} orders to MongoDB...`);
      await OrderModel.insertMany(localData.orders);
    }

    const bannerCount = await HeroBannerModel.countDocuments();
    if (bannerCount === 0 && localData.heroBanner) {
      console.log('🥭 Bootstrapping promotional banner hero settings to MongoDB...');
      await HeroBannerModel.create(localData.heroBanner);
    }

    const queryCount = await QueryModel.countDocuments();
    if (queryCount === 0 && localData.queries?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.queries.length} queries to MongoDB...`);
      await QueryModel.insertMany(localData.queries);
    }

    const subCount = await SubscriberModel.countDocuments();
    if (subCount === 0 && localData.subscribers?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.subscribers.length} newsletter subscribers to MongoDB...`);
      await SubscriberModel.insertMany(localData.subscribers);
    }

    const reelCount = await ReelModel.countDocuments();
    if (reelCount === 0 && localData.reels?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.reels.length} vertical reels to MongoDB...`);
      await ReelModel.insertMany(localData.reels);
    }

    const testimonialCount = await TestimonialModel.countDocuments();
    if (testimonialCount === 0 && localData.testimonials?.length > 0) {
      console.log(`🥭 Bootstrapping ${localData.testimonials.length} testimonials to MongoDB...`);
      await TestimonialModel.insertMany(localData.testimonials);
    }

    console.log('🥭 Active MongoDB synchronization analysis finished!');
  } catch (err) {
    console.error('❌ Error synchronizing local database state to MongoDB:', err);
  }
}

// Single active write-through utility
export async function writeThroughToMongo(key: string, dataArray: any[]) {
  if (!isMongoConnected) return;
  try {
    if (key === 'products') {
      await ProductModel.deleteMany({});
      if (dataArray.length > 0) await ProductModel.insertMany(dataArray);
    } else if (key === 'categories') {
      await CategoryModel.deleteMany({});
      if (dataArray.length > 0) await CategoryModel.insertMany(dataArray);
    } else if (key === 'blogs') {
      await BlogModel.deleteMany({});
      if (dataArray.length > 0) await BlogModel.insertMany(dataArray);
    } else if (key === 'coupons') {
      await CouponModel.deleteMany({});
      if (dataArray.length > 0) await CouponModel.insertMany(dataArray);
    } else if (key === 'orders') {
      await OrderModel.deleteMany({});
      if (dataArray.length > 0) await OrderModel.insertMany(dataArray);
    } else if (key === 'queries') {
      await QueryModel.deleteMany({});
      if (dataArray.length > 0) await QueryModel.insertMany(dataArray);
    } else if (key === 'subscribers') {
      await SubscriberModel.deleteMany({});
      if (dataArray.length > 0) await SubscriberModel.insertMany(dataArray);
    } else if (key === 'reels') {
      await ReelModel.deleteMany({});
      if (dataArray.length > 0) await ReelModel.insertMany(dataArray);
    } else if (key === 'testimonials') {
      await TestimonialModel.deleteMany({});
      if (dataArray.length > 0) await TestimonialModel.insertMany(dataArray);
    } else if (key === 'users') {
      await UserModel.deleteMany({});
      if (dataArray.length > 0) await UserModel.insertMany(dataArray);
    }
  } catch (err) {
    console.error(`❌ Failed to write-through collection ${key} to MongoDB:`, err);
  }
}

export async function writeBannerToMongo(bannerData: any) {
  if (!isMongoConnected) return;
  try {
    await HeroBannerModel.deleteMany({});
    await HeroBannerModel.create(bannerData);
  } catch (err) {
    console.error('❌ Failed to save banner state to MongoDB:', err);
  }
}
