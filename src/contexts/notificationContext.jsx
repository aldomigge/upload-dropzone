import { createContext, useContext, useReducer } from 'react';

import Notification from '../components/Notification';

const Context = createContext();

export const useNotificationContext = () => useContext(Context);

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SHOW_NOTIFICATION':
          return {
            ...prevState,
            open: true,
            variation: action.variation,
            message: action.message,
            duration: action.duration,
          };
        case 'HIDE_NOTIFICATION':
          return {
            ...prevState,
            open: false,
            variation: '',
            message: '',
            duration: null,
          };
        default:
          return {
            open: false,
            variation: '',
            message: '',
            duration: null,
          };
      }
    },
    {
      open: false,
      variation: '',
      message: '',
      duration: null,
    },
  );

  const notificationContext = {
    show: (variation, message, duration) => {
      dispatch({ type: 'SHOW_NOTIFICATION', variation, message, duration });
    },
    close: () => {
      dispatch({ type: 'HIDE_NOTIFICATION' });
    },
  };

  return (
    <Context.Provider value={notificationContext}>
      {children}
      <Notification {...state} />
    </Context.Provider>
  );
}

export function NotificationContext({ children }) {
  return <Context.Consumer>{children}</Context.Consumer>;
}
