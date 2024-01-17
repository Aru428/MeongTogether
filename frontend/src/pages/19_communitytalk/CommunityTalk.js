import React, { useState, useEffect } from "react";
// import socketIOClient from "socket.io-client";

// const ENDPOINT = "http://localhost:3000";

import "./CommunityTalk.scss";

export default function CommunityTalk() {
  // const [response, setResponse] = useState("");
  // const [message, setMessage] = useState("");
  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   const socket = socketIOClient(ENDPOINT);
  //   setSocket(socket);

  //   socket.on("chat message", (msg) => {
  //     setResponse(msg);
  //   });

  //   return () => socket.disconnect();
  // }, []);

  // const sendMessage = () => {
  //   socket.emit("chat message", message);
  // };g

  return (
    <>
      {/* <div>
        <p>Message: {response}</p>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div> */}
    </>
  );
}
