import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/db/index.ts';
import {
  products,
  categories,
  orders,
  storeSettings,
  coupons,
  banners,
  customers,
  inventoryMovements,
  adminUsers,
  accountsReceivable,
  accountsPayable
} from './src/db/schema.ts';
import { eq, desc, and } from 'drizzle-orm';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Bootstrap API (loads complete database state in 1 fast query)
app.get('/api/bootstrap', async (req, res) => {
  try {
    const [
      allSettings,
      allProducts,
      allCategories,
      allOrders,
      allCoupons,
      allBanners,
      allCustomers,
      allMovements,
      allUsers,
      allReceivables,
      allPayables
    ] = await Promise.all([
      db.select().from(storeSettings).limit(1),
      db.select().from(products).orderBy(desc(products.id)),
      db.select().from(categories).orderBy(categories.displayOrder),
      db.select().from(orders).orderBy(desc(orders.id)),
      db.select().from(coupons).orderBy(desc(coupons.id)),
      db.select().from(banners).orderBy(banners.displayOrder),
      db.select().from(customers).orderBy(desc(customers.id)),
      db.select().from(inventoryMovements).orderBy(desc(inventoryMovements.id)),
      db.select().from(adminUsers).orderBy(adminUsers.id),
      db.select().from(accountsReceivable).orderBy(desc(accountsReceivable.id)),
      db.select().from(accountsPayable).orderBy(desc(accountsPayable.id))
    ]);

    res.json({
      settings: allSettings[0] || null,
      products: allProducts,
      categories: allCategories,
      orders: allOrders,
      coupons: allCoupons,
      banners: allBanners,
      customers: allCustomers,
      movements: allMovements,
      users: allUsers.map((u) => ({
        id: String(u.id),
        name: u.name,
        email: u.email,
        role: u.role,
        roleLabel: u.roleLabel,
        privileges: u.privileges,
        isActive: u.isActive,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin
      })),
      receivables: allReceivables,
      payables: allPayables
    });
  } catch (error) {
    console.error('Error fetching bootstrap data:', error);
    res.status(500).json({ error: 'Erro ao carregar dados do banco de dados' });
  }
});

// Authentication API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Check in database adminUsers table
    const userMatch = await db
      .select()
      .from(adminUsers)
      .where(and(eq(adminUsers.email, cleanEmail), eq(adminUsers.isActive, true)))
      .limit(1);

    if (userMatch.length > 0 && userMatch[0].password === cleanPassword) {
      const u = userMatch[0];
      // Update last login
      await db
        .update(adminUsers)
        .set({ lastLogin: new Date() })
        .where(eq(adminUsers.id, u.id));

      return res.json({
        success: true,
        user: {
          id: String(u.id),
          name: u.name,
          email: u.email,
          role: u.role,
          roleLabel: u.roleLabel,
          privileges: u.privileges
        }
      });
    }

    // Special fallback for Edilson master credentials
    if (cleanEmail === 'edilson9155@gmail.com' && cleanPassword === '91550748') {
      return res.json({
        success: true,
        user: {
          id: '1',
          name: 'Edilson (Super Admin)',
          email: 'edilson9155@gmail.com',
          role: 'super_admin',
          roleLabel: 'Administrador Geral',
          privileges: {
            dashboard: true,
            productsAndStock: true,
            orders: true,
            financial: true,
            couponsAndBanners: true,
            usersAndSettings: true
          }
        }
      });
    }

    return res.status(401).json({ error: 'E-mail ou senha incorretos' });
  } catch (error) {
    console.error('Error in auth login:', error);
    res.status(500).json({ error: 'Erro ao processar autenticação' });
  }
});

// Users Management API
app.get('/api/users', async (req, res) => {
  try {
    const list = await db.select().from(adminUsers).orderBy(adminUsers.id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role, roleLabel, privileges, isActive } = req.body;
    const inserted = await db
      .insert(adminUsers)
      .values({
        name,
        email: email.trim().toLowerCase(),
        password,
        role: role || 'operator',
        roleLabel: roleLabel || 'Operador',
        privileges: privileges || {
          dashboard: true,
          productsAndStock: true,
          orders: true,
          financial: false,
          couponsAndBanners: false,
          usersAndSettings: false
        },
        isActive: isActive !== undefined ? isActive : true
      })
      .returning();
    res.json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao criar usuário' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password, role, roleLabel, privileges, isActive } = req.body;
    const updateData: any = { name, email: email?.trim().toLowerCase(), role, roleLabel, privileges, isActive };
    if (password) updateData.password = password;

    const updated = await db
      .update(adminUsers)
      .set(updateData)
      .where(eq(adminUsers.id, id))
      .returning();
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar usuário' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const target = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    if (target.length > 0 && target[0].email === 'edilson9155@gmail.com') {
      return res.status(400).json({ error: 'O Super Administrador não pode ser excluído.' });
    }
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

// Accounts Receivable API (Contas a Receber)
app.get('/api/financial/receivables', async (req, res) => {
  try {
    const list = await db.select().from(accountsReceivable).orderBy(desc(accountsReceivable.id));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar contas a receber' });
  }
});

app.post('/api/financial/receivables', async (req, res) => {
  try {
    const { description, customerName, customerPhone, orderCode, amount, dueDate, paymentMethod, status, category, notes } = req.body;
    const inserted = await db
      .insert(accountsReceivable)
      .values({
        description,
        customerName,
        customerPhone,
        orderCode,
        amount: String(amount),
        dueDate,
        paymentMethod: paymentMethod || 'Pix',
        status: status || 'pending',
        category: category || 'Venda da Loja',
        notes
      })
      .returning();
    res.json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao registrar conta a receber' });
  }
});

app.patch('/api/financial/receivables/:id/receive', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db
      .update(accountsReceivable)
      .set({
        status: 'received',
        receivedDate: new Date()
      })
      .where(eq(accountsReceivable.id, id))
      .returning();
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao baixar conta a receber' });
  }
});

app.delete('/api/financial/receivables/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(accountsReceivable).where(eq(accountsReceivable.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir conta a receber' });
  }
});

// Accounts Payable API (Contas a Pagar)
app.get('/api/financial/payables', async (req, res) => {
  try {
    const list = await db.select().from(accountsPayable).orderBy(desc(accountsPayable.id));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar contas a pagar' });
  }
});

app.post('/api/financial/payables', async (req, res) => {
  try {
    const { description, supplier, amount, dueDate, category, paymentMethod, status, barcodeOrPix, notes } = req.body;
    const inserted = await db
      .insert(accountsPayable)
      .values({
        description,
        supplier,
        amount: String(amount),
        dueDate,
        category: category || 'Fornecedores de Vasilhas',
        paymentMethod: paymentMethod || 'Boleto',
        status: status || 'pending',
        barcodeOrPix,
        notes
      })
      .returning();
    res.json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao registrar conta a pagar' });
  }
});

app.patch('/api/financial/payables/:id/pay', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db
      .update(accountsPayable)
      .set({
        status: 'paid',
        paidDate: new Date()
      })
      .where(eq(accountsPayable.id, id))
      .returning();
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar pagamento' });
  }
});

app.delete('/api/financial/payables/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(accountsPayable).where(eq(accountsPayable.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir conta a pagar' });
  }
});

// Orders API
app.get('/api/orders', async (req, res) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.id));
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar pedidos' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `VP-${randomSuffix}`;

    const inserted = await db
      .insert(orders)
      .values({
        code: orderCode,
        customerName: orderData.customer?.name || orderData.customerName || 'Cliente',
        customerPhone: orderData.customer?.phone || orderData.customerPhone || '',
        customerEmail: orderData.customer?.email || orderData.customerEmail || null,
        deliveryMethod: orderData.deliveryMethod || 'local',
        deliveryFee: '0.00',
        address: orderData.address || null,
        items: orderData.items || [],
        subtotal: String(orderData.subtotal || 0),
        discount: String(orderData.discount || 0),
        total: String(orderData.total || 0),
        paymentMethod: orderData.paymentMethod || 'pix',
        paymentStatus: orderData.paymentStatus || 'pending',
        changeFor: orderData.changeFor ? String(orderData.changeFor) : null,
        status: 'received',
        statusHistory: [
          {
            status: 'received',
            date: new Date().toISOString(),
            note: 'Pedido registrado no banco de dados'
          }
        ]
      })
      .returning();

    const createdOrder = inserted[0];

    // Automatically create Account Receivable in PostgreSQL!
    await db.insert(accountsReceivable).values({
      description: `Pedido ${orderCode} - ${orderData.customer.name}`,
      customerName: orderData.customer.name,
      customerPhone: orderData.customer.phone,
      orderId: String(createdOrder.id),
      orderCode: orderCode,
      amount: String(orderData.total),
      dueDate: new Date().toISOString().split('T')[0],
      receivedDate: orderData.paymentStatus === 'paid' ? new Date() : null,
      paymentMethod: orderData.paymentMethod.toUpperCase(),
      status: orderData.paymentStatus === 'paid' ? 'received' : 'pending',
      category: 'Venda da Loja',
      notes: `Registrado automaticamente via pedido ${orderCode}`
    });

    res.json({ success: true, order: createdOrder });
  } catch (error: any) {
    console.error('Error placing order in PostgreSQL:', error);
    res.status(500).json({ error: error.message || 'Erro ao salvar pedido no banco' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, note } = req.body;

    const currentOrder = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (currentOrder.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const history = (currentOrder[0].statusHistory as any[]) || [];
    history.push({
      status,
      date: new Date().toISOString(),
      note: note || `Status alterado para ${status}`
    });

    const updatePayload: any = {
      status,
      statusHistory: history,
      updatedAt: new Date()
    };

    if (status === 'delivered') {
      updatePayload.paymentStatus = 'paid';
    }

    const updated = await db
      .update(orders)
      .set(updatePayload)
      .where(eq(orders.id, id))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const settingsList = await db.select().from(storeSettings).limit(1);
    res.json(settingsList[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar configurações' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const payload = req.body;
    const updated = await db
      .update(storeSettings)
      .set({
        storeName: payload.storeName,
        slogan: payload.slogan,
        logoUrl: payload.logo,
        whatsapp: payload.whatsapp,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        neighborhood: payload.neighborhood,
        city: payload.city,
        state: payload.state,
        openingHours: payload.openingHours,
        instagram: payload.instagram,
        pixDiscountPercent: String(payload.pixDiscountPercent || 5),
        pixKey: payload.pixKey,
        pixReceiverName: payload.pixReceiverName,
        updatedAt: new Date()
      })
      .where(eq(storeSettings.id, 1))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar configurações no banco' });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.id));
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar produtos do banco' });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const allCats = await db.select().from(categories).orderBy(categories.displayOrder);
    res.json(allCats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar categorias' });
  }
});

// Image Upload Endpoint
app.post('/api/upload', (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida' });
    }
    res.json({ url: imageBase64, filename: filename || 'image.jpg' });
  } catch (error) {
    res.status(500).json({ error: 'Falha no processamento da imagem' });
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running with PostgreSQL Cloud SQL on port ${PORT}`);
  });
}

startServer();
