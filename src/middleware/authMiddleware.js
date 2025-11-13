const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const authenticateToken = (req, res, next) => {
  console.log('🔐 Middleware: Authentication check started');
  
  const authHeader = req.headers.authorization;
  
  console.log('📨 Request headers:', {
    authorization: authHeader ? 'Present' : 'Missing',
    'content-type': req.headers['content-type'],
    'user-agent': req.headers['user-agent']
  });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('❌ Middleware: No Bearer token found');
    return res.status(401).json({ 
      success: false,
      message: "Access token diperlukan" 
    });
  }

  const token = authHeader.split(" ")[1];
  console.log('🔑 Token received (first 10 chars):', token.substring(0, 10) + '...');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    console.log('✅ Middleware: Token valid for user:', {
      userId: decoded.userId,
      email: decoded.email
    });
    
    next();
  } catch (error) {
    console.log('❌ Middleware: Token verification failed:', error.message);
    return res.status(403).json({ 
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa" 
    });
  }
};

// Pastikan ekspor dengan benar
module.exports = {
  authenticateToken
};