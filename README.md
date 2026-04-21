# ტრადიციული კერძების რეცეპტები მსოფლიოდან
### Traditional Recipes from the World

A bilingual (Georgian & English) recipe platform built with **Next.js 14**, **Tailwind CSS**, and **Lucide React** — ready for deployment on Vercel.

---

## ✨ Features

- 🌍 **Bilingual** — Full Georgian and English support with live language switching
- 🔍 **Search & Filter** — Filter by country, cuisine category, or keyword
- 📱 **Mobile-first** responsive design
- 🎨 **Warm & Appetizing** color palette (Cream · Terracotta · Forest Green)
- 🧭 **Dynamic routing** — Individual pages per recipe (`/recipe/[id]`)
- ✅ **Interactive cooking mode** — Check off ingredients and steps as you cook
- 🔎 **SEO-optimised** meta tags on every page

---

## 🗂 Project Structure

```
recipe-platform/
├── app/
│   ├── globals.css          # Global styles + Tailwind directives
│   ├── layout.js            # Root layout with metadata
│   ├── page.js              # Home page (hero + recipe grid)
│   └── recipe/
│       └── [id]/
│           └── page.js      # Dynamic recipe detail page
├── components/
│   ├── Navbar.js            # Sticky header with search & language toggle
│   ├── RecipeCard.js        # Recipe card with image and meta
│   ├── Footer.js            # Footer with contact info
│   └── LanguageToggle.js    # GE / EN toggle component
├── data/
│   └── recipes.js           # All recipe data (bilingual)
├── public/                  # Static assets
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Local Setup (VS Code)

### Prerequisites
- **Node.js** v18 or later — download from [nodejs.org](https://nodejs.org)
- **VS Code** — download from [code.visualstudio.com](https://code.visualstudio.com)

### Step 1 — Clone or download the project

If using GitHub:
```bash
git clone https://github.com/YOUR_USERNAME/recipe-platform.git
cd recipe-platform
```

Or open the folder in VS Code:
```
File → Open Folder → select the recipe-platform folder
```

### Step 2 — Install dependencies

Open the VS Code integrated terminal (`Ctrl+`` ` or **Terminal → New Terminal**) and run:

```bash
npm install
```

### Step 3 — Start the development server

```bash
npm run dev
```

Open your browser at **http://localhost:3000** — the site will hot-reload as you make changes.

### Useful VS Code Extensions
- **ES7+ React/Redux/React-Native snippets** — faster component writing
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **Prettier** — automatic code formatting

---

## 🌐 Deploy to Vercel via GitHub

### Step 1 — Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: recipe platform"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/recipe-platform.git
git branch -M main
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or sign up free)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel auto-detects Next.js — no configuration needed
5. Click **"Deploy"**

Your site is live in ~60 seconds! Every push to `main` triggers an automatic redeploy.

### Step 3 — Custom Domain (optional)

In your Vercel project dashboard:
- Go to **Settings → Domains**
- Add your custom domain and follow the DNS instructions

---

## 📝 Adding New Recipes

Open `data/recipes.js` and add a new object to the `recipes` array:

```js
{
  id: "unique-slug",                    // URL slug: /recipe/unique-slug
  country: { ge: "ქვეყანა", en: "Country" },
  countryCode: "XX",                    // ISO 2-letter code
  category: "soup",                     // soup | pasta | dumplings | curry | street-food
  difficulty: { ge: "საშუალო", en: "Medium" },
  prepTime: 45,                         // minutes
  imageUrl: "https://images.unsplash.com/photo-...",
  title: { ge: "კერძის სახელი", en: "Dish Name" },
  description: { ge: "...", en: "..." },
  ingredients: {
    ge: ["ინგრ. 1", "ინგრ. 2"],
    en: ["Ingr. 1", "Ingr. 2"],
  },
  instructions: {
    ge: ["ნაბიჯი 1...", "ნაბიჯი 2..."],
    en: ["Step 1...", "Step 2..."],
  },
}
```

---

## 📧 Contact

**Email:** tradiciulireceptebi@gmail.com

---

## 📄 License

MIT — free to use and modify.
