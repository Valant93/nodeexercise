const fs = require("fs");

const fileName = "example.txt";
const data = "Hello, World! This file was created using fs.writeFile()";

fs.writeFile(fileName, data, "utf8", (err) => {
  if (err) {
    console.error("An error occurred while writing the file:", err);
    return;
  }

  console.log(`File '${fileName}' was written successfully!`);
});
