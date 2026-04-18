import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
 
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
import CreateVideoWizard from './pages/video/CreateVideoWizard';
import DetailVideoPage from './pages/video/DetailVideoPage';
import NotifyPage from './pages/notiy/NotifyPage';
import GoogleTranslateManager from './pages/google/GoogleTranslateManager';
import NativeTranslate from './pages/google/NativeTranslate';
 
// ✅ Constantes para evitar strings mágicos
const SOUND_PATH = "/sounds/notify.mp3";
const VIBRATION_PATTERN = [300, 100, 300, 100, 600];

function App() {
  const { auth, notify } = useSelector(state => state)
  const dispatch = useDispatch()

  // ✅ Socket initialization
  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    
    return () => {
      socket.close()
    }
  }, [dispatch])

  // ✅ PWA detection (sin cambios)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('PWA manifest loaded successfully');
    });
  }
 
  // ✅ Notification permission request (mejorado)
  useEffect(() => {
    if (!("Notification" in window)) {
      console.warn("Este navegador no soporta notificaciones de escritorio");
      return;
    }
    
    if (Notification.permission === "default") {
      // Esperar un poco antes de pedir permiso (mejor UX)
      const timer = setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // ✅ Notificaciones en tiempo real (mejorado)
  const lastNotifyId = useRef(null);
  const audioRef = useRef(null);

  // Pre-cargar audio para mejor rendimiento
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio(SOUND_PATH);
      audioRef.current.load();
    }
  }, []);

  useEffect(() => {
    if (!notify.data || notify.data.length === 0) return;
    
    const latestNotify = notify.data[0];

    // Evitar notificaciones duplicadas
    if (latestNotify._id !== lastNotifyId.current) {
      lastNotifyId.current = latestNotify._id;

      // ✅ Solo reproducir si la página no está visible (opcional)
      const isPageVisible = document.visibilityState === 'visible';
      
      // 🔔 Sonido (solo si el usuario ha interactuado o la página no está visible)
      try {
        if (audioRef.current) {
          // Resetear audio para poder reproducir múltiples veces
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => {
            // Silenciar error de autoplay - es normal
            console.debug("Audio requiere interacción del usuario");
          });
        }
      } catch (error) {
        console.debug("Sonido no disponible:", error);
      }

      // 📳 Vibración (solo si la página no está visible o está en segundo plano)
      if ("vibrate" in navigator && !isPageVisible) {
        navigator.vibrate(VIBRATION_PATTERN);
      }
      
      // ✅ Notificación de escritorio (si la página no está visible)
      if (!isPageVisible && Notification.permission === "granted") {
        const { text, user, url } = latestNotify;
        const notification = new Notification(
          user?.username || 'MarketPlace',
          {
            body: text || 'Tienes una nueva notificación',
            icon: user?.avatar || '/images/logo.png',
            tag: latestNotify._id, // Evitar duplicados
            requireInteraction: false
          }
        );
        
        notification.onclick = () => {
          window.focus();
          if (url) {
            window.location.href = url;
          }
          notification.close();
        };
      }
    }
  }, [notify.data]);

  // ✅ Bloqueo de usuarios
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
      {/* ============ RUTAS PÚBLICAS ============<NativeTranslate/> */}
<GoogleTranslateManager/>
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
          <Route exact path="/notify" component={NotifyPage} />

          {/* ============ ADMIN ============ */}
          <Route exact path="/admindashboard" component={AdminDashboard} />
          <Route path="/admin/posts" component={Posts} />

          {/* ============ BOUTIQUES ============ */}
          <Route exact path="/boutique/:boutiqueId/products/new" component={CreateBoutiqueProductPage} />
          <Route exact path="/boutique/:boutiqueId/products/edit/:productId" component={CreateBoutiqueProductPage} />
          <Route exact path="/product/:productId" component={DetailProduct} />
          <Route exact path="/create-boutique" component={CreateBoutiquePage} />
          <Route exact path="/edit-boutique/:id" component={CreateBoutiquePage} />
          <Route exact path="/mes-boutiques" component={MesBoutiques} />
          <Route exact path="/mes-products-boutiques" component={MesProductsBoutiques} />
          <Route exact path="/products-boutique-page/:boutiqueId" component={ProductsBoutiquePage} />
          <Route exact path="/boutique/:id" component={BoutiqueDetailPage} />
          <Route path="/payment-boutique/:boutiqueId" component={PaymentBoutique} />

          {/* ============ VIDEOS ============ */}
          <Route exact path="/create-video-page" component={CreateVideoWizard} />
          <Route exact path="/video/:id" component={DetailVideoPage} />

          {/* ============ POSTS / ANUNCIOS ============ */}
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

          {/* ============ CATEGORÍAS ============ */}
          <Route exact path="/:slug/:page?" component={CategoryPage} />
          <Route exact path="/:slug/:subSlug/:page?" component={CategoryPage} />
          <Route exact path="/:slug/:subSlug/:articleSlug/:page?" component={CategoryPage} />

          {/* ============ 404 ============ */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;