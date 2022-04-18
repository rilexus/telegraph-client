import React from "react";
import { MessageBubble } from "../MessageBubble";
import { useId } from "../../../../WebSocket";
import { Flex } from "@nightfall-ui/layout";

const Board = ({ messages }) => {
  const id = useId();
  return (
    <div
      style={{
        padding: "0 .3rem",
      }}
    >
      {messages.map((m) => {
        return (
          <Flex key={m.id} justify={id === m.sender ? "end" : "start"}>
            <MessageBubble
              value={m.value}
              date={m.date}
              own={id === m.sender}
            />
          </Flex>
        );
      })}
    </div>
  );
};

export default Board;
