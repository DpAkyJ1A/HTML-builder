const fs = require("fs");
const path = require("path");
const stylesDir = path.resolve(__dirname, "styles");
const projectDir = path.resolve(__dirname, "project-dist");

function createBundle() {
  fs.writeFile(path.resolve(projectDir, "bundle.css"), "", (err) => {
    if (err) throw err;
  });
  fs.readdir(stylesDir, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (path.extname(file) == ".css") {
        fs.readFile(path.resolve(stylesDir, file), (err, data) => {
          if (err) throw err;
          fs.appendFile(path.resolve(projectDir, "bundle.css"), data, (err) => {
            if (err) throw err;
          });
        });
      }
    });
  });
}

createBundle();
