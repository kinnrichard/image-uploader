const multer = require('multer');
const path = require('path');
const db = require('./database');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const saveImageToDatabase = (userId, filename, originalName, filePath) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO images (user_id, filename, original_name, file_path) VALUES (?, ?, ?, ?)',
            [userId, filename, originalName, filePath],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, filename, originalName, filePath });
                }
            }
        );
    });
};

const getUserImages = (userId) => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM images WHERE user_id = ? ORDER BY uploaded_at DESC',
            [userId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
};

module.exports = {
    upload,
    saveImageToDatabase,
    getUserImages
};