import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const useChannels = (handler) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const channels = useContext(Context);

  useEffect(() => {
    const listen = (action) => {
      handlerRef.current(action);
    };
    channels.subscribe(listen);
    return () => {
      channels.unsubscribe(listen);
    };
  }, []);

  return channels;
};

const Context = createContext();

const ChannelProvider = ({ children, channels }) => {
  return <Context.Provider value={channels}>{children}</Context.Provider>;
};

export { ChannelProvider, useChannels };
