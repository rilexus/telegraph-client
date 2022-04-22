import React from "react";

const MessageBubble = ({ value, own }) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          padding: ".4rem 1rem",
          paddingBottom: "0.5rem",
          backgroundColor: own ? "#3eaaf5" : "#e5e5ea",
          fontSize: "1.5rem",
          textAlign: own ? "right" : "left",
          color: own ? "white" : "black",
          borderRadius: "1.25rem",
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default MessageBubble;
