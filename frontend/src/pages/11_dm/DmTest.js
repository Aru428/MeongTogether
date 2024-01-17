import { useState, useEffect } from 'react';
import styles from './dm.module.scss';
import io from 'socket.io-client';
import Chat from './Chat';
import Notice from './Notice';

const socket = io.connect('http://localhost:8000/', { autoConnect: false });

export default function DmTest() {
  const [msgInput, setMsgInput] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [chatList, setChatList] = useState([
    {
      user_id: 'sohee1234',
      msg_content: '하이하이',
      send_time: '2024-01-02T08:39:56.000Z',
    },
    {
      user_id: '새싹',
      msg_content: '안녕123',
      send_time: '2024-01-02T09:29:08.000Z',
    },
    {
      user_id: '김철수',
      msg_content: '뭐하는중이야?',
      send_time: '2024-01-02T09:29:19.000Z',
    },
    {
      type: 'notice', // 공지사항
      content: '~~~님이 입장하였습니다',
    },
  ]);
  const [userId, setUserId] = useState(null);
  const initSocketConnect = () => {
    console.log('connected', socket.connected);
    if (!socket.connected) socket.connect(); // 연결이 안 되어 있을 때만 연결을 하겠다
  };

  const sendMsg = () => {};

  const entryChat = () => {
    initSocketConnect();
    socket.emit('entry', { userId: userIdInput });
  };

  return (
    <>
      <h2>채팅창</h2>
      {/* {userId ? ( */}
      <>
        <div className={styles['chat-container']}>
          {chatList.map((chat, i) => {
            return (
              <>
                <div>
                  <div key={i}>{chat.user_id}님 환영합니다</div>
                </div>
                <div>
                  <div key={i}>{chat.msg_content}</div>
                  <div key={i}>{chat.send_time}</div>
                </div>
                {/* <div>
                  <div key={i}>{chat.msg_content}</div>
                  <div key={i}>{chat.send_time}</div>
                </div> */}
              </>
            );
          })}
        </div>
        <div className={styles['input-container']}>
          <input
            type="text"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
          />
          <button onClick={sendMsg} className={styles.button}>
            전송
          </button>
        </div>
      </>
    </>
  );
}
