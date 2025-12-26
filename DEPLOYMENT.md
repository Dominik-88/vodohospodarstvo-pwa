# 🚀 Deployment Guide

## Možnosti deploymentu

### 1. Firebase Hosting (Doporučeno)

#### Výhody
- ✅ Automatické HTTPS
- ✅ Globální CDN
- ✅ Integrace s Firebase službami
- ✅ Bezplatný plán (10 GB/měsíc)

#### Postup
```bash
# 1. Instalace Firebase CLI
npm install -g firebase-tools

# 2. Přihlášení
firebase login

# 3. Inicializace projektu
firebase init hosting

# Odpovězte na otázky:
# - What do you want to use as your public directory? → .
# - Configure as a single-page app? → Yes
# - Set up automatic builds? → No

# 4. Deploy
firebase deploy

# 5. Vaše URL
# https://your-project-id.web.app
```

#### firebase.json
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "README.md",
      "TECHNICAL.md",
      "QUICKSTART.md"
    ],
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }],
    "headers": [{
      "source": "**/*.@(js|css)",
      "headers": [{
        "key": "Cache-Control",
        "value": "max-age=31536000"
      }]
    }]
  }
}
```

---

### 2. Netlify

#### Výhody
- ✅ Jednoduchý deployment
- ✅ Automatické buildy z GitHubu
- ✅ Bezplatný plán (100 GB/měsíc)
- ✅ Formuláře a funkce

#### Postup A: Přes CLI
```bash
# 1. Instalace Netlify CLI
npm install -g netlify-cli

# 2. Přihlášení
netlify login

# 3. Deploy
netlify deploy --prod

# 4. Vaše URL
# https://your-site-name.netlify.app
```

#### Postup B: Přes GitHub
1. Jděte na [netlify.com](https://netlify.com)
2. Klikněte na "New site from Git"
3. Vyberte GitHub repozitář
4. Nastavení:
   - Build command: (prázdné)
   - Publish directory: `.`
5. Klikněte "Deploy site"

#### netlify.toml
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

---

### 3. GitHub Pages

#### Výhody
- ✅ Zdarma pro veřejné repozitáře
- ✅ Automatické buildy
- ✅ Custom domény

#### Postup
1. Jděte do nastavení repozitáře
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `main` / `(root)`
5. Klikněte "Save"

#### Vaše URL
```
https://dominik-88.github.io/vodohospodarstvo-pwa/
```

#### GitHub Actions (volitelné)
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

---

### 4. Vercel

#### Výhody
- ✅ Rychlý deployment
- ✅ Edge Functions
- ✅ Bezplatný plán

#### Postup
```bash
# 1. Instalace Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Production deploy
vercel --prod

# 4. Vaše URL
# https://your-project.vercel.app
```

#### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### 5. Cloudflare Pages

#### Výhody
- ✅ Globální CDN
- ✅ Neomezená šířka pásma
- ✅ Bezplatný plán

#### Postup
1. Jděte na [pages.cloudflare.com](https://pages.cloudflare.com)
2. Klikněte "Create a project"
3. Připojte GitHub repozitář
4. Nastavení:
   - Build command: (prázdné)
   - Build output directory: `.`
5. Klikněte "Save and Deploy"

---

## Custom doména

### Firebase Hosting
```bash
firebase hosting:channel:deploy production --domain your-domain.com
```

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Nastavte DNS záznamy:
   ```
   A    @    75.2.60.5
   CNAME www  your-site.netlify.app
   ```

### GitHub Pages
1. Settings → Pages → Custom domain
2. Zadejte doménu
3. Nastavte DNS:
   ```
   A    @    185.199.108.153
   A    @    185.199.109.153
   A    @    185.199.110.153
   A    @    185.199.111.153
   ```

---

## SSL/HTTPS

Všechny platformy poskytují **automatické HTTPS** zdarma pomocí Let's Encrypt.

---

## Environment Variables

### Firebase
```bash
# .env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
```

### Netlify
```bash
# Netlify UI: Site settings → Environment variables
FIREBASE_API_KEY=your_api_key
```

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
env:
  FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
```

---

## Monitoring

### Google Analytics
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry (Error Tracking)
```javascript
// app.js
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## Performance Optimization

### 1. Minifikace
```bash
# Terser pro JavaScript
npx terser app.js -o app.min.js -c -m

# cssnano pro CSS
npx cssnano styles.css styles.min.css
```

### 2. Gzip komprese
```nginx
# nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 3. CDN
Všechny platformy používají globální CDN automaticky.

---

## Rollback

### Firebase
```bash
# Seznam verzí
firebase hosting:channel:list

# Rollback na předchozí verzi
firebase hosting:rollback
```

### Netlify
```bash
# Netlify UI: Deploys → Publish deploy
```

### GitHub Pages
```bash
# Revert commit
git revert HEAD
git push
```

---

## Checklist před deploymentem

- [ ] Aktualizovat Firebase konfiguraci
- [ ] Otestovat offline režim
- [ ] Zkontrolovat responzivitu
- [ ] Ověřit všechny funkce
- [ ] Nastavit Google Analytics
- [ ] Přidat custom doménu
- [ ] Otestovat na různých zařízeních
- [ ] Zkontrolovat Lighthouse score
- [ ] Nastavit monitoring
- [ ] Vytvořit backup

---

**Vytvořeno s ❤️ pro efektivní správu vodohospodářské infrastruktury**