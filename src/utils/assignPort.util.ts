import net from "net";

function findAvailablePort(startPort = 1024, maxPort = 65535) {
  return new Promise((resolve, reject) => {
    function testPort(port: any) {
      if (port > maxPort) {
        return reject(
          new Error(
            `No available ports found between ${startPort} and ${maxPort}`
          )
        );
      }

      const server = net.createServer();
      server.listen(port, () => {
        server.once("close", () => resolve(port));
        server.close();
      });
      server.on("error", () => testPort(port + 1));
    }

    testPort(startPort);
  });
}

// Usage example

export async function assignPort() {
  const port = await findAvailablePort();
  return port;
}
