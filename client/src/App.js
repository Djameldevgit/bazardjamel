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
import SocketClient from './SocketClient'
import Home from './pages/home';

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
import UserBoutiquesPage from './pages/boutique/UserBoutiquesPage';
import MesAnnoces from './pages/users/MesAnnoces';
import ProfileSettings from './pages/users/ProfileSettings';
import ProfileSaved from './pages/users/ProfileSaved';
import CreateBoutiqueProductPage from './pages/boutiqueProduct/CreateBoutiqueProductPage';
//import CreateImageHomeCarousel from './pages/carousel/CreateImageHomeCarousel';
import MesProduitsBoutiquePage from './pages/boutiqueProduct/MesProduitsBoutiqueDashborad';

 
function App() {
  const { auth } = useSelector(state => state)
  const dispatch = useDispatch()


 

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])


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

  {/* ============ RUTAS DE BOUTIQUES - PRIMERO LAS MÁS ESPECÍFICAS ============ */}
  <Route exact path="/boutique/:boutiqueId/products/new" component={CreateBoutiqueProductPage} />
  <Route exact path="/boutique/:boutiqueId/products/edit/:postId" component={CreateBoutiqueProductPage} />
  
  {/* ✅ NUEVAS RUTAS PARA DASHBOARD - GESTIÓN DE BOUTIQUES */}
  <Route exact path="/create-boutique" component={CreateBoutiquePage} />
  <Route exact path="/edit-boutique/:id" component={CreateBoutiquePage} />
  <Route exact path="/mes-boutiques" component={UserBoutiquesPage} />
   <Route exact path="/mes-produits-boutique/:boutiqueId" component={MesProduitsBoutiquePage} />
  {/* ✅ NUEVAS RUTAS PARA DASHBOARD - GESTIÓN DE PRODUCTOS DE BOUTIQUE */}
 
   
  {/* Ruta genérica de boutique - PARA VISTA PÚBLICA */}
  <Route exact path="/boutique/:id" component={BoutiqueDetailPage} />

  {/* ============ RUTAS DE ADMIN ============ 
  <Route path="/admin/carousel" exact component={CreateImageHomeCarousel} />
  <Route path="/admin/carousel/create" exact component={CreateImageHomeCarousel} />
  <Route path="/admin/carousel/edit/:id" exact component={CreateImageHomeCarousel} />
  */}

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

  {/* ============ RUTAS DE CATEGORÍAS ============ */}
  <Route exact path="/:slug/:page?" component={CategoryPage} />
  <Route exact path="/:slug/:subSlug/:page?" component={CategoryPage} />
  <Route exact path="/:slug/:subSlug/:articleSlug/:page?" component={CategoryPage} />

  {/* ============ RUTA 404 ============ */}
  <Route component={NotFound} />
</Switch>
    </div>
  </Router>
  );
}

export default App;