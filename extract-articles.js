const fs = require("fs");
const h = fs.readFileSync(__dirname + "/index.html", "utf8");
const i = h.indexOf('id="articles"');
console.log(h.substring(i, i + 6000));
