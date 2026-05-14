# digilist-api

Tiny Node 20 service for the digilist.no chatbot backend.

- `POST /api/chat` — Anthropic Claude proxy (RAG context supplied by the
  frontend in `src/lib/chatbot/rag.ts`)
- `POST /api/inquiry` — Resend email delivery of the chatbot inquiry form
- `GET  /api/health` — liveness probe

Zero npm dependencies. Native `fetch` and `http` only. Listens on
`127.0.0.1:3001` and is reverse-proxied by nginx at `/api/*`.

---

## One-time VPS setup (`root@72.61.23.56`)

```bash
# 1. Install Node 20 if not present
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 2. App directory
mkdir -p /var/www/digilist-api
chown -R www-data:www-data /var/www/digilist-api

# 3. Env file (real secrets go here, NOT in the repo)
nano /etc/digilist-api.env       # paste the contents of .env.example
chmod 600 /etc/digilist-api.env
chown root:root /etc/digilist-api.env

# 4. systemd service
cp /var/www/digilist-api/digilist-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now digilist-api
systemctl status digilist-api

# 5. nginx — paste server/nginx.snippet.conf into the digilist.no server block
nano /etc/nginx/sites-enabled/digilist-apps.conf
nginx -t && nginx -s reload

# 6. Verify
curl https://digilist.no/api/health
# → {"ok":true,"uptime":...,"anthropicConfigured":true,"resendConfigured":true}
```

## Subsequent deploys

The marketing-site `deploy.sh` rsyncs the contents of `server/` to
`/var/www/digilist-api/` and then `systemctl restart digilist-api`.

## Env variables

See `.env.example`. Required: `ANTHROPIC_API_KEY`, `RESEND_API_KEY`.

## Email routing

- **To:** `admin@digilist.no`
- **Cc:** `info@xala.no`, `hamid@xala.no`
- **Reply-To:** the inquirer's email
- **From:** Resend sandbox sender until the digilist.no domain is
  verified in Resend (then swap `MAIL_FROM` to
  `Digilist <chat@digilist.no>`).
