import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { Image } from './entity/Image';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, './service/images/');
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

createConnection().then((connection) => {
    const repository = connection.getRepository(Image);
    const app = express();

    app.use(cors({ origin: `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}` }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    // app.use((error: { field: string; }) => {
    //     console.log('This is the rejected field ->', error.field);
    // });

    app.post(
        '/images',
        upload.single('IMAGE'),
        async (req: Request, res: Response) => {
            const file = req['file'];
            const image = new Image();
            image.generatedId = uuidv4();
            image.name = file.originalname;
            image.mimeType = file.mimetype;

            const data = await fs.promises.readFile(file.path);

            image.data = Buffer.from(data);
            const images = repository.create(image);
            const results = await repository.save(images);

            // res.setHeader('X-Location', `${host}:${port}/images/${results.generatedId}`)

            res.status(201).json(results);
        }
    );

    app.get('/images', async (req: Request, res: Response) => {
        const images = await repository.find();
        res.setHeader('Content-Type', 'application/json');
        res.json(images);
    });

    app.listen(process.env.SERVICE_PORT, () => {
        // console.log(`⚡️[server]: Server is running at ${host}:${port}`);
    });
});
