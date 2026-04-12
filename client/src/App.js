import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; // Switch en lugar de Routes para v5
import GoogleTranslateManager from './components/GoogleTraslateManager'
import { useSelector, useDispatch } from 'react-redux'
import Login from './pages/login'
import Register from './pages/register'
import { refreshToken } from './redux/actions/authAction'
import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'
import Home from './pages/home';
import Bloqueos404 from './components/adminitration/Bloqueos404';
import NotFound from './pages/NotFound';
import CategoryPage from './pages/category/CategoryPage';
import Navbar2 from './components/header/Navbar2';
import CreateAnnoncePage from './pages/CreateAnnoncePage';
import PostId from './pages/PostID/PostId';

import DashboardPage from './pages/users/dashboardpage';
import profile from './pages/users/profile';
import CreateBoutiquePage from './pages/boutique/createBoutiquePage';


import roles from './pages/users/roles';


import BoutiqueDetailPage from './pages/boutique/BoutiqueDetailPage';

import MesAnnoces from './pages/users/MesAnnoces';
import ProfileSettings from './pages/users/ProfileSettings';
import ProfileSaved from './pages/users/ProfileSaved';
import CreateBoutiqueProductPage from './pages/boutiqueProduct/CreateBoutiqueProductPage';

import Posts from './pages/aprobation/Posts';
import MesBoutiques from './pages/boutique/MesBoutiques';

import ProductsBoutiquePage from './pages/boutiqueProduct/ProductsBoutiquePage';
import MesProductsBoutiques from './pages/boutiqueProduct/MesProductsBoutiques';
import DetailProduct from './pages/boutiqueProduct/DetailProduct';
import AdminDashboard from './pages/administration/AdminDashborad';
import PaymentBoutique from './pages/boutique/PayementBoutique';
import CreateVideoPage from './pages/video/CreateVideoPage';
import DetailVideoPage from './pages/video/DetailVideoPage';


function App() {
  const { auth, notify } = useSelector(state => state)
  const dispatch = useDispatch()




  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close()
  }, [dispatch])

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('PWA manifest loaded successfully');
    });
  }

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") { }
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") { }
      });
    }
  }, [])

  const lastNotifyId = useRef(null);

  useEffect(() => {
    if (notify.data.length > 0) {
      const ultima = notify.data[0];

      // Solo ejecutar si es realmente una nueva notificación
      if (ultima._id !== lastNotifyId.current) {
        lastNotifyId.current = ultima._id;

        // 🔔 Sonido
        try {
          const audio = new Audio("/sounds/notify.mp3");
          audio.play().catch(err => {
            console.log("⚠️ El sonido requiere interacción del usuario", err);
          });
        } catch (error) {
          console.warn("Sonido no soportado", error);
        }

        // 📳 Vibración
        if ("vibrate" in navigator) {
          navigator.vibrate([300, 100, 300, 100, 600]);
        }
      }
    }
  }, [notify.data]);


  if (auth.token && auth.user?.isBlocked) {
    return (
      <Router>
        <Route exact path="/bloqueos404" component={Bloqueos404} />
        <Route path="*" component={Bloqueos404} />
      </Router>
    )
  }
  return (
    <Router>
      <GoogleTranslateManager />

      <div className="App">
        <Navbar2 />

        <div id="google_translate_element" style={{ display: 'none' }}></div>

        {auth.token && <SocketClient />}


        <Switch>
          {/* ============ RUTAS PÚBLICAS ============ */}
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />

          <Route exact path="/bloqueos404" component={Bloqueos404} />


          <Route exact path="/admindashboard" component={AdminDashboard} />

          {/* ============ RUTAS DE ADMIN ============ */}
          <Route path="/admin/posts" component={Posts} />

          {/* ============ RUTAS DE BOUTIQUES - PRIMERO LAS MÁS ESPECÍFICAS ============ */}

          {/* 🔥 RUTAS DE CREACIÓN/EDICIÓN DE PRODUCTOS - VAN PRIMERO */}
          <Route exact path="/boutique/:boutiqueId/products/new" component={CreateBoutiqueProductPage} />
          <Route exact path="/boutique/:boutiqueId/products/edit/:productId" component={CreateBoutiqueProductPage} />
          <Route exact path="/product/:productId" component={DetailProduct} />
          {/* 🔥 RUTAS DE DASHBOARD - GESTIÓN DE BOUTIQUES */}
          <Route exact path="/create-boutique" component={CreateBoutiquePage} />

  {/* 🔥 RUTAS DE DASHBOARD - GESTIÓN DE VIDEOS */}
  <Route exact path="/create-video-page" component={CreateVideoPage} />
  <Route exact  path="/video/:id" component={DetailVideoPage}/>


          <Route exact path="/edit-boutique/:id" component={CreateBoutiquePage} />
          <Route exact path="/mes-boutiques" component={MesBoutiques} />
          <Route exact path="/mes-products-boutiques" component={MesProductsBoutiques} />
          <Route exact path="/products-boutique-page/:boutiqueId" component={ProductsBoutiquePage} />

          {/* 🔥 RUTA GENÉRICA DE BOUTIQUE - PARA VISTA PÚBLICA (VA AL FINAL DE LAS RUTAS DE BOUTIQUE) */}
          <Route exact path="/boutique/:id" component={BoutiqueDetailPage} />

          <Route path="/payment-boutique/:boutiqueId" component={PaymentBoutique} />
          {/* ============ RUTAS DE ANUNCIOS NORMALES ============ */}
          <Route exact path="/creer-annonce" component={CreateAnnoncePage} />
          <Route exact path="/edit-post/:id" component={CreateAnnoncePage} />
          <Route exact path="/post/:id" component={PostId} />

          {/* ============ USER DASHBOARD ============ */}
          <Route exact path="/mes-annonces" component={MesAnnoces} />
          <Route exact path="/profile/settings" component={ProfileSettings} />
          <Route exact path="/profile/:id/saved" component={ProfileSaved} />
          <Route exact path="/users/dashboard" component={DashboardPage} />
          <Route exact path="/profile/:id" component={profile} />
          <Route exact path="/users/roles" component={roles} />

          {/* ============ RUTAS DE CATEGORÍAS (VAN AL FINAL PORQUE SON MUY GENÉRICAS) ============ */}
          <Route exact path="/:slug/:page?" component={CategoryPage} />
          <Route exact path="/:slug/:subSlug/:page?" component={CategoryPage} />
          <Route exact path="/:slug/:subSlug/:articleSlug/:page?" component={CategoryPage} />

          {/* ============ RUTA 404 - SIEMPRE AL FINAL ============ */}



          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;