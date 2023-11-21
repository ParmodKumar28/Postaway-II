// File uploading middleware using the multer library.

// 1. Import multer and fs.
import multer from "multer";
import fs from 'fs';
import path from "path";

// 2. Set the directory for the uploads to be stored.
const dir = 'C:/Users/MSI 1/Desktop/Projects Container/Backend Projects/Postaway-II/uploads';

// 3. Create the uploads directory if it doesn't exist.
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// 4. Configure storage with filename and location.
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, dir);
    },
    filename : (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname));
    },
});

// 5. Using multer to upload the file and pass the storage
export const upload = multer({
    storage : storage,
    limits: {fileSize: 5 * 1024 * 1024}
});