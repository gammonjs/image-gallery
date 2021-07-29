import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { Image } from './entity/Image';
import multer from 'multer';
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'test',
    secretKey: 'testtest'
})


const STORE = require('path').resolve('service/public');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, STORE);
    },
    filename: (_req, file, cb) => {
        file.filename = uuidv4();
        cb(null, file.filename);
    }
});

const upload = multer({ storage: storage });

minioClient.makeBucket('images', 'us-east-1', function(err) {
    if (err) return console.log(err)

    console.log('Bucket created successfully in "us-east-1".')
})

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
    app.use(express.static('public'));

    app.post(
        '/images',
        upload.single('IMAGE'),
        async (req: Request, res: Response) => {
            const file = req['file'];

            var metaData = {
                'Content-Type': `application/octet-stream`,
                'X-Amz-Meta-Testing': 1234,
                'example': 5678
            }
            // Using fPutObject API upload your file to the bucket europetrip.
            minioClient.fPutObject('images', file.filename, `${STORE}/${file.filename}`, metaData, function(err, etag) {
              if (err) return console.log(err)
              console.log('File uploaded successfully.')
            });

            
            const image = new Image();
            image.name = file.originalname;
            image.generatedId = file.filename;
            image.mimeType = file.mimetype

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
        const image = await repository.findOne({
            where: { generatedId: req.params.id }
        });

        res.set({'Content-Type': image.mimeType});
        res.sendFile(`${STORE}/${image.generatedId}`, image.name);
    });

    app.listen(process.env.SERVICE_PORT, () => {
        // console.log(`⚡️[server]: Server is running at ${host}:${port}`);
    });
});
