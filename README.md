# Dictate - Video-conferencing for small meetings and groups

## Commands

#### Run app and go to http://localhost

```console
$ docker compose up
```

#### Local build for dev

```console
$ python manage.py build
$ python manage.py runserver
$ npm run --prefix frontend/react dev
```

## Config

#### Update variables in .env

- ENVIRONMENT = "development" | "production"
- DEBUG = "true" | unset

### Endpoints

- /
  - main app
- /api/
  - api endpoints
- /api-auth/
  - logging into api for accessing /api/ through browser
    - /api-auth/login
    - /api-auth/logout
