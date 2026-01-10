import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getCategories } from './redux/actions/postAction'
import { refreshToken } from './redux/actions/authAction'
import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

// Componentes de layout
import Alert from './components/alert/Alert'
import Navbar2 from './components/header/Navbar2'

// Páginas estáticas
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import ActivatePage from './auth/ActivatePage'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import Video from './pages/video'
import Bloginfo from './pages/bloginfo'
import Bloqueos404 from './components/adminitration/Bloqueos404'
import Appinfo2 from './pages/appinfo2'
import Appinfo3 from './pages/appinfo3'
import Map from './pages/Map'
import PostId from './pages/PostId'
import Message from './pages/message'
import CreateAnnoncePage from './pages/CreateAnnoncePage'

// Sistema de rutas dinámicas
import DynamicPage from './pages/DynamicPage'
 
import PageRender from './customRouter/PageRender'
import PrivateRouter from './customRouter/PrivateRouter'
 
import GoogleTranslateManager from './components/GoogleTraslateManager'
import CreateBoutiquePage from './pages/boutique/createBoutiquePage'
import BoutiquePage from './pages/boutique/BoutiquePage'
import BoutiqueDashboardPage from './pages/boutique/BoutiqueDashboradPage'
import UserBoutiquesPage from './pages/boutique/UserBoutiquesPage'
 
 
function App() {
  const { auth, languageReducer } = useSelector(state => state)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [translateReady, setTranslateReady] = useState(false)
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

  // 🔥 CORREGIDO: Cargar categorías
  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  // 🔥 CORREGIDO: Inicializar Google Translate
  useEffect(() => {
    const initializeGoogleTranslate = () => {
      const useTranslate = localStorage.getItem('useGoogleTranslate') === 'true'
      const targetLang = localStorage.getItem('targetTranslateLang')
      
      if (useTranslate && targetLang) {
        window.googleTranslateElementInit = () => {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'es',
              includedLanguages: 'en,fr,ar',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_translate_element')
            
            setTimeout(() => {
              const iframe = document.querySelector('.goog-te-menu-frame')
              if (iframe && iframe.contentWindow) {
                const select = iframe.contentWindow.document.querySelector('.goog-te-combo')
                if (select) {
                  select.value = targetLang
                  select.dispatchEvent(new Event('change'))
                }
              }
            }, 1000)
          }
          setTranslateReady(true)
        }

        if (!window.google || !window.google.translate) {
          const script = document.createElement('script')
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
          script.async = true
          document.head.appendChild(script)
        } else {
          window.googleTranslateElementInit()
        }
      } else {
        setTranslateReady(true)
      }
    }

    initializeGoogleTranslate()
  }, [])

  // 🔥 Observar cambios en el DOM para traducción dinámica
  useEffect(() => {
    if (translateReady && localStorage.getItem('useGoogleTranslate') === 'true') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            setTimeout(() => {
              translateNewContent()
            }, 300)
          }
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      return () => observer.disconnect()
    }
  }, [translateReady])

  const translateNewContent = () => {
    if (window.google && window.google.translate && window.google.translate.translate) {
      const targetLang = localStorage.getItem('targetTranslateLang') || 'en'
      
      const elements = document.querySelectorAll('body *:not(.notranslate):not(script):not(style)')
      
      elements.forEach(element => {
        if (element.childElementCount === 0 && 
            element.textContent && 
            element.textContent.trim().length > 0 &&
            !element.classList.contains('goog-translated')) {
          
          const originalText = element.textContent
          window.google.translate.translate(
            originalText,
            'es',
            targetLang,
            (result) => {
              if (result && result.translatedText) {
                element.textContent = result.translatedText
                element.classList.add('goog-translated')
              }
            }
          )
        }
      })
    }
  }

  // 🔥 Actualizar estado de carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <div className="loading-screen">Chargement...</div>

  if (auth.token && auth.user?.esBloqueado) {
    return (
      <Router>
        <Switch>
          <Route exact path="/bloqueos404" component={Bloqueos404} />
          <Route path="*" component={Bloqueos404} />
        </Switch>
      </Router>
    )
  }

  return (
    <Router>
      <GoogleTranslateManager />
      <Alert />
      <div className="App">
        <Navbar2 />
        {auth.token && socket && <SocketClient socket={socket} />}
        
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        
        <Switch>
          {/* ==================== RUTAS ESTÁTICAS ==================== */}
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/bloginfo" component={Bloginfo} />
          <Route exact path="/creer-annonce" component={CreateAnnoncePage} />
          <Route exact path="/editer-annonce/:id" component={CreateAnnoncePage} />
          <Route exact path="/post/:id" component={PostId} />
          <Route exact path="/message" component={Message} />
          <Route exact path="/video/:obraId" component={Video} />
          <Route exact path="/forgot_password" component={ForgotPassword} />
          <Route exact path="/user/reset/:token" component={ResetPassword} />
          <Route exact path="/user/activate/:activation_token" component={ActivatePage} />

          {/* ==================== ADMINISTRACIÓN ==================== */}
          <Route exact path="/create-boutique" component={CreateBoutiquePage} />
          <Route exact path="/edit-boutique/:id" component={CreateBoutiquePage} />
          <Route exact path="/boutiquedashboard" component={BoutiqueDashboardPage} />
          <Route exact path="/profile/boutiques" component={UserBoutiquesPage} />
          <Route exact path="/boutique/:domaine" component={BoutiquePage} />


          {/* ==================== RUTAS PRIVADAS ==================== */}
          <PrivateRouter exact path="/profile" component={PageRender} />
          <PrivateRouter exact path="/mes-annonces" component={PageRender} />
          {/* ... otras rutas privadas */}

          {/* ==================== REDIRECCIONES LEGACY ==================== */}
          <Route exact path="/category/:categoryName" 
            render={({ match }) => <Redirect to={`/${match.params.categoryName}/1`} />} 
          />
          <Route exact path="/category/:categoryName/:subcategoryId" 
            render={({ match }) => <Redirect to={`/${match.params.categoryName}-${match.params.subcategoryId}/1`} />} 
          />
          <Route exact path="/immobilier" 
            render={() => <Redirect to="/immobilier/1" />} 
          />
          <Route exact path="/immobilier/:operationId" 
            render={({ match }) => <Redirect to={`/immobilier-${match.params.operationId}/1`} />} 
          />
          <Route exact path="/stores" 
            render={() => <Redirect to="/boutiques/1" />} 
          />

          {/* ==================== RUTA DINÁMICA PRINCIPAL ==================== */}
          <Route exact path="/:slug/:page?" component={DynamicPage} />

          {/* ==================== RUTAS PRIVADAS GENÉRICAS ==================== */}
          <PrivateRouter exact path="/:page/:id/:tab" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />
          <PrivateRouter exact path="/:page" component={PageRender} />

          {/* ==================== 404 ==================== */}
          <Route path="*"><Redirect to="/" /></Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App