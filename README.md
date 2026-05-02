# VAnim Project Page

Static project page for the ICML 2026 paper:

`VAnim: Rendering-Aware Sparse State Modeling for Structure-Preserving Vector Animation`

## Structure

- `index.html` - main project page
- `assets/styles.css` - page styles
- `assets/app.js` - gallery rendering, search, autoplay toggle, BibTeX copy
- `assets/figures/` - paper figures and exported web images
- `assets/videos/` - demo videos shown in the gallery
- `data/videos.js` - video metadata for the 54 demo cases
- `publish_to_github.sh` - helper script for first push

## Local Preview

From this directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages Deployment

1. Create an empty GitHub repository.
2. Run:

```bash
bash publish_to_github.sh <github_repo_url>
```

Example:

```bash
bash publish_to_github.sh git@github.com:YOUR_NAME/VAnimProject.git
```

3. In the GitHub repository settings, enable Pages from branch `main` and folder `/ (root)`.
4. The site will be available at:

`https://<username>.github.io/<repo>/`
