import React from "react";
import { useEffect } from "react";
import { useConnectionState } from "./WebSocket";
import { Chat, Home } from "telegraph-pages";
import { useAudioDevices, useVideoDevices } from "telegraph-hooks";
import { ThemeProvider } from "@nightfall-ui/theme";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@nightfall-ui/icons";
import { Footnote } from "@nightfall-ui/typography";

const openMediaDevices = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

// Open camera with at least minWidth and minHeight capabilities
async function openCamera(cameraId, minWidth = 640, minHeight = 480) {
  const constraints = {
    // audio: { echoCancellation: true },
    video: {
      deviceId: cameraId,
      width: { min: minWidth },
      height: { min: minHeight },
    },
  };

  return await openMediaDevices(constraints);
}

const requestPermission = async () => {
  try {
    const stream = await openMediaDevices({ video: true, audio: true });
    return true;
  } catch (e) {
    return false;
  }
};

function VideoDeviceSelect({ onSelect, value }) {
  const inputs = useVideoDevices();

  useEffect(() => {
    if (!value && inputs.length) {
      const id = inputs?.[0]?.deviceId;
      onSelect({ target: { value: id } });
    }
  }, [inputs]);

  return (
    <div>
      <label htmlFor="videoinputs">Video Input</label>
      <br />
      <select
        name="videoinputs"
        onChange={onSelect}
        id={"videoinputs"}
        value={value || inputs?.[0]?.deviceId}
      >
        <option value={-1}>none</option>
        {inputs.map((input) => {
          return (
            <option key={input?.deviceId} value={input?.deviceId}>
              {input?.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function AudioDeviceSelect({ onSelect, value }) {
  const inputs = useAudioDevices();

  useEffect(() => {
    if (!value && inputs.length) {
      const id = inputs?.[0]?.deviceId;
      onSelect({ target: { value: id } });
    }
  }, [inputs]);

  return (
    <div>
      <label htmlFor="audioinputs">Video Input</label>
      <br />
      <select
        name="audioinputs"
        onChange={onSelect}
        id={"audioinputs"}
        value={value || inputs?.[0]?.deviceId}
      >
        {inputs.map((input) => {
          return (
            <option key={input?.deviceId} value={input?.deviceId}>
              {input?.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function App() {
  const isConnected = useConnectionState();

  return (
    <div className="App">
      <ThemeProvider>
        {!isConnected && (
          <div>
            <div>
              <Spinner />
            </div>
            <div>
              <Footnote type={"primary"} weight={"regular"}>
                Connecting
              </Footnote>
            </div>
          </div>
        )}
        {isConnected && (
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/chat"} element={<Chat />} />
            <Route path={"*"} element={<Navigate to={"/"} />} />
          </Routes>
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
