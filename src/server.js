const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

// Pastikan dotenv memuat file dari root project (bukan dari /src)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Debug log: tampilkan variabel env yang terbaca
console.log('🔧 Loaded DB configuration:');
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'marsel',
  database: process.env.DB_NAME || 'food_delivery',
  port: process.env.DB_PORT || 3306
});

// Try connecting to the database
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:');
    console.error(err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// ✅ Import order routes
const orderRoutes = require('./routes/orderRoutes.js'); // pastikan path ini sesuai struktur foldermu
app.use('/orders', orderRoutes); // semua endpoint diawali /orders
const restaurantRoutes = require('./routes/restaurantRoutes.js');
app.use('/restaurants', restaurantRoutes);
const menuRoutes = require("./routes/menuRoutes.js");
app.use("/restaurants/:restaurantId/menus", menuRoutes);


// Simple test route
app.get('/', (req, res) => {
  res.send('🍔 Order Service is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
