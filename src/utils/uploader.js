import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear las carpetas si no existen
const createFolders = (folders) => {
    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/others'; 

        if (file.mimetype.startsWith('image')) {
            folder = 'uploads/pets';
        } else if (file.mimetype === 'application/pdf' || file.mimetype.includes('document')) {
            folder = 'uploads/documents';
        }

        createFolders([folder]);
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({ storage });

export default uploader;
