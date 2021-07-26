# image-gallery

Things I would like to do but ran out of time during this weekend timebox activity

-   E2E client testing with Plawright
-   Unit client testing with React-Testing-Library
-   Docker compose minio for image store
-   Store href to files in Postgres
-   Pagination (client and server) with offset, limit and name query params
-   i18n translations which are just a little trikier in server side rendoring with things like input place holders
-   No data indicator on gallery picture panel when no images are loaded
-   Error handling (front and back end)
-   Backend service should be adapted off the framework and registered into container

## Configuration (env varables or the .env file)

```
SERVICE_HOST=http://localhost
SERVICE_PORT=8000
CLIENT_HOST=http://localhost
CLIENT_PORT=3000
DB=image_gallery
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=changeme
DB_ADMIN_PORT=8080
```

## Instantiate the database

All web services must be restarted after this step (if they are already running with active connection)

```
docker-compose up
```

## Setup the web services

```
npm install
cd service
npm install
cd ../client
npm install
cd ..
```

## Run the service and client concurrently

```
npm run dev
navigate to http://localhost:3000/
```

## Cleanup

This step is important because you cannot delete the image from docker itself because the config is .env based

```
docker-compose down
```
