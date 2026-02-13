// src/App.js o src/routes/AppRoutes.js - PARA REACT ROUTER v5
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'; // Switch en lugar de Routes para v5
import GoogleTranslateManager from './components/GoogleTraslateManager'
import { useSelector, useDispatch } from 'react-redux'
import Login from './pages/login'
import Register from './pages/register'
import { refreshToken } from './redux/actions/authAction'
import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
//mport PageRender from './customRouter/PageRender'
//import PrivateRouter from './customRouter/PrivateRouter'
import Home from './pages/home';

import NotFound from './pages/NotFound';
import CategoryPage from './pages/category/CategoryPage';
import Navbar2 from './components/header/Navbar2';
import CreateAnnoncePage from './pages/CreateAnnoncePage';
import PostId from './pages/PostId';
import DashboardPage from './pages/users/dashboardpage';
import profile from './pages/profile';
import CreateBoutiquePage from './pages/boutique/createBoutiquePage';
import BoutiquePage from './pages/boutique/BoutiquePage';
 
import BoutiquesCategoryPage from './pages/boutique/BoutiquesCategoryPage';
import MyBoutiquesPage from './pages/boutique/MyBoutiquesPage';
//import ManageBoutiquePage from './pages/boutique/ManageBoutiquePage';
//import EditBoutiquePage from './pages/boutique/EditBoutiquePage';






import roles from './pages/users/roles';
import BoutiquesListPage from './pages/boutique/BoutiquesListePage';

function App() {
  const { auth } = useSelector(state => state)
  const dispatch = useDispatch()


  const [socket, setSocket] = useState(null)

  // 🔥 CORREGIDO: Un solo useEffect para inicializar Socket.IO
  useEffect(() => {
    // Inicializar autenticación
    dispatch(refreshToken())

    // Inicializar Socket.IO solo si no está ya inicializado
    if (!socket) {
      // Asegúrate de que la URL del backend sea correcta
      const socketServer = process.env.REACT_APP_SOCKET_SERVER || 'http://localhost:5000'
      const socketInstance = io(socketServer, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      // Verificar que la instancia sea válida
      if (socketInstance && typeof socketInstance.on === 'function') {
        setSocket(socketInstance)
        dispatch({ type: GLOBALTYPES.SOCKET, payload: socketInstance })

        // Manejar eventos de conexión
        socketInstance.on('connect', () => {
          console.log('✅ Socket.IO conectado:', socketInstance.id)
        })

        socketInstance.on('connect_error', (error) => {
          console.error('❌ Error de conexión Socket.IO:', error)
        })
      } else {
        console.error('❌ No se pudo crear la instancia de Socket.IO')
      }
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [dispatch])



  return (
    <Router>
    <GoogleTranslateManager />
  
    <div className="App">
      <Navbar2 />
  
      {/* Contenedor oculto del traductor */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
  
      <Switch>
  
        {/* ============================= */}
        {/* 1️⃣ RUTAS ESTÁTICAS (SIEMPRE PRIMERO) */}
        {/* ============================= */}
  
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
  
        {/* Crear / Editar anuncio */}
        <Route exact path="/creer-annonce" component={CreateAnnoncePage} />
        <Route exact path="/edit-post/:id" component={CreateAnnoncePage} />
  
        {/* Dashboard */}
        <Route exact path="/dashboard" component={DashboardPage} />
  
        {/* Boutiques */}
        <Route exact path="/create-boutique" component={CreateBoutiquePage} />
        <Route exact path="/store/:id" component={MyBoutiquesPage} />
  
        {/* Post individual */}
        <Route exact path="/post/:id" component={PostId} />
  
        {/* Perfil y roles */}
        <Route exact path="/profile/:id" component={profile} />
        <Route exact path="/users/roles" component={roles} />
  
  
        {/* ============================= */}
        {/* 2️⃣ RUTAS DINÁMICAS DE CATEGORÍAS (SIEMPRE DESPUÉS) */}
        {/* IMPORTANTE: van al final para evitar que capturen rutas fijas */}
        {/* ============================= */}
  
        {/* Nivel 3 */}
        <Route exact path="/:slug/:page?" component={CategoryPage} />
<Route exact path="/:slug/:subSlug/:page?" component={CategoryPage} />
<Route exact path="/:slug/:subSlug/:articleSlug/:page?" component={CategoryPage} />
  
  
        {/* ============================= */}
        {/* 3️⃣ NOT FOUND (ÚLTIMA SIEMPRE) */}
        {/* ============================= */}
  
        <Route component={NotFound} />
  
      </Switch>
    </div>
  </Router>
  
  );
}

export default App;