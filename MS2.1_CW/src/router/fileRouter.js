import multer from 'multer';
import { Router } from 'express';
import upload from "../middleware/fileUpload";
import {UNEXPECTED_FILE_TYPE} from "../constants/file";
import { fileController } from "../controllers/fileController";

export const fileRouter = Router();

fileRouter.post('/upload', function(req, res, next) {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            if (err.code === UNEXPECTED_FILE_TYPE.code) {
                return res.status(400).json({ error: {description: err.field}});
            }
        } else {
            return res.status(500).json({ error: {description: err.message}});
        }
    });

    next();
    }, fileController
);