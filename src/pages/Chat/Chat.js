import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useId, useMessage, useSend } from "../../WebSocket";
import { useSearchParams } from "react-router-dom";
import { useInput } from "telegraph-hooks";
import { v4 as generateId } from "uuid";
import { useChannels } from "../../ChannelProvider";
import { Input } from "./components";
import { Center, Flex } from "@nightfall-ui/layout";
import { TransitionGroup } from "react-transition-group";
import { MessageBubble } from "./components/MessageBubble";
import { Transition } from "react-transitions-library";

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

const MessageTranslateTransition = forwardRef(
  function MessageTranslateTransition({ x, y, ...props }, ref) {
    const timeout = 400;

    const defaultStyle = useMemo(
      () => ({
        // define the transition as in CSS
        display: "inline-block",
        transition: `transform ${timeout}ms ease 0ms`,
      }),
      [timeout, x, y]
    );

    const transitionStyle = useMemo(
      () => ({
        entering: {
          transform: `translate(0px, 0)`,
        },
        entered: {
          transform: `translate(0, 0)`,
        },
        exiting: {
          transform: `translate(${x}, ${y})`,
        },
        exited: {
          transform: `translate(${x}, ${y})`,
        },
      }),
      []
    );

    return (
      <Transition
        {...props}
        ref={ref}
        as={"span"}
        timeout={timeout}
        defaultStyle={defaultStyle}
        transitionStyle={transitionStyle}
      >
        {props.children}
      </Transition>
    );
  }
);

const MessageAppearTransition = (props) => {
  const timeout = 700;
  const defaultStyle = useMemo(
    () => ({
      // define the transition as in CSS
      transition: `opacity ${timeout}ms ease 0ms`,
    }),
    [timeout]
  );

  const transitionStyle = useMemo(
    () => ({
      entering: {
        // add any CSSProperties
        opacity: 1,
      },
      entered: {
        opacity: 1,
      },
      exiting: {
        opacity: 0,
      },
      exited: {
        opacity: 0,
      },
    }),
    []
  );

  return (
    <Transition
      {...props}
      as={"span"}
      timeout={timeout}
      defaultStyle={defaultStyle}
      transitionStyle={transitionStyle}
    >
      {props.children}
    </Transition>
  );
};
const MessageEnterTransition = ({ x, y, ...props }) => {
  return (
    <MessageTranslateTransition {...props} x={`${x}px`} y={`${y}px`}>
      <MessageAppearTransition {...props}>
        {props.children}
      </MessageAppearTransition>
    </MessageTranslateTransition>
  );
};

const Chat = () => {
  const [params] = useSearchParams();
  const send = useSend();
  const messageInput = useInput({ name: "message-input", initialValue: "" });
  const ownId = useId();
  const id = ownId;

  const [inputRect, setInputRect] = useState({});

  const [messages, sendMessage] = useChat();

  const getChatId = () => {
    return params.get("chatid");
  };

  useEffect(() => {
    const input = messageInput.ref.current;
    const rect = input.getBoundingClientRect();
    setInputRect(rect);
  }, [messageInput.ref, messages]);

  useEffect(() => {
    const chatid = getChatId();
    if (chatid) {
      send({ type: "join-room", id: chatid });
    }
  }, []);

  return (
    <Center
      small={95}
      tablet={90}
      laptop={50}
      desktop={40}
      style={{
        height: "100vh",
      }}
    >
      <div>CHAT</div>

      <Flex
        direction={"column"}
        justify={"between"}
        align={"start"}
        style={{
          width: "100%",
          height: "95vh",
        }}
      >
        <div
          style={{
            overflowY: "scroll",
            width: "100%",
            height: "100%",
          }}
        >
          {messages.map((m) => {
            return (
              <div
                key={m.id}
                style={{
                  textAlign: "right",
                }}
              >
                <TransitionGroup>
                  <MessageEnterTransition x={-inputRect?.x} y={inputRect?.y}>
                    <MessageBubble
                      value={m.value}
                      date={m.date}
                      own={id === m.sender}
                    />
                  </MessageEnterTransition>
                </TransitionGroup>
              </div>
            );
          })}
        </div>

        <div
          style={{
            width: "100%",
          }}
        >
          <Input
            type="text"
            {...messageInput}
            placeholder={"Message"}
            onKeyDown={(e) => {
              const { keyCode } = e;
              if (keyCode === 13 /* enter */ && !!messageInput.value) {
                sendMessage({
                  type: "message-text",
                  value: messageInput.value,
                  date: new Date().toISOString(),
                  id: generateId(),
                  sender: ownId,
                });

                messageInput.onChange({ target: { value: "" } });
              }
            }}
          />
        </div>
      </Flex>
    </Center>
  );
};

export default Chat;
