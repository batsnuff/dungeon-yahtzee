# 🚀 Szybka Instrukcja Deploy

## Krok po kroku - GitHub Pages

### 1️⃣ Przygotowanie

Upewnij się, że masz zainstalowane:
- Node.js (v16 lub nowszy)
- Git

### 2️⃣ Utwórz repo na GitHubie

1. Idź na https://github.com/new
2. Nazwa repozytorium: `dungeon-yahtzee` (lub dowolna inna)
3. Zostaw jako **Public**
4. **NIE zaznaczaj** "Initialize with README"
5. Kliknij "Create repository"

### 3️⃣ Zaktualizuj konfigurację

Otwórz plik `vite.config.js` i zmień:

```javascript
base: '/dungeon-yahtzee/',
```

na nazwę swojego repozytorium:

```javascript
base: '/TWOJA-NAZWA-REPO/',
```

### 4️⃣ Wrzuć na GitHuba

Otwórz terminal w folderze projektu i wykonaj:

```bash
# Inicjalizuj git
git init

# Dodaj wszystkie pliki
git add .

# Pierwszy commit
git commit -m "Initial commit - Dungeon Yahtzee"

# Ustaw branch na main
git branch -M main

# Dodaj remote (ZMIEŃ na swój username!)
git remote add origin https://github.com/TWOJ-USERNAME/dungeon-yahtzee.git

# Wypchnij na GitHub
git push -u origin main
```

### 5️⃣ Włącz GitHub Pages

1. Idź do swojego repo na GitHubie
2. Kliknij **Settings** (u góry)
3. W menu z lewej wybierz **Pages**
4. W sekcji "Build and deployment":
   - **Source**: wybierz "GitHub Actions"
5. Gotowe! Nie musisz nic więcej robić

### 6️⃣ Czekaj na deploy

1. Idź do zakładki **Actions** w swoim repo
2. Zobaczysz workflow "Deploy to GitHub Pages"
3. Poczekaj aż się zakończy (zielona fajka ✓)

### 7️⃣ Odwiedź stronę!

Twoja gra będzie dostępna pod:

```
https://TWOJ-USERNAME.github.io/dungeon-yahtzee/
```

---

## 🔄 Aktualizowanie gry

Gdy chcesz wprowadzić zmiany:

```bash
# Edytuj pliki (np. src/App.jsx)

# Dodaj zmiany
git add .

# Commit
git commit -m "Opis zmian"

# Push
git push
```

GitHub automatycznie zbuduje i wdroży nową wersję! 🎉

---

## 🛠️ Testowanie lokalnie

Przed wysłaniem zmian na GitHub, możesz przetestować lokalnie:

```bash
# Zainstaluj zależności (pierwszym razem)
npm install

# Uruchom serwer deweloperski
npm run dev

# Otwórz http://localhost:5173 w przeglądarce
```

---

## ❗ Najczęstsze problemy

### Problem: "404 - Page not found"
**Rozwiązanie**: Sprawdź czy `base` w `vite.config.js` zgadza się z nazwą repo.

### Problem: "Biała strona po deploy"
**Rozwiązanie**: Sprawdź konsolę przeglądarki (F12). Prawdopodobnie zła ścieżka w `base`.

### Problem: "npm: command not found"
**Rozwiązanie**: Zainstaluj Node.js z https://nodejs.org/

### Problem: GitHub Actions nie działa
**Rozwiązanie**: Sprawdź czy w Settings → Actions → General masz włączone "Allow all actions"

---

## 📝 Struktura projektu

```
dungeon-yahtzee-gh/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Auto-deploy na GitHub
├── public/
│   └── vite.svg             # Ikona
├── src/
│   ├── App.jsx              # 🎮 GŁÓWNA GRA TUTAJ
│   ├── main.jsx             # Entry point
│   └── index.css            # Style Tailwind
├── .gitignore               # Pliki do ignorowania
├── index.html               # HTML template
├── package.json             # Zależności
├── vite.config.js           # ⚠️ ZMIEŃ BASE TUTAJ
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
└── README.md                # Dokumentacja
```

---

## 🎮 Modyfikowanie gry

Chcesz coś zmienić? Wszystko jest w `src/App.jsx`:

- **Linia 32-43**: Wrogowie (HP, DMG, ikony)
- **Linia 45-51**: Artefakty (moce, efekty)
- **Linia 141-155**: Combo (obrażenia, koszt many)
- **Linia 230**: Liczba pięter do wygranej

---

Powodzenia! ⚔️🎲

