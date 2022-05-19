const fs = require("fs");
const path = require("path");
const dir = path.resolve(__dirname, "files");
const dirCopy = path.resolve(__dirname, "files-copy");

function createFolder() {
  fs.mkdir(dirCopy, (err) => {
    if (err) throw err;
  });
}

function copyDir() {
  fs.readdir(dirCopy, (err) => {
    if (err) createFolder();
    fs.readdir(dir, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        fs.createReadStream(path.resolve(dir, file)).pipe(
          fs.createWriteStream(path.resolve(dirCopy, file))
        );
      });
    });
  });
}

copyDir();
