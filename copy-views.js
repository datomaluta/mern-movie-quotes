const fs = require("fs-extra");
const path = require("path");

// Define source and destination directories
const srcDir = path.join(__dirname, "api", "views");
const destDir = path.join(__dirname, "dist", "views");

// Copy the 'views' directory to 'dist/views'
fs.copy(srcDir, destDir, { overwrite: true }, (err) => {
  if (err) {
    console.error("Error copying views directory:", err);
    process.exit(1); // Exit with error code
  } else {
    console.log("Views directory copied successfully!");
  }
});
