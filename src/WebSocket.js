import React, {
  useContext,
  createContext,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";
import { SOCKET } from "./env";

const SocketContext = createContext({});

const useSocket = () => useContext(SocketContext);

const useSend = () => {
  const socket = useSocket();

  return useCallback(
    (action) => {
      socket.send(JSON.stringify(action));
    },
    [socket]
  );
};

const useConnectionState = () => {
  const socket = useSocket();
  const [state, setState] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (state !== socket.connected) {
        setState(socket.connected);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [state, socket]);

  return state;
};

const useId = () => {
  const socket = useSocket();
  return socket.id;
};

const useMessage = (type, handler) => {
  const socket = useSocket();
  const callbackRef = useRef(handler);
  callbackRef.current = handler;

  useEffect(() => {
    const handle = (message) => {
      try {
        const action = JSON.parse(message);
        if (action.type === type) {
          callbackRef.current(action);
        }
      } catch (e) {
        console.error(e);
      }
    };

    socket.addEventListener("message", handle);
    return () => {
      socket.removeEventListener("message", handle);
    };
  }, [socket, callbackRef, type]);
};

const socket = io(SOCKET);
const WebSocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export {
  WebSocketProvider,
  useSocket,
  useSend,
  useMessage,
  useConnectionState,
  useId,
  socket,
};
