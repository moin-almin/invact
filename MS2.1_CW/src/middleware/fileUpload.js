import multer from 'multer';
import { path } from 'path';
import { fileTypeValidator } from '../utils/fileTypeValidator';
import { UNEXPECTED_FILE_TYPE } from '../constants/file';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isFileTypeAllowed = fileTypeValidator(file);
        if (isFileTypeAllowed) {
            return cb(null, true);
        } else {
            cb(new multer.MulterError(UNEXPECTED_FILE_TYPE.code, UNEXPECTED_FILE_TYPE.message));
        }
    },
}).array('file', 1);

export default upload;
