# nissevik.com — uppstart och deploy

Personlig hemsida byggd i Next.js, hostad på egen Ubuntu-server via PM2 + Nginx + Cloudflare Tunnel.

## Beslutad stack
- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- **next-themes** för Light/Dark/Auto
- **i18n** via `[lang]`-segment i URL:en (`sv` som standard, `en` som alternativ)
- **Innehåll** som MDX-filer i repot (ingen databas)
- **Contact** = statiska länkar (mejl, X, GitHub), ingen backend
- **Output** = `standalone` (lean serverbundle för PM2)

## Navigationsstruktur (sidomeny)
```
Home
About
Projects
Writing
Reading list
Investments
──────────────
Contact
```

---

## Steg 1 — Skapa skelettet lokalt (Claude Code)

Mappen `~/nissevik` finns redan. Starta Claude Code i den:
```bash
cd ~/nissevik
claude
```

Kör sedan denna prompt i Claude Code:

> Skapa ett Next.js-projekt (App Router, TypeScript, Tailwind, ESLint) för en personlig hemsida i den nuvarande mappen.
>
> **Mål:** en statiskt renderad sajt med en vänster sidomeny och innehåll i mitten, inspirerad av personliga sajter som brian.lovin och sizhang.
>
> **Krav:**
> - Layout med fast vänster sidomeny. Menyval: Home, About, Projects, Writing, Reading list, Investments. En tunn avdelare, sedan Contact underst.
> - Nere i sidomenyn: en tema-toggle (Light / Dark / Auto) via `next-themes`, och en språk-toggle (SV / EN).
> - Flerspråkighet via `[lang]`-route-segment. `sv` är standard, `en` är alternativ. Root ska redirecta till `/sv`. All UI-text ska gå via en enkel ordbok (ett objekt per språk), inte hårdkodas i komponenterna.
> - Innehållssidor renderas från MDX-filer i `content/`, organiserat per sektion och språk. Skapa en placeholder-MDX per sida och språk så att alla menyval funkar.
> - Sätt `output: 'standalone'` i `next.config` (för PM2-deploy senare).
> - Ren, minimal design. Mörkt tema som default-känsla men respektera Light/Dark/Auto.
>
> **Constraints:** engelska i kod, svenska i kommentarer. Håll spellogik/innehåll separerat från layout. Skapa inget backend-anrop, sajten är statisk än så länge.

När det är klart, testa lokalt:
```bash
npm run dev   # öppna http://localhost:3000
```

Verifiera att båda togglarna funkar och att alla menyval visar sina placeholder-sidor på både svenska och engelska.

---

## Steg 2 — Git och GitHub

```bash
cd ~/nissevik
git init
git add -A
git commit -m "Initial scaffold: sidebar, i18n, theme toggle"
```

Skapa ett nytt repo på GitHub (t.ex. `nissevik-site`), sedan:
```bash
git remote add origin https://github.com/Nissevik/nissevik-site.git
git branch -M main
git push -u origin main
```

---

## Steg 3 — Dra ner och kör på servern

SSH in:
```bash
ssh hem-server
```

Klona, bygg, starta med PM2:
```bash
cd ~
git clone https://github.com/Nissevik/nissevik-site.git nissevik
cd nissevik
npm install
npm run build

# standalone-bygget hamnar i .next/standalone
pm2 start "npm run start" --name nissevik
pm2 save
```

Appen ska nu svara på `http://localhost:3000` på servern. Testa:
```bash
curl -I http://localhost:3000
```

---

## Steg 4 — Nginx + Cloudflare (koppla nissevik.com)

**Nginx** — skapa `/etc/nginx/sites-available/nissevik`:
```nginx
server {
    listen 80;
    server_name nissevik.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktivera och ladda om:
```bash
sudo ln -s /etc/nginx/sites-available/nissevik /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Cloudflare Tunnel** — lägg till en public hostname i din befintliga tunnel (`hem-tunnel`) i Cloudflare Zero Trust-dashboarden:
- Hostname: `nissevik.com`
- Service: `http://localhost:80`

Du har redan tunneln igång för SSH, så detta lägger bara till en rutt till. Ingen portöppning i routern behövs.

Öppna `https://nissevik.com` och verifiera att sajten laddar.

---

## Deploy-loop framåt (efter första setup)
```bash
# lokalt
git add -A && git commit -m "..." && git push

# på servern
ssh hem-server
cd ~/nissevik && git pull && npm install && npm run build && pm2 restart nissevik
```
Detta kan förenklas till ett litet `deploy.sh`-script senare.

---

## Efter att kedjan funkar
När `nissevik.com` visar skelettet börjar vi fylla på innehåll och finslipa design, sektion för sektion (Home först, sedan About/Contact, osv). Reading list och Investments blir strukturerad MDX/data. Din self-hosted Supabase sparas till en framtida funktion som faktiskt behöver en databas.
