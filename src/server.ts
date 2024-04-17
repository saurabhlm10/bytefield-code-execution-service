import app from "./app";
import { ENV } from "./constants";
import { createServer } from "http";
import { Server } from "socket.io";

const port = ENV.port;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: ENV.clientUrl,
  },
});

async function startServer() {
  try {
    httpServer.listen(port, () =>
      console.log("Server listening on PORT", port)
    );
  } catch (err) {
    console.error(err);
  }
}

startServer();

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);
});
