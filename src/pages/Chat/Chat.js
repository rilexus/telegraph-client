import React, { useEffect, useRef, useState } from "react";
import { useId, useMessage, useSend, useSocket } from "../../WebSocket";
import { useSearchParams } from "react-router-dom";
import { useInput } from "telegraph-hooks";
import { v4 as generateId } from "uuid";
import { useChannels } from "../../ChannelProvider";

const useChat = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((m) => [...m, message]);
  };

  const { send, create } = useChannels((action) => {
    const { type, data } = action;
    if (type === "message") {
      addMessage(data);
    }
  });

  const sendMessage = (message) => {
    addMessage(message);
    send(message);
  };

  useMessage("room-member-entered", ({ member }) => {
    const { id } = member;
    create(id);
  });

  return [messages, sendMessage];
};

const Chat = () => {
  const [params] = useSearchParams();
  const send = useSend();
  const messageInput = useInput({ name: "message-input", initialValue: "" });
  const ownId = useId();

  const [messages, sendMessage] = useChat();

  const getChatId = () => {
    return params.get("chatid");
  };

  useEffect(() => {
    const chatid = getChatId();
    if (chatid) {
      send({ type: "join-room", id: chatid });
    }
  }, []);

  return (
    <div>
      <div>CHAT</div>
      <div>
        {messages.map((m) => {
          return <div key={m.id}>{m.value}</div>;
        })}
      </div>
      <div>
        <input
          type="text"
          {...messageInput}
          placeholder={"Message"}
          onKeyDown={(e) => {
            const { keyCode } = e;
            if (keyCode === 13 /* enter */) {
              sendMessage({
                type: "message-text",
                value: messageInput.value,
                date: new Date().toISOString(),
                id: generateId(),
              });

              messageInput.onChange({ target: { value: "" } });
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
