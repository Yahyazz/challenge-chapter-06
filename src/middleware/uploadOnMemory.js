import multer from 'multer';
// const path = require("path");

const storage = multer.memoryStorage();

export default multer({ storage });
