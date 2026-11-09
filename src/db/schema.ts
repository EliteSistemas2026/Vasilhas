import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (integrated with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('customer').notNull(), // 'admin' | 'customer'
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Store Settings
export const storeSettings = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  storeName: text('store_name').notNull().default('Vasilha & Cia'),
  slogan: text('slogan').default('Potes herméticos, vasilhas e organizadores inteligentes'),
  logoUrl: text('logo_url').default('/icon.svg'),
  whatsapp: text('whatsapp').notNull().default('5511998765432'),
  phone: text('phone').default('(11) 3254-8900'),
  email: text('email').default('atendimento@vasilhaecia.com.br'),
  address: text('address').default('Av. das Utilidades, 1500 - Sala 4'),
  neighborhood: text('neighborhood').default('Vila Olímpia'),
  city: text('city').default('São Paulo'),
  state: text('state').default('SP'),
  openingHours: text('opening_hours').default('Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00'),
  instagram: text('instagram').default('@vasilhaecia.utilidades'),
  minOrderValue: numeric('min_order_value', { precision: 10, scale: 2 }).default('30.00').notNull(),
  freeShippingMin: numeric('free_shipping_min', { precision: 10, scale: 2 }).default('199.00').notNull(),
  localDeliveryFee: numeric('local_delivery_fee', { precision: 10, scale: 2 }).default('14.90').notNull(),
  pixDiscountPercent: numeric('pix_discount_percent', { precision: 5, scale: 2 }).default('5.00').notNull(),
  pixKey: text('pix_key').default('pix@vasilhaecia.com.br'),
  pixReceiverName: text('pix_receiver_name').default('Vasilha & Cia Utilidades Domésticas Ltda'),
  paymentMethods: jsonb('payment_methods').default({
    pix: true,
    creditCard: true,
    cashOnDelivery: true,
    payOnPickup: true
  }),
  deliveryRules: jsonb('delivery_rules').default({
    pickupEnabled: true,
    localDeliveryEnabled: true,
    shippingEnabled: true
  }),
  returnPolicy: text('return_policy').default('Garantimos 7 dias para troca ou devolução sem custo.'),
  privacyPolicy: text('privacy_policy').default('Seus dados são protegidos por criptografia.'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').default(''),
  imageUrl: text('image_url').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  sku: text('sku').notNull().unique(),
  barcode: text('barcode'),
  description: text('description').notNull(),
  material: text('material').notNull(),
  capacity: text('capacity').notNull(),
  dimensions: text('dimensions').notNull(),
  costPrice: numeric('cost_price', { precision: 10, scale: 2 }).default('0.00').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  promotionalPrice: numeric('promotional_price', { precision: 10, scale: 2 }),
  stock: integer('stock').default(0).notNull(),
  minStock: integer('min_stock').default(5).notNull(),
  images: jsonb('images').default([]).notNull(), // string[]
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  isNew: boolean('is_new').default(false).notNull(),
  tags: jsonb('tags').default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Product Variations
export const productVariations = pgTable('product_variations', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  sizeOrCapacity: text('size_or_capacity').notNull(),
  color: text('color'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  promotionalPrice: numeric('promotional_price', { precision: 10, scale: 2 }),
  stock: integer('stock').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Banners
export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').default(''),
  badgeText: text('badge_text'),
  imageUrl: text('image_url').notNull(),
  linkCategory: text('link_category'),
  buttonText: text('button_text').default('Ver Ofertas').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Coupons
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  type: text('type').notNull(), // 'percent' | 'fixed'
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  minOrderValue: numeric('min_order_value', { precision: 10, scale: 2 }).default('0.00').notNull(),
  usageLimit: integer('usage_limit').default(100).notNull(),
  timesUsed: integer('times_used').default(0).notNull(),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Customers
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  totalOrders: integer('total_orders').default(0).notNull(),
  totalSpent: numeric('total_spent', { precision: 10, scale: 2 }).default('0.00').notNull(),
  lastOrderDate: timestamp('last_order_date'),
  addresses: jsonb('addresses').default([]),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // e.g. "VP-84210"
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  deliveryMethod: text('delivery_method').notNull(), // 'pickup' | 'local' | 'standard'
  deliveryFee: numeric('delivery_fee', { precision: 10, scale: 2 }).default('0.00').notNull(),
  address: jsonb('address'),
  items: jsonb('items').notNull(), // OrderItem[]
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  discount: numeric('discount', { precision: 10, scale: 2 }).default('0.00').notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  couponCode: text('coupon_code'),
  paymentMethod: text('payment_method').notNull(), // 'pix' | 'credit_card' | 'cash_on_delivery' | 'pay_on_pickup'
  paymentStatus: text('payment_status').default('pending').notNull(), // 'pending' | 'paid' | 'cancelled'
  changeFor: numeric('change_for', { precision: 10, scale: 2 }),
  status: text('status').default('received').notNull(), // 'received' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled'
  statusHistory: jsonb('status_history').default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Inventory Movements
export const inventoryMovements = pgTable('inventory_movements', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  productName: text('product_name').notNull(),
  variationId: text('variation_id'),
  variationName: text('variation_name'),
  type: text('type').notNull(), // 'in' | 'out' | 'adjustment' | 'order_reservation' | 'order_cancellation'
  quantity: integer('quantity').notNull(),
  previousStock: integer('previous_stock').notNull(),
  newStock: integer('new_stock').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  variations: many(productVariations)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const productVariationsRelations = relations(productVariations, ({ one }) => ({
  product: one(products, {
    fields: [productVariations.productId],
    references: [products.id]
  })
}));
