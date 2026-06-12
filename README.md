# Techfest '26 Projection Portal 🚀

An immersive 3D graphics projection portal and registration interface designed for **IIT Bombay Techfest '26**. The application features an interactive 3D WebGL WebGL constellation globe, a responsive events feed, real-time ticket registrations with barcode simulators, ambient sound synthesis, and an advanced high-contrast accessibility theme.

---

## 💻 Local Development

### 1. Installation
Install project dependencies with npm:
```bash
npm install
```

### 2. Run the Development Server
Launch the local development environment:
```bash
npm run dev
```
The server will boot locally. Open the browser to the address shown in your terminal (usually `http://localhost:3000`).

### 3. Build Production Target
Compile the static HTML, JS, and CSS static bundle inside the `/dist` directory:
```bash
npm run build
```

---

## 🚀 Smooth Deployment to GitHub Pages

We have configured `vite.config.ts` with a relative base path (`base: './'`) so the assets find their files correctly when hosted on GitHub subfolders. Below are the two standard methods to deploy this successfully.

### Step 1: Push Your Code to Github
Initialize git, add your origin remote, and push:
```bash
git init
git add .
git commit -m "Configure GitHub Pages workflows"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main -f
```

---

### Method A: Direct GitHub Actions (Recommended & Modern 🌟)
Deploying directly using GitHub Actions avoids having to manage separate compiled branches. We've created the perfect `.github/workflows/static.yml` for this.

1. Go to your repository settings on **GitHub**.
2. Click on **Pages** in the left sidebar (under "Code and automation").
3. Under **Build and deployment** -> **Source**, select **GitHub Actions** from the dropdown menu (instead of "Deploy from a branch").
4. Go to the **Actions** tab of your repo. The `"Deploy static content to Pages"` workflow will run automatically to compile the React code and host your site directly!

---

### Method B: Classic Branch Deployment (Using `gh-pages` branch 📦)
If you prefer standard branch deployment, our `.github/workflows/deploy.yml` compiles and pushes your production assets automatically to a separate `gh-pages` branch.

1. Once you push your code, go to the **Actions** tab on GitHub: you'll see the `"Deploy to GitHub Pages"` build pipeline running.
2. After it builds and completes successfully, it will automatically create a `gh-pages` branch in your repository.
3. Go to repository **Settings** -> **Pages**.
4. Under **Build and deployment** -> **Source**, choose **Deploy from a branch**.
5. Select `gh-pages` and `/ (root)` from the dropdown menus and click **Save**.

Your Techfest '26 portal will be live in just a few seconds at:
`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

---

## 🎨 Immersive Interface Modules

- **Interactive 3D Globe (`/src/components/TechfestCanvas.tsx`)**: Customized WebGL representation mapping rotating constellation vertices representing tech event sectors. Supporting real-time node locking, interactive presets (Globe, Constellation, Atom), and hover coordinates.
- **Dynamic Registrations Dashboard (`/src/components/MyRegistrationsList.tsx`)**: Interactive ticket vault tracking registered sessions locally with a visual scan-line styling and digital barcode indicator.
- **Accessibility Engine (High Contrast & Ambient Toggle)**: Equipped with specialized light-contrast overlay presets and retro synthesizer drone triggers.
