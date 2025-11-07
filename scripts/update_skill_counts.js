const fs = require("fs");
const path = require("path");

const skillExtensions = {
  HTML: [".html"],
  CSS: [".css"],
  SASS: [".scss"],
  JavaScript: [".js"],
  PHP: [".php"],
  MySQL: [".sql"],
  React: [".jsx", ".tsx"],
};

const ignoreDirNames = new Set(["node_modules", ".git"]);
const searchRoots = ["public"];

function walkDir(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoreDirNames.has(entry.name)) {
        walkDir(fullPath, cb);
      }
    } else if (entry.isFile()) {
      cb(fullPath);
    }
  });
}

function countLines(filePath) {
  return fs.readFileSync(filePath, "utf8").split(/\r?\n/).length;
}

const counts = {};
Object.keys(skillExtensions).forEach((k) => (counts[k] = 0));

searchRoots
  .filter((root) => fs.existsSync(root))
  .forEach((root) => {
    walkDir(root, (file) => {
      const ext = path.extname(file);
      for (const [skill, extensions] of Object.entries(skillExtensions)) {
        if (extensions.includes(ext)) {
          counts[skill] += countLines(file);
          break;
        }
      }
    });
  });

fs.writeFileSync("src/data/skills.json", JSON.stringify(counts, null, 2) + "\n");
console.log("Updated skills.json", counts);
