import io from "socket.io-client";
import config from "../../config";

const ioConnection = config.ioConnection;

const emitMessageToSocket = (message, uuid) => {
    const socket = io(ioConnection, {
        query: {
            user: uuid,
        },
    });

    socket.emit("updates", message);
};

export default emitMessageToSocket;
