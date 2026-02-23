// components/boutique/tabs/SettingsTab.jsx
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Tab, Nav } from 'react-bootstrap';
import { 
  FaSave, 
  FaUser, 
  FaShareAlt, 
  FaBell, 
  FaPalette,
  FaShieldAlt,
  FaEnvelope,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
  FaTwitter
} from 'react-icons/fa';

const SettingsTab = ({ boutique, type = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(type);
  const [saved, setSaved] = useState(false);

  // États pour les différents formulaires
  const [profileSettings, setProfileSettings] = useState({
    nom_boutique: boutique.nom_boutique || '',
    slogan_boutique: boutique.slogan_boutique || '',
    email: boutique.proprietaire?.email || '',
    telephone: boutique.proprietaire?.telephone || '',
    wilaya: boutique.proprietaire?.wilaya || '',
    adresse: boutique.proprietaire?.adresse || ''
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: boutique.reseaux_sociaux?.facebook || '',
    instagram: boutique.reseaux_sociaux?.instagram || '',
    tiktok: boutique.reseaux_sociaux?.tiktok || '',
    whatsapp: boutique.reseaux_sociaux?.whatsapp || '',
    website: boutique.reseaux_sociaux?.website || '',
    youtube: '',
    twitter: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewOrder: true,
    emailPayment: true,
    emailPromotions: false,
    smsNewOrder: false,
    smsShipping: true,
    pushNewMessage: true
  });

  const [themeSettings, setThemeSettings] = useState({
    couleur_theme: boutique.couleur_theme || '#2563eb',
    fontFamily: 'default',
    layout: 'modern',
    showStats: true,
    showSocial: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    ipWhitelist: [],
    sessionTimeout: 30,
    autoLogout: true
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    console.log('Sauvegarde des paramètres');
  };

  const renderProfileTab = () => (
    <div>
      <h5 className="mb-4">Paramètres du profil</h5>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nom de la boutique</Form.Label>
              <Form.Control
                type="text"
                value={profileSettings.nom_boutique}
                onChange={(e) => setProfileSettings({...profileSettings, nom_boutique: e.target.value})}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Slogan</Form.Label>
              <Form.Control
                type="text"
                value={profileSettings.slogan_boutique}
                onChange={(e) => setProfileSettings({...profileSettings, slogan_boutique: e.target.value})}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email de contact</Form.Label>
              <Form.Control
                type="email"
                value={profileSettings.email}
                onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="tel"
                value={profileSettings.telephone}
                onChange={(e) => setProfileSettings({...profileSettings, telephone: e.target.value})}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Wilaya</Form.Label>
          <Form.Control
            type="text"
            value={profileSettings.wilaya}
            onChange={(e) => setProfileSettings({...profileSettings, wilaya: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Adresse complète</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={profileSettings.adresse}
            onChange={(e) => setProfileSettings({...profileSettings, adresse: e.target.value})}
          />
        </Form.Group>
      </Form>
    </div>
  );

  const renderSocialTab = () => (
    <div>
      <h5 className="mb-4">Réseaux sociaux</h5>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>
            <FaFacebook className="text-primary me-2" />
            Facebook
          </Form.Label>
          <Form.Control
            type="url"
            placeholder="https://facebook.com/votre-boutique"
            value={socialSettings.facebook}
            onChange={(e) => setSocialSettings({...socialSettings, facebook: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaInstagram className="text-danger me-2" />
            Instagram
          </Form.Label>
          <Form.Control
            type="url"
            placeholder="https://instagram.com/votre-boutique"
            value={socialSettings.instagram}
            onChange={(e) => setSocialSettings({...socialSettings, instagram: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaTiktok className="text-dark me-2" />
            TikTok
          </Form.Label>
          <Form.Control
            type="url"
            placeholder="https://tiktok.com/@votre-boutique"
            value={socialSettings.tiktok}
            onChange={(e) => setSocialSettings({...socialSettings, tiktok: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaWhatsapp className="text-success me-2" />
            WhatsApp
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="+213 XX XXX XXX"
            value={socialSettings.whatsapp}
            onChange={(e) => setSocialSettings({...socialSettings, whatsapp: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaGlobe className="text-secondary me-2" />
            Site web
          </Form.Label>
          <Form.Control
            type="url"
            placeholder="https://votre-site.com"
            value={socialSettings.website}
            onChange={(e) => setSocialSettings({...socialSettings, website: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaYoutube className="text-danger me-2" />
            YouTube
          </Form.Label>
          <Form.Control
            type="url"
            placeholder="https://youtube.com/@votre-boutique"
            value={socialSettings.youtube}
            onChange={(e) => setSocialSettings({...socialSettings, youtube: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaTwitter className="text-info me-2" />
            Twitter
          </Form.Label>
          <Form.Control
            type="url"
            placeholder="https://twitter.com/votre-boutique"
            value={socialSettings.twitter}
            onChange={(e) => setSocialSettings({...socialSettings, twitter: e.target.value})}
          />
        </Form.Group>
      </Form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div>
      <h5 className="mb-4">Préférences de notification</h5>
      <Form>
        <h6 className="mb-3">Email</h6>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Nouvelle commande"
            checked={notificationSettings.emailNewOrder}
            onChange={(e) => setNotificationSettings({...notificationSettings, emailNewOrder: e.target.checked})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Confirmation de paiement"
            checked={notificationSettings.emailPayment}
            onChange={(e) => setNotificationSettings({...notificationSettings, emailPayment: e.target.checked})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Promotions et offres"
            checked={notificationSettings.emailPromotions}
            onChange={(e) => setNotificationSettings({...notificationSettings, emailPromotions: e.target.checked})}
          />
        </Form.Group>

        <h6 className="mb-3 mt-4">SMS</h6>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Nouvelle commande"
            checked={notificationSettings.smsNewOrder}
            onChange={(e) => setNotificationSettings({...notificationSettings, smsNewOrder: e.target.checked})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Mise à jour expédition"
            checked={notificationSettings.smsShipping}
            onChange={(e) => setNotificationSettings({...notificationSettings, smsShipping: e.target.checked})}
          />
        </Form.Group>

        <h6 className="mb-3 mt-4">Push</h6>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Nouveau message"
            checked={notificationSettings.pushNewMessage}
            onChange={(e) => setNotificationSettings({...notificationSettings, pushNewMessage: e.target.checked})}
          />
        </Form.Group>
      </Form>
    </div>
  );

  const renderThemeTab = () => (
    <div>
      <h5 className="mb-4">Apparence</h5>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Couleur du thème</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type="color"
              value={themeSettings.couleur_theme}
              onChange={(e) => setThemeSettings({...themeSettings, couleur_theme: e.target.value})}
              style={{ width: '100px', height: '40px', marginRight: '10px' }}
            />
            <Form.Control
              type="text"
              value={themeSettings.couleur_theme}
              onChange={(e) => setThemeSettings({...themeSettings, couleur_theme: e.target.value})}
              style={{ width: '150px' }}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Police de caractères</Form.Label>
          <Form.Select
            value={themeSettings.fontFamily}
            onChange={(e) => setThemeSettings({...themeSettings, fontFamily: e.target.value})}
          >
            <option value="default">Par défaut</option>
            <option value="modern">Moderne</option>
            <option value="classic">Classique</option>
            <option value="elegant">Élégant</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Disposition</Form.Label>
          <Form.Select
            value={themeSettings.layout}
            onChange={(e) => setThemeSettings({...themeSettings, layout: e.target.value})}
          >
            <option value="modern">Moderne</option>
            <option value="compact">Compacte</option>
            <option value="spacious">Aérée</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Afficher les statistiques"
            checked={themeSettings.showStats}
            onChange={(e) => setThemeSettings({...themeSettings, showStats: e.target.checked})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Afficher les réseaux sociaux"
            checked={themeSettings.showSocial}
            onChange={(e) => setThemeSettings({...themeSettings, showSocial: e.target.checked})}
          />
        </Form.Group>
      </Form>
    </div>
  );

  const renderSecurityTab = () => (
    <div>
      <h5 className="mb-4">Sécurité</h5>
      <Form>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Authentification à deux facteurs (2FA)"
            checked={securitySettings.twoFactorAuth}
            onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
          />
          <Form.Text className="text-muted">
            Renforcez la sécurité de votre compte avec une vérification en deux étapes
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Déconnexion automatique après inactivité"
            checked={securitySettings.autoLogout}
            onChange={(e) => setSecuritySettings({...securitySettings, autoLogout: e.target.checked})}
          />
        </Form.Group>

        {securitySettings.autoLogout && (
          <Form.Group className="mb-3">
            <Form.Label>Délai de déconnexion (minutes)</Form.Label>
            <Form.Control
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
              min="5"
              max="120"
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>IP autorisées (une par ligne)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="192.168.1.1&#10;10.0.0.1"
            value={securitySettings.ipWhitelist.join('\n')}
            onChange={(e) => setSecuritySettings({...securitySettings, ipWhitelist: e.target.value.split('\n')})}
          />
          <Form.Text className="text-muted">
            Laissez vide pour autoriser toutes les IP
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  );

  return (
    <div className="settings-tab">
      {saved && (
        <Alert variant="success" onClose={() => setSaved(false)} dismissible>
          Paramètres sauvegardés avec succès !
        </Alert>
      )}

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="profile">
                  <FaUser className="me-2" /> Profil
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="social">
                  <FaShareAlt className="me-2" /> Réseaux sociaux
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="notifications">
                  <FaBell className="me-2" /> Notifications
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="theme">
                  <FaPalette className="me-2" /> Apparence
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="security">
                  <FaShieldAlt className="me-2" /> Sécurité
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={9}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    {renderProfileTab()}
                  </Tab.Pane>
                  <Tab.Pane eventKey="social">
                    {renderSocialTab()}
                  </Tab.Pane>
                  <Tab.Pane eventKey="notifications">
                    {renderNotificationsTab()}
                  </Tab.Pane>
                  <Tab.Pane eventKey="theme">
                    {renderThemeTab()}
                  </Tab.Pane>
                  <Tab.Pane eventKey="security">
                    {renderSecurityTab()}
                  </Tab.Pane>
                </Tab.Content>

                <hr className="my-4" />
                
                <div className="text-end">
                  <Button variant="primary" onClick={handleSave}>
                    <FaSave className="me-2" /> Sauvegarder
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default SettingsTab;