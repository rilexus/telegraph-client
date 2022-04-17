import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { socket, WebSocketProvider } from "./WebSocket";
import { ChannelProvider } from "./ChannelProvider";
import Channels from "./Channels";

const channels = new Channels(socket);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WebSocketProvider>
      <ChannelProvider channels={channels}>
        <App />
      </ChannelProvider>
    </WebSocketProvider>
  </BrowserRouter>
);
