// components/CATEGORIES/FieldVariantes.js - VERSIÓN CORREGIDA
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

// Definir las variantes de animación (las mismas que en tu ejemplo)
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// Hook para manejar la dirección de animación
const useAnimationDirection = () => {
  const [direction, setDirection] = useState(0);
  const [currentKey, setCurrentKey] = useState(0);
  
  const animateTo = (newKey) => {
    setDirection(newKey > currentKey ? 1 : -1);
    setCurrentKey(newKey);
  };
  
  return { direction, currentKey, animateTo };
};

// 🔥 COMPONENTE PRINCIPAL QUE ENVUELVE TODO
export const AnimatedFieldsContainer = ({ children, fieldName }) => {
  const { direction, currentKey, animateTo } = useAnimationDirection();
  
  // Cambiar la animación cuando cambia el fieldName
  useEffect(() => {
    animateTo(currentKey + 1);
  }, [fieldName]);
  
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentKey}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 🔥 WRAPPER PARA CAMPOS INDIVIDUALES (simplificado)
export const AnimatedFieldWrapper = ({ children, fieldKey = null }) => {
  return (
    <motion.div
      key={fieldKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, type: "spring" }}
      style={{ width: '100%', marginBottom: '1rem' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedFieldWrapper;