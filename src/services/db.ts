import {
  Product,
  Category,
  Banner,
  Coupon,
  Order,
  InventoryMovement,
  Customer,
  StoreSettings,
  CartItem,
  DeliveryMethod,
  OrderStatus
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'vasilha_settings_v1',
  CATEGORIES: 'vasilha_categories_v1',
  PRODUCTS: 'vasilha_products_v1',
  BANNERS: 'vasilha_banners_v1',
  COUPONS: 'vasilha_coupons_v1',
  ORDERS: 'vasilha_orders_v1',
  MOVEMENTS: 'vasilha_movements_v1',
  CUSTOMERS: 'vasilha_customers_v1',
  CART: 'vasilha_cart_v1'
};

// Initial Seed Data with real products, accurate dimensions, and curated imagery
const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Vasilha & Cia',
  slogan: 'Potes herméticos, vasilhas e organizadores inteligentes para seu lar',
  logo: '/icon.svg',
  whatsapp: '5511998765432',
  phone: '(11) 3254-8900',
  email: 'atendimento@vasilhaecia.com.br',
  address: 'Av. das Utilidades, 1500 - Sala 4',
  neighborhood: 'Vila Olímpia',
  city: 'São Paulo',
  state: 'SP',
  openingHours: 'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00',
  instagram: '@vasilhaecia.utilidades',
  facebook: 'facebook.com/vasilhaecia',
  minOrderValue: 30.00,
  freeShippingMin: 199.00,
  localDeliveryFee: 14.90,
  pixDiscountPercent: 5.00,
  pixKey: 'pix@vasilhaecia.com.br',
  pixKeyType: 'email',
  pixReceiverName: 'Vasilha & Cia Utilidades Domésticas Ltda',
  paymentMethods: {
    pix: true,
    creditCard: true,
    cashOnDelivery: true,
    payOnPickup: true
  },
  deliveryRules: {
    pickupEnabled: true,
    localDeliveryEnabled: true,
    shippingEnabled: true
  },
  returnPolicy: 'Garantimos 7 dias para troca ou devolução sem custo caso você não fique 100% satisfeito com seu pote ou vasilha.',
  privacyPolicy: 'Seus dados são protegidos por criptografia e utilizados estritamente para faturamento e entrega de seus pedidos.',
  adminPassword: 'admin'
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Potes de Vidro Herméticos',
    slug: 'potes-vidro-hermeticos',
    description: 'Vidro borossilicato de alta resistência com tampa de bambu e anel de silicone.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    order: 1,
    isActive: true
  },
  {
    id: 'cat-2',
    name: 'Organizadores de Geladeira',
    slug: 'organizadores-geladeira',
    description: 'Gavetas e caixas organizadoras em acrílico transparente para manter alimentos frescos.',
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&auto=format&fit=crop&q=80',
    order: 2,
    isActive: true
  },
  {
    id: 'cat-3',
    name: 'Marmitas & Vasilhas Térmicas',
    slug: 'marmitas-vasilhas',
    description: 'Vasilhas com divisórias, travas 100% anti-vazamento, seguras para micro-ondas.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    order: 3,
    isActive: true
  },
  {
    id: 'cat-4',
    name: 'Porta-Mantimentos & Cereais',
    slug: 'porta-mantimentos',
    description: 'Dispenser dosador e potes empilháveis para arroz, feijão, café e massas.',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80',
    order: 4,
    isActive: true
  },
  {
    id: 'cat-5',
    name: 'Porta-Temperos & Condimentos',
    slug: 'porta-temperos',
    description: 'Kits giratórios, frascos com dosadores duplos e etiquetas adesivas inclusas.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    order: 5,
    isActive: true
  },
  {
    id: 'cat-6',
    name: 'Utensílios & Escorredores',
    slug: 'utensilios-escorredores',
    description: 'Praticidade para a pia e bancada: escorredores retráteis inox e suportes.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    order: 6,
    isActive: true
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kit 4 Potes Herméticos de Vidro Borossilicato com Tampa de Bambu',
    slug: 'kit-4-potes-hermeticos-vidro-bambu',
    sku: 'POT-BAMBU-4K',
    barcode: '789855120101',
    categoryId: 'cat-1',
    description: 'Conjunto premium com 4 potes herméticos feitos em vidro borossilicato de altíssima resistência térmica (suporta de -20°C até 400°C). As tampas de bambu ecológico contam com anel vedante em silicone atóxico, mantendo mantimentos crocantes e secos por semanas.',
    material: 'Vidro Borossilicato e Tampa de Bambu Natural com Silicone',
    capacity: 'Kit com 450ml, 800ml, 1.200ml e 1.800ml',
    dimensions: 'Alturas de 10cm, 15cm, 20cm e 28cm x 9,5cm diâmetro',
    costPrice: 62.00,
    price: 139.90,
    promotionalPrice: 119.90,
    stock: 28,
    minStock: 6,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      {
        id: 'var-1-1',
        sku: 'POT-BAMBU-KIT',
        name: 'Kit Completo 4 Peças (450ml, 800ml, 1.2L, 1.8L)',
        sizeOrCapacity: 'Kit 4 Unidades',
        color: 'Bambu Natural',
        price: 139.90,
        promotionalPrice: 119.90,
        stock: 28
      },
      {
        id: 'var-1-2',
        sku: 'POT-BAMBU-18L',
        name: 'Avulso Extra Grande 1.800 ml',
        sizeOrCapacity: '1.800 ml',
        color: 'Bambu Natural',
        price: 49.90,
        promotionalPrice: 42.90,
        stock: 15
      }
    ],
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    tags: ['Hermético', 'Tampa Bambu', 'Livre de BPA', 'Borossilicato', 'Eco-friendly'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Organizador de Geladeira Cristal com Alça e Cesto Drenante',
    slug: 'organizador-geladeira-cristal-alca-cesto',
    sku: 'ORG-GEL-CRIS',
    barcode: '789855120102',
    categoryId: 'cat-2',
    description: 'Caixa organizadora transparente para frutas, saladas e verduras na geladeira. Possui cesto interno perfurado removível para escorrer umidade, evitando que os alimentos fiquem em contato com a água e apodreçam precocemente. Tampa com regulador de ventilação.',
    material: 'Acrílico Cristal Resistente (Livre de BPA e Ftalatos)',
    capacity: '3.200 ml',
    dimensions: '29 x 18 x 15 cm',
    costPrice: 24.50,
    price: 59.90,
    promotionalPrice: 49.90,
    stock: 42,
    minStock: 8,
    images: [
      'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      {
        id: 'var-2-1',
        sku: 'ORG-GEL-MED',
        name: 'Tamanho Médio (2,2 Litros)',
        sizeOrCapacity: '2.200 ml',
        color: 'Transparente',
        price: 49.90,
        promotionalPrice: 41.90,
        stock: 20
      },
      {
        id: 'var-2-2',
        sku: 'ORG-GEL-GRA',
        name: 'Tamanho Grande (3,2 Litros com Cesto)',
        sizeOrCapacity: '3.200 ml',
        color: 'Transparente',
        price: 59.90,
        promotionalPrice: 49.90,
        stock: 22
      }
    ],
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    tags: ['Livre de BPA', 'Geladeira', 'Cesto Drenante', 'Anti-odor'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Vasilha Marmita Bento Hermética com 3 Divisórias e Travas',
    slug: 'vasilha-marmita-bento-hermetica-divisorias',
    sku: 'VAS-MARM-BENTO',
    barcode: '789855120103',
    categoryId: 'cat-3',
    description: 'Vasilha para refeições e marmitas com 3 compartimentos independentes que não misturam comida líquida ou molhos. 4 travas perimetrais de alta pressão e anel de silicone garantem vedação 100% anti-vazamento. Vai ao micro-ondas, freezer e lava-louças.',
    material: 'Polipropileno de Grau Alimentício + Silicone',
    capacity: '1.200 ml',
    dimensions: '21 x 14,5 x 7 cm',
    costPrice: 18.00,
    price: 44.90,
    promotionalPrice: 38.90,
    stock: 35,
    minStock: 5,
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      {
        id: 'var-3-1',
        sku: 'VAS-MARM-VERDE',
        name: 'Verde Sálvia',
        sizeOrCapacity: '1.200 ml',
        color: 'Verde Sálvia',
        price: 44.90,
        promotionalPrice: 38.90,
        stock: 18
      },
      {
        id: 'var-3-2',
        sku: 'VAS-MARM-BEGE',
        name: 'Areia / Off-white',
        sizeOrCapacity: '1.200 ml',
        color: 'Off-white',
        price: 44.90,
        promotionalPrice: 38.90,
        stock: 17
      }
    ],
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    tags: ['Livre de BPA', 'Micro-ondas', 'Freezer', 'Vedação 100%', '3 Divisórias'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Conjunto Porta-Mantimentos Herméticos Modulares com Tampa Dosadora',
    slug: 'porta-mantimentos-modulares-dosadora-kit',
    sku: 'MAN-MOD-SET',
    barcode: '789855120104',
    categoryId: 'cat-4',
    description: 'Potes transparentes de formato retangular inteligente que economizam até 40% de espaço em armários e despensas. Tampa ergonômica com trava de segurança e vedação que mantém cereais, grãos, café e farinhas livres de carunchos e umidade.',
    material: 'Plástico Rígido Transparente Tipo Acrílico (BPA Free)',
    capacity: 'Kit com 3 tamanhos (1.000ml, 1.700ml, 2.300ml)',
    dimensions: 'Base 12 x 10 cm, alturas variadas (15cm, 21cm, 28cm)',
    costPrice: 48.00,
    price: 119.90,
    promotionalPrice: 98.90,
    stock: 19,
    minStock: 4,
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      {
        id: 'var-4-1',
        sku: 'MAN-MOD-KIT3',
        name: 'Kit 3 Potes Empilháveis',
        sizeOrCapacity: 'Kit Trio (1L, 1.7L, 2.3L)',
        color: 'Branco & Transparente',
        price: 119.90,
        promotionalPrice: 98.90,
        stock: 19
      }
    ],
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    tags: ['Empilhável', 'Despensa Organizada', 'Vedação Perfeita', 'Livre de BPA'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Kit 12 Potes Porta-Temperos em Vidro com Tampa Dupla e Etiquetas Lousa',
    slug: 'kit-12-potes-porta-temperos-vidro-etiquetas',
    sku: 'TEMP-KIT-12',
    barcode: '789855120105',
    categoryId: 'cat-5',
    description: 'Transforme seu porta-temperos em um show de organização! 12 potinhos quadrados em vidro com tampa hermética em aço inox e sobretampa dosadora dupla (polvilhar e dosar em colher). Acompanha 24 etiquetas adesivas à prova d’água e caneta giz.',
    material: 'Vidro Transparente + Tampa Inox com Dosador Plástico Atóxico',
    capacity: '120 ml cada frasco',
    dimensions: '10,5 cm altura x 4,5 cm base quadrada',
    costPrice: 39.00,
    price: 89.90,
    promotionalPrice: 74.90,
    stock: 24,
    minStock: 6,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      {
        id: 'var-5-1',
        sku: 'TEMP-KIT-12-INX',
        name: 'Kit 12 Potes + Tampas Inox + Etiquetas',
        sizeOrCapacity: '12x 120 ml',
        color: 'Prata Inox',
        price: 89.90,
        promotionalPrice: 74.90,
        stock: 24
      }
    ],
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNew: true,
    tags: ['Vidro', 'Inox', 'Etiquetas Inclusas', 'Temperos', 'Dosador Duplo'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Escorredor Retrátil de Pia em Aço Inox e Silicone Dobrável',
    slug: 'escorredor-retratil-pia-aco-inox-silicone',
    sku: 'ESC-RET-INOX',
    barcode: '789855120106',
    categoryId: 'cat-6',
    description: 'Escorredor multiuso enrolável para apoio sobre a cuba da pia. Feito com varetas maciças em aço inox resistente e laterais em silicone antiderrapante. Ideal para secar vasilhas, copos e lavar frutas. Enrola facilmente ocupando quase zero espaço na gaveta.',
    material: 'Aço Inox 304 Maciço e Silicone Premium',
    capacity: 'Suporta até 15 kg de panelas e louça',
    dimensions: '47 cm comprimento x 30 cm largura',
    costPrice: 22.00,
    price: 52.90,
    promotionalPrice: 42.90,
    stock: 16,
    minStock: 5,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      {
        id: 'var-6-1',
        sku: 'ESC-RET-GRZ',
        name: 'Cinza Grafite',
        sizeOrCapacity: '47 x 30 cm',
        color: 'Cinza Grafite',
        price: 52.90,
        promotionalPrice: 42.90,
        stock: 16
      }
    ],
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    tags: ['Inox 304', 'Dobrável', 'Pia Limpa', 'Super Resistente'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Saladeira em Vidro Canelado com Tampa de Madeira e Servidores',
    slug: 'saladeira-vidro-canelado-tampa-madeira',
    sku: 'SAL-CANEL-KIT',
    barcode: '789855120107',
    categoryId: 'cat-1',
    description: 'Vasilha para saladas, massas e sobremesas com acabamento vintage canelado. A tampa em madeira nobre serve também como tábua para corte ou apoio de mesa. Acompanha colher e garfo de salada em madeira combinando.',
    material: 'Vidro Espesso Canelado e Madeira Nobre Selada',
    capacity: '2.500 ml',
    dimensions: '24 cm diâmetro x 12 cm altura',
    costPrice: 45.00,
    price: 99.90,
    promotionalPrice: 89.90,
    stock: 8,
    minStock: 3,
    images: [
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      {
        id: 'var-7-1',
        sku: 'SAL-CANEL-25L',
        name: 'Vasilha 2,5L + 2 Talheres de Madeira',
        sizeOrCapacity: '2.500 ml',
        color: 'Vidro Transparente / Madeira',
        price: 99.90,
        promotionalPrice: 89.90,
        stock: 8
      }
    ],
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    tags: ['Mesa Posta', 'Vidro Canelado', 'Madeira Nobre', 'Vasilha Salada'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Porta-Frios Duplo Hermético com Tampa e Divisória Removível',
    slug: 'porta-frios-duplo-hermetico-tampa-divisoria',
    sku: 'ORG-FRIOS-DUP',
    barcode: '789855120108',
    categoryId: 'cat-2',
    description: 'Guarde queijo e presunto fatiados no mesmo pote sem ressecar e sem misturar cheiros. Tampa transparente com travas laterais e vedação de silicone que prolonga o frescor dos frios por muito mais tempo.',
    material: 'Plástico Rígido Cristal Livre de BPA',
    capacity: '2 x 500 ml (1.000 ml total)',
    dimensions: '22 x 15 x 6 cm',
    costPrice: 14.50,
    price: 36.90,
    promotionalPrice: 29.90,
    stock: 3, // Low stock on purpose for testing inventory alert!
    minStock: 5,
    images: [
      'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop&q=80'
    ],
    variations: [
      {
        id: 'var-8-1',
        sku: 'ORG-FRIOS-CRIS',
        name: 'Porta Frios Duplo Cristal',
        sizeOrCapacity: '1.000 ml',
        color: 'Transparente',
        price: 36.90,
        promotionalPrice: 29.90,
        stock: 3
      }
    ],
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    tags: ['Frios Frescos', 'Anti-odor', 'Geladeira Limpa', 'Livre de BPA'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'Potes Herméticos de Vidro com Tampa Bambu',
    subtitle: 'Mantenha sua cozinha organizada, seus alimentos frescos e livres de umidade com elegância escandinava.',
    badgeText: 'LANÇAMENTO EXCLUSIVO',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&auto=format&fit=crop&q=80',
    linkCategory: 'potes-vidro-hermeticos',
    buttonText: 'Explorar Linha Bambu',
    order: 1,
    isActive: true
  },
  {
    id: 'ban-2',
    title: 'Transforme sua Geladeira & Despensa',
    subtitle: 'Caixas de acrílico cristal com cesto drenante e recipientes modulares empilháveis.',
    badgeText: 'ATÉ 30% OFF',
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=1400&auto=format&fit=crop&q=80',
    linkCategory: 'organizadores-geladeira',
    buttonText: 'Ver Organizadores',
    order: 2,
    isActive: true
  }
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'BEMVINDO10',
    type: 'percent',
    value: 10,
    minOrderValue: 50.00,
    usageLimit: 500,
    timesUsed: 42,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'VASILHA15',
    type: 'fixed',
    value: 15,
    minOrderValue: 90.00,
    usageLimit: 200,
    timesUsed: 18,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'POTELIMPO',
    type: 'percent',
    value: 15,
    minOrderValue: 120.00,
    usageLimit: 100,
    timesUsed: 5,
    isActive: true
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    code: 'VP-84210',
    customer: {
      name: 'Mariana Duarte Silva',
      phone: '(11) 98765-4321',
      email: 'mariana.duarte@gmail.com'
    },
    address: {
      cep: '04543-000',
      street: 'Rua Afonso Braz',
      number: '450',
      complement: 'Apto 62',
      neighborhood: 'Vila Nova Conceição',
      city: 'São Paulo',
      state: 'SP',
      notes: 'Deixar na portaria com o zelador'
    },
    deliveryMethod: 'local',
    deliveryFee: 14.90,
    items: [
      {
        productId: 'prod-1',
        variationId: 'var-1-1',
        name: 'Kit 4 Potes Herméticos de Vidro Borossilicato com Tampa de Bambu',
        sku: 'POT-BAMBU-KIT',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
        unitPrice: 119.90,
        quantity: 1,
        totalPrice: 119.90,
        variationName: 'Kit Completo 4 Peças'
      },
      {
        productId: 'prod-2',
        variationId: 'var-2-2',
        name: 'Organizador de Geladeira Cristal com Alça e Cesto Drenante',
        sku: 'ORG-GEL-GRA',
        image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=400&auto=format&fit=crop&q=80',
        unitPrice: 49.90,
        quantity: 2,
        totalPrice: 99.80,
        variationName: 'Tamanho Grande (3,2L)'
      }
    ],
    subtotal: 219.70,
    discount: 21.97,
    total: 212.63,
    couponCode: 'BEMVINDO10',
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    status: 'delivered',
    statusHistory: [
      { status: 'received', date: '2026-11-06T10:15:00.000Z', note: 'Pedido recebido com sucesso' },
      { status: 'confirmed', date: '2026-11-06T10:16:30.000Z', note: 'Pagamento Pix aprovado' },
      { status: 'preparing', date: '2026-11-06T11:00:00.000Z', note: 'Produtos embalados com plástico bolha' },
      { status: 'out_for_delivery', date: '2026-11-06T14:20:00.000Z', note: 'Entregador João a caminho' },
      { status: 'delivered', date: '2026-11-06T15:45:00.000Z', note: 'Entregue na portaria' }
    ],
    createdAt: '2026-11-06T10:15:00.000Z',
    updatedAt: '2026-11-06T15:45:00.000Z'
  },
  {
    id: 'ord-102',
    code: 'VP-91823',
    customer: {
      name: 'Carlos Eduardo Mendes',
      phone: '(11) 97123-8899',
      email: 'carlos.mendes@outlook.com'
    },
    address: {
      cep: '01310-100',
      street: 'Av. Paulista',
      number: '1200',
      complement: 'Conj 41',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    },
    deliveryMethod: 'pickup',
    deliveryFee: 0,
    items: [
      {
        productId: 'prod-3',
        variationId: 'var-3-1',
        name: 'Vasilha Marmita Bento Hermética com 3 Divisórias e Travas',
        sku: 'VAS-MARM-VERDE',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        unitPrice: 38.90,
        quantity: 2,
        totalPrice: 77.80,
        variationName: 'Verde Sálvia'
      }
    ],
    subtotal: 77.80,
    discount: 0,
    total: 77.80,
    paymentMethod: 'pay_on_pickup',
    paymentStatus: 'paid',
    status: 'ready_for_pickup',
    statusHistory: [
      { status: 'received', date: '2026-11-07T14:10:00.000Z', note: 'Pedido recebido para retirada' },
      { status: 'confirmed', date: '2026-11-07T14:12:00.000Z', note: 'Pedido confirmado pela loja' },
      { status: 'ready_for_pickup', date: '2026-11-07T15:00:00.000Z', note: 'Disponível no balcão de retirada' }
    ],
    createdAt: '2026-11-07T14:10:00.000Z',
    updatedAt: '2026-11-07T15:00:00.000Z'
  },
  {
    id: 'ord-103',
    code: 'VP-99451',
    customer: {
      name: 'Juliana Alencar Peixoto',
      phone: '(11) 99122-3344',
      email: 'juliana.peixoto@uol.com.br'
    },
    address: {
      cep: '04012-010',
      street: 'Rua Domingos de Morais',
      number: '980',
      neighborhood: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP'
    },
    deliveryMethod: 'local',
    deliveryFee: 14.90,
    items: [
      {
        productId: 'prod-5',
        variationId: 'var-5-1',
        name: 'Kit 12 Potes Porta-Temperos em Vidro com Tampa Dupla e Etiquetas Lousa',
        sku: 'TEMP-KIT-12-INX',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
        unitPrice: 74.90,
        quantity: 1,
        totalPrice: 74.90,
        variationName: 'Kit 12 Potes + Tampas Inox'
      }
    ],
    subtotal: 74.90,
    discount: 0,
    total: 89.80,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    changeFor: 100.00,
    status: 'preparing',
    statusHistory: [
      { status: 'received', date: '2026-11-08T09:20:00.000Z', note: 'Recebido com pagamento em dinheiro na entrega' },
      { status: 'confirmed', date: '2026-11-08T09:25:00.000Z', note: 'Confirmado pelo atendente' },
      { status: 'preparing', date: '2026-11-08T10:00:00.000Z', note: 'Em separação no estoque' }
    ],
    createdAt: '2026-11-08T09:20:00.000Z',
    updatedAt: '2026-11-08T10:00:00.000Z'
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Mariana Duarte Silva',
    phone: '(11) 98765-4321',
    email: 'mariana.duarte@gmail.com',
    totalOrders: 1,
    totalSpent: 212.63,
    lastOrderDate: '2026-11-06T10:15:00.000Z'
  },
  {
    id: 'cust-2',
    name: 'Carlos Eduardo Mendes',
    phone: '(11) 97123-8899',
    email: 'carlos.mendes@outlook.com',
    totalOrders: 1,
    totalSpent: 77.80,
    lastOrderDate: '2026-11-07T14:10:00.000Z'
  },
  {
    id: 'cust-3',
    name: 'Juliana Alencar Peixoto',
    phone: '(11) 99122-3344',
    email: 'juliana.peixoto@uol.com.br',
    totalOrders: 1,
    totalSpent: 89.80,
    lastOrderDate: '2026-11-08T09:20:00.000Z'
  }
];

const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    productId: 'prod-1',
    productName: 'Kit 4 Potes Herméticos de Vidro Borossilicato com Tampa de Bambu',
    variationName: 'Kit Completo 4 Peças',
    type: 'in',
    quantity: 30,
    previousStock: 0,
    newStock: 30,
    reason: 'Entrada de lote inicial do fornecedor',
    date: '2026-11-01T08:00:00.000Z'
  },
  {
    id: 'mov-2',
    productId: 'prod-1',
    productName: 'Kit 4 Potes Herméticos de Vidro Borossilicato com Tampa de Bambu',
    variationName: 'Kit Completo 4 Peças',
    type: 'order_reservation',
    quantity: -1,
    previousStock: 30,
    newStock: 29,
    reason: 'Baixa automática pelo pedido VP-84210',
    date: '2026-11-06T10:16:30.000Z'
  },
  {
    id: 'mov-3',
    productId: 'prod-8',
    productName: 'Porta-Frios Duplo Hermético com Tampa e Divisória Removível',
    type: 'adjustment',
    quantity: -2,
    previousStock: 5,
    newStock: 3,
    reason: 'Ajuste manual de quebra no mostruário da loja',
    date: '2026-11-07T11:30:00.000Z'
  }
];

// In-Memory & LocalStorage persistent wrapper with subscription
class StoreDatabase {
  private listeners: Set<() => void> = new Set();

  private load<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao carregar do localStorage:', key, e);
    }
    return defaultValue;
  }

  private save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', key, e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Erro no listener da StoreDatabase:', err);
      }
    });
  }

  // --- Settings ---
  public getSettings(): StoreSettings {
    return this.load<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  public updateSettings(partial: Partial<StoreSettings>): StoreSettings {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    this.save(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return this.load<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  public saveCategory(category: Category): void {
    const list = this.getCategories();
    const index = list.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      list[index] = category;
    } else {
      list.push(category);
    }
    this.save(STORAGE_KEYS.CATEGORIES, list);
  }

  public deleteCategory(id: string): void {
    const list = this.getCategories().filter((c) => c.id !== id);
    this.save(STORAGE_KEYS.CATEGORIES, list);
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.load<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  public getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find((p) => p.slug === slug);
  }

  public saveProduct(product: Product): void {
    const list = this.getProducts();
    const index = list.findIndex((p) => p.id === product.id);
    product.updatedAt = new Date().toISOString();
    if (index >= 0) {
      list[index] = product;
    } else {
      product.createdAt = new Date().toISOString();
      list.unshift(product);
    }
    this.save(STORAGE_KEYS.PRODUCTS, list);
  }

  public deleteProduct(id: string): void {
    const list = this.getProducts().filter((p) => p.id !== id);
    this.save(STORAGE_KEYS.PRODUCTS, list);
  }

  // --- Banners ---
  public getBanners(): Banner[] {
    return this.load<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  }

  public saveBanner(banner: Banner): void {
    const list = this.getBanners();
    const index = list.findIndex((b) => b.id === banner.id);
    if (index >= 0) {
      list[index] = banner;
    } else {
      list.push(banner);
    }
    this.save(STORAGE_KEYS.BANNERS, list);
  }

  public deleteBanner(id: string): void {
    const list = this.getBanners().filter((b) => b.id !== id);
    this.save(STORAGE_KEYS.BANNERS, list);
  }

  // --- Coupons ---
  public getCoupons(): Coupon[] {
    return this.load<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  public saveCoupon(coupon: Coupon): void {
    const list = this.getCoupons();
    const index = list.findIndex((c) => c.id === coupon.id);
    if (index >= 0) {
      list[index] = coupon;
    } else {
      list.unshift(coupon);
    }
    this.save(STORAGE_KEYS.COUPONS, list);
  }

  public deleteCoupon(id: string): void {
    const list = this.getCoupons().filter((c) => c.id !== id);
    this.save(STORAGE_KEYS.COUPONS, list);
  }

  public validateCoupon(code: string, currentSubtotal: number): { valid: boolean; coupon?: Coupon; error?: string; discountAmount: number } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.getCoupons().find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!coupon) {
      return { valid: false, error: 'Cupom não encontrado ou inativo.', discountAmount: 0 };
    }

    if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, error: 'Este cupom já atingiu o limite de utilizações.', discountAmount: 0 };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return { valid: false, error: 'Este cupom já expirou.', discountAmount: 0 };
    }

    if (currentSubtotal < coupon.minOrderValue) {
      return {
        valid: false,
        error: `Valor mínimo para este cupom é de R$ ${coupon.minOrderValue.toFixed(2).replace('.', ',')}.`,
        discountAmount: 0
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = (currentSubtotal * coupon.value) / 100;
    } else {
      discountAmount = Math.min(coupon.value, currentSubtotal);
    }

    return { valid: true, coupon, discountAmount: Number(discountAmount.toFixed(2)) };
  }

  // --- Inventory & Stock ---
  public getMovements(): InventoryMovement[] {
    return this.load<InventoryMovement[]>(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  }

  public addStockMovement(data: Omit<InventoryMovement, 'id' | 'date'>): InventoryMovement {
    const movement: InventoryMovement = {
      ...data,
      id: 'mov-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      date: new Date().toISOString()
    };
    const list = this.getMovements();
    list.unshift(movement);
    this.save(STORAGE_KEYS.MOVEMENTS, list);
    return movement;
  }

  public adjustStock(
    productId: string,
    quantityDelta: number,
    type: InventoryMovement['type'],
    reason: string,
    variationId?: string
  ): boolean {
    const products = this.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    if (variationId && product.variations && product.variations.length > 0) {
      const variation = product.variations.find((v) => v.id === variationId);
      if (!variation) return false;

      const previousStock = variation.stock;
      const newStock = Math.max(0, previousStock + quantityDelta);
      variation.stock = newStock;

      // Recalculate total product stock
      product.stock = product.variations.reduce((sum, v) => sum + v.stock, 0);

      this.addStockMovement({
        productId,
        productName: product.name,
        variationId,
        variationName: variation.name,
        type,
        quantity: quantityDelta,
        previousStock,
        newStock,
        reason
      });
    } else {
      const previousStock = product.stock;
      const newStock = Math.max(0, previousStock + quantityDelta);
      product.stock = newStock;

      this.addStockMovement({
        productId,
        productName: product.name,
        type,
        quantity: quantityDelta,
        previousStock,
        newStock,
        reason
      });
    }

    this.save(STORAGE_KEYS.PRODUCTS, products);
    return true;
  }

  // --- Orders & Checkout Server-Style Recalculation ---
  public getOrders(): Order[] {
    return this.load<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  public getOrderByCode(code: string): Order | undefined {
    return this.getOrders().find(
      (o) => o.code.toUpperCase() === code.trim().toUpperCase()
    );
  }

  public getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  /**
   * Recalculates cart items using strictly the database prices (anti-tampering),
   * applies coupon discounts and calculates delivery fee based on store settings.
   */
  public recalculateCart(
    items: { productId: string; variationId?: string; quantity: number }[],
    couponCode?: string,
    deliveryMethod: DeliveryMethod = 'pickup',
    paymentMethod: string = 'pix'
  ): {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    pixDiscount: number;
    total: number;
    itemsValidated: CartItem[];
    errors: string[];
  } {
    const settings = this.getSettings();
    const products = this.getProducts();
    const errors: string[] = [];
    const itemsValidated: CartItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId && p.isActive);
      if (!product) {
        errors.push(`Produto não encontrado ou indisponível.`);
        continue;
      }

      let unitPrice = product.promotionalPrice && product.promotionalPrice > 0
        ? product.promotionalPrice
        : product.price;
      let maxStock = product.stock;
      let variationName: string | undefined;

      if (item.variationId && product.variations && product.variations.length > 0) {
        const variation = product.variations.find((v) => v.id === item.variationId);
        if (variation) {
          unitPrice = variation.promotionalPrice && variation.promotionalPrice > 0
            ? variation.promotionalPrice
            : variation.price;
          maxStock = variation.stock;
          variationName = variation.name;
        }
      }

      const safeQuantity = Math.max(1, Math.min(item.quantity, maxStock));
      if (maxStock <= 0) {
        errors.push(`Item "${product.name}" esgotado.`);
        continue;
      }

      const itemTotal = unitPrice * safeQuantity;
      subtotal += itemTotal;

      itemsValidated.push({
        productId: product.id,
        variationId: item.variationId,
        name: product.name,
        image: product.images[0] || '/icon.svg',
        price: product.price,
        promotionalPrice: product.promotionalPrice,
        quantity: safeQuantity,
        capacity: product.capacity,
        material: product.material,
        variationName,
        maxStock
      });
    }

    // Coupon discount
    let couponDiscount = 0;
    if (couponCode) {
      const validation = this.validateCoupon(couponCode, subtotal);
      if (validation.valid) {
        couponDiscount = validation.discountAmount;
      }
    }

    // Delivery fee is 0 (freight calculation disabled per store configuration)
    const deliveryFee = 0;

    // Pix discount if configured
    let pixDiscount = 0;
    const baseAfterCoupon = Math.max(0, subtotal - couponDiscount);
    if (paymentMethod === 'pix' && settings.pixDiscountPercent > 0) {
      pixDiscount = Number(((baseAfterCoupon * settings.pixDiscountPercent) / 100).toFixed(2));
    }

    const totalDiscount = Number((couponDiscount + pixDiscount).toFixed(2));
    const total = Number(Math.max(0, subtotal - totalDiscount).toFixed(2));

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: totalDiscount,
      deliveryFee: Number(deliveryFee.toFixed(2)),
      pixDiscount,
      total,
      itemsValidated,
      errors
    };
  }

  /**
   * Places a new order, safely decreases inventory, records customer, and emits status history
   */
  public placeOrder(orderData: Omit<Order, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'statusHistory'>): { success: boolean; order?: Order; error?: string } {
    const products = this.getProducts();

    // 1. Verify stock availability first (idempotent / transactional protection)
    for (const item of orderData.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) return { success: false, error: `Produto "${item.name}" não existe mais.` };

      if (item.variationId && prod.variations) {
        const v = prod.variations.find((v) => v.id === item.variationId);
        if (!v || v.stock < item.quantity) {
          return { success: false, error: `Estoque insuficiente para "${item.name} (${item.variationName || ''})".` };
        }
      } else {
        if (prod.stock < item.quantity) {
          return { success: false, error: `Estoque insuficiente para "${item.name}".` };
        }
      }
    }

    // 2. Generate random non-sequential human readable code
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `VP-${randomSuffix}`;

    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      code: orderCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'received',
          date: new Date().toISOString(),
          note: 'Pedido recebido pelo sistema da loja'
        }
      ]
    };

    // 3. Atomically deduct inventory
    for (const item of orderData.items) {
      this.adjustStock(
        item.productId,
        -item.quantity,
        'order_reservation',
        `Reserva para o pedido ${orderCode}`,
        item.variationId
      );
    }

    // 4. Update coupon usage
    if (orderData.couponCode) {
      const coupons = this.getCoupons();
      const coup = coupons.find((c) => c.code.toUpperCase() === orderData.couponCode?.toUpperCase());
      if (coup) {
        coup.timesUsed = (coup.timesUsed || 0) + 1;
        this.save(STORAGE_KEYS.COUPONS, coupons);
      }
    }

    // 5. Save order
    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.save(STORAGE_KEYS.ORDERS, orders);

    // 6. Update or create Customer profile
    this.upsertCustomer(orderData.customer, newOrder);

    // 7. Clear cart
    this.clearCart();

    return { success: true, order: newOrder };
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): boolean {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    const oldStatus = order.status;
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (newStatus === 'delivered' || newStatus === 'confirmed') {
      if (order.paymentMethod === 'pix' || order.paymentMethod === 'credit_card') {
        order.paymentStatus = 'paid';
      }
    }

    order.statusHistory.push({
      status: newStatus,
      date: new Date().toISOString(),
      note: note || `Status alterado para ${newStatus}`
    });

    // If order is cancelled, restore stock!
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      order.paymentStatus = 'cancelled';
      for (const item of order.items) {
        this.adjustStock(
          item.productId,
          item.quantity,
          'order_cancellation',
          `Reposição automática por cancelamento do pedido ${order.code}`,
          item.variationId
        );
      }
    }

    this.save(STORAGE_KEYS.ORDERS, orders);
    return true;
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    return this.load<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  private upsertCustomer(customerInfo: Order['customer'], order: Order): void {
    const customers = this.getCustomers();
    const cleanPhone = customerInfo.phone.replace(/\D/g, '');
    let existing = customers.find(
      (c) => c.phone.replace(/\D/g, '') === cleanPhone || (c.email && customerInfo.email && c.email.toLowerCase() === customerInfo.email.toLowerCase())
    );

    if (existing) {
      existing.name = customerInfo.name;
      existing.totalOrders += 1;
      existing.totalSpent += order.total;
      existing.lastOrderDate = new Date().toISOString();
      if (order.address) {
        existing.addresses = existing.addresses || [];
        existing.addresses.push(order.address);
      }
    } else {
      existing = {
        id: 'cust-' + Date.now(),
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrderDate: new Date().toISOString(),
        addresses: order.address ? [order.address] : []
      };
      customers.push(existing);
    }

    this.save(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // --- Cart local state ---
  public getCart(): CartItem[] {
    return this.load<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  public addToCart(item: CartItem): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (c) => c.productId === item.productId && c.variationId === item.variationId
    );

    if (existingIndex >= 0) {
      const newQty = cart[existingIndex].quantity + item.quantity;
      cart[existingIndex].quantity = Math.min(newQty, item.maxStock);
    } else {
      cart.push(item);
    }

    this.save(STORAGE_KEYS.CART, cart);
  }

  public updateCartQuantity(productId: string, variationId: string | undefined, quantity: number): void {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(
        (c) => !(c.productId === productId && c.variationId === variationId)
      );
    } else {
      const item = cart.find(
        (c) => c.productId === productId && c.variationId === variationId
      );
      if (item) {
        item.quantity = Math.min(quantity, item.maxStock);
      }
    }
    this.save(STORAGE_KEYS.CART, cart);
  }

  public removeFromCart(productId: string, variationId?: string): void {
    const cart = this.getCart().filter(
      (c) => !(c.productId === productId && c.variationId === variationId)
    );
    this.save(STORAGE_KEYS.CART, cart);
  }

  public clearCart(): void {
    this.save(STORAGE_KEYS.CART, []);
  }
}

export const db = new StoreDatabase();
