import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { Image } from './entity/Image';
import Multer from 'multer';
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'test',
    secretKey: 'testtest'
});

minioClient.makeBucket('images', 'us-east-1', function (err) {
    if (err) return console.log(err);

    console.log('Bucket created successfully in "us-east-1".');
});

createConnection().then((connection) => {
    const repository = connection.getRepository(Image);
    const app = express();

    app.use(
        cors({
            origin: `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post(
        '/images',
        Multer({ storage: Multer.memoryStorage() }).single('IMAGE'),
        async (req: Request, res: Response) => {
            const generatedId = uuidv4();

            minioClient.putObject(
                'images',
                generatedId,
                req.file.buffer,
                async (error, etag) => {
                    if (error) {
                        return console.log(error);
                    }
                    const image = new Image();
                    image.name = req.file.originalname;
                    image.generatedId = generatedId;
                    image.mimeType = req.file.mimetype;

                    const images = repository.create(image);
                    const result = await repository.save(images);

                    res.status(201).json({
                        created_at: result.created_at,
                        id: result.generatedId,
                        name: result.name,
                        location: `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/images/${result.generatedId}`
                    });
                }
            );
        }
    );

    app.get('/images', async (req: Request, res: Response) => {
        const images = await repository.find();
        res.setHeader('Content-Type', 'application/json');
        res.header('X-Record-Count', images.length.toString());
        res.json(
            images.map((x) => ({
                created_at: x.created_at,
                id: x.generatedId,
                name: x.name,
                mimeType: x.mimeType,
                location: `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/images/${x.generatedId}`
            }))
        );
    });

    app.get('/images/:id', async (req, res) => {
        minioClient.getObject(
            'images',
            req.params.id,
            function (error, stream) {
                if (error) {
                    return res.status(500).send(error);
                }
                // const contentType = stream.headers['content-type'];

                res.setHeader('Content-Type', 'image/jpeg');
                stream.pipe(res);
            }
        );
    });

    app.listen(process.env.SERVICE_PORT, () => {
        // console.log(`⚡️[server]: Server is running at ${host}:${port}`);
    });
});
