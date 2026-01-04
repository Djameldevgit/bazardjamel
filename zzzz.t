src/
├── components 
    ├── CACTEGORIES/
        └── campos
        └── camposComun
        └── CategoryAccordion
        └── specificFields/
                ├── BoutiquesField.js
                ├── VehiculesField.js
                ├── VetementsFields.js
                ├── ImmobiliersFields.js
                ├── InformatiqueFields.js
                ├── ServicesField.js
                ├── SportFields.js
                ├── VoyagesField.js
                ├── LoisirsFields.js
                ├── MateriauxField.js
                ├── AlimentairesField.js
                ├── TelephonesField.js
                ├── SanteBeauteField.js
                ├── PieceDetache.js
                ├── MuebleField.js
                ├── Emploi.js
                └── Electromenager.js
        └── DynamicField
        └── FieldConfig
        └── FieldRenderer
        └── DynamicFieldManager

├── App.js                  # ✅ ACTUALIZADO (configuración de rutas)
├── pages/
│   ├── DynamicPage.js                      # ✅ NUEVO (manejador de rutas principal)
│   ├── home/
│   │   └── Home.js                         # Sin cambios
│   ├── categorySubCategory/
│   │   ├── CategoryPage.js                 # ✅ ACTUALIZADO (acepta 'page')
│   │   ├── SubcategoryPage.js              # ✅ ACTUALIZADO (maneja slugs con -)
│   │   ├── ImmobilerHierarchyPage.js       # ✅ NUEVO (jerarquía especial inmuebles)
│   │   └── ImmobilerOperationPage.js       # ⚠️ Mantener (legacy)
│   ├── boutique/                           # ✅ NUEVA CARPETA
│   │   ├── BoutiquesList.js                # ✅ NUEVO (listado de tiendas)
│   │   └── BoutiqueDetail.js               # ✅ NUEVO (detalle por slug)
│   ├── store/                              # ✅ Carpeta existente (mantener)
│   │   ├── StoreList.js                    # ⚠️ Renombrar o mantener
│   │   ├── StoreDetail.js                  # ✅ ACTUALIZAR (acepta slug)
│   │   ├── CreateStore.js                  # Sin cambios
│   │   └── EditStore.js                    # Sin cambios
│   ├── PostId.js                           # Ya existe
│   ├── CreateAnnoncePage.js                # Ya existe
│   └── (otras páginas)                     # Sin cambios
├── components/
│   ├── home/
│   │   └── Posts.js                        # ✅ ACTUALIZADO (mejorado para rutas nuevas)
│   ├── slidersHeaders/
│   │   └── CategorySlider.js               # ✅ ACTUALIZADO (enlaces nuevos)
│   ├── header/
│   │   └── Navbar2.js                      # ✅ ACTUALIZAR (enlaces nuevos)
│   ├── extra/
│   │   └── LoadingSpinner.js               # ✅ NUEVO (crear)
│   └── (otros componentes)                 # Sin cambios
├── redux/
│   ├── actions/
│   │   ├── postAction.js                   # ✅ ACTUALIZAR (acciones para slugs)
│   │   ├── storeAction.js                  # ✅ AGREGAR getStoreBySlug
│   │   └── (otras acciones)                # Sin cambios
│   ├── reducers/
│   │   └── postReducer.js                  # ✅ ACTUALIZAR (estados para rutas nuevas)
│   └── store.js                            # Sin cambios
├── utils/
│   ├── slugUtils.js                        # ✅ NUEVO (generar/parsear slugs)
│   ├── linkHelper.js                       # ✅ NUEVO (opcional - generación de enlaces)
│   └── (otras utilidades)                  # Sin cambios
├── customRouter/
│   ├── PageRender.js                       # Sin cambios
│   └── PrivateRouter.js                    # Sin cambios
└── (otros archivos raíz)                   # Sin cambios
 
 
 
 
 
 
 
 
 
 
 ESTRUCTURA COMPLETA DEL PROYECTO
🌐 CLIENT (Frontend React)
text
client/
├── build/                    # Build de producción
├── public/                   # Archivos estáticos públicos
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── CATEGORIES/
│   │   │   ├── campos/
│   │   │   │   └── camposComun/
│   │   │   │       ├── MarqueField.js
│   │   │   │       ├── modeleField.js
│   │   │   │       ├── PriceField.js
│   │   │   │       ├── QuantiteField.js
│   │   │   │       └── TailleFiled.js  
│   │   │   │
│   │   │   └── specificFields/
│   │   │       ├── BoutiquesField.js
│   │   │       ├── VehiculesField.js
│   │   │       ├── VetementsFields.js
│   │   │       ├── ImmobiliersFields.js
│   │   │       ├── InformatiqueFields.js
│   │   │       ├── ServicesField.js
│   │   │       ├── SportFields.js
│   │   │       ├── VoyagesField.js
│   │   │       ├── LoisirsFields.js
│   │   │       ├── MateriauxField.js
│   │   │       ├── AlimentairesField.js
│   │   │       ├── TelephonesField.js
│   │   │       ├── SanteBeauteField.js
│   │   │       ├── PieceDetache.js
│   │   │       ├── MuebleField.js
│   │   │       ├── Emploi.js
│   │   │       └── Electromenager.js
│   │   │
│   │   ├── categoryAccordion/   # Lógica de categorías/subcategorías
│   │   │   ├── dinamicField.js
│   │   │   ├── dinamicFieldManager.js 
│   │   │   ├── fieldConfig.js
│   │   │   ├── FieldRendererUniversalr.js
│   │   │   └── fieldRenderer.js
│   │   │
│   │   ├── dashboard/          # Componentes del dashboard
│   │   │   ├── DashboardHeader.js
│   │   │   ├── DashboardStats.js
│   │   │   ├── UserPosts.js
│   │   │   └── StoreManagement.js
│   │   │
│   │   ├── slidersHeaders/     # Sliders con iconos para categorías
│   │   │   ├── sliderAlimentaire.js
│   │   │   ├── sliderVehicules.js
│   │   │   ├── sliderImmobilers.js
│   │   │   ├── sliderTelephones.js
│   │   │   ├── DynamicCategorySlider.js
│   │   │   └── SliderConfig.js
│   │   │
│   │   ├             # Componentes de tienda
│   │   │    
│   │   │    
│   │   │    
│   │   │
│   │   └── extra/              # Componentes adicionales
│   │       ├── Header.js
│   │       ├── Footer.js
│   │       ├── SearchBar.js
│   │       ├── ProductCard.js
│   │       ├── Modal.js
│   │       └── LoadingSpinner.js
│   │
│   ├── pages/
│   │   ├── CategorySubcategory/
│   │   │   ├── categoryPage.js
│   │   │   ├── immobilerOperationPage.js    # Lógica especial inmuebles
│   │   │   ├── propertyPage.js
│   │   │   ├── publicStorePage.js
│   │   │   ├── storeCategoryPage.js
│   │   │   └── subcategoryPage.js
│   │   │────── store/  
│   │   ├── message/           # Mensajería
│   │   │   ├── Inbox.js
│   │   │   ├── Chat.js
│   │   │   └── MessageList.js
│   │   │
│   │   ├── profile/           # Perfil de usuario
│   │   │   ├── UserProfile.js
│   │   │   ├── EditProfile.js
│   │   │   └── UserSettings.js
│   │   │
│   │   ├── store/             # Páginas de tienda
│   │   │   ├── StoreFront.js
│   │   │   ├── StoreProducts.js
│   │   │   └── StoreReviews.js
│   │   │
│   │   ├── storedashboard/    # Dashboard de tienda
│   │   │   └── [id].js        # Ruta dinámica por ID
│   │   │
│   │   ├── users/             # Gestión de usuarios
│   │   │   ├── UserList.js
│   │   │   └── UserDetail.js
│   │   │
│   │   ├── home/              # Página principal
│   │   │   └── HomePage.js
│   │   │
│   │   ├── login/             # Autenticación
│   │   │   └── LoginPage.js
│   │   │
│   │   └── register/          # Registro
│   │       └── RegisterPage.js
│   │
│   ├── redux/                 # Estado global
│   │   ├── store.js
│   │   ├── actions/
│   │   │   ├── authActions.js
│   │   │   ├── productActions.js
│   │   │   ├── categoryActions.js
│   │   │   └── userActions.js
│   │   ├── reducers/
│   │   │   ├── authReducer.js
│   │   │   ├── productReducer.js
│   │   │   ├── categoryReducer.js
│   │   │   └── rootReducer.js
│   │   └── constants/
│   │       └── actionTypes.js
│   │
│   ├── styles/                # Estilos CSS
│   │   ├── global.css
│   │   ├── components/
│   │   │   ├── Button.css
│   │   │   └── Card.css
│   │   └── pages/
│   │       ├── Home.css
│   │       └── Dashboard.css
│   │
│   ├── utils/                 # Utilidades del cliente
│   │   ├── api.js
│   │   ├── validators.js
│   │   └── formatters.js
│   │
│   ├── App.js                 # Componente principal
│   ├── index.js               # Punto de entrada
│   ├── socketClient.js        # Cliente Socket.io
│   ├── .env                   # Variables de entorno
│   └── .gitignore
│
├── package.json
└── README.md
🖥️ SERVER (Backend Node.js/Express)
text
server/
├── middleware/                # Middlewares
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── uploadMiddleware.js
│   └── validationMiddleware.js
│
├── utils/                     # Utilidades
│   ├── database.js           # Conexión DB
│   ├── emailService.js       # Servicio de email
│   ├── uploadHelper.js       # Subida de archivos
│   ├── validators.js         # Validaciones
│   └── constants.js          # Constantes
│
├── controllers/              # Controladores
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── storeController.js
│   ├── messageController.js
│   └── uploadController.js
│
├── models/                   # Modelos de MongoDB
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Store.js
│   ├── Message.js
│   ├── Conversation.js
│   └── Review.js
│
├── routes/                   # Rutas API
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── storeRoutes.js
│   ├── messageRoutes.js
│   └── uploadRoutes.js
│
├── config/                   # Configuraciones
│   ├── database.js
│   ├── cloudinary.js
│   └── corsOptions.js
│
├── uploads/                  # Archivos subidos (temporal)
│   └── images/
│
├── server.js                 # Punto de entrada del servidor
├── socketServer.js           # Servidor Socket.io
├── package.json
├── .env
└── .gitignore
📦 ARCHIVOS DE CONFIGURACIÓN PRINCIPALES
text
├── package.json (Client)
├── package.json (Server)
├── .env (Client)
├── .env (Server)
├── README.md
├── .gitignore
└── docker-compose.yml (opcional)
📋 EXPLICACIÓN DE CARPETAS CLAVE
1. components/CATEGORIES/
Estructura modular para manejar diferentes tipos de productos:

camposComun/: Campos generales aplicables a todas las categorías

specificFields/: Campos específicos por categoría (Inmuebles, Vehículos, etc.)

2. components/categoryAccordion/
Lógica compleja para:

Gestión jerárquica de categorías/subcategorías

Sistema de dos niveles para inmuebles

Renderizado dinámico de campos según categoría

3. pages/CategorySubcategory/
Rutas especializadas para navegación por categorías con lógica específica para:

Inmuebles (compra/alquiler/venta)

Tiendas públicas

Categorías con múltiples niveles

4. models/ (Server)
Esquemas de MongoDB para:

Usuarios y autenticación

Productos con campos dinámicos

Categorías jerárquicas

Sistema de mensajería en tiempo real

🔗 CONEXIONES IMPORTANTES
Cliente → Servidor: API REST para datos

Socket.io: Mensajería en tiempo real

Redux: Estado global compartido

Categorías dinámicas: Configuración flexible de campos por categoría

🎯 CARACTERÍSTICAS DESTACADAS
✅ Sistema de categorías flexible con campos dinámicos
✅ Dashboard multi-rol (usuario/tienda/admin)
✅ Mensajería en tiempo real con Socket.io
✅ Gestión de archivos (Cloudinary/Local)
✅ Formularios dinámicos según categoría de producto
✅ Sistema de búsqueda y filtros avanzados
✅ Responsive design con componentes reutilizables
✅ Autenticación JWT con roles y permisos


FieldRenderer.js - EL DISTRIBUIDOR INTELIGENTE
javascript
// Actúa como ROUTER de componentes
FieldRenderer({
  fieldName,           // Nombre del campo a renderizar
  mainCategory,        // Para decidir qué componente específico usar
  subCategory,         // Para contexto adicional
  articleType          // Para casos especiales como immobilier
})

FLUJO COMPLETO DE DATOS
text
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO INTERACTÚA                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  CreateAnnoncePage (Home.js)                │
│  • Estado global (formData, currentStep)                   │
│  • Maneja submit final                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                DynamicFieldManager (Paso 2)                 │
│  • Decide qué campos mostrar según paso                    │
│  • Consulta FieldConfig para campos específicos            │
│  • Controla navegación entre pasos                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                     FieldRenderer                           │
│  • Router inteligente:                                     │
│    - Si es campo compartido → usa camposComun/             │
│    - Si es campo específico → usa specificFields/          │
└───────────────────────┬─────────────────────────────────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
┌──────────▼──────────┐   ┌──────────▼──────────┐
│   specificFields/   │   │    camposComun/     │
│  • TelephonesFields │   │  • MarqueField      │
│  • VehiculesFields  │   │  • ModeleField      │
│  • ImmobiliersFields│   │  • PriceField       │
└─────────────────────┘   └─────────────────────┘


USUARIO LLENA FORMULARIO
      ↓
[CreateAnnoncePage.js] - PADRE
      ↓
[formData] (campos base) + [specificData] (campos dinámicos)
      ↓
[DynamicFieldManager] (organiza por pasos)
      ↓
[FieldRenderer] (distribuye a componentes)
      ↓
[MarqueField.js] [ModeleField.js] [TailleField.js] (componentes hijos)
      ↓
DATOS SE GUARDAN EN [specificData] → [categorySpecificData] en MongoDB
const [formData, setFormData] = useState({
  categorie: '',        // Ej: 'vehicules', 'telephones'
  articleType: '',      // Solo para immobilier: 'vente', 'location'
  subCategory: '',      // Ej: 'automobiles', 'smartphones'
});