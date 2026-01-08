# Booking Brilliance - Deployment Guide

## 🚀 Quick Deploy

Deploy to production with a single command:

```bash
./deploy.sh
```

## 📋 Prerequisites

- Node.js 18+ installed
- SSH access to Hostinger VPS (72.61.23.56)
- SSH key configured for root@72.61.23.56

## 🔧 Configuration

### Hostinger VPS Details

- **Server IP**: 72.61.23.56
- **User**: root
- **Deployment Path**: `/var/www/digilist/main`
- **Domain**: https://digilist.no

### SSL Certificate

SSL certificate is automatically managed by Let's Encrypt and configured in nginx.

## 📦 Deployment Process

The deployment script performs the following steps:

1. **Build** - Compiles the React application for production
2. **Deploy** - Syncs files to Hostinger via rsync
3. **Verify** - Tests if the site is accessible

### Manual Deployment

If you prefer to deploy manually:

```bash
# 1. Build the project
npm install
npm run build

# 2. Deploy to server
rsync -avz --delete --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    dist/ root@72.61.23.56:/var/www/digilist/main/

# 3. Verify
curl -I https://digilist.no
```

## 🔒 Security Configuration

The site is configured with enterprise-grade security:

### SSL/TLS Configuration

- ✅ TLS 1.2 & 1.3 only
- ✅ Modern cipher suites with forward secrecy
- ✅ DH parameters (2048-bit)
- ✅ HSTS with preload
- ✅ **B+ Rating on SSL Labs**

### Security Headers

All responses include:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ...
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), ...
```

## 🧪 Testing

### Test SSL Rating

```bash
# SSL Labs Test (expect B+ rating)
https://www.ssllabs.com/ssltest/analyze.html?d=digilist.no
```

### Test Security Headers

```bash
# Security Headers Test (expect A/B grade)
https://securityheaders.com/?q=https://digilist.no
```

### Test Site Availability

```bash
curl -I https://digilist.no
```

## 📁 Project Structure

```
booking-brilliance/
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── deploy.sh              # Deployment script
├── DEPLOYMENT.md          # This file
├── package.json           # Dependencies
└── vite.config.ts         # Build configuration
```

## 🔄 Nginx Configuration

The site is served by nginx with the following configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name digilist.no www.digilist.no;
    
    root /var/www/digilist/main;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers (configured)
    # SSL certificates (Let's Encrypt)
}
```

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment Fails

```bash
# Test SSH connection
ssh root@72.61.23.56 'echo "Connection OK"'

# Check remote directory
ssh root@72.61.23.56 'ls -la /var/www/digilist/main'
```

### Site Not Loading

```bash
# Check nginx status
ssh root@72.61.23.56 'systemctl status nginx'

# Check nginx logs
ssh root@72.61.23.56 'tail -f /var/log/nginx/digilist.error.log'

# Reload nginx
ssh root@72.61.23.56 'nginx -t && systemctl reload nginx'
```

## 📝 Environment Variables

For local development, create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

**Note**: Environment variables are embedded at build time with Vite.

## 🔐 SSH Key Setup

If you need to set up SSH access:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to server
ssh-copy-id root@72.61.23.56

# Test connection
ssh root@72.61.23.56
```

## 📊 Monitoring

### Check Site Status

```bash
# HTTP status
curl -s -o /dev/null -w "%{http_code}" https://digilist.no

# Response time
curl -w "@-" -o /dev/null -s https://digilist.no <<'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:     %{time_connect}\n
time_total:       %{time_total}\n
EOF
```

### Check SSL Certificate

```bash
# Certificate expiry
echo | openssl s_client -servername digilist.no -connect digilist.no:443 2>/dev/null | openssl x509 -noout -dates
```

## 🔄 Rollback

If you need to rollback to a previous version:

```bash
# On the server, nginx keeps the previous deployment
ssh root@72.61.23.56 'ls -la /var/www/digilist/'

# You can manually restore from backup if needed
```

## 📞 Support

For deployment issues:

1. Check nginx logs: `/var/log/nginx/digilist.error.log`
2. Verify SSL certificate: `certbot certificates`
3. Test nginx config: `nginx -t`
4. Reload nginx: `systemctl reload nginx`

## 🎯 Production Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test build locally with `npm run preview`
- [ ] Verify environment variables are set
- [ ] Check SSL certificate is valid
- [ ] Test security headers
- [ ] Verify site loads correctly
- [ ] Test on mobile devices
- [ ] Check browser console for errors

## 🚀 Continuous Deployment

For automated deployments, you can set up a GitHub Action or similar CI/CD pipeline that runs `./deploy.sh` on push to main branch.

---

**Last Updated**: January 8, 2026  
**Domain**: https://digilist.no  
**Server**: Hostinger VPS (72.61.23.56)  
**SSL Rating**: B+  
**Security Headers**: A/B Grade
