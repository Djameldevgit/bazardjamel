// pages/store/StoreListPage.js
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getStores, searchStores } from '../../redux/actions/storeActions'
import StoreCard from '../../components/store/StoreCard'

const StoreListPage = () => {
  const dispatch = useDispatch()
  const { stores, loading, error, pagination } = useSelector(state => state.store)
  
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    verified: false
  })

  useEffect(() => {
    dispatch(getStores(page, 20, filters))
  }, [dispatch, page, filters])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      dispatch(searchStores(searchQuery, filters))
    } else {
      dispatch(getStores(1, 20, filters))
    }
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  if (loading && page === 1) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <h4 className="mt-3">Chargement des boutiques...</h4>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Boutiques</h1>
        <p className="lead text-muted">
          Découvrez toutes nos boutiques partenaires
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch} className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher une boutique..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">Toutes catégories</option>
                    <option value="vetements">Vêtements</option>
                    <option value="electronique">Électronique</option>
                    <option value="alimentation">Alimentation</option>
                    <option value="services">Services</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Ville"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="verified-switch"
                  label="Vérifiées"
                  checked={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                />
              </Col>
            </Row>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="primary" type="submit">
                <i className="fas fa-search me-2"></i>
                Rechercher
              </Button>
              <Button 
                variant="outline-primary"
                as={Link}
                to="/creer-boutique-form"
              >
                <i className="fas fa-plus me-2"></i>
                Créer une boutique
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Resultados */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>
            {pagination.total} boutique{pagination.total !== 1 ? 's' : ''} trouvée{pagination.total !== 1 ? 's' : ''}
          </h4>
          <Badge bg="info" className="fs-6">
            Page {page} sur {pagination.totalPages}
          </Badge>
        </div>

        {stores.length === 0 ? (
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            Aucune boutique trouvée. Soyez le premier à créer une boutique!
          </Alert>
        ) : (
          <Row>
            {stores.map(store => (
              <Col key={store._id} lg={4} md={6} className="mb-4">
                <StoreCard store={store} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <Button
                  variant="link"
                  className="page-link"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
              </li>
              
              {[...Array(pagination.totalPages)].map((_, idx) => {
                const pageNum = idx + 1
                // Mostrar solo páginas cercanas a la actual
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= page - 2 && pageNum <= page + 2)
                ) {
                  return (
                    <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                      <Button
                        variant="link"
                        className="page-link"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    </li>
                  )
                }
                return null
              })}
              
              <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
                <Button
                  variant="link"
                  className="page-link"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Suivant
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </Container>
  )
}

export default StoreListPage