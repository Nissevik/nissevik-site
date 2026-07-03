# nissevik.com — kommandon och genvägar

Praktisk referens för vardagen. För första-gångs-setup, se `nissevik-setup.md`.

---

## Lokal utveckling (på Mac:en)

```bash
cd ~/nissevik
npm run dev        # startar dev-server, öppna http://localhost:3000
npm run build      # testbygg produktionsversionen lokalt
```

Dev-servern laddar om automatiskt när du sparar en fil. Avsluta med `Ctrl+C`.

---

## Deploya en ändring

Standardflödet varje gång du vill lägga ut något nytt:

```bash
# 1. På Mac:en: committa och pusha
cd ~/nissevik
git add -A
git commit -m "Kort beskrivning av ändringen"
git push

# 2. På servern: dra ner och bygg om
ssh hem-server
~/nissevik/deploy.sh
```

`deploy.sh` kör `git pull`, `npm install`, `npm run build` och `pm2 restart nissevik` åt dig, med utskrift för varje steg. Ladda sedan om sidan med `Cmd+Shift+R` (hård omladdning) för att slippa cachad version.

### Manuell deploy (om deploy.sh strular)
```bash
ssh hem-server
cd ~/nissevik
git pull && npm install && npm run build && pm2 restart nissevik
```

---

## Git-vardag (på Mac:en)

```bash
git status                 # vad har ändrats
git log --oneline -5       # senaste commits
git add -A                 # lägg till alla ändringar
git commit -m "..."        # spara en commit
git push                   # skicka till GitHub
git pull                   # hämta senaste (om du jobbat på annan dator)
git checkout -- <fil>      # ångra osparade ändringar i en fil
```

---

## Servern

Logga in:
```bash
ssh hem-server
```

### Appen (PM2)
```bash
pm2 status                 # ser om appen kör (online/stopped)
pm2 restart nissevik       # starta om appen
pm2 stop nissevik          # stoppa appen
pm2 logs nissevik          # visa loggar (Ctrl+C för att avsluta)
pm2 logs nissevik --lines 50   # senaste 50 raderna
pm2 save                   # spara processlistan (så den överlever omstart)
```

### Nginx (reverse proxy)
```bash
sudo nginx -t                      # testa att konfigurationen är giltig
sudo systemctl reload nginx        # ladda om efter ändring
sudo systemctl status nginx        # se status
# Konfigfil: /etc/nginx/sites-available/nissevik
```

### Cloudflare Tunnel
```bash
sudo systemctl status cloudflared  # se om tunneln kör
sudo systemctl restart cloudflared # starta om vid behov
```
Public hostnames (t.ex. nissevik.com) styrs i Cloudflare Zero Trust-dashboarden under
Networks → Tunnels → hem-tunnel → Published application routes.

### Snabb hälsokoll på servern
```bash
curl -I http://localhost:3000                        # svarar appen? (307 → /sv)
curl -I -H "Host: nissevik.com" http://localhost:80  # proxar Nginx rätt?
```

---

## Var saker ligger

| Sak | Plats |
|-----|-------|
| Projektet (Mac) | `~/nissevik` |
| Projektet (server) | `~/nissevik` |
| Innehåll (texter) | `content/<sektion>/{sv,en}.mdx` |
| UI-texter (meny m.m.) | `src/lib/dictionaries.ts` |
| Menykonfiguration | `src/lib/nav.ts` |
| Komponenter | `src/components/` |
| GitHub-repo | github.com/Nissevik/nissevik-site |
| Live | https://nissevik.com |

---

## Redigera innehåll

Innehållet är vanliga Markdown/MDX-filer. Ändra texten i `content/<sektion>/sv.mdx`
och `content/<sektion>/en.mdx`, spara, och deploya enligt flödet ovan. Kom ihåg att
uppdatera båda språken.

---

## SSH och filöverföring (från server-kommandon.md)

```bash
ssh hem-server                     # anslut till servern
sftp johan@sftp-hem-server         # filöverföring (put/get/ls/exit)
```
Server-IP lokalt: 192.168.1.182 · Domän: nissevik.com · SSH utifrån: ssh.nissevik.com
