import React, { useEffect } from "react";
import { useInput } from "telegraph-hooks";
import { useNavigate } from "react-router-dom";
import { useMessage, useSend, useSocket } from "../../WebSocket";

const Home = () => {
  const offerInput = useInput({ name: "offerInput", initialValue: "" });

  const navigate = useNavigate();
  const send = useSend();
  const socket = useSocket();
  const ownId = socket.id;

  useMessage("new-room", (message) => {
    const {
      room: { id: roomId },
    } = message;

    navigate(`/chat?chatid=${roomId}`);
  });

  const handleCreateChat = () => {
    send({ type: "create-room" });
  };

  return (
    <div>
      <h1>Telegraph Chat</h1>
      <div>
        <div
          style={{
            marginBottom: "3rem",
          }}
        >
          <input type="text" {...offerInput} placeholder={"Chat ID"} />
          <button
            disabled={!offerInput.value}
            onClick={() => {
              console.log("NOT IMPLEMENTED!");
            }}
          >
            JOIN CHAT
          </button>
        </div>
        <div>or</div>
        <div>
          <button
            disabled={!!offerInput.value}
            style={{
              marginRight: "1rem",
            }}
            onClick={handleCreateChat}
          >
            CREATE CHAT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
