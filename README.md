# Payload

## Quickstart

Install docker for mac: https://www.docker.com/docker-mac

Add the following line to your `/etc/hosts` file:

```
127.0.0.1       local.payloadapp.com
```

Start the frontend and backend services

```bash
docker-compose up -d
```

Navigate to http://local.payloadapp.com

Stop all the services (quickly)

```bash
docker-compose stop -t0
```
