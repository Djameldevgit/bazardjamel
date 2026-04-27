// components/message/RightSide.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserCard from '../UserCard';
import MsgDisplay from './MsgDisplay';
import Icons from '../Icons';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { imageShow, videoShow } from '../../utils/mediaShow';
import { imageUpload } from '../../utils/imageUpload';
import { addMessage, getMessages, loadMoreMessages } from '../../redux/actions/messageAction';
import LoadIcon from '../../images/loading.gif';

const RightSide = () => {
  const { id } = useParams(); // ✅ Obtener ID del usuario de la URL
  const { auth, message, theme, socket } = useSelector(state => state);
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);
  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  const refDisplay = useRef();
  const pageEnd = useRef();

  // Obtener usuario de la conversación
  useEffect(() => {
    if (id && message.users.length > 0) {
      const newUser = message.users.find(user => user._id === id);
      if (newUser) setUser(newUser);
    }
  }, [id, message.users]);

  // Obtener mensajes
  useEffect(() => {
    const getMessagesData = async () => {
      if (message.data.every(item => item._id !== id)) {
        await dispatch(getMessages({ auth, id }));
        setTimeout(() => {
          refDisplay.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
      }
    };
    if (id) getMessagesData();
  }, [id, dispatch, auth, message.data]);

  // Actualizar datos de mensajes
  useEffect(() => {
    if (id) {
      const newData = message.data.find(item => item._id === id);
      if (newData) {
        setData(newData.messages);
        setResult(newData.result);
        setPage(newData.page);
      }
    }
  }, [message.data, id]);

  // Auto-scroll
  useEffect(() => {
    if (id) {
      setTimeout(() => {
        refDisplay.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [data, id]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsLoadMore(p => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (pageEnd.current) observer.observe(pageEnd.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isLoadMore > 1 && result >= page * 9) {
      dispatch(loadMoreMessages({ auth, id, page: page + 1 }));
      setIsLoadMore(1);
    }
  }, [isLoadMore, result, page, auth, id, dispatch]);

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = '';
    let newMedia = [];

    files.forEach(file => {
      if (!file) return err = 'File does not exist.';
      if (file.size > 1024 * 1024 * 5) {
        return err = 'The image/video largest is 5mb.';
      }
      return newMedia.push(file);
    });

    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;
    
    setText('');
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if (media.length > 0) newArr = await imageUpload(media);

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString()
    };

    setLoadMedia(false);
    await dispatch(addMessage({ msg, auth, socket }));
    refDisplay.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  if (!id) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column h-100">
        <i className="fas fa-comments text-primary" style={{ fontSize: '5rem' }} />
        <h5 className="mt-3">Sélectionnez une conversation</h5>
        <p className="text-muted">Choisissez un utilisateur pour commencer à discuter</p>
      </div>
    );
  }

  return (
    <>
      <div className="message_header" style={{ cursor: 'pointer' }}>
        {user && <UserCard user={user} />}
      </div>

      <div className="chat_container" style={{ height: media.length > 0 ? 'calc(100% - 180px)' : '' }}>
        <div className="chat_display" ref={refDisplay}>
          <button style={{ marginTop: '-25px', opacity: 0 }} ref={pageEnd}>
            Load more
          </button>

          {data.map((msg, index) => (
            <div key={index}>
              {msg.sender !== auth.user._id && (
                <div className="chat_row other_message">
                  <MsgDisplay user={user} msg={msg} theme={theme} />
                </div>
              )}
              {msg.sender === auth.user._id && (
                <div className="chat_row you_message">
                  <MsgDisplay user={auth.user} msg={msg} theme={theme} data={data} />
                </div>
              )}
            </div>
          ))}

          {loadMedia && (
            <div className="chat_row you_message">
              <img src={LoadIcon} alt="loading" />
            </div>
          )}
        </div>
      </div>

      <div className="show_media" style={{ display: media.length > 0 ? 'grid' : 'none' }}>
        {media.map((item, index) => (
          <div key={index} id="file_media">
            {item.type.match(/video/i)
              ? videoShow(URL.createObjectURL(item), theme)
              : imageShow(URL.createObjectURL(item), theme)}
            <span onClick={() => handleDeleteMedia(index)}>&times;</span>
          </div>
        ))}
      </div>

      <form className="chat_input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Écrivez votre message..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{
            filter: theme ? 'invert(1)' : 'invert(0)',
            background: theme ? '#040404' : '',
            color: theme ? 'white' : ''
          }}
        />

        <Icons setContent={setText} content={text} theme={theme} />

        <div className="file_upload">
          <i className="fas fa-image text-danger" />
          <input
            type="file"
            name="file"
            id="file"
            multiple
            accept="image/*,video/*"
            onChange={handleChangeMedia}
          />
        </div>

        <button
          type="submit"
          className="material-icons"
          disabled={(!text && media.length === 0) || loadMedia}
        >
          near_me
        </button>
      </form>
    </>
  );
};

export default RightSide;