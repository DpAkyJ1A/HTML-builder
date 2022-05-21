const fs = require("fs");
const path = require("path");
const readStream = fs.createReadStream(path.resolve(__dirname, "text.txt"));
let data = "";

readStream.on("error", (err) => {
  if (err) throw err;
});
readStream.on("data", (chunk) => (data += chunk));
readStream.on("end", () => console.log(data));
