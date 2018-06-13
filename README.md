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

Install ngrok - https://ngrok.com/download

ngrok exposes a url that tunnels into the server running on your laptop

Start ngrok

```sh
./ngrok http 80
```

You should see output that looks like this:

```sh
ngrok by @inconshreveable

Session Status                online
Session Expires               7 hours, 59 minutes
Version                       2.2.8
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://<someRandomId>.ngrok.io -> localhost:80
Forwarding                    https://<someRandomId>.ngrok.io -> localhost:80
Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Copy the `https://<someRandomId>.ngrok.io` from the `Forwarding` section and paste it as the `WEBHOOK_BASE_URL` environment variable value in `backend/.env`

Make sure the `backend` service is restarted after setting the `.env` file. Saving `backend/index.js` should trigger a nodemon restart.

_NOTE: This link expires every 8 hours so you'll have to do this each time the link expires or you restart `ngrok`. You'll also want to clean up the webhooks that get created with the ngrok tunnel link. Otherwise github will send a bunch of notifications to a dead ngrok tunnel._
