const path = require('path');
const app_path = path.dirname(process.mainModule.filename);
const library = path.join(app_path, 'Library');
const pages = path.join(app_path, 'Pages');
exports.library = library;
exports.pages = pages;
