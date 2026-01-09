 Hola maestro , estoy desarollando una app MERN marketPlcae con la seguiente Estructura Actualizada del Proyecto MENR Marketplace
📂 COMPONENTS/CATEGORIES/ - SISTEMA DE CAMPOS DINÁMICOS
 
camposComun/
├── TitleField.js              # Input para título del anuncio
├── DescriptionField.js        # Textarea para descripción
├── PriceField.js              # Input numérico para precio
├── ReferenceField.js          # Input para referencia única
├── EtatField.js               # Select para estado del producto
├── WilayaCommuneField.js      # Selects anidados para localización
├── TelephoneField.js          # Input para teléfono
├── EmailField.js              # Input para email
├── MarqueField.js             # Select con JSON para marcas de autos
├── ModeleField.js             # Select con JSON para modelos de autos
├── MarqueVehiculesField.js    # ⭐ NUEVO: Input simple para marcas de otros vehículos
├── ModeleVehiculesField.js    # ⭐ NUEVO: Input simple para modelos de otros vehículos
├── LivraisonField.js          # Checkbox para entrega
├── UniteField.js              # Select para unidad de precio
├── TypeOffreField.js          # Select para tipo de oferta
├── EchangeField.js            # Select para intercambio
└── GrossDetailField.js        # Input para detalles adicionales
✅ Componentes Específicos (specificFields/)
text
specificFields/
├── BaseCategoryField.js       # 🔥 NÚCLEO: Renderiza todos los campos según categoría
├── VehiculesFields.js         # ⭐ ACTUALIZADO: Campos para vehículos con multiselect react-select
├── ImmobiliersFields.js       # Campos para inmuebles
├── VetementsFields.js         # Campos para ropa
├── TelephonesFields.js        # Campos para teléfonos
├── InformatiqueFields.js      # Campos para informática
├── ElectromenagerFields.js    # Campos para electrodomésticos
├── PiecesDetacheesFields.js   # Campos para piezas de repuesto
├── SanteBeauteFields.js       # Campos para salud/belleza
├── MeublesFields.js           # Campos para muebles
├── LoisirsFields.js           # Campos para ocio
├── SportFields.js             # Campos para deportes
├── AlimentairesFields.js      # Campos para alimentos
├── ServicesFields.js          # Campos para servicios
├── MateriauxFields.js         # Campos para materiales
├── VoyagesFields.js           # Campos para viajes
├── EmploiFields.js            # Campos para empleo
├── BoutiquesField.js          # Campos para tiendas
└── (otros componentes específicos)
✅ Gestión de Campos
 
categoryNivel/
├── categoryVehicule.js               # ⭐ NUEVO: Genera y parsea slugs para URLs amigables
├── categoryVetements.js  
├── categoryElectromenager.js               # ⭐ NUEVO: Genera y parsea slugs para URLs amigables
├── categoryImmobiler.js              # ⭐ NUEVO: Genera enlaces dinámicos para categorías
└── otras categorias

├── CategoryAccordion.js  
├── FieldConfig.js             # ⭐ ACTUALIZADO: Configuración centralizada de campos por categoría/subcategoría
├── DynamicFieldManager.js 
├── index.js  
├── FieldRendererUniversal.js  # ⭐ ACTUALIZADO: Renderiza campos específicos según categoría
└── FieldRenderer.js  # (alternativa/spelling)
└── FieldVariantes.js 
 
 
utils/
├── slugUtils.js               # ⭐ NUEVO: Genera y parsea slugs para URLs amigables
├── linkHelper.js              # ⭐ NUEVO: Genera enlaces dinámicos para categorías
└── (otras utilidades)
📂 REDUX/ - GESTIÓN DE ESTADO
text
redux/
├── actions/
│   ├── postAction.js          # ⭐ ACTUALIZADO: Acciones para posts con slugs
│   ├── storeAction.js         # ⭐ ACTUALIZADO: Acciones para tiendas con getStoreBySlug
│   └── (otras acciones)
├── reducers/
│   └── postReducer.js         # ⭐ ACTUALIZADO: Estados para nuevas rutas
└── store.js
📂 PAGES/ - PÁGINAS PRINCIPALES
✅ Sistema de Rutas Dinámicas
text
pages/
├── DynamicPage.js             # ⭐ NUEVO: Manejador principal de rutas dinámicas
├── categorySubCategory/
│   ├── CategoryPage.js        # ⭐ ACTUALIZADO: Página de categoría (acepta parámetros)
│   ├── SubcategoryPage.js     # ⭐ ACTUALIZADO: Página de subcategoría (maneja slugs con guiones)
│   ├── ImmobilerHierarchyPage.js  # ⭐ NUEVO: Jerarquía especial para inmuebles
│   └── ImmobilerOperationPage.js  # Mantenido (legacy)
├── boutique/
│   ├── BoutiquesList.js       # ⭐ NUEVO: Listado de tiendas
│   └── BoutiqueDetail.js      # ⭐ NUEVO: Detalle de tienda por slug
├── store/
│   ├── StoreList.js           # Listado de almacenes (mantener/renombrar)
│   ├── StoreDetail.js         # ⭐ ACTUALIZADO: Detalle de almacén (acepta slug)
│   ├── CreateStore.js         # Crear almacén
│   └── EditStore.js           # Editar almacén
├── CreateAnnoncePage.js       # Página de creación de anuncios
└── PostId.js                  # Detalle de post individual
✅ Componentes de UI
text
components/
├── home/
│   └── Posts.js               # ⭐ ACTUALIZADO: Mejorado para nuevas rutas
├── slidersHeaders/
│   └── CategorySlider.js      # ⭐ ACTUALIZADO: Enlaces nuevos
├── header/
│   └── Navbar2.js             # ⭐ ACTUALIZADO: Enlaces nuevos
└── extra/
    └── LoadingSpinner.js      # ⭐ NUEVO: Spinner de carga
📂 APP.JS - CONFIGURACIÓN PRINCIPAL
text
App.js                         # ⭐ ACTUALIZADO: Configuración completa de rutas
📂 CUSTOMROUTER/ - ENRUTAMIENTO PERSONALIZADO
text
customRouter/
├── PageRender.js              # Renderizado de páginas
└── PrivateRouter.js           # Rutas privadas
 
 
por ahora estoy implementando tres categorias solo para luego expander la logica a mas categorias 
estoy usando una accordion anidado (nested accordion) que:

Muestre todas las categorías principales (collapsed inicialmente)

Al seleccionar una categoría (ej: Électroménager) → se expande mostrando las subcategorías

Las subcategorías pueden ser de dos tipos:

De 1 nivel: Al hacer click → pasa directo al Step 2

Con nivel extra: Tienen un icono (chevron) → Al hacer click → se despliega el nivel extra debajo

Preserva el diseno tal cual como esta y vea que es lo que esta pasando con la categoria electromenager que no respode al hacer click