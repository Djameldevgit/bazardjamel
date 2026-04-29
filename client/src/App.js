import { useEffect, useRef, useState } from 'react'
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
import EditVideoWizard from './pages/video/EditVideoWizard';
import usePushNotifications from './pages/notiy/UsePushNotifications';
import UserVideoPage from './pages/video/userVideo/[userId]';
import UserFeed from './pages/video/userVideo/UserFeed';
import Message from './pages/message';
import InfoUserVideo from './pages/video/userVideo/InfoUserVideo';
import TrendingVideos from './pages/video/TrendingVideos';
import CreateImageWizard from './pages/video/CreateImageWizard';
import EditImageWizard from './pages/video/EditImageWizar';
// ============================================
// ✅ SONIDO Y VIBRACIÓN - SIMPLIFICADO
// ============================================

let audioElement = null;
let audioUnlocked = false;
let userInteracted = false;

// Inicializar audio
const initAudio = () => {
  if (!audioElement) {
    audioElement = new Audio('/sounds/notify.mp3');
    audioElement.preload = 'auto';
    audioElement.load();
    console.log('🔊 Audio inicializado');
  }
};

// Desbloquear audio (se llama con interacción del usuario)
const unlockAudio = () => {
  if (audioUnlocked || !audioElement) return;
  
  try {
    audioElement.volume = 0;
    const promise = audioElement.play();
    if (promise !== undefined) {
      promise.then(() => {
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.volume = 0.8;
        audioUnlocked = true;
        console.log('✅ Audio desbloqueado correctamente');
      }).catch(() => {
        console.log('⚠️ No se pudo desbloquear audio aún');
      });
    }
  } catch (error) {
    console.log('⚠️ Error desbloqueando audio:', error);
  }
};

// Reproducir sonido
const playSound = () => {
  if (!audioElement || !audioUnlocked) return;
  
  try {
    audioElement.currentTime = 0;
    audioElement.volume = 0.8;
    audioElement.play().catch(err => {
      console.log('⚠️ Error reproduciendo:', err);
      if (err.name === 'NotAllowedError') {
        audioUnlocked = false;
      }
    });
  } catch (error) {
    console.warn('Sonido no soportado:', error);
  }
};

// Vibrar
const vibratePhone = (pattern = [300, 100, 300]) => {
  if ('vibrate' in navigator && navigator.vibrate) {
    navigator.vibrate(pattern);
    console.log('📳 Vibración');
  }
};
 
function App() {
  const { auth, notify } = useSelector(state => state);
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const lastNotifyId = useRef(null);
  const { sendLocalNotification, isPWAInstalled } = usePushNotifications();
  // ✅ Inicializar audio al montar
  useEffect(() => {
    initAudio();
    setIsReady(true);
  }, []);
 
  
  // ✅ Detectar interacción del usuario para desbloquear audio
  useEffect(() => {
    const handleInteraction = () => {
      if (!userInteracted) {
        userInteracted = true;
        unlockAudio();
      }
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // ✅ Solicitar permiso de notificación
  useEffect(() => {
    const requestPermission = () => {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    };
    
    window.addEventListener('click', requestPermission);
    window.addEventListener('touchstart', requestPermission);
    
    return () => {
      window.removeEventListener('click', requestPermission);
      window.removeEventListener('touchstart', requestPermission);
    };
  }, []);

  // ✅ Socket
  useEffect(() => {
    dispatch(refreshToken());

    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    
    return () => socket.close();
  }, [dispatch]);

  // ✅ NOTIFICACIONES: Sonido + Vibración
  useEffect(() => {
    if (!notify.data || notify.data.length === 0 || !isReady) return;
    
    const latest = notify.data[0];
    
    if (latest._id !== lastNotifyId.current) {
      lastNotifyId.current = latest._id;
      
      const title = latest.text || 'Nouvelle notification';
      const body = latest.content || `${latest.user?.username || 'Quelqu\'un'} a interagi`;
      const icon = latest.image || latest.user?.avatar || '/icon-web-01.png';
      const url = latest.url || '/';
      
      // ✅ Para PWA instalada - usar Service Worker
      if (isPWAInstalled && 'serviceWorker' in navigator) {
        sendLocalNotification(title, body, url, icon);
      }
      
      // ✅ Sonido y vibración (cuando la app está abierta)
      if (userInteracted) {
        playSound();
        vibratePhone([200, 100, 200]);
      }
    }
  }, [notify.data, isReady, userInteracted, isPWAInstalled, sendLocalNotification]);
  
  // ✅ Bloqueo de usuarios
  if (auth.token && auth.user?.isBlocked) {
    return (
      <Router>
        <Route exact path="/bloqueos404" component={Bloqueos404} />
        <Route path="*" component={Bloqueos404} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar2 />
        <div id="google_translate_element" style={{ display: 'none' }} />
        {auth.token && <SocketClient />}

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/bloqueos404" component={Bloqueos404} />
          <Route exact path="/notify" component={NotifyPage} />
          <Route exact path="/video/userVideo/:userId" component={UserVideoPage} />
          <Route exact path="/video/userFeed/:userId" component={UserFeed} />
          <Route exact path="/video/userVideo/:userId/info" component={InfoUserVideo} />
          <Route exact path="/videos/trending" component={TrendingVideos} />
          <Route path="/create-image-page" component={CreateImageWizard} />
        <Route path="/edit-image/:id" component={EditImageWizard} />

          <Route exact path="/admindashboard" component={AdminDashboard} />
          <Route path="/admin/posts" component={Posts} />
          <Route exact path="/boutique/:boutiqueId/products/new" component={CreateBoutiqueProductPage} />
          <Route exact path="/boutique/:boutiqueId/products/edit/:productId" component={CreateBoutiqueProductPage} />
 
        

          <Route exact path="/message" component={Message} />

          <Route exact path="/product/:productId" component={DetailProduct} />
          <Route exact path="/create-boutique" component={CreateBoutiquePage} />
          <Route exact path="/edit-boutique/:id" component={CreateBoutiquePage} />
          <Route exact path="/mes-boutiques" component={MesBoutiques} />
          <Route exact path="/mes-products-boutiques" component={MesProductsBoutiques} />
          <Route exact path="/products-boutique-page/:boutiqueId" component={ProductsBoutiquePage} />
          <Route exact path="/boutique/:id" component={BoutiqueDetailPage} />
          <Route path="/payment-boutique/:boutiqueId" component={PaymentBoutique} />
          <Route exact path="/create-video-page" component={CreateVideoWizard} />
          <Route path="/edit-video/:id" component={EditVideoWizard} />
          <Route exact path="/video/:id" component={DetailVideoPage} />
          <Route exact path="/creer-annonce" component={CreateAnnoncePage} />
          <Route exact path="/edit-post/:id" component={CreateAnnoncePage} />
          <Route exact path="/post/:id" component={PostId} />
          <Route exact path="/mes-annonces" component={MesAnnoces} />
          <Route exact path="/profile/settings" component={ProfileSettings} />
          <Route exact path="/profile/:id/saved" component={ProfileSaved} />
          <Route exact path="/users/dashboard" component={DashboardPage} />
          <Route exact path="/profile/:id" component={profile} />
          <Route exact path="/users/roles" component={roles} />
          <Route exact path="/:slug/:page?" component={CategoryPage} />
          <Route exact path="/:slug/:subSlug/:page?" component={CategoryPage} />
          <Route exact path="/:slug/:subSlug/:articleSlug/:page?" component={CategoryPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;