import React, { useEffect, useState } from 'react'
import Info from '../components/profile/Info'
import Posts from '../components/profile/Posts'
import Saved from '../components/profile/Saved'
import { useSelector, useDispatch } from 'react-redux'
import { getProfileUsers } from '../redux/actions/profileAction'
import { useParams } from 'react-router-dom'
import { Spinner, Alert, Container } from 'react-bootstrap'

const Profile = () => {
    const { profile, auth } = useSelector(state => state)
    const dispatch = useDispatch()

    const { id } = useParams()
    const [saveTab, setSaveTab] = useState(false)
    const [initialLoad, setInitialLoad] = useState(false)

    useEffect(() => {
        console.log('👤 Profile useEffect ejecutado:', { id, authUserId: auth.user?._id });
        
        // Solo cargar si tenemos auth y id
        if (!auth.token || !id) return;

        const loadProfile = async () => {
            try {
                setInitialLoad(true);
                console.log('🚀 Disparando getProfileUsers para:', id);
                
                // Verificar si ya está cargado
                const isAlreadyLoaded = profile.ids.includes(id) && 
                                      profile.posts.some(p => p._id === id);
                
                if (!isAlreadyLoaded) {
                    await dispatch(getProfileUsers({ id, auth }));
                }
                
                console.log('✅ Perfil cargado/existente:', {
                    ids: profile.ids,
                    postsCount: profile.posts.filter(p => p._id === id).length
                });
                
            } catch (error) {
                console.error('❌ Error cargando perfil:', error);
            } finally {
                setInitialLoad(false);
            }
        };

        loadProfile();
    }, [id, auth, dispatch, profile.ids, profile.posts]);

    // 🔍 Verificar autenticación
    if (!auth.token) {
        return (
            <Container className="py-5">
                <Alert variant="warning" className="text-center">
                    <h4>Authentification requise</h4>
                    <p>Veuillez vous connecter pour voir les profils.</p>
                </Alert>
            </Container>
        );
    }

    // 🔍 Mostrar loading inicial
    if (initialLoad) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Chargement du profil...</p>
            </Container>
        );
    }

    // 🔍 Verificar si el perfil existe
    const userExists = profile.users.some(user => user._id === id);
    if (!userExists && !profile.loading) {
        return (
            <Container className="py-5">
                <Alert variant="danger" className="text-center">
                    <h4>Profil non trouvé</h4>
                    <p>L'utilisateur avec l'ID {id} n'existe pas.</p>
                </Alert>
            </Container>
        );
    }

    const isOwnProfile = auth.user?._id === id;

    return (
        <div className="profile">
            <Container className="py-4">
                {/* Componente Info */}
                <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

                {/* Tabs solo para perfil propio */}
                {isOwnProfile && (
                    <div className="profile_tab mt-4 mb-4">
                        <div className="btn-group w-100" role="group">
                            <button 
                                className={`btn btn-lg ${!saveTab ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setSaveTab(false)}
                            >
                                <i className="fas fa-images me-2"></i>
                                Mes Publications
                            </button>
                            <button 
                                className={`btn btn-lg ${saveTab ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setSaveTab(true)}
                            >
                                <i className="fas fa-bookmark me-2"></i>
                                Sauvegardés
                            </button>
                        </div>
                    </div>
                )}

                {/* Contenido principal */}
                <div className="profile-content mt-4">
                    {saveTab ? (
                        <Saved auth={auth} dispatch={dispatch} />
                    ) : (
                        <Posts 
                            auth={auth} 
                            profile={profile} 
                            dispatch={dispatch} 
                            id={id} 
                        />
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Profile