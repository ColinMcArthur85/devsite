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

const ignoreDirs = ["node_modules", ".git", "public/assets", "public/data", "public/components", "scripts"];

function walkDir(dir, cb) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const base = path.basename(fullPath);
    if (stat.isDirectory()) {
      if (!ignoreDirs.some((d) => fullPath.includes(d))) {
        walkDir(fullPath, cb);
      }
    } else {
      cb(fullPath);
    }
  });
}

function countLines(filePath) {
  return fs.readFileSync(filePath, "utf8").split(/\r?\n/).length;
}

const counts = {};
Object.keys(skillExtensions).forEach((k) => (counts[k] = 0));

walkDir(".", (file) => {
  const ext = path.extname(file);
  for (const [skill, extensions] of Object.entries(skillExtensions)) {
    if (extensions.includes(ext)) {
      counts[skill] += countLines(file);
      break;
    }
  }
});

fs.writeFileSync("src/data/skills.json", JSON.stringify(counts, null, 2) + "\n");
console.log("Updated skills.json", counts);
