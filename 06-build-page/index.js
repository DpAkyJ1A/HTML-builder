const fs = require("fs");
const path = require("path");
const stylesDir = path.resolve(__dirname, "styles");
const assetsDir = path.resolve(__dirname, "assets");
const componentsDir = path.resolve(__dirname, "components");
const projectDir = path.resolve(__dirname, "project-dist");
const projectAssetsDir = path.resolve(projectDir, "assets");

function buildProject() {
  fs.readdir(projectDir, (err) => {
    if (err) createFolder(projectDir);
    createIndexHtml();
  });
}

// 1. create project-dist
function createFolder(folder) {
  fs.mkdir(folder, (err) => {
    if (err) throw err;
  });
}

// 2. index.html from template.html
async function createIndexHtml() {
  let templateHtml = await fs.promises.readFile(
    path.resolve(__dirname, "template.html"),
    "utf-8"
  );
  let templatesNames = await fs.promises.readdir(componentsDir, {
    withFileTypes: true,
  });
  // it finally works!
  for (let template of templatesNames) {
    let templateData = await fs.promises.readFile(
      path.resolve(componentsDir, template.name),
      "utf-8"
    );
    const regExp = new RegExp(`{{${template.name.split(".")[0]}}}`, "g");
    templateHtml = templateHtml.replace(
      regExp,
      templateData
    );
  }

  fs.writeFile(path.resolve(projectDir, 'index.html'), templateHtml, (err) => {
    if (err) throw err
    createBundle();
  });
}

// 3. create bundle.css
function createBundle() {
  fs.writeFile(path.resolve(projectDir, "style.css"), "", (err) => {
    if (err) throw err;
  });
  fs.readdir(stylesDir, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (path.extname(file) == ".css") {
        fs.readFile(path.resolve(stylesDir, file), (err, data) => {
          if (err) throw err;
          fs.appendFile(path.resolve(projectDir, "style.css"), data, (err) => {
            if (err) throw err;
          });
        });
      }
    });
    copyAssets();
  });
}

// 4. copy assets to project-dist/assets
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
