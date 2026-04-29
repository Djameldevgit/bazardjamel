require('dotenv').config()
//require('./cronJobs/DeleteUsersNoVerified');
//const { autoUnblockUsers } = require('./controllers/autoUnBlockUser');

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const path = require('path')

// --- Cloudinary ---
const cloudinary = require('cloudinary').v2;

// ============================================
// 1️⃣ INICIALIZAR APP
// ============================================
const app = express()

// ============================================
// 2️⃣ MIDDLEWARES GLOBALES
// ============================================
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'));

// ============================================
// 3️⃣ SOCKET.IO
// ============================================
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const SocketServer = require('./socketServer')

io.on('connection', socket => {
    SocketServer(socket)
})

// ============================================
// 4️⃣ CLOUDINARY CONFIGURATION
// ============================================
cloudinary.config({
    cloud_name: 'dfjipgj2o',
    api_key: '213981915435275',
    api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
console.log('☁️ Cloudinary configurado correctamente');

// ============================================
// 5️⃣ RUTAS API (organizadas por categoría)
// ============================================

// --- Autenticación y Usuarios ---
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/userActionRouter'));
app.use('/api', require('./routes/rolesRouter'));

// --- Categorías ---
app.use('/api/categories', require('./routes/categoryRouter'));

// --- Posts y Comentarios ---
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));

// --- Boutiques y Productos ---
app.use('/api', require('./routes/boutiqueRouter'));
app.use('/api', require('./routes/boutiqueProductRouter'));

// --- Mensajes y Notificaciones ---
app.use('/api', require('./routes/messageRouter'));
app.use('/api', require('./routes/notifyRouter'));

// --- Reportes y Bloqueos ---
app.use('/api', require('./routes/reportRouter'));

app.use('/api', require('./routes/videoRouter'));
app.use('/api', require('./routes/imageRouter'));
// --- Configuración y Settings ---
app.use('/api', require('./routes/languageRouter'));
app.use('/api', require('./routes/privacysettingsRouter'));
app.use("/api", require("./routes/settingsRouter"));
app.use('/api', require('./routes/carouselHomeRouter'));

// --- Formularios y Blogs ---
app.use('/api/forms', require('./routes/formRouter'));
app.use('/api/blog/comments', require('./routes/blogCommentRoutes'));

// ============================================
// 6️⃣ TAREAS PROGRAMADAS (comentadas)
// ============================================
// setInterval(autoUnblockUsers, 5 * 60 * 1000);

// ============================================
// 7️⃣ CONEXIÓN A MONGODB
// ============================================
const URI = process.env.MONGODB_URI;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('✅ Connected to mongodb')
})

// ============================================
// 8️⃣ PRODUCCIÓN - SERVIR CLIENTE REACT
// ============================================
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// ============================================
// 9️⃣ INICIAR SERVIDOR
// ============================================
const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`)
})