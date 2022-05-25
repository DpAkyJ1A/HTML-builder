const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

stdout.write("Write something: ");
stdin.on("data", (data) => {
  if (data.toString().trim() == "exit") process.exit();
  fs.access("file.txt", fs.constants.F_OK, (err) => {
    if (err) init();
    fs.appendFile(path.join(__dirname, "file.txt"), data, (err) => {
      if (err) throw err;
    });
    stdout.write("Write something: ");
  });
});

process.on("exit", () => stdout.write("What did u write in me..."));

process.on("SIGINT", () => process.exit());

function init() {
  fs.writeFile("file.txt", "", (error) => {
    if (error) return console.error(error.message);
  });
}
