# Dictate - Video-conferencing for small meetings and groups

## Commands

### Production

Go to localhost:8000 or 127.0.0.1:8000

```console
$ docker compose up
```

### Dev

Go to localhost:8000 or 127.0.0.1:8000

```console
$ python manage.py build
$ python manage.py runserver
```

To access live updates to frontend
Go to localhost:(port specified by stdout)

```console
$ python manage.py build
$ python manage.py runserver
$ npm run --prefix frontend/react dev
```

### Endpoints

- /
  - main app
- /api/
  - api endpoints
- /api-auth/
  - logging into api for accessing /api/ through browser
    - /api-auth/login
    - /api-auth/logout
