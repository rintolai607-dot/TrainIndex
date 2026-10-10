# Putting Transit Index on GitHub (GitHub Pages)

The app is a static site (no build step), so GitHub Pages can host it free over HTTPS. HTTPS is also what the service worker and "Near me" need.

## 1. One-time setup
1. Create a free account at github.com.
2. Install Git (git-scm.com) and, in a terminal, set your identity:
   ```
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```

## 2. Create the repository
On github.com click **New repository**, name it e.g. `transit-index`, keep it **Public** (free Pages needs public), leave "Add a README" **unticked**, and create it.

## 3. Push the files
In the project folder (the one containing `index.html`, and the `icons/` folder):

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/transit-index.git
git push -u origin main
```
(GitHub will ask you to sign in; use a Personal Access Token as the password if prompted.)

No terminal? On the repo page choose **Add file → Upload files**, drag in everything **including the `icons` folder**, and commit.

## 4. Turn on Pages
Repo → **Settings → Pages** → Source: **Deploy from a branch**, Branch: `main`, folder `/ (root)` → Save. After about a minute the site is at:

`https://<your-username>.github.io/transit-index/`

## 5. Updating later
```
git add .
git commit -m "Describe the change"
git push
```
The service worker caches files, so after a deploy bump `CACHE` in `sw.js` (e.g. `transit-index-v3`) so visitors get the new version.

## Notes
- Keep every path relative (the project already does), because the site lives under `/transit-index/`.
- **Never commit your National Rail (Darwin) token.** It is entered in the app's *Data source settings* and stays in your browser only.
- National Rail times need that free token: register at https://realtime.nationalrail.co.uk/OpenLDBWSRegistration/ . TfL needs nothing.
- Add a `.nojekyll` empty file if Pages ever ignores a file starting with an underscore.
