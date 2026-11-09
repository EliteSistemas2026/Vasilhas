export interface ProductVariation {
  id: string;
  sku: string;
  name: string; // e.g. "500 ml - Tampa Bambu", "1.000 ml", "1.800 ml"
  sizeOrCapacity: string;
  color?: string;
  price: number;
  promotionalPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  description: string;
  material: string; // e.g. "Vidro Borossilicato", "Acrílico Cristal Livre de BPA", "Aço Inox 304", "Polipropileno"
  capacity: string; // e.g. "1.000 ml", "1.8 L", "500 ml"
  dimensions: string; // e.g. "15 x 10 x 8 cm"
  costPrice: number;
  price: number;
  promotionalPrice?: number;
  stock: number;
  minStock: number;
  images: string[];
  variations: ProductVariation[];
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  tags: string[]; // e.g. ["Hermético", "Livre de BPA", "Micro-ondas", "Freezer", "Lava-louças"]
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  image: string;
  linkCategory?: string;
  buttonText: string;
  order: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  variationId?: string;
  name: string;
  image: string;
  price: number;
  promotionalPrice?: number;
  quantity: number;
  capacity?: string;
  material?: string;
  variationName?: string;
  maxStock: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number; // e.g. 10 for 10% or 15 for R$ 15
  minOrderValue: number;
  usageLimit: number;
  timesUsed: number;
  expiresAt?: string;
  isActive: boolean;
}

export type DeliveryMethod = 'pickup' | 'local' | 'standard';

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface OrderAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  variationId?: string;
  name: string;
  image: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  variationName?: string;
}

export type OrderStatus =
  | 'received'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'pix'
  | 'credit_card'
  | 'cash_on_delivery'
  | 'pay_on_pickup';

export type PaymentStatus = 'pending' | 'paid' | 'cancelled';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  date: string;
  note?: string;
}

export interface Order {
  id: string;
  code: string; // e.g. "VP-48201"
  customer: OrderCustomer;
  address?: OrderAddress;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  changeFor?: number; // Para pagamento em dinheiro se precisar de troco
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  variationId?: string;
  variationName?: string;
  type: 'in' | 'out' | 'adjustment' | 'order_reservation' | 'order_cancellation';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  addresses?: OrderAddress[];
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  logo: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  openingHours: string;
  instagram: string;
  facebook?: string;
  minOrderValue: number;
  freeShippingMin: number;
  localDeliveryFee: number;
  pixDiscountPercent: number;
  pixKey: string;
  pixKeyType: 'cnpj' | 'cpf' | 'email' | 'phone' | 'random';
  pixReceiverName: string;
  paymentMethods: {
    pix: boolean;
    creditCard: boolean;
    cashOnDelivery: boolean;
    payOnPickup: boolean;
  };
  deliveryRules: {
    pickupEnabled: boolean;
    localDeliveryEnabled: boolean;
    shippingEnabled: boolean;
  };
  returnPolicy: string;
  privacyPolicy: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  adminPassword?: string;
}
