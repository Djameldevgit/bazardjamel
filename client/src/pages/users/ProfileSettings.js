// src/pages/ProfileSettings.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Spinner, 
  Alert,
  Tab,
  Nav,
  Badge,
  Modal
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { 
  Person, 
  Envelope, 
  Telephone, 
  GeoAlt, 
  Camera, 
  Lock,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  X,
  CheckCircle,
  ExclamationTriangle
} from 'react-bootstrap-icons';
import { updateUserProfile, changePassword } from '../../redux/actions/authAction';
import { updateUserSettings } from '../../redux/actions/settingsAction';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const fileInputRef = useRef(null);
  
  const { auth } = useSelector(state => state);
  const { settings } = useSelector(state => state.settings || {});
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Estados para los diferentes formularios
  const [profileData, setProfileData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    avatar: null
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newMessageAlerts: true,
    newFollowerAlerts: true,
    commentAlerts: true,
    likeAlerts: true,
    marketingEmails: false,
    newsletterSubscription: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, private, friends
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showLastSeen: true,
    allowMessages: 'everyone', // everyone, followers, nobody
    allowComments: 'everyone', // everyone, followers, nobody
    allowTagging: 'everyone' // everyone, followers, nobody
  });
  
  const [preferences, setPreferences] = useState({
    language: 'es',
    currency: 'EUR',
    theme: 'light',
    timezone: 'Europe/Madrid',
    measurements: 'metric' // metric, imperial
  });

  // Cargar datos del usuario cuando el componente monta
  useEffect(() => {
    if (auth.user) {
      setProfileData({
        fullname: auth.user.fullname || '',
        username: auth.user.username || '',
        email: auth.user.email || '',
        phone: auth.user.phone || '',
        bio: auth.user.bio || '',
        location: auth.user.location || '',
        website: auth.user.website || '',
        avatar: auth.user.avatar || null
      });
      
      // Cargar configuraciones guardadas
      if (settings) {
        setNotificationSettings(prev => ({ ...prev, ...settings.notifications }));
        setPrivacySettings(prev => ({ ...prev, ...settings.privacy }));
        setPreferences(prev => ({ ...prev, ...settings.preferences }));
      }
    }
  }, [auth.user, settings]);

  // Manejar cambios en inputs de perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en notificaciones
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  // Manejar cambios en privacidad
  const handlePrivacyChange = (e) => {
    const { name, value } = e.target;
    setPrivacySettings(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en preferencias
  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  // Manejar subida de avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo y tamaño
      if (!file.type.match('image.*')) {
        setError('Por favor, selecciona una imagen válida');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('La imagen no puede superar los 5MB');
        return;
      }
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      setProfileData(prev => ({ ...prev, avatar: file }));
      setError('');
    }
  };

  // Guardar perfil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== '') {
          formData.append(key, profileData[key]);
        }
      });
      
      //await dispatch(updateUserProfile(formData, auth.token));
      setSuccess('Perfil actualizado correctamente');
      
      // Limpiar preview
      setPreviewImage(null);
      
      // Recargar datos del usuario
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, auth.token));
      
      setSuccess('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración
  const handleSaveSettings = async (type) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let settingsData = {};
      
      switch(type) {
        case 'notifications':
          settingsData = { notifications: notificationSettings };
          break;
        case 'privacy':
          settingsData = { privacy: privacySettings };
          break;
        case 'preferences':
          settingsData = { preferences: preferences };
          break;
        default:
          break;
      }
      
     // await dispatch(updateUserSettings(settingsData, auth.token));
      setSuccess('Configuración guardada correctamente');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  // Solicitar eliminación de cuenta
  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    
    try {
      // Aquí iría la lógica para eliminar la cuenta
      // await dispatch(deleteAccount(auth.token));
      
      // Redirigir al login después de eliminar
      history.push('/login');
      
    } catch (err) {
      setError('Error al eliminar la cuenta');
      setLoading(false);
    }
  };

  // Verificar autenticación
  if (!auth.token || !auth.user) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Autenticación requerida</h4>
          <p>Por favor, inicia sesión para ver la configuración de tu perfil.</p>
          <Button variant="primary" onClick={() => history.push('/login')}>
            Iniciar sesión
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className={`profile-settings ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="h3 fw-bold mb-1">Configuración de Perfil</h2>
            <p className="text-muted mb-0">
              Gestiona tu información personal y preferencias
            </p>
          </div>
          
          <Button 
            variant="outline-secondary" 
            onClick={() => history.push(`/profile/${auth.user._id}`)}
            className="rounded-pill"
          >
            <Person className="me-2" size={16} />
            Ver Perfil
          </Button>
        </div>

        {/* Alertas de éxito/error */}
        {success && (
          <Alert variant="success" className="d-flex align-items-center mb-4" onClose={() => setSuccess('')} dismissible>
            <CheckCircle className="me-2" size={20} />
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="d-flex align-items-center mb-4" onClose={() => setError('')} dismissible>
            <ExclamationTriangle className="me-2" size={20} />
            {error}
          </Alert>
        )}

        {/* Tabs de configuración */}
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row>
            <Col lg={3} className="mb-4">
              {/* Menú lateral */}
              <Nav variant="pills" className="flex-column settings-nav">
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="d-flex align-items-center">
                    <Person className="me-3" size={18} />
                    <div>
                      <strong>Información Personal</strong>
                      <small className="d-block text-muted">Nombre, email, bio</small>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                
                <Nav.Item>
                  <Nav.Link eventKey="password" className="d-flex align-items-center">
                    <Lock className="me-3" size={18} />
                    <div>
                      <strong>Seguridad</strong>
                      <small className="d-block text-muted">Contraseña</small>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                
                <Nav.Item>
                  <Nav.Link eventKey="notifications" className="d-flex align-items-center">
                    <Bell className="me-3" size={18} />
                    <div>
                      <strong>Notificaciones</strong>
                      <small className="d-block text-muted">Alertas y emails</small>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                
                <Nav.Item>
                  <Nav.Link eventKey="privacy" className="d-flex align-items-center">
                    <Shield className="me-3" size={18} />
                    <div>
                      <strong>Privacidad</strong>
                      <small className="d-block text-muted">Visibilidad y permisos</small>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                
                <Nav.Item>
                  <Nav.Link eventKey="preferences" className="d-flex align-items-center">
                    <Palette className="me-3" size={18} />
                    <div>
                      <strong>Preferencias</strong>
                      <small className="d-block text-muted">Idioma, tema, moneda</small>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                
                <Nav.Item>
                  <Nav.Link eventKey="danger" className="d-flex align-items-center text-danger">
                    <ExclamationTriangle className="me-3" size={18} />
                    <div>
                      <strong>Zona de Peligro</strong>
                      <small className="d-block text-muted">Eliminar cuenta</small>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col lg={9}>
              {/* Contenido de los tabs */}
              <Tab.Content>
                {/* TAB: Información Personal */}
                <Tab.Pane eventKey="profile">
                  <div className="settings-card bg-white rounded-3 shadow-sm p-4">
                    <h4 className="mb-4">Información Personal</h4>
                    
                    <Form onSubmit={handleSaveProfile}>
                      {/* Avatar */}
                      <div className="mb-4 text-center">
                        <div className="position-relative d-inline-block">
                          <div 
                            className="avatar-preview rounded-circle overflow-hidden border"
                            style={{ width: '120px', height: '120px' }}
                          >
                            {previewImage ? (
                              <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="w-100 h-100 object-fit-cover"
                              />
                            ) : profileData.avatar ? (
                              <img 
                                src={profileData.avatar} 
                                alt={profileData.fullname} 
                                className="w-100 h-100 object-fit-cover"
                              />
                            ) : (
                              <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                                <Person size={40} className="text-secondary" />
                              </div>
                            )}
                          </div>
                          
                          <Button
                            variant="primary"
                            size="sm"
                            className="position-absolute bottom-0 end-0 rounded-circle p-2"
                            onClick={() => fileInputRef.current.click()}
                            type="button"
                          >
                            <Camera size={16} />
                          </Button>
                          
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="d-none"
                          />
                        </div>
                        
                        <p className="text-muted small mt-2">
                          JPG, PNG o GIF. Máx 5MB.
                        </p>
                      </div>

                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Nombre completo</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullname"
                            value={profileData.fullname}
                            onChange={handleProfileChange}
                            placeholder="Tu nombre"
                          />
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>Nombre de usuario</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            placeholder="@usuario"
                          />
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>
                            <Envelope className="me-2" size={14} />
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            placeholder="tu@email.com"
                          />
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>
                            <Telephone className="me-2" size={14} />
                            Teléfono
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            placeholder="+34 123 456 789"
                          />
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>
                            <GeoAlt className="me-2" size={14} />
                            Ubicación
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            value={profileData.location}
                            onChange={handleProfileChange}
                            placeholder="Ciudad, País"
                          />
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>
                            <Globe className="me-2" size={14} />
                            Sitio web
                          </Form.Label>
                          <Form.Control
                            type="url"
                            name="website"
                            value={profileData.website}
                            onChange={handleProfileChange}
                            placeholder="https://tusitio.com"
                          />
                        </Col>
                        
                        <Col xs={12} className="mb-4">
                          <Form.Label>Biografía</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            placeholder="Cuéntanos sobre ti..."
                            rows={4}
                          />
                          <Form.Text className="text-muted">
                            {profileData.bio.length}/500 caracteres
                          </Form.Text>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          type="submit"
                          variant="primary"
                          disabled={loading}
                          className="rounded-pill px-4"
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="me-2" size={16} />
                              Guardar Cambios
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Tab.Pane>

                {/* TAB: Seguridad */}
                <Tab.Pane eventKey="password">
                  <div className="settings-card bg-white rounded-3 shadow-sm p-4">
                    <h4 className="mb-4">Cambiar Contraseña</h4>
                    
                    <Form onSubmit={handleChangePassword}>
                      <Row>
                        <Col xs={12} className="mb-3">
                          <Form.Label>Contraseña actual</Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                          />
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>Nueva contraseña</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                          />
                          <Form.Text className="text-muted">
                            Mínimo 6 caracteres
                          </Form.Text>
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>Confirmar nueva contraseña</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                          />
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          type="submit"
                          variant="primary"
                          disabled={loading}
                          className="rounded-pill px-4"
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Actualizando...
                            </>
                          ) : (
                            <>
                              <Lock className="me-2" size={16} />
                              Cambiar Contraseña
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Tab.Pane>

                {/* TAB: Notificaciones */}
                <Tab.Pane eventKey="notifications">
                  <div className="settings-card bg-white rounded-3 shadow-sm p-4">
                    <h4 className="mb-4">Configuración de Notificaciones</h4>
                    
                    <Form>
                      <div className="mb-4">
                        <h5 className="h6 mb-3">Notificaciones por Email</h5>
                        
                        <Form.Check 
                          type="switch"
                          id="emailNotifications"
                          name="emailNotifications"
                          label="Recibir notificaciones por email"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          className="mb-2"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="newMessageAlerts"
                          name="newMessageAlerts"
                          label="Alertas de nuevos mensajes"
                          checked={notificationSettings.newMessageAlerts}
                          onChange={handleNotificationChange}
                          className="mb-2"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="newFollowerAlerts"
                          name="newFollowerAlerts"
                          label="Nuevos seguidores"
                          checked={notificationSettings.newFollowerAlerts}
                          onChange={handleNotificationChange}
                          className="mb-2"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="commentAlerts"
                          name="commentAlerts"
                          label="Comentarios en mis publicaciones"
                          checked={notificationSettings.commentAlerts}
                          onChange={handleNotificationChange}
                          className="mb-2"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="likeAlerts"
                          name="likeAlerts"
                          label="Me gusta en mis publicaciones"
                          checked={notificationSettings.likeAlerts}
                          onChange={handleNotificationChange}
                          className="mb-2"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="h6 mb-3">Notificaciones Push</h5>
                        
                        <Form.Check 
                          type="switch"
                          id="pushNotifications"
                          name="pushNotifications"
                          label="Activar notificaciones push"
                          checked={notificationSettings.pushNotifications}
                          onChange={handleNotificationChange}
                          className="mb-2"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="h6 mb-3">Marketing y Promociones</h5>
                        
                        <Form.Check 
                          type="switch"
                          id="marketingEmails"
                          name="marketingEmails"
                          label="Recibir ofertas y promociones"
                          checked={notificationSettings.marketingEmails}
                          onChange={handleNotificationChange}
                          className="mb-2"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="newsletterSubscription"
                          name="newsletterSubscription"
                          label="Suscribirse al newsletter"
                          checked={notificationSettings.newsletterSubscription}
                          onChange={handleNotificationChange}
                          className="mb-2"
                        />
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="primary"
                          onClick={() => handleSaveSettings('notifications')}
                          disabled={loading}
                          className="rounded-pill px-4"
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="me-2" size={16} />
                              Guardar Preferencias
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Tab.Pane>

                {/* TAB: Privacidad */}
                <Tab.Pane eventKey="privacy">
                  <div className="settings-card bg-white rounded-3 shadow-sm p-4">
                    <h4 className="mb-4">Configuración de Privacidad</h4>
                    
                    <Form>
                      <div className="mb-4">
                        <h5 className="h6 mb-3">Visibilidad del Perfil</h5>
                        
                        <Form.Select 
                          name="profileVisibility"
                          value={privacySettings.profileVisibility}
                          onChange={handlePrivacyChange}
                          className="mb-3"
                        >
                          <option value="public">Público - Todos pueden ver</option>
                          <option value="private">Privado - Solo yo</option>
                          <option value="friends">Amigos - Solo mis amigos</option>
                        </Form.Select>
                        
                        <Form.Check 
                          type="switch"
                          id="showEmail"
                          name="showEmail"
                          label="Mostrar email en el perfil"
                          checked={privacySettings.showEmail}
                          onChange={handlePrivacyChange}
                          className="mb-2"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="showPhone"
                          name="showPhone"
                          label="Mostrar teléfono en el perfil"
                          checked={privacySettings.showPhone}
                          onChange={handlePrivacyChange}
                          className="mb-2"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="showLocation"
                          name="showLocation"
                          label="Mostrar ubicación"
                          checked={privacySettings.showLocation}
                          onChange={handlePrivacyChange}
                          className="mb-2"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="showLastSeen"
                          name="showLastSeen"
                          label="Mostrar última vez en línea"
                          checked={privacySettings.showLastSeen}
                          onChange={handlePrivacyChange}
                          className="mb-2"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="h6 mb-3">Interacciones</h5>
                        
                        <Form.Label className="small">¿Quién puede enviarte mensajes?</Form.Label>
                        <Form.Select 
                          name="allowMessages"
                          value={privacySettings.allowMessages}
                          onChange={handlePrivacyChange}
                          className="mb-3"
                        >
                          <option value="everyone">Todos</option>
                          <option value="followers">Solo seguidores</option>
                          <option value="nobody">Nadie</option>
                        </Form.Select>
                        
                        <Form.Label className="small">¿Quién puede comentar?</Form.Label>
                        <Form.Select 
                          name="allowComments"
                          value={privacySettings.allowComments}
                          onChange={handlePrivacyChange}
                          className="mb-3"
                        >
                          <option value="everyone">Todos</option>
                          <option value="followers">Solo seguidores</option>
                          <option value="nobody">Nadie</option>
                        </Form.Select>
                        
                        <Form.Label className="small">¿Quién puede etiquetarte?</Form.Label>
                        <Form.Select 
                          name="allowTagging"
                          value={privacySettings.allowTagging}
                          onChange={handlePrivacyChange}
                          className="mb-3"
                        >
                          <option value="everyone">Todos</option>
                          <option value="followers">Solo seguidores</option>
                          <option value="nobody">Nadie</option>
                        </Form.Select>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="primary"
                          onClick={() => handleSaveSettings('privacy')}
                          disabled={loading}
                          className="rounded-pill px-4"
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="me-2" size={16} />
                              Guardar Configuración
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Tab.Pane>

                {/* TAB: Preferencias */}
                <Tab.Pane eventKey="preferences">
                  <div className="settings-card bg-white rounded-3 shadow-sm p-4">
                    <h4 className="mb-4">Preferencias</h4>
                    
                    <Form>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Idioma</Form.Label>
                          <Form.Select 
                            name="language"
                            value={preferences.language}
                            onChange={handlePreferenceChange}
                          >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="it">Italiano</option>
                          </Form.Select>
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>Moneda</Form.Label>
                          <Form.Select 
                            name="currency"
                            value={preferences.currency}
                            onChange={handlePreferenceChange}
                          >
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">Dólar ($)</option>
                            <option value="GBP">Libra (£)</option>
                          </Form.Select>
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>Tema</Form.Label>
                          <Form.Select 
                            name="theme"
                            value={preferences.theme}
                            onChange={handlePreferenceChange}
                          >
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                            <option value="system">Sistema</option>
                          </Form.Select>
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>Zona horaria</Form.Label>
                          <Form.Select 
                            name="timezone"
                            value={preferences.timezone}
                            onChange={handlePreferenceChange}
                          >
                            <option value="Europe/Madrid">Madrid</option>
                            <option value="Europe/London">Londres</option>
                            <option value="America/New_York">Nueva York</option>
                            <option value="America/Mexico_City">Ciudad de México</option>
                          </Form.Select>
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Form.Label>Sistema de medidas</Form.Label>
                          <Form.Select 
                            name="measurements"
                            value={preferences.measurements}
                            onChange={handlePreferenceChange}
                          >
                            <option value="metric">Métrico (km, kg)</option>
                            <option value="imperial">Imperial (mi, lb)</option>
                          </Form.Select>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="primary"
                          onClick={() => handleSaveSettings('preferences')}
                          disabled={loading}
                          className="rounded-pill px-4"
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="me-2" size={16} />
                              Guardar Preferencias
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Tab.Pane>

                {/* TAB: Zona de Peligro */}
                <Tab.Pane eventKey="danger">
                  <div className="settings-card bg-white rounded-3 shadow-sm p-4 border-danger">
                    <h4 className="text-danger mb-4">Zona de Peligro</h4>
                    
                    <Alert variant="warning">
                      <ExclamationTriangle className="me-2" size={20} />
                      <strong>¡Cuidado!</strong> Las siguientes acciones son irreversibles.
                    </Alert>
                    
                    <div className="danger-zone-item p-3 border rounded-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="h6 mb-1">Eliminar cuenta</h5>
                          <p className="text-muted small mb-0">
                            Una vez eliminada, no podrás recuperar tu cuenta ni tus datos.
                          </p>
                        </div>
                        <Button 
                          variant="outline-danger"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="rounded-pill"
                        >
                          Eliminar cuenta
                        </Button>
                      </div>
                    </div>
                    
                    <div className="danger-zone-item p-3 border rounded-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="h6 mb-1">Exportar datos</h5>
                          <p className="text-muted small mb-0">
                            Descarga toda tu información personal.
                          </p>
                        </div>
                        <Button 
                          variant="outline-secondary"
                          className="rounded-pill"
                        >
                          Exportar datos
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

        {/* Modal de confirmación para eliminar cuenta */}
        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">
              <ExclamationTriangle className="me-2" size={20} />
              Eliminar cuenta
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <p className="mb-3">
              ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción:
            </p>
            <ul className="text-danger small">
              <li>Eliminará permanentemente tu perfil</li>
              <li>Eliminará todos tus anuncios</li>
              <li>Eliminará tus fotos y datos personales</li>
              <li>No podrá ser revertida</li>
            </ul>
            
            <Form.Group className="mt-3">
              <Form.Label>Escribe "ELIMINAR" para confirmar</Form.Label>
              <Form.Control type="text" placeholder="ELIMINAR" />
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Sí, eliminar mi cuenta
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      <style jsx="true">{`
        .settings-nav .nav-link {
          color: #495057;
          padding: 1rem;
          margin-bottom: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        
        .settings-nav .nav-link:hover {
          background-color: rgba(139, 92, 246, 0.1);
        }
        
        .settings-nav .nav-link.active {
          background-color: #8B5CF6;
          color: white;
        }
        
        .settings-nav .nav-link.active small {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .settings-card {
          transition: transform 0.2s;
        }
        
        .avatar-preview {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .danger-zone-item {
          transition: background-color 0.2s;
        }
        
        .danger-zone-item:hover {
          background-color: #fff5f5;
        }
        
        .object-fit-cover {
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default ProfileSettings;