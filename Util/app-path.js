const path = require('path');
const app_path = path.dirname(process.mainModule.filename);
const library = path.join(app_path, 'Library');
const player = path.join(app_path, 'Player_2.0');
exports.library = library;
exports.player = player;
