 
INICIAR CategoryPage

  obtener parámetros de URL:
      slug
      subSlug
      articleSlug
      page

  detectar si es modo Boutique
      si slug == "boutiques"
          isBoutique = true
      sino
          isBoutique = false

🔷 OBTENER ESTADO GLOBAL (Redux)
  obtener datos desde Redux:

      si modo normal:
          categoryInfo
          posts
          postsLoading
          hasMorePosts
          pagination

      si modo boutique:
          boutiques
          boutiquesLoading
          hasMoreBoutiques
          boutiquePagination

🔷 CREAR ESTADO LOCAL
  crear estado local:

      allChildren
      currentSub
      currentArticle
      error

      filters:
          sub = subSlug
          article = articleSlug
          page = page || 1

🔷 SINCRONIZAR URL
SI no existe page en URL:
    redirigir agregando /1

🔷 CUANDO CAMBIAN slug o filters
CUANDO slug o filters cambian:

    SI es boutique:
        despachar acción getBoutiquesByCategory
        guardar hijos en allChildren
        actualizar currentSub

    SINO (modo posts):
        despachar acción getCategoryPosts
        guardar hijos en allChildren
        actualizar currentSub
        actualizar currentArticle

🔷 FUNCIÓN: CLICK EN SLIDER
SI usuario hace click en slider:

    SI es boutique:
        actualizar filtros con sub
        actualizar URL sin recargar
        cargar boutiques de esa subcategoría
        actualizar currentSub

    SINO:
        SI subcategoría NO tiene artículos:
            actualizar filtros
            actualizar URL
            cargar posts

        SI subcategoría tiene artículos:
            solo mostrar artículos en slider
            no cargar posts todavía

🔷 FUNCIÓN: CLICK EN ARTÍCULO (nivel 3)
SI usuario hace click en artículo:

    actualizar filtros con:
        sub
        article
        page = 1

    actualizar URL sin recargar
    cargar posts filtrados
    actualizar currentArticle

🔷 FUNCIÓN: LOAD MORE (Infinite Scroll)
SI usuario baja scroll:

    SI es boutique:
        si hay más boutiques:
            aumentar página
            cargar más boutiques

    SINO:
        si hay más posts:
            aumentar página
            cargar más posts

🔷 FUNCIÓN: BUILD BREADCRUMB
crear lista breadcrumb:

    agregar "Inicio"

    agregar categoría principal

    si hay sub:
        agregar sub

    si hay artículo:
        agregar artículo

🔷 FUNCIÓN: DETERMINAR ITEMS DEL SLIDER
SI es boutique:
    mostrar subcategorías

SINO:
    SI hay sub y tiene artículos:
        mostrar artículos
    SINO:
        mostrar subcategorías

🔷 RENDER
MOSTRAR:

  CategoryCarousel

  SI hay items para slider:
      mostrar SliderUnificado

  mostrar Breadcrumb

  mostrar título + contador

  SI error:
      mostrar error

  SINO SI loading:
      mostrar spinner

  SINO SI hay items:
      mostrar grid con:
          PostCard o BoutiqueCard
      mostrar InfiniteScroll
      mostrar Pagination si aplica

  SINO:
      mostrar estado vacío

🎯 RESUMEN ARQUITECTÓNICO

Tu página hace 5 cosas simultáneamente:

1. Lee la URL
2. Sincroniza estado local
3. Sincroniza Redux
4. Sincroniza la UI
5. Controla navegación sin recarga


Eso es arquitectura dinámica SPA avanzada.

🏆 Versión ultra resumida

Si lo comprimimos al máximo:

CategoryPage:

  leer URL
  cargar datos según filtros
  actualizar slider
  actualizar breadcrumb
  renderizar posts o boutiques
  manejar paginación e infinite scroll


Maestro…

Si entiendes este pseudocódigo
puedes reescribir la página desde cero sin mirar el código.

Eso es dominar arquitectura.

Si quieres, ahora hacemos:

👉 Pseudocódigo SOLO del sistema de filtros
👉 O diagrama mental tipo árbol del flujo completo

Tú decides el siguiente nivel 🔥


CategoryPage
│
├── 1️⃣ ENTRADA (URL)
│     │
│     ├── slug
│     ├── subSlug
│     ├── articleSlug
│     └── page
│
├── 2️⃣ DETECTAR MODO
│     │
│     ├── SI slug == "boutiques"
│     │       → Modo Boutique
│     │
│     └── SINO
│             → Modo Posts
│
├── 3️⃣ CREAR FILTROS INTERNOS
│     │
│     ├── sub = subSlug
│     ├── article = articleSlug
│     └── page = page || 1
│
├── 4️⃣ SINCRONIZAR URL
│     │
│     └── SI no hay page
│            → redirigir agregando /1
│
├── 5️⃣ CARGA DE DATOS (useEffect principal)
│     │
│     ├── SI Modo Boutique
│     │       │
│     │       ├── dispatch getBoutiquesByCategory()
│     │       ├── guardar boutiques
│     │       ├── guardar children (subcategorías)
│     │       └── actualizar currentSub
│     │
│     └── SI Modo Posts
│             │
│             ├── dispatch getCategoryPosts()
│             ├── guardar posts
│             ├── guardar children (nivel 2)
│             │
│             ├── SI sub existe
│             │       ├── encontrar currentSub
│             │       │
│             │       └── SI article existe
│             │              └── encontrar currentArticle
│             │
│             └── SI no hay sub
│                    └── limpiar currentSub y currentArticle
│
├── 6️⃣ SISTEMA SLIDER
│     │
│     ├── SI boutique
│     │       → mostrar subcategorías
│     │
│     └── SI posts
│            │
│            ├── SI currentSub tiene artículos
│            │       → mostrar artículos (nivel 3)
│            │
│            └── SINO
│                    → mostrar subcategorías
│
├── 7️⃣ EVENTOS DE USUARIO
│     │
│     ├── CLICK SUBCATEGORÍA
│     │       │
│     │       ├── actualizar filtros
│     │       ├── actualizar URL sin recargar
│     │       └── volver a cargar datos
│     │
│     ├── CLICK ARTÍCULO (nivel 3)
│     │       │
│     │       ├── actualizar filtros
│     │       ├── actualizar URL
│     │       └── cargar posts filtrados
│     │
│     └── SCROLL (InfiniteScroll)
│             │
│             ├── aumentar página
│             ├── actualizar filtros
│             └── cargar más resultados
│
├── 8️⃣ SISTEMA BREADCRUMB
│     │
│     ├── Inicio
│     ├── Categoría
│     ├── Subcategoría (si existe)
│     └── Artículo (si existe)
│
├── 9️⃣ PAGINACIÓN MANUAL
│     │
│     ├── cambiar página
│     ├── actualizar filtros
│     ├── actualizar URL
│     └── cargar datos
│
└── 🔟 RENDER FINAL
      │
      ├── CategoryCarousel
      ├── SliderUnificado
      ├── Breadcrumb
      ├── Título + contador
      │
      ├── SI error → mostrar error
      ├── SI loading → spinner
      ├── SI hay items → grid + infinite scroll
      └── SI vacío → estado sin resultados
