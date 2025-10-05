# ⚔️ Dungeon Yahtzee - Krypty Chaosu ⚔️

Roguelike dice game combining classic Yahtzee mechanics with dungeon crawling RPG elements!

## 🎮 Game Features

- **15 Floors of Challenges** - Fight through progressively harder enemies
- **Boss Battles** - Face powerful bosses every 5 floors
- **Artifacts System** - Collect powerful items that enhance your abilities
- **Status Effects** - Burning, freezing, and blessing effects add tactical depth
- **Shop System** - Buy potions, shields, and blessings with earned gold
- **Leveling System** - Gain XP and level up to increase your stats
- **Critical Hits** - 15% base chance for double damage attacks
- **📱 PWA Support** - Install as a mobile/desktop app for offline play!

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open browser:**
Navigate to `http://localhost:5173`

### 📱 Install as PWA (Progressive Web App)

1. **Open the app** in Chrome, Edge, or Safari
2. **Look for install prompt** in the address bar or app menu
3. **Click "Install"** or "Add to Home Screen"
4. **Launch** from your desktop or home screen like a native app!

**Benefits:**
- ✅ Works offline after first load
- ✅ Standalone app window (no browser UI)
- ✅ Fast loading with service worker caching
- ✅ Desktop/mobile shortcuts

## 📦 Deploy to GitHub Pages

### Option 1: Automatic Deploy (Recommended)

This project includes GitHub Actions workflow for automatic deployment.

1. **Create a new repository on GitHub** (e.g., `dungeon-yahtzee`)

2. **Initialize git and push:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dungeon-yahtzee.git
git push -u origin main
```

3. **Configure GitHub Pages:**
   - Go to your repository Settings
   - Navigate to Pages section
   - Under "Build and deployment", select Source: **GitHub Actions**

4. **Update base URL:**
   - Edit `vite.config.js`
   - Change `base: '/dungeon-yahtzee/'` to match your repository name
   - If your repo name is different, update accordingly

5. **Push changes:**
```bash
git add .
git commit -m "Update base URL"
git push
```

The game will automatically deploy when you push to main branch!

### Option 2: Manual Deploy

1. **Update vite.config.js** with your repository name:
```javascript
base: '/your-repo-name/'
```

2. **Build and deploy:**
```bash
npm run build
npm run deploy
```

3. **Configure GitHub Pages:**
   - Go to repository Settings → Pages
   - Select branch: `gh-pages`
   - Click Save

Your game will be available at: `https://YOUR_USERNAME.github.io/your-repo-name/`

## 🎯 How to Play

1. **Roll Dice** - Click "RZUĆ KOŚĆMI" to roll (3 rolls per turn)
2. **Hold Dice** - Click dice to hold them between rolls
3. **Choose Attack** - Select a combo to attack the enemy
4. **Use Shop** - Buy items between battles to help survive
5. **Defeat Bosses** - Beat all 15 floors to win!

### Combat Combos

- **Jedynki-Szóstki** - Score based on matching numbers
- **Trzy/Cztery jednakowe** - 3 or 4 matching dice
- **Full** - 3 of a kind + 2 of a kind (30 DMG)
- **Strit** - Sequence of numbers (35-45 DMG)
- **Yahtzee** - All 5 dice matching (60 DMG!)
- **Szansa** - Sum of all dice

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **vite-plugin-pwa** - Progressive Web App support
- **GitHub Pages** - Hosting

## 📝 Project Structure

```
dungeon-yahtzee/
├── src/
│   ├── App.jsx          # Main game component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions workflow
```

## 🎨 Customization

- **Change difficulty**: Modify enemy stats in `enemies` array
- **Add artifacts**: Add new items to `artifactsList`
- **Adjust balance**: Tweak damage values in `calculateCombos()`
- **Change floors**: Modify victory condition in `attack()` function

## 📄 License

Free to use and modify for personal projects!

## 🤝 Contributing

Feel free to fork and create your own version!

---

Made with ⚔️ and 🎲

Enjoy the adventure! 🎮

