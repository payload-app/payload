# Payload

## Quickstart

Install docker for mac: https://www.docker.com/docker-mac

Add the following line to your `/etc/hosts` file:

```
127.0.0.1       payload.local
```

Start the frontend and backend services

```bash
docker-compose up -d
```

Navigate to http://payload.local

Stop all the services (quickly)

```bash
docker-compose stop -t0
```

## Setting Up the Webhook Callback

This is done automatically, you just need to set the WEBHOOK_URL parameters in the .env file
