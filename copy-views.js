// const fs = require("fs-extra");
// const path = require("path");

// // Define source and destination directories
// const srcDir = path.join(__dirname, "api", "views");
// const destDir = path.join(__dirname, "dist", "views");

// // Copy the 'views' directory to 'dist/views'
// fs.copy(srcDir, destDir, { overwrite: true }, (err) => {
//   if (err) {
//     console.error("Error copying views directory:", err);
//     process.exit(1); // Exit with error code
//   } else {
//     console.log("Views directory copied successfully!");
//   }
// });

const fs = require("fs-extra");
const path = require("path");

// Define source and destination directories for the 'views' folder
const viewsSrcDir = path.join(__dirname, "api", "views");
const viewsDestDir = path.join(__dirname, "dist", "views");

// Define source and destination directories for the 'locales' folder
const localesSrcDir = path.join(__dirname, "api", "locales");
const localesDestDir = path.join(__dirname, "dist", "locales");

// Function to copy directories
function copyDirectory(srcDir, destDir, dirName) {
  fs.copy(srcDir, destDir, { overwrite: true }, (err) => {
    if (err) {
      console.error(`Error copying ${dirName} directory:`, err);
      process.exit(1); // Exit with error code
    } else {
      console.log(`${dirName} directory copied successfully!`);
    }
  });
}

// Copy the 'views' directory
copyDirectory(viewsSrcDir, viewsDestDir, "views");

// Copy the 'locales' directory
copyDirectory(localesSrcDir, localesDestDir, "locales");
