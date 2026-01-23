// Carousel.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const Carousel = ({ images, id, isMobile, isTablet, isDesktop }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const getImageSize = () => {
        if (isMobile) return '200px';
        if (isTablet) return '250px';
        return '300px';
    };

    return (
        <div style={{ 
            position: 'relative',
            width: '100%',
            height: getImageSize(),
            overflow: 'hidden',
            borderRadius: isMobile ? '4px' : '6px'
        }}>
            {images.map((img, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: `${(index - currentIndex) * 100}%`,
                        width: '100%',
                        height: '100%',
                        transition: 'left 0.3s ease-in-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={img}
                        alt={`${id}-image-${index}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: isMobile ? '4px' : '6px'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                    />
                </div>
            ))}

            {/* Botones de navegación */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevSlide();
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '10px',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            width: isMobile ? '28px' : '36px',
                            height: isMobile ? '28px' : '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            zIndex: 2,
                        }}
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={isMobile ? 16 : 20} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextSlide();
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            width: isMobile ? '28px' : '36px',
                            height: isMobile ? '28px' : '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            zIndex: 2,
                        }}
                        aria-label="Next image"
                    >
                        <ChevronRight size={isMobile ? 16 : 20} />
                    </button>

                    {/* Indicadores */}
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '6px',
                        zIndex: 2,
                    }}>
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                style={{
                                    width: isMobile ? '6px' : '8px',
                                    height: isMobile ? '6px' : '8px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundColor: index === currentIndex ? '#007bff' : 'rgba(255, 255, 255, 0.5)',
                                    cursor: 'pointer',
                                    padding: 0,
                                    transition: 'all 0.2s ease',
                                }}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Contador de imágenes */}
            {images.length > 1 && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: isMobile ? '10px' : '12px',
                    zIndex: 2,
                }}>
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
};

export default Carousel;