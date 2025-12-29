import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const NumeroTelephoneField = ({ value, onChange, name = 'telefono', error }) => {
  const { t } = useTranslation('formfields')
  
  const handleChange = (e) => {
    // Solo números y +
    const cleanValue = e.target.value.replace(/[^\d+]/g, '')
    onChange({
      target: { name, value: cleanValue }
    })
  }

  return (
    <>
      <Form.Label>📞 {t('telephone')}</Form.Label>
      <Form.Control
        type="tel"
        name={name}
        value={value || ''}
        onChange={handleChange}
        isInvalid={!!error}
        placeholder="0658556296"
      />
      {error && <div className="text-danger small">{error}</div>}
    </>
  )
}

export default NumeroTelephoneField