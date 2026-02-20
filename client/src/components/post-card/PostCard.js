// 📂 frontend/src/components/PostCard.jsx - VERSIÓN ACTUALIZADA CON DETECCIÓN DE CONTEXTO
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CardBodyCarousel from './CardBodyCarousel';
import CardBodyTitle from './CardBodyTitle';
import CardHeader from './CardHeader';
import DescriptionPost from './DescriptionPost';
import UserInfo from './UserInfo';
import CardFooterHome from './card-footer/CardFooterHome';
import CardFooterCategory from './card-footer/CardFooterCategory';

const PostCard = ({ post }) => {
  const location = useLocation();
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  if (!post) return null;

  // Detectar en qué página estamos
  const pathname = location.pathname;
  
  // Página de detalle (post individual)
  const isDetailPage = pathname.includes('/post/') || 
                      pathname.includes('/detail/') ||
                      pathname.includes('/annonce/') ||
                      pathname.includes('/product/');
  
  // Página de inicio (Home)
  const isHomePage = pathname === '/' || 
                    pathname === '/home' || 
                    pathname === '/accueil' ||
                    pathname === ''; // root
  
  // Página de categoría (CategoryPage)
  // Detectar si es una categoría principal (sin /category/ en la URL)
  const isCategoryPage = !isDetailPage && !isHomePage && (
    // Categorías principales (slug directo)
    pathname.match(/^\/(immobilier|vehicules|pieces-detachees|telephones|informatique|electromenager|vetements|sante-beaute|meubles|loisirs|sport|emploi|materiaux|alimentaires|services|voyages|boutiques)$/) ||
    // También detectar rutas que empiecen con /category/ (por si acaso)
    pathname.startsWith('/category/')
  );

  // Determinar qué footer usar
  const renderFooter = () => {
    if (isHomePage) {
      return <CardFooterHome post={post} />;
    }
    if (isCategoryPage) {
      return <CardFooterCategory post={post} />;
    }
    if (isDetailPage) {
      // En detalle usamos el footer de categoría pero con prop especial si quieres
      return <CardFooterCategory post={post} isDetailPage={true} />;
    }
    // Por defecto (fallback)
    return <CardFooterHome post={post} />;
  };

  // Debug (opcional - quitar en producción)
  console.log('📍 PostCard context:', { 
    pathname, 
    isHomePage, 
    isCategoryPage, 
    isDetailPage,
    using: isHomePage ? 'HomeFooter' : isCategoryPage ? 'CategoryFooter' : isDetailPage ? 'Detail (CategoryFooter)' : 'Default'
  });

  return (
    <Card 
      className={`border-0 shadow-sm overflow-hidden mb-4 ${
        isDetailPage ? 'detail-view' : 'grid-view'
      } ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
      style={{
        borderRadius: '12px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(isDetailPage && {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        })
      }}
    >
      {/* Header con info del usuario */}
     
      {/* Título del producto (solo en home y category, no en detalle) */}
      {!isDetailPage && <CardBodyTitle post={post} />}
      
      {/* Carrusel de imágenes */}
      <CardBodyCarousel post={post} />
      
      {/* Contenido adicional solo en detalle */}
      {isDetailPage && (
        <>
          <DescriptionPost post={post} />
          <UserInfo post={post} />
        </>
      )}
      
      {/* Footer dinámico según el contexto */}
      {renderFooter()}

      {/* Estilos personalizados */}
      <style>{`
        .detail-view {
          border: none;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .grid-view {
          cursor: pointer;
          height: 100%;
        }
        
       
        
        @media (max-width: 768px) {
          .card {
            margin-bottom: 4px;
            border-radius: 8px !important;
          }
          
         
          
        }
        
        /* Dark mode */
        .bg-dark .card-header-custom,
        .bg-dark .card-footer-home,
        .bg-dark .card-footer-category {
          background-color: #1e293b !important;
          border-color: #334155 !important;
        }
        
        .bg-dark .text-muted {
          color: #94a3b8 !important;
        }
        
        .bg-dark .border-top {
          border-top-color: #334155 !important;
        }
        
        .bg-dark .border-bottom {
          border-bottom-color: #334155 !important;
        }
        
        /* Asegurar que las cards tengan buena altura en grid */
        .grid-view .card-body {
          flex: 1;
        }
      `}</style>
    </Card>
  );
};

export default React.memo(PostCard);