# Skrivena Srbija

Mapa mesta po Srbiji za koja ljudi uglavnom ne znaju: vodopadi, kanjoni, pećine, tvrđave, manastiri i neobična mesta. Radi kao aplikacija na telefonu (može da se instalira na početni ekran).

## Pokretanje u VS Code-u

Potreban je [Node.js](https://nodejs.org) (verzija 18 ili novija).

1. Otvori folder `skrivena-srbija` u VS Code-u.
2. Otvori terminal (Terminal → New Terminal) i pokreni:

```bash
npm install
npm run dev
```

3. Otvori adresu koju terminal ispiše (obično `http://localhost:5173`).

Pošto je `dev` pokrenut sa `--host`, terminal ispisuje i adresu tipa `http://192.168.x.x:5173`. Otvori je na telefonu (isti Wi-Fi) da vidiš kako izgleda.

## Šta aplikacija ima

- **Mesta**: lista i mapa, pretraga i filter po kategorijama
- **Blizu mene**: mesta u krugu od 100 km od tvoje lokacije
- **Moj ćilim**: kolekcija posećenih mesta, svako mesto je jedan romb u ćilimu
- **Podeli svoj ćilim**: pravi sliku 1080×1920 za Instagram i TikTok story
- **Iznenadi me**: nasumično mesto koje još nisi posetio
- **Navigacija**: otvara mesto u Google mapama
- Svako mesto ima svoj link (npr. `/#rtanj`), pa se može podeliti

Posećena mesta se čuvaju u pregledaču na telefonu, bez naloga i registracije.

## Dodavanje novih mesta

Sva mesta su u fajlu `src/data/places.js`. Kopiraj jedan postojeći unos i promeni podatke. Koordinate (`lat`, `lng`) najlakše dobiješ u Google mapama: desni klik na mesto, pa klik na brojeve da ih kopiraš. Polje `query` je tekst po kome dugme „Navigacija" traži mesto.

Pre objavljivanja proveri opise i koordinate. Tačnost je kod ovakve aplikacije najvažnija.

## Objavljivanje (besplatno)

Najjednostavnije je preko [Vercel](https://vercel.com) ili [Netlify](https://netlify.com):

1. Postavi projekat na GitHub.
2. Na Vercelu klikni „Add New Project" i izaberi repozitorijum.
3. Vercel sam prepoznaje Vite i objavljuje sajt.

Ili ručno: `npm run build` pravi folder `dist` koji možeš da prevučeš na Netlify Drop.

Posle toga kupi domen (npr. `skrivenasrbija.rs`) i poveži ga u podešavanjima.

## Mapa

Podloga mape je OpenStreetMap. Besplatna je, ali je namenjena manjem saobraćaju. Ako aplikacija postane jako popularna (hiljade korisnika dnevno), pređi na servis kao što je MapTiler ili Stadia Maps, koji imaju besplatan plan uz API ključ, i samo promeni `url` u `src/components/MapView.jsx`.
