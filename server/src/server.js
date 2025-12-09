const http = require("http");
const app = require("./app");
const server = http.createServer(app);


server.addListener("listening", () => {
  const server_address = server.address()

  if (server_address.address=='::') {
    server_address.address = 'localhost'
  }
  console.log(`Server listening. Click http://${server_address.address}:${server_address.port}`);
});

server.addListener("error", (err) => {
  console.log("Faild to start server.");
  console.log(err.message);
  if (DB_CONNECTION) {
    DB_CONNECTION.connection.close(true);
  }
});

module.exports = server;
