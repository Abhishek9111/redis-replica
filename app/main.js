const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
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
    }
  });
});

server.listen(6379, "127.0.0.1");
