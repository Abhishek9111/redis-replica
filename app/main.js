const net = require("net");

const STORAGE = {};
const config = new Map();
const arguments = process.argv.slice(2);

const fs = require("fs");
const { join } = require("./path");
const { getKeysValues } = require("./parseRDB");
let rdb;
function formatConfigMessage(key = "", value = "") {
  return `*2\r\n$${key.length}\r\n${key}\r\n$${value.length}\r\n${value}\r\n`;
}

if (config.get("dir") && config.get("dbfilename")) {
  const dbPath = join(config.get("dir"), config.get("dbfilename"));
  const isDbExists = fs.existsSync(dbPath);
  if (isDbExists) {
    rdb = fs.readFileSync(dbPath);
    if (!rdb) {
      throw `Error reading DB at provided path: ${dbPath}`;
    }
  } else {
    console.log(`DB doesn't exists at provided path: ${dbPath}`);
  }
}

const [fileDir, fileName] = [arguments[1] ?? null, arguments[3] ?? null];
if (fileDir && fileName) {
  config.set("dir", fileDir);
  config.set("dbfilename", fileName);
}
const server = net.createServer((connection) => {
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
    } else if (parsedData[2] == "config") {
      return connection.write(formatConfigMessage(value, config.get(value)));
    } else if (parsedData[2] == "KEYS") {
      const redis_key = getKeysValues(rdb);
      return connection.write(serializeRESP([redis_key]));
    }
  });
});

server.listen(6379, "127.0.0.1");
