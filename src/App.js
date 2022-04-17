import React from "react";
import { useEffect, useState } from "react";
import { useConnectionState } from "./WebSocket";
import { Chat, Home } from "telegraph-pages";

import { Routes, Route, Navigate } from "react-router-dom";

const openMediaDevices = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

const DEVICE_INPUT_TYPES = {
  VIDEO: "videoinput",
  AUDIO: "audioinput",
};
async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === type);
}

async function getVideoDevices() {
  return getConnectedDevices(DEVICE_INPUT_TYPES.VIDEO);
}

async function getAudioDevices() {
  return getConnectedDevices(DEVICE_INPUT_TYPES.AUDIO);
}

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

const useDevices = (type) => {
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    getConnectedDevices(type)
      .then((devices) => {
        setInputs(devices);
      })
      .catch((e) => {
        console.error(e);
      });

    const handleNewDevices = () => {
      const newCameraList = getConnectedDevices(type);
      setInputs(newCameraList);
    };

    // Listen for changes to media devices and update the list accordingly
    navigator.mediaDevices.addEventListener("devicechange", handleNewDevices);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleNewDevices
      );
    };
  }, []);
  return inputs;
};

const useVideoDevices = () => {
  return useDevices(DEVICE_INPUT_TYPES.VIDEO);
};

const useAudioDevices = () => {
  return useDevices(DEVICE_INPUT_TYPES.AUDIO);
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
      {isConnected && (
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/chat"} element={<Chat />} />
          <Route path={'*'} element={<Navigate to={'/'} />}/>
        </Routes>
      )}
    </div>
  );
}

export default App;
