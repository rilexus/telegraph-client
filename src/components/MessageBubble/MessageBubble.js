import React from "react";

const MessageBubble = ({ value, date, own }) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          fontSize: ".8rem",
          color: "#868585",
        }}
      >
        {date}
      </div>
      <div>
        <div
          style={{
            padding: ".5rem",
            backgroundColor: own ? "blue" : "gray",
            fontSize: "1rem",
            textAlign: own ? "right" : "left",
            color: own ? "white" : "black",
            borderRadius: "1rem",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
