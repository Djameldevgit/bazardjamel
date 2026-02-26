require('dotenv').config()
//require('./cronJobs/DeleteUsersNoVerified');
//const { autoUnblockUsers } = require('./controllers/autoUnBlockUser');

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const SocketServer = require('./socketServer')
const morgan = require('morgan');
const path = require('path')
// --- Cloudinary ---
const cloudinary = require('cloudinary').v2;

 
cloudinary.config({
    cloud_name: 'dfjipgj2o',
    api_key: '213981915435275',
    api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
console.log('☁️ Cloudinary configurado correctamente');

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'));

// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    SocketServer(socket)
})
 
cloudinary.config({
    cloud_name: 'dfjipgj2o',
    api_key: '213981915435275',
    api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
console.log('☁️ Cloudinary configurado correctamente');
 

// Routes
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
app.use('/api', require('./routes/boutiquePostRouter'));
//setInterval(autoUnblockUsers, 5 * 60 * 1000);

const URI = process.env.MONGODB_URI;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})