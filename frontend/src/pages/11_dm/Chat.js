import styles from './dm.module.scss';
import { useSelector } from 'react-redux';

export default function Chat({ chat }) {
  const { user_id } = useSelector((state) => state.user);
  const type = user_id === chat.user_id ? 'my' : 'other';
  return (
    <div className={`${styles.list} ${styles[`${type}Chat`]}`}>
      <div className={styles.date}>{chat.send_time}</div>
      <div className={styles.content}>{chat.msg_content}</div>
    </div>
  );
}
