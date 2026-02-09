require('dotenv').config();
const { autoUnblockUsers } = require('./controllers/autoUnBlockUser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const i18n = require('i18n');
const SocketServer = require('./socketServer');
const morgan = require('morgan');

// --- Cloudinary ---
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dfjipgj2o',
    api_key: '213981915435275',
    api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
console.log('☁️ Cloudinary configurado correctamente');

// --- Express ---
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// --- i18n ---
i18n.configure({
  locales: ['en', 'es', 'fr', 'ar', 'ru', 'kab', 'chino'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  objectNotation: true,
  updateFiles: false
});
app.use(i18n.init);

// --- Socket ---
const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on('connection', socket => SocketServer(socket));

// --- Routes ---
app.get('/api/set-language', (req, res) => {
  const lang = req.query.lang;
  if (lang && i18n.getLocales().includes(lang)) {
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false });
    res.send({ message: `Idioma cambiado a ${lang}` });
  } else {
    res.status(400).send({ error: 'Idioma no válido' });
  }
});

// Todas las rutas de API
app.use('/api', require('./routes/authRouter'));

// ✅ ¡IMPORTANTE! Agrega el router de categorías
app.use('/api/categories', require('./routes/categoryRouter')); // ← AQUÍ ESTÁ

app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
app.use('/api', require('./routes/languageRouter'));
app.use('/api', require('./routes/rolesRouter'));
app.use('/api', require('./routes/userActionRouter'));
app.use('/api', require('./routes/blockUserRouter'));
app.use('/api', require('./routes/reportRouter'));
app.use('/api/blog/comments', require('./routes/blogCommentRoutes'));
app.use('/api/forms', require('./routes/formRouter'));
app.use('/api', require('./routes/privacysettingsRouter'));
app.use("/api", require("./routes/settingsRouter"));
app.use('/api', require('./routes/boutiqueRouter'));
// app.js - DESPUÉS de app.use(express.json());

// 🔧 DEBUG: Interceptar TODAS las rutas
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.originalUrl} - ${new Date().toLocaleTimeString()}`);
  
  // Interceptar específicamente POST /api/posts
  if (req.method === 'POST' && req.originalUrl === '/api/posts') {
      console.log('🎯 INTERCEPTADO POST /api/posts');
      console.log('📦 Headers:', req.headers);
      console.log('👤 req.user:', req.user);
      console.log('📝 Body:', req.body);
      
      // Forzar ir al controlador createPost
      console.log('🚀 Redirigiendo a postCtrl.createPost...');
      const postCtrl = require('./controllers/postCtrl');
      return postCtrl.createPost(req, res, next);
  }
  
  next();
});
setInterval(autoUnblockUsers, 5 * 60 * 1000);

// --- MongoDB ---
const URI = process.env.MONGODB_URI;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to mongodb'))
.catch(err => console.error('Error connecting:', err));

// --- Producción ---
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

// --- Start Server ---
const port = process.env.PORT || 5000;
http.listen(port, () => {
 
  
});