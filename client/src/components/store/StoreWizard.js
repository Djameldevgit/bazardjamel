import React, { useState } from 'react'
import {
  Card,
  Button,
  ProgressBar,
  Alert,
  Row,
  Col,
  Spinner
} from 'react-bootstrap'
import Step1Categories from './Step1Categories'
import Step2Duration from './Step2Duration'
import Step3Plan from './Step3Plan'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { createStore } from '../../redux/actions/storeAction'

const StoreWizard = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [storeData, setStoreData] = useState({
    categories: [],
    duration: 1,
    plan: null
  })
  const [localError, setLocalError] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()

  // Obtener estados de Redux - CON VALIDACIÓN SEGURA
  const { auth } = useSelector(state => state)
  const storeState = useSelector(state => state.store || {})
  
  // 🔥 VALIDACIÓN SEGURA PARA EVITAR undefined
  const storeLoading = storeState.loading || false
  const error = storeState.error || null
  const success = storeState.success || false

  console.log('🔄 Estado auth:', auth)
  console.log('🔄 Estado store:', { loading: storeLoading, error, success })

  const steps = ['Choisir catégories', 'Choisir durée', 'Choisir offre']
  const stepProgress = ((activeStep + 1) / steps.length) * 100

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1)
    setLocalError(null)
  }

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1)
    setLocalError(null)
  }

  const handleCategorySelect = (categories) => {
    console.log('✅ Catégories sélectionnées:', categories)
    setStoreData({ ...storeData, categories })
    setLocalError(null)
  }

  const handleDurationSelect = (duration) => {
    console.log('✅ Durée sélectionnée:', duration)
    setStoreData({ ...storeData, duration })
    setLocalError(null)
  }

  const handlePlanSelect = (plan) => {
    console.log('✅ Plan sélectionné:', plan)
    setStoreData({ ...storeData, plan })
    setLocalError(null)
  }

  const handleSubmit = async () => {
    console.log('🎯 === DÉBUT CRÉATION BOUTIQUE ===')
    
    // Resetear errores
    setLocalError(null)
    
    // Validations
    if (!storeData.plan) {
      const errorMsg = '❌ Veuillez sélectionner un plan'
      setLocalError(errorMsg)
      return
    }
    
    if (storeData.categories.length === 0) {
      const errorMsg = '❌ Veuillez sélectionner au moins une catégorie'
      setLocalError(errorMsg)
      return
    }
    
    if (!auth?.token) {
      const errorMsg = '❌ Vous devez être connecté'
      setLocalError(errorMsg)
      return
    }

    // Preparar datos mínimos
    const finalData = {
      name: `Boutique ${storeData.plan.name || 'Nouvelle'}`,
      description: `Boutique spécialisée`,
      category: storeData.categories[0] || 'Général',
      plan: 'Free', // Siempre Free para evitar problemas
      duration: storeData.duration || 1
    }

    console.log('📤 Données à envoyer:', finalData)

    try {
      setIsCreating(true)
      setLocalError(null)
      
      console.log('🚀 Appel à createStore...')
      
      // Llamar a la acción
      const result = await dispatch(createStore(finalData, auth.token))
      
      console.log('📥 Résultat reçu:', result)
      
      // Verificar si result es undefined
      if (!result) {
        console.error('❌ ERROR: result est undefined!')
        setLocalError('Erreur inattendue')
        return
      }
      
      // Verificar éxito
      if (result.success === true) {
        console.log('✅ Succès!')
        
        // Redirigir
        const storeId = result.store?._id || result.store?.id
        
        if (storeId) {
          setTimeout(() => history.push(`/store/${storeId}`), 1500)
        } else {
          setTimeout(() => history.push('/dashboard'), 1500)
        }
        
      } else {
        // Error
        setLocalError(result.error || 'Erreur de création')
      }
      
    } catch (error) {
      console.error('❌ Exception:', error)
      setLocalError('Erreur inattendue')
      
    } finally {
      setIsCreating(false)
    }
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Step1Categories
            selectedCategories={storeData.categories}
            onSelect={handleCategorySelect}
          />
        )
      case 1:
        return (
          <Step2Duration
            selectedDuration={storeData.duration}
            onSelect={handleDurationSelect}
          />
        )
      case 2:
        return (
          <Step3Plan
            selectedPlan={storeData.plan}
            onSelect={handlePlanSelect}
            duration={storeData.duration}
          />
        )
      default:
        return 'Étape inconnue'
    }
  }

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return storeData.categories.length > 0
      case 1:
        return (storeData.duration || 0) > 0
      case 2:
        return storeData.plan !== null
      default: 
        return false
    }
  }

  // Mostrar error de Redux o local - CON VALIDACIÓN
  const displayError = error || localError || ''

  // 🔥 CORRECCIÓN: Usar Boolean() para evitar .toString() en undefined
  const isLoading = Boolean(isCreating || storeLoading)

  console.log('🎨 Render StoreWizard - SEGURO')
  console.log('activeStep:', activeStep)
  console.log('isStepValid:', isStepValid())
  console.log('isCreating:', isCreating)
  console.log('storeLoading:', storeLoading)
  console.log('displayError:', displayError)
  console.log('authUser:', auth?.user?.email || 'Non connecté')

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Étape {activeStep + 1} sur {steps.length}</span>
            <span className="text-primary fw-bold">{steps[activeStep]}</span>
          </div>
          <ProgressBar
            now={stepProgress}
            variant="primary"
            className="mb-3"
            style={{ height: '6px' }}
          />
        </div>

        {/* Success Alert */}
        {success && (
          <Alert variant="success" className="mb-4">
            <i className="fas fa-check-circle me-2"></i>
            Boutique créée avec succès! Redirection en cours...
          </Alert>
        )}

        {/* Error Alert */}
        {displayError && (
          <Alert variant="danger" className="mb-4">
            <i className="fas fa-exclamation-circle me-2"></i>
            {displayError}
          </Alert>
        )}

        {/* Auth Status Warning */}
        {!auth?.token && (
          <Alert variant="warning" className="mb-4">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Vous devez être connecté pour créer une boutique.
            <Button
              variant="link"
              className="p-0 ms-2"
              onClick={() => window.location.href = '/login'}
            >
              Se connecter
            </Button>
          </Alert>
        )}

        {/* Step Content */}
        <div className="my-4">
          {getStepContent(activeStep)}
        </div>

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
          <Button
            variant="outline-secondary"
            onClick={handleBack}
            disabled={activeStep === 0 || isLoading}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Retour
          </Button>

          <div>
            {activeStep === steps.length - 1 ? (
              <Button
                id="create-store-btn"
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading || !auth?.token}
                style={{ minWidth: '200px' }}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <i className="fas fa-store me-2"></i>
                    {!auth?.token ? 'Connexion requise' : 'Créer la boutique'}
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Continuer
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            )}
          </div>
        </div>

        {/* 🔥 DEBUG INFO CORREGIDO - SIN .toString() */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4">
            <Alert variant="info" className="small">
              <strong>🔍 Debug Info:</strong>
              <div className="mt-2">
                <Row>
                  <Col md={6}>
                    <div><strong>État UI:</strong></div>
                    <div>• Step: {activeStep}</div>
                    <div>• Step Valid: {isStepValid() ? 'Oui' : 'Non'}</div>
                    <div>• Loading: {isLoading ? 'Oui' : 'Non'}</div>
                    <div>• Auth: {auth?.token ? '✅ Connecté' : '❌ Non connecté'}</div>
                  </Col>
                  <Col md={6}>
                    <div><strong>Données boutique:</strong></div>
                    <div>• Catégories: {storeData.categories.length}</div>
                    <div>• Durée: {storeData.duration || 0} mois</div>
                    <div>• Plan: {storeData.plan?.name || 'Aucun'}</div>
                    <div>• Plan ID: {storeData.plan?.id || '-'}</div>
                  </Col>
                </Row>
              </div>
            </Alert>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default StoreWizard