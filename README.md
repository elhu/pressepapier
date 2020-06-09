# pressepapier
Shared clipboard using Go + React

## Getting the project running

1. Install `docker` and `docker-compose`
2. `$> docker-compose up`
3. Visit https://localhost/, accept the certificate error, and go!

### If everything is broken

```
$> docker-compose down && docker-compose up --build --force-recreate
```

## Structure

```
.
├── nginx/             # Configuration for local dev nginx
└── ui                 # Everything related to the frontend
    ├── public         # Static assets
    └── src            # Code for the actual react app
└── docker-compose.yml # Config for docker-compose
```
