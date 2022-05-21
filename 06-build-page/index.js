const fs = require("fs");
const path = require("path");
const stylesDir = path.resolve(__dirname, "styles");
const assetsDir = path.resolve(__dirname, "assets");
const componentsDir = path.resolve(__dirname, "components");
const projectDir = path.resolve(__dirname, "project-dist");
const projectAssetsDir = path.resolve(projectDir, "assets");

function buildProject() {
  // 1. create project-dist
  fs.readdir(projectDir, (err) => {
    if (err) createFolder(projectDir);
    // 2. index.html from template.html
    createIndexHtml();
    // 3. create bundle.css + 4. copy assets to project-dist/assets
    // createBundle();
  });
}

function createFolder(folder) {
  fs.mkdir(folder, (err) => {
    if (err) throw err;
  });
}

function createIndexHtml() {
  fs.writeFile(path.resolve(projectDir, "index.html"), "", (err) => {
    if (err) throw err;
  });
  fs.readFile(path.resolve(__dirname, "template.html"), (err, data) => {
    data = data.toString();
    let newHtml = "";
    for (let i = 0; i < data.length; i++) {
      let templateName = "";
      if (data[i] == "{") {
        i += 2;
        for (let j = 0; j < 10; j++) {
          if (data[i + j] == "}") {
            let promise = new Promise(function (resolve, reject) {
              newHtml += pasteTemplate(templateName);
              setTimeout(() => resolve("done"), 1000)
            })
            i += j + 1;
            break;
          }
          templateName += data[i + j];
        }
      } else newHtml += data[i];
    }
    console.log(newHtml)
  });
}

function pasteTemplate(templateName) {
  fs.readdir(componentsDir, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.includes(templateName)) {
        fs.readFile(path.resolve(componentsDir, file), (err, data) => {
          if (err) throw err;
          return data.toString();
        });
      }
    });
  });
}

// 3.
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
    copyAssets();
  });
}

// 4.
function copyAssets() {
  fs.readdir(projectAssetsDir, (err) => {
    if (err) createFolder(projectAssetsDir);
    fs.readdir(assetsDir, (err, folders) => {
      if (err) throw err;
      // copy folders
      folders.forEach((folder) => {
        let oldFolder = path.resolve(assetsDir, folder);
        let newFolder = path.resolve(projectAssetsDir, folder);
        fs.readdir(newFolder, (err) => {
          if (err) createFolder(newFolder);
          fs.readdir(oldFolder, (err, files) => {
            if (err) throw err;
            // copy files
            files.forEach((file) => {
              fs.createReadStream(path.resolve(oldFolder, file)).pipe(
                fs.createWriteStream(path.resolve(newFolder, file))
              );
            });
          });
        });
      });
    });
  });
}

buildProject();
