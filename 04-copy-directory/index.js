const fs = require("fs");
const path = require("path");
const dir = path.resolve(__dirname, "files");
const dirCopy = path.resolve(__dirname, "files-copy");

function createFolder() {
  fs.mkdir(dirCopy, (err) => {
    if (err) throw err;
  });
}

async function copyDir() {
  await fs.promises.rm(dirCopy, { recursive: true, force: true });
  createFolder();
    fs.readdir(dir, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        fs.createReadStream(path.resolve(dir, file)).pipe(
          fs.createWriteStream(path.resolve(dirCopy, file))
        );
      });
    });

}

copyDir();
