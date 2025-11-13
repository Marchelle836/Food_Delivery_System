const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5002;


app.use(cors());
app.use(express.json());


console.log('🔧 Loaded DB configuration:');
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});


const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'marsel',
  database: process.env.DB_NAME || 'food_delivery',
  port: process.env.DB_PORT || 3306
});


db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:');
    console.error(err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});


const orderRoutes = require('./routes/orderRoutes.js'); 
app.use('/orders', orderRoutes); 


app.get('/', (req, res) => {
  res.send('🍔 Order Service is running!');
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
