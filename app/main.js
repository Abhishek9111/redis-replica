const net = require("net");

const STORAGE = {};

const server = net.createServer((connection) => {
  // Handle connection
  console.log("connection");
  //   connection.write("+PONG\r\n");
  connection.on("data", (data) => {
    // connection.write("+PONG\r\n");
    //initial data is encoded string -> [72, 101, 108, 108, 111] which we are parsing
    const parsedData = Buffer.from(data).toString().split("\r\n");
    // *2\r\n $5 \r\n ECHO \r\n $3 \r\n hey \r\n

    if (parsedData[2] == "ECHO") {
      let returnString = parsedData[4];
      let returnStringLen = returnString.len;
      return connection.write(
        "$" + returnStringLen + "\r\n" + returnString + "\r\n"
      );
    } else if (parsedData[2] == "SET") {
      STORAGE[parsedData[4]] = parsedData[6];
      connection.write("OK\r\n");
      if (parsedData[10]) {
        setTimeout(() => {
          delete STORAGE[parsedData[4]];
        }, parseData[10]);
      }
    } else if (parsedData[2] == "GET") {
      return connection.write(
        `$${STORAGE[parsedData[4]].length}\r\n${STORAGE[parsedData[4]]}\r\n` ||
          "$-1\r\n"
      );
    }
  });
});

server.listen(6379, "127.0.0.1");
