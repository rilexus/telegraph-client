import {useEffect, useState} from "react";

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

export default (type) => {
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