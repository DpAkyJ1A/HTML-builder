const fs = require("fs");
const path = require("path");
const dir = path.resolve(__dirname, "secret-folder");
const files = fs.readdirSync(dir);

for (const file of files) {
  const stat = fs.lstatSync(path.join(dir, file));
  if (!stat.isDirectory()) {
    let ext = path.extname(file);
    console.log(file.replace(ext, '') + " - " + ext + " - " + stat.size / 1000 + 'kb');
  } 
}
