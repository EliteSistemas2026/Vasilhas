export const SUPABASE_MIGRATION_SQL = `-- ============================================================
-- VASILHA & CIA - MIGRATION COMPLETA SUPABASE POSTGRESQL
-- Loja Virtual de Vasilhas, Potes e Utilidades Domésticas
-- ============================================================

-- 1. Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Configurações da Loja
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name VARCHAR(150) NOT NULL DEFAULT 'Vasilha & Cia',
    slogan VARCHAR(255) DEFAULT 'Potes herméticos, vasilhas e organizadores inteligentes',
    logo_url TEXT,
    whatsapp VARCHAR(20) NOT NULL DEFAULT '5511999998888',
    phone VARCHAR(20) DEFAULT '(11) 3456-7890',
    email VARCHAR(120) DEFAULT 'contato@vasilhaecia.com.br',
    address TEXT DEFAULT 'Av. das Utilidades, 1500',
    neighborhood VARCHAR(100) DEFAULT 'Centro',
    city VARCHAR(100) DEFAULT 'São Paulo',
    state VARCHAR(2) DEFAULT 'SP',
    opening_hours VARCHAR(150) DEFAULT 'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00',
    instagram VARCHAR(80) DEFAULT '@vasilhaecia',
    min_order_value NUMERIC(10, 2) DEFAULT 30.00,
    free_shipping_min NUMERIC(10, 2) DEFAULT 199.00,
    local_delivery_fee NUMERIC(10, 2) DEFAULT 12.00,
    pix_discount_percent NUMERIC(5, 2) DEFAULT 5.00,
    pix_key VARCHAR(150) DEFAULT 'contato@vasilhaecia.com.br',
    pix_key_type VARCHAR(20) DEFAULT 'email',
    pix_receiver_name VARCHAR(150) DEFAULT 'Vasilha & Cia Comércio de Utilidades LTDA',
    payment_methods JSONB DEFAULT '{"pix": true, "creditCard": true, "cashOnDelivery": true, "payOnPickup": true}'::jsonb,
    delivery_rules JSONB DEFAULT '{"pickupEnabled": true, "localDeliveryEnabled": true, "shippingEnabled": true}'::jsonb,
    return_policy TEXT DEFAULT 'Aceitamos devoluções em até 7 dias corridos após o recebimento.',
    privacy_policy TEXT DEFAULT 'Seus dados de contato e endereço são utilizados exclusivamente para entrega.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    sku VARCHAR(80) NOT NULL UNIQUE,
    barcode VARCHAR(80),
    description TEXT NOT NULL,
    material VARCHAR(120) NOT NULL,
    capacity VARCHAR(60) NOT NULL,
    dimensions VARCHAR(100) NOT NULL,
    cost_price NUMERIC(10, 2) DEFAULT 0.00,
    price NUMERIC(10, 2) NOT NULL,
    promotional_price NUMERIC(10, 2),
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    images JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Variações de Produto
CREATE TABLE IF NOT EXISTS public.product_variations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    size_or_capacity VARCHAR(60) NOT NULL,
    color VARCHAR(60),
    price NUMERIC(10, 2) NOT NULL,
    promotional_price NUMERIC(10, 2),
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Banners Promocionais
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    badge_text VARCHAR(60),
    image_url TEXT NOT NULL,
    link_category VARCHAR(100),
    button_text VARCHAR(60) DEFAULT 'Ver Ofertas',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Cupons de Desconto
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percent', 'fixed')),
    value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0.00,
    usage_limit INT DEFAULT 1000,
    times_used INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    email VARCHAR(120),
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    last_order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(25) NOT NULL,
    customer_email VARCHAR(120),
    delivery_method VARCHAR(30) NOT NULL CHECK (delivery_method IN ('pickup', 'local', 'standard')),
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    address JSONB,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    coupon_code VARCHAR(50),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'cash_on_delivery', 'pay_on_pickup')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
    change_for NUMERIC(10, 2),
    status VARCHAR(30) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled')),
    status_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variation_id UUID REFERENCES public.product_variations(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(80) NOT NULL,
    image_url TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    variation_name VARCHAR(150)
);

-- 11. Tabela de Movimentações de Estoque
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name VARCHAR(200) NOT NULL,
    variation_id UUID REFERENCES public.product_variations(id) ON DELETE SET NULL,
    variation_name VARCHAR(150),
    type VARCHAR(30) NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'order_reservation', 'order_cancellation')),
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Leitura pública para a vitrine
CREATE POLICY "Permitir leitura pública de configurações" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de categorias ativas" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir leitura pública de produtos ativos" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir leitura pública de variações" ON public.product_variations FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de banners ativos" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir leitura pública de cupons ativos" ON public.coupons FOR SELECT USING (is_active = true);

-- Inserção pública de pedidos e itens (checkout anônimo)
CREATE POLICY "Permitir criação pública de pedidos" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de pedido pelo código público" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de itens no pedido" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de itens do pedido" ON public.order_items FOR SELECT USING (true);

-- Acesso administrativo total
CREATE POLICY "Admin total store_settings" ON public.store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total variations" ON public.product_variations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total banners" ON public.banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total coupons" ON public.coupons FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total order_items" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total inventory_movements" ON public.inventory_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- TRIGGERS E FUNÇÕES AUTOMÁTICAS
-- ============================================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
`;
