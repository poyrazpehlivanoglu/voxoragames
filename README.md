# Voxora Games website

A static website (HTML, CSS, JavaScript) for Voxora Games. There is no build step and no dependencies, so it works as-is on GitHub Pages.

## Files

- `index.html` : page content (Roblox explainer, process, glossary, studio, contact)
- `style.css` : all styling
- `script.js` : the interactive parts, plus a `CONFIG` block at the top where you edit your games and contact links

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `voxora-games`).
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the root of the repository.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose the `main` branch and the `/ (root)` folder, then save.
5. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/voxora-games/`.

If you name the repository `YOUR-USERNAME.github.io`, the site is served at `https://YOUR-USERNAME.github.io/` instead.

## Things to edit before you share it

Open `script.js` and edit the `CONFIG` block at the top:

- `contact.email` is a placeholder (`hello@example.com`). Replace it with your real address.
- Add your Discord, Roblox community, YouTube, or X links. Leave a value empty to hide it.
- The three games are placeholder codenames. Replace them with your real projects. When a game is released, set `status: "live"` and add its Roblox `url`.

Page text can be changed directly in `index.html`.

## Notes

- Roblox is a trademark of Roblox Corporation. The footer states that Voxora Games is independent. Keep that notice.
- Roblox rules on payouts, eligibility, and fees change over time. Check the Roblox Creator Hub before you publish exact numbers on the site.
