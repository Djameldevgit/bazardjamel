// src/components/administration/Users/UsersTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import ModalPrivilegios from "../ModalPrivilegios";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Table,
  Dropdown,
  Badge,
  Spinner,
  Button,
  Modal,
  Row,
  Col,
  Card,
  Accordion,
  Form,
  InputGroup
} from "react-bootstrap";
import {
  PencilFill,
  TrashFill,
  LockFill,
  UnlockFill,
  CheckCircleFill,
  XCircleFill,
  ThreeDotsVertical,
  Search,
  XCircle
} from "react-bootstrap-icons";
import moment from "moment";
import "moment/locale/ar";
import "moment/locale/es";
import { debounce } from 'lodash';

import { getDataAPI } from "../../../utils/fetchData";
import {
  deleteUser,
  toggleActiveStatus,
  USER_TYPES,
  toggleVerification,
  bloquearUsuario,
  unBlockUser,
} from "../../../redux/actions/userAction";
import {
  getBlockedUsers,
} from "../../../redux/actions/userBlockAction";
import { MESS_TYPES } from "../../../redux/actions/messageAction";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";

import LoadMoreBtn from "../../LoadMoreBtn";
import UserCard from "../../UserCard";
import BloqueModalUser from "./BloqueModalUser";

// Recibimos props del AdminDashboard
const UsersTab = ({ filters = {}, token: propToken }) => {
  // Usamos Redux pero también permitimos recibir token por props
  const { homeUsers, auth, socket, online, languageReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  
  // Token prioritario: el que viene por props o el de Redux
  const authToken = propToken || auth?.token;
  
  const lang = languageReducer?.language || 'es';
  
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [, forceRender] = useState(0);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [userForPermission, setUserForPermission] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Estados para búsqueda en servidor
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);

  // Efecto para aplicar filtros desde el Drawer
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      // Aquí puedes aplicar los filtros del drawer
      // Por ejemplo, si hay filtros, refrescar la búsqueda
      console.log('Filtros aplicados:', filters);
      // Refrescar usuarios con filtros
      if (authToken) {
        fetchUsersWithFilters();
      }
    }
  }, [filters]);

  // Función para obtener usuarios con filtros
  const fetchUsersWithFilters = async () => {
    try {
      setLoad(true);
      let query = `users?limit=9`;
      
      // Aplicar filtros si existen
      if (filters.status) {
        query += `&status=${filters.status}`;
      }
      if (filters.role) {
        query += `&role=${filters.role}`;
      }
      if (filters.dateRange?.from) {
        query += `&fromDate=${filters.dateRange.from}`;
      }
      if (filters.dateRange?.to) {
        query += `&toDate=${filters.dateRange.to}`;
      }
      
      const res = await getDataAPI(query, authToken);
      dispatch({
        type: USER_TYPES.GET_USERS,
        payload: { ...res.data, page: 1 },
      });
    } catch (err) {
      console.error("Error fetching users with filters:", err);
    } finally {
      setLoad(false);
    }
  };

  // Función para buscar usuarios en el servidor
  const searchUsers = useCallback(
    debounce(async (searchTerm, page = 1) => {
      if (!authToken) return;

      try {
        setIsSearching(true);
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        if (normalizedSearchTerm.length === 0) {
          setSearchResults([]);
          return;
        }

        const query = `users/search?username=${encodeURIComponent(normalizedSearchTerm)}&page=${page}&limit=9&caseInsensitive=true`;
        const res = await getDataAPI(query, authToken);

        if (page === 1) {
          setSearchResults(res.data.users || []);
        } else {
          setSearchResults(prev => [...prev, ...(res.data.users || [])]);
        }

        setSearchPage(page);
        setHasMoreSearch(res.data.users && res.data.users.length === 9);
      } catch (err) {
        console.error("Error searching users:", err);
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: "Error en la búsqueda de usuarios" }
        });
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [authToken, dispatch]
  );

  // Efecto para realizar búsqueda cuando el término cambia
  useEffect(() => {
    if (search.trim() !== "") {
      searchUsers(search, 1);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [search, searchUsers]);

  // Handler para cargar más resultados de búsqueda
  const handleLoadMoreSearch = async () => {
    if (!authToken || search.trim() === "") return;

    try {
      setLoad(true);
      await searchUsers(search, searchPage + 1);
    } catch (err) {
      console.error("Error loading more search results:", err);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    moment.locale(lang === 'ar' ? 'ar' : 'es');
  }, [lang]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenPermissionModal = (user) => {
    setUserForPermission(user);
    setShowPermissionModal(true);
  };

  const handleClosePermissionModal = () => {
    setUserForPermission(null);
    setShowPermissionModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      forceRender((n) => n + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authToken) {
      dispatch(getBlockedUsers(authToken));
    }
  }, [authToken, dispatch]);

  useEffect(() => {
    if (!socket || !auth?.user) return;

    socket.emit("checkUserOnline", auth.user);

    socket.on("checkUserOnlineToClient", (data) => {
      dispatch({ type: GLOBALTYPES.ONLINE, payload: data });
    });

    socket.on("CheckUserOffline", (data) => {
      dispatch({ type: MESS_TYPES.UPDATE_USER_STATUS, payload: data });
    });

    return () => {
      socket.off("checkUserOnlineToClient");
      socket.off("CheckUserOffline");
    };
  }, [socket, auth?.user, dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoad(true);
        const res = await getDataAPI(`users?limit=9`, authToken);
        dispatch({
          type: USER_TYPES.GET_USERS,
          payload: { ...res.data, page: 1 },
        });
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoad(false);
        setInitialLoad(false);
      }
    };

    if (initialLoad && authToken) {
      fetchUsers();
    }
  }, [authToken, dispatch, initialLoad]);

  const handleLoadMore = async () => {
    setLoad(true);
    try {
      const res = await getDataAPI(
        `users?limit=9&page=${homeUsers.page + 1}`,
        authToken
      );
      dispatch({
        type: USER_TYPES.GET_USERS,
        payload: { ...res.data, page: homeUsers.page + 1 },
      });
    } catch (err) {
      console.error("Error loading more users:", err);
    } finally {
      setLoad(false);
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser({ id: userToDelete, auth: { token: authToken } }));
      setShowDeleteModal(false);

      if (search.trim() !== "") {
        setSearchResults(prev => prev.filter(user => user._id !== userToDelete));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleCloseModal = () => {
    setShowBlockModal(false);
    setSelectedUser(null);
  };

  const handleBlockUser = async (datosBloqueo) => {
    try {
      await dispatch(
        bloquearUsuario({ auth: { token: authToken }, datosBloqueo, user: selectedUser })
      );
      dispatch({
        type: USER_TYPES.UPDATE_USER_BLOCK_STATUS,
        payload: {
          userId: selectedUser._id,
          esBloqueado: true,
        },
      });
      dispatch(getBlockedUsers(authToken));

      if (search.trim() !== "") {
        setSearchResults(prev =>
          prev.map(u => u._id === selectedUser._id ? { ...u, esBloqueado: true } : u)
        );
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  const handleUnblockUser = async (user) => {
    try {
      await dispatch(unBlockUser({ user, auth: { token: authToken } }));
      dispatch({
        type: USER_TYPES.UPDATE_USER_BLOCK_STATUS,
        payload: {
          userId: user._id,
          esBloqueado: false,
        },
      });
      dispatch(getBlockedUsers(authToken));

      if (search.trim() !== "") {
        setSearchResults(prev =>
          prev.map(u => u._id === user._id ? { ...u, esBloqueado: false } : u)
        );
      }

      forceRender(n => n + 1);
    } catch (err) {
      console.error("Error unblocking user:", err);
    }
  };

  const handleToggleActiveStatus = async (userId) => {
    try {
      await dispatch(toggleActiveStatus(userId, authToken));

      if (search.trim() !== "") {
        setSearchResults(prev =>
          prev.map(u => u._id === userId ? { ...u, isActive: !u.isActive } : u)
        );
      }
    } catch (err) {
      console.error("Error toggling active status:", err);
    }
  };

  const handleToggleVerification = async (userId) => {
    try {
      await dispatch(toggleVerification(userId, authToken));

      if (search.trim() !== "") {
        setSearchResults(prev =>
          prev.map(u => u._id === userId ? { ...u, isVerified: !u.isVerified } : u)
        );
      }
    } catch (err) {
      console.error("Error toggling verification:", err);
    }
  };

  // Determinar qué usuarios mostrar
  const usersToShow = search.trim() !== "" ? searchResults : homeUsers.users;
  const hasMore = search.trim() !== "" ? hasMoreSearch : homeUsers.result >= 9;

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted fw-semibold">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header con buscador */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-gradient" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <Card.Body className="py-4">
              <Row className="align-items-center g-3">
                <Col lg={8} md={7}>
                  <InputGroup size="lg">
                    <InputGroup.Text className="bg-white border-0">
                      <Search className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Buscar usuarios por nombre o email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border-0 shadow-sm"
                      style={{ fontSize: "1rem" }}
                    />
                    {search.trim() !== "" && (
                      <Button
                        variant="light"
                        onClick={() => setSearch("")}
                        className="border-0"
                      >
                        <XCircle />
                      </Button>
                    )}
                  </InputGroup>
                </Col>
                <Col lg={4} md={5} className="text-md-end">
                  <Badge bg="light" text="dark" className="py-2 px-3 fs-6">
                    <i className="bi bi-person-check me-2"></i>
                    {usersToShow.length} {search.trim() !== "" ? "resultados" : "usuarios"}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">
            <TrashFill className="me-2" />
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="mb-0">¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            <TrashFill className="me-2" />
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Indicador de búsqueda */}
      {isSearching && search.trim() !== "" && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-4">
                <Spinner animation="border" variant="primary" className="mb-2" />
                <p className="mb-0 text-muted">Buscando...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Vista Mobile - Accordion */}
      {isMobile ? (
        <Row>
          <Col>
            {usersToShow.length === 0 ? (
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="py-5">
                  <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                  <p className="mt-3 mb-0 text-muted fs-5">
                    {search ? "No se encontraron usuarios" : "No hay usuarios disponibles"}
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <Accordion flush>
                {usersToShow.map((user, index) => (
                  <Accordion.Item key={user._id} eventKey={user._id} className="mb-3 border-0 shadow-sm rounded">
                    <Accordion.Header className="bg-white">
                      <div className="d-flex align-items-center w-100">
                        <Badge bg="primary" className="me-3 rounded-circle" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {index + 1}
                        </Badge>
                        <UserCard user={user} />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light">
                      <Row className="g-3 mb-3">
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Estado</small>
                            {online.some((u) => u._id === user._id) ? (
                              <Badge bg="success" className="w-100">En línea</Badge>
                            ) : user.lastDisconnectedAt ? (
                              <Badge bg="secondary" className="w-100">
                                Desconectado {moment(user.lastDisconnectedAt).fromNow()}
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="w-100">Desconectado</Badge>
                            )}
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Última desconexión</small>
                            {user.lastDisconnectedAt ? (
                              <small className="text-dark fw-semibold">
                                {moment(user.lastDisconnectedAt).fromNow()}
                              </small>
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Registro</small>
                            <small className="text-dark fw-semibold">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Verificación</small>
                            {user.isVerified ? (
                              <Badge bg="success" className="w-100"><CheckCircleFill className="me-1" /> Verificado</Badge>
                            ) : (
                              <Badge bg="danger" className="w-100"><XCircleFill className="me-1" /> No verificado</Badge>
                            )}
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Estado cuenta</small>
                            {user.isActive ? (
                              <Badge bg="success" className="w-100">Activo</Badge>
                            ) : (
                              <Badge bg="warning" text="dark" className="w-100">Inactivo</Badge>
                            )}
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Bloqueo</small>
                            {user.esBloqueado ? (
                              <Badge bg="danger" className="w-100">Bloqueado</Badge>
                            ) : (
                              <Badge bg="success" className="w-100">No bloqueado</Badge>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Dropdown className="d-grid">
                        <Dropdown.Toggle variant="primary" size="sm" className="w-100">
                          <ThreeDotsVertical className="me-2" />
                          Acciones
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100 shadow">
                          <Dropdown.Item disabled className="text-muted">
                            <PencilFill className="me-2" /> Editar
                          </Dropdown.Item>
                          <Dropdown.Divider />

                          <Dropdown.Item className="text-danger" onClick={() => confirmDelete(user._id)}>
                            <TrashFill className="me-2" /> Eliminar
                          </Dropdown.Item>

                          <Dropdown.Item onClick={() => handleOpenPermissionModal(user)}>
                            🛡️ Gestionar Permisos
                          </Dropdown.Item>

                          <Dropdown.Divider />

                          <Dropdown.Item
                            className={user.isActive ? "text-warning" : "text-success"}
                            onClick={() => handleToggleActiveStatus(user._id)}
                          >
                            {user.isActive ? (
                              <LockFill className="me-2" />
                            ) : (
                              <UnlockFill className="me-2" />
                            )}
                            {user.isActive ? "Desactivar" : "Activar"}
                          </Dropdown.Item>

                          <Dropdown.Item
                            className={user.esBloqueado ? "text-success" : "text-danger"}
                            onClick={() =>
                              user.esBloqueado ? handleUnblockUser(user) : handleOpenModal(user)
                            }
                          >
                            {user.esBloqueado ? (
                              <UnlockFill className="me-2" />
                            ) : (
                              <LockFill className="me-2" />
                            )}
                            {user.esBloqueado ? "Desbloquear" : "Bloquear"}
                          </Dropdown.Item>

                          <Dropdown.Item
                            className={user.isVerified ? "text-danger" : "text-success"}
                            onClick={() => handleToggleVerification(user._id)}
                          >
                            {user.isVerified ? (
                              <XCircleFill className="me-2" />
                            ) : (
                              <CheckCircleFill className="me-2" />
                            )}
                            {user.isVerified ? "Desverificar" : "Verificar"}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </Col>
        </Row>
      ) : (
        /* Vista Desktop - Tabla */
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                  <tr>
                    <th className="text-white border-0 py-3">#</th>
                    <th className="text-white border-0 py-3">Usuario</th>
                    <th className="text-white border-0 py-3">Estado</th>
                    <th className="text-white border-0 py-3">Última desconexión</th>
                    <th className="text-white border-0 py-3">Registro</th>
                    <th className="text-white border-0 py-3">Verificación</th>
                    <th className="text-white border-0 py-3">Estado cuenta</th>
                    <th className="text-white border-0 py-3">Bloqueo</th>
                    <th className="text-white border-0 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usersToShow.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5">
                        <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                        <p className="mt-3 mb-0 text-muted fs-5">
                          {search ? "No se encontraron usuarios" : "No hay usuarios disponibles"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    usersToShow.map((user, index) => (
                      <tr key={user._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td className="fw-bold text-primary">{index + 1}</td>
                        <td><UserCard user={user} /></td>
                        <td>
                          {online.some((u) => u._id === user._id) ? (
                            <Badge bg="success" className="px-3 py-2">En línea</Badge>
                          ) : user.lastDisconnectedAt ? (
                            <Badge bg="secondary" className="px-3 py-2">
                              Desconectado {moment(user.lastDisconnectedAt).fromNow()}
                            </Badge>
                          ) : (
                            <Badge bg="secondary" className="px-3 py-2">Desconectado</Badge>
                          )}
                        </td>
                        <td>
                          {user.lastDisconnectedAt ? (
                            <small className="text-muted" title={new Date(user.lastDisconnectedAt).toLocaleString()}>
                              {moment(user.lastDisconnectedAt).fromNow()}
                            </small>
                          ) : (
                            <span className="text-muted">--</span>
                          )}
                        </td>
                        <td><small className="text-muted">{new Date(user.createdAt).toLocaleDateString()}</small></td>
                        <td>
                          {user.isVerified ? (
                            <Badge bg="success" className="px-3 py-2"><CheckCircleFill className={`me-1 ${lang === 'ar' ? 'ms-1' : ''}`} /> Verificado</Badge>
                          ) : (
                            <Badge bg="danger" className="px-3 py-2"><XCircleFill className={`me-1 ${lang === 'ar' ? 'ms-1' : ''}`} /> No verificado</Badge>
                          )}
                        </td>
                        <td>
                          {user.isActive ? (
                            <Badge bg="success" className="px-3 py-2">Activo</Badge>
                          ) : (
                            <Badge bg="warning" text="dark" className="px-3 py-2">Inactivo</Badge>
                          )}
                        </td>
                        <td>
                          {user.esBloqueado ? (
                            <Badge bg="danger" className="px-3 py-2">Bloqueado</Badge>
                          ) : (
                            <Badge bg="success" className="px-3 py-2">No bloqueado</Badge>
                          )}
                        </td>
                        <td className="text-center">
                          <Dropdown drop={lang === 'ar' ? 'start' : 'end'}>
                            <Dropdown.Toggle variant="outline-primary" size="sm" id="dropdown-actions" className="rounded-circle" style={{ width: "35px", height: "35px", padding: "0" }}>
                              <ThreeDotsVertical />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0">
                              <Dropdown.Item className="text-danger" onClick={() => confirmDelete(user._id)}>
                                <TrashFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> Eliminar
                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Item
                                className={user.isActive ? "text-warning" : "text-success"}
                                onClick={() => handleToggleActiveStatus(user._id)}
                              >
                                {user.isActive ? (
                                  <LockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                                ) : (
                                  <UnlockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                                )}
                                {user.isActive ? "Desactivar" : "Activar"}
                              </Dropdown.Item>

                              <Dropdown.Item
                                className={user.esBloqueado ? "text-success" : "text-danger"}
                                onClick={() =>
                                  user.esBloqueado ? handleUnblockUser(user) : handleOpenModal(user)
                                }
                              >
                                {user.esBloqueado ? (
                                  <UnlockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                                ) : (
                                  <LockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                                )}
                                {user.esBloqueado ? "Desbloquear" : "Bloquear"}
                              </Dropdown.Item>

                              <Dropdown.Item
                                className={user.isVerified ? "text-danger" : "text-success"}
                                onClick={() => handleToggleVerification(user._id)}
                              >
                                {user.isVerified ? (
                                  <XCircleFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                                ) : (
                                  <CheckCircleFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} />
                                )}
                                {user.isVerified ? "Desverificar" : "Verificar"}
                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Item disabled className="text-muted">
                                <PencilFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> Editar
                              </Dropdown.Item>

                              <Dropdown.Item onClick={() => handleOpenPermissionModal(user)}>
                                🛡️ Gestionar Permisos
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Indicador de carga */}
      {load && (
        <Row className="my-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-3">
                <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                <span className="text-muted">Cargando más...</span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Botón de cargar más */}
      {hasMore && usersToShow.length > 0 && (
        <Row className="my-4">
          <Col className="d-flex justify-content-center">
            <LoadMoreBtn
              result={9}
              page={search.trim() !== "" ? searchPage : homeUsers.page}
              load={load}
              handleLoadMore={search.trim() !== "" ? handleLoadMoreSearch : handleLoadMore}
            />
          </Col>
        </Row>
      )}

      {/* Modal de permisos */}
      {showPermissionModal && userForPermission && (
        <ModalPrivilegios
          user={userForPermission}
          setShowModal={setShowPermissionModal}
          token={authToken}
        />
      )}

      {/* Modal de bloqueo */}
      {showBlockModal && selectedUser && (
        <BloqueModalUser
          show={showBlockModal}
          handleClose={handleCloseModal}
          handleBlock={handleBlockUser}
          user={selectedUser}
        />
      )}
    </Container>
  );
};

export default UsersTab;