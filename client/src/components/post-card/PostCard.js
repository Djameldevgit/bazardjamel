// 📂 frontend/src/components/PostCard.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CardBodyCarousel from './CardBodyCarousel';
import CardBodyTitle from './CardBodyTitle';
import DescriptionPost from './DescriptionPost';
import UserInfo from './UserInfo';
import CardFooterHome from './card-footer/CardFooterHome';
import CardFooterCategory from './card-footer/CardFooterCategory';

const PostCard = ({ post }) => {
  const location = useLocation();
  const { theme = 'light' } = useSelector(state => state.theme || {});

  if (!post) return null;

  const pathname = location.pathname;

  // Detectar contexto
  const isDetailPage = pathname.includes('/post/') ||
                       pathname.includes('/detail/') ||
                       pathname.includes('/annonce/') ||
                       pathname.includes('/product/');

  const isHomePage = pathname === '/' ||
                     pathname === '/home' ||
                     pathname === '/accueil' ||
                     pathname === '';

  const isCategoryPage = !isDetailPage && !isHomePage && (
    pathname.match(/^\/(immobilier|vehicules|pieces-detachees|telephones|informatique|electromenager|vetements|sante-beaute|meubles|loisirs|sport|emploi|materiaux|alimentaires|services|voyages|boutiques)$/) ||
    pathname.startsWith('/category/')
  );

  const renderFooter = () => {
    if (isHomePage) return <CardFooterHome post={post} />;
    if (isCategoryPage) return <CardFooterCategory post={post} />;
    if (isDetailPage) return <CardFooterCategory post={post} isDetailPage />;
    return <CardFooterHome post={post} />;
  };

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
        ...(isDetailPage && { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' })
      }}
    >
      {/* Título solo en vistas de cuadrícula */}
      {!isDetailPage && <CardBodyTitle post={post} />}

      {/* Carrusel de imágenes */}
      <CardBodyCarousel post={post} />

      {/* Secciones solo en detalle */}
      {isDetailPage && (
        <>
          <DescriptionPost post={post} />
          <UserInfo post={post} />
        </>
      )}

      {/* Footer dinámico */}
      {renderFooter()}

      {/* Estilos mínimos para la card y tema oscuro */}
      
    </Card>
  );
};

export default React.memo(PostCard);