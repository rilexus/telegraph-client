class Subscription {
  listeners = [];
  emit = (action) => {
    this.listeners.forEach((l) => {
      l(action);
    });
  };
  subscribe = (listener) => {
    this.listeners.push(listener);
  };

  unsubscribe = (listener) => {
    this.listeners = this.listeners.filter((l) => l !== listener);
  };
}

class Channels extends Subscription {
  channels = new Map();
  connections = new Map();
  socket;

  configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  constructor(socket) {
    super();
    this.socket = socket;

    socket.addEventListener("message", async (m) => {
      try {
        const { type, offer, answer, from, to, iceCandidate } = JSON.parse(m);
        switch (type) {
          case "icecandidate": {
            if (to === socket.id) {
              try {
                await this.getConnection(from).addIceCandidate(iceCandidate);
              } catch (e) {
                console.error("Error adding received ice candidate", e);
              }
            }
            return;
          }
          case "offer": {
            const config = this.configuration;
            const connection = new RTCPeerConnection(config);
            this.addConnection(from, connection);

            connection.addEventListener("connectionstatechange", (e) => {
              // TODO: remove connection, if disconnected
            });

            connection.addEventListener("datachannel", ({ channel }) => {
              this.addChannel(from, channel);

              channel.addEventListener("message", (message) => {
                try {
                  const data = JSON.parse(message.data);
                  this.emit({ ...message, type: "message", data: data });
                } catch (e) {
                  console.error();
                }
              });

              channel.addEventListener("open", (e) => {
                this.emit(e);
              });

              channel.addEventListener("close", (e) => {
                this.emit(e);
                this.removeChannel(from);
              });
            });

            await connection.setRemoteDescription(
              new RTCSessionDescription(offer)
            );
            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);
            this.socketSend({
              type: "answer",
              answer: answer,
              from: to,
              to: from,
            });
            return;
          }
          case "answer": {
            if (to === socket.id) {
              const connection = this.getConnection(from);
              const remoteDesc = new RTCSessionDescription(answer);
              await connection.setRemoteDescription(remoteDesc);
            }
            return;
          }

          default: {
            return;
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  addChannel = (id, channel) => {
    this.channels.set(id, channel);
  };

  getChannel = (id) => {
    return this.channels.get(id);
  };

  removeChannel = (id) => {
    this.channels.delete(id);
  };

  getConnection = (id) => {
    return this.connections.get(id);
  };

  addConnection = (id, connection) => {
    this.connections.set(id, connection);
  };

  removeConnection = (id) => {
    this.connections.delete(id);
  };

  socketSend = (action) => {
    try {
      this.socket.send(JSON.stringify(action));
    } catch (e) {
      console.error(e);
    }
  };

  create = async (id) => {
    const config = this.configuration;
    const connection = new RTCPeerConnection(config);
    const channel = connection.createDataChannel("channel");

    this.addChannel(id, channel);
    this.addConnection(id, connection);

    connection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        this.socketSend({
          type: "icecandidate",
          iceCandidate: event.candidate,
          to: id,
          from: this.socket.id,
        });
      }
    });

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);

    channel.addEventListener("message", (message) => {
      try {
        const data = JSON.parse(message.data);
        this.emit({ ...message, type: "message", data: data });
      } catch (e) {
        console.error(e);
      }
    });
    channel.addEventListener("open", (e) => {
      this.emit(e);
    });
    channel.addEventListener("close", (e) => {
      this.emit(e);
      this.removeChannel(id);
    });

    this.socketSend({ type: "offer", offer, from: this.socket.id, to: id });
  };

  sendAll = (action) => {
    try {
      this.channels.forEach((channel) => {
        if (channel.readyState === "open") {
          channel.send(JSON.stringify(action));
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  send = (action, id) => {
    if (id) {
      this.getChannel(id)?.send(JSON.stringify(action));
    } else {
      this.sendAll(action);
    }
  };
}

export default Channels;
