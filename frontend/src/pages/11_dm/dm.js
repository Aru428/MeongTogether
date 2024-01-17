import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './dm.module.scss';
import io from 'socket.io-client';
import Chat from './Chat';
import Notice from './Notice';
import axios from 'axios';

const socket = io.connect(`${process.env.REACT_APP_HOST}`, {
  autoConnect: false,
});

export default function Dm() {
  const [msgInput, setMsgInput] = useState('');
  const [chatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState(null);

  const { nickname, user_id } = useSelector((state) => state.user);
  const { chat_name } = useParams();

  const initSocketConnect = () => {
    console.log('connected', socket.connected);
    if (!socket.connected) socket.connect(); // 연결이 안 되어 있을 때만 연결을 하겠다
  };

  const getChatMsg = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/chat/getmsg/${chat_name}`)
      .then((res) => {
        console.log(res.data);
        setChatList(res.data);
      });
  };

  const entryChat = () => {
    initSocketConnect();
    socket.emit('entry', {
      chat_name: chat_name,
      chat_category: 'dm',
      nickname: nickname, // nickname : 접속한 사용자
    });
    getChatMsg();
  };

  useEffect(() => {
    // mount
    socket.on('error', (res) => {
      alert(res.msg);
    });
    entryChat();

    // unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleEnter = (e) => {
    if (e.key === 'Enter') sendMsg();
  };

  const sendMsg = () => {
    if (msgInput !== '') {
      socket.emit('sendMsg', { user_id: user_id, msg: msgInput });
      setMsgInput('');

      axios
        .post(
          `${process.env.REACT_APP_HOST}/chat/createmsg`,
          {
            user_id: user_id,
            chat_name: chat_name,
            msg_content: msgInput,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log('채팅 전송!!', res.data);
        });
    }
  };

  // chatList 변경시
  // useEffect(() => {
  //   const notice = (res) => {
  //     console.log("notice");
  //     const newChatList = [...chatList, { type: "notice", content: res.msg }];
  //     setChatList(newChatList);
  //   };

  //   socket.on("notice", notice);
  //   return () => socket.off("notice", notice);
  // }, [chatList]);

  const addChatList = useCallback(
    (res) => {
      const currentDate = new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', ' '); // YYYY-MM-DD HH:mm:ss 형식으로 포맷
      const newChatList = [
        ...chatList,
        { user_id: res.user_id, msg_content: res.msg, send_time: currentDate },
      ];
      setChatList(newChatList);
    },
    // chatId와 chatList가 변경될 때마다 함수를 다시 선언
    [chatId, chatList]
  );

  useEffect(() => {
    socket.on('chat', addChatList);
    return () => socket.off('chat', addChatList);
  }, [addChatList]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>쪽지</div>
        <div className={styles.chatContainer}>
          {chatList.map((chat, i) => {
            if (chat.type === 'notice') return <Notice key={i} chat={chat} />;
            else return <Chat key={i} chat={chat} />;
          })}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={handleEnter}
          />

          <button onClick={sendMsg}>전송</button>
        </div>
      </div>
    </>
  );
}
