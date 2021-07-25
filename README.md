# image-gallery

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

All web services must be restarted after this step (if they are already running)

```
docker-compose up
```

## Setup the web services

```
npm run bootstrap
```

## Run the service and client concurrently

```
npm run dev
```

## Cleanup

This step is important because you cannot delete the image from docker itself because the config is .env based

```
docker-compose down
```
