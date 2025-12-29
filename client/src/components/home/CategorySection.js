// components/home/CategorySection.js
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PostCard from '../postcards/PostCard';
 
const CategorySection = ({ categoryName, posts, emoji }) => {
    if (!posts || posts.length === 0) return null;
    
    // Emojis por categoría
    const categoryEmojis = {
        'immobilier': '🏠',
        'vehicules': '🚗',
        'telephones': '📱',
        'informatique': '💻',
        'electromenager': '🔌',
        'piecesDetachees': '⚙️',
        'vetements': '👕',
        'alimentaires': '🍎',
        'santebeaute': '💄',
        'meubles': '🛋️',
        'services': '🛠️',
        'materiaux': '🧱',
        'loisirs': '🎮',
        'emploi': '💼',
        'sport': '⚽',
        'voyages': '✈️'
    };
    
    const emojiToUse = emoji || categoryEmojis[categoryName] || '📁';
    
    return (
        <div className="category-section mb-5">
            {/* Encabezado de la categoría */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1">
                        <span className="me-2">{emojiToUse}</span>
                        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                    </h3>
                    <p className="text-muted small mb-0">
                        {posts.length} annonce{posts.length !== 1 ? 's' : ''} récente{posts.length !== 1 ? 's' : ''}
                    </p>
                </div>
                
                <Link 
                    to={`/category/${categoryName}`}
                    className="btn btn-outline-primary btn-sm"
                >
                    Voir tout →
                </Link>
            </div>
            
            {/* Grid de posts */}
            <Row xs={1} md={2} lg={3} className="g-4">
                {posts.slice(0, 6).map((post) => (
                    <Col key={post._id}>
                        <PostCard post={post} />
                    </Col>
                ))}
            </Row>
            
            {/* Línea separadora */}
            <hr className="mt-5" />
        </div>
    );
};

export default CategorySection;