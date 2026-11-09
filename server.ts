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
  inventoryMovements
} from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';

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

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.id));
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Erro ao carregar produtos do banco' });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const allCats = await db.select().from(categories).orderBy(categories.displayOrder);
    res.json(allCats);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Erro ao carregar categorias' });
  }
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const settingsList = await db.select().from(storeSettings).limit(1);
    res.json(settingsList[0] || null);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Erro ao carregar configurações' });
  }
});

// Orders API (Tracking by Code)
app.get('/api/orders/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const result = await db.select().from(orders).where(eq(orders.code, code)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching order by code:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// Image Upload Endpoint (handles data URL or image store)
app.post('/api/upload', (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida' });
    }
    // Return data URL directly or cloud storage URL
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
