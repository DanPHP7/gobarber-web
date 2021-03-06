import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { MdNotifications } from 'react-icons/md';
import { toast } from 'react-toastify';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socketio from 'socket.io-client';

import api from '~/services/api';

import {
  Container,
  Badge,
  NotificationList,
  Scroll,
  Notification,
} from './styles';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const hasUnread = useMemo(
    () => !!notifications.find(notification => notification.read === false),
    [notifications]
  );
  const user = useSelector(state => state.user.profile);
  // socket connections
  const socket = useMemo(
    () =>
      socketio('http://localhost:4000', {
        query: {
          user_id: user.id,
        },
      }),
    [user.id]
  );

  // monitoring events of notifications
  useEffect(() => {
    socket.on('notification', notification => {
      setNotifications([notification, ...notifications]);
    });
  }, [socket, notifications]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await api.get('/notifications');

        const { data } = response;
        const notification = data.map(item => ({
          ...item,
          timeDistance: formatDistance(parseISO(item.createdAt), new Date(), {
            addSuffix: true,
            locale: pt,
          }),
        }));
        if (data) {
          setNotifications(notification);
        }
      } catch (error) {
        toast.success('Sem nenhuma notificação.');
      }
    }
    loadNotifications();
  }, []);

  function handleToggleVisible() {
    setVisible(!visible);
  }

  async function handleMarkAsRead(id) {
    await api.put(`/notifications/${id}`);

    setNotifications(
      notifications.map(notification =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  }

  return (
    <Container>
      <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>
      <NotificationList visible={visible}>
        <Scroll>
          {notifications &&
            notifications.map(notification => (
              <Notification
                key={String(notification._id)}
                unread={!notification.read}
              >
                <p>{notification.content}</p>
                <time>{notification.timeDistance}</time>
                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    Marcar como lida
                  </button>
                )}
              </Notification>
            ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
