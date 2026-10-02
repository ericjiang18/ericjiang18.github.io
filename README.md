# Eric Hanchen Jiang — personal website

A responsive academic homepage for [ericjiang18.github.io](https://ericjiang18.github.io), built with Jekyll and GitHub Pages. The design is inspired by [Tianyang Liu’s homepage](https://leoii22.com/), with original styling and interactions tailored to Eric’s content.

## Preview locally

With Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open <http://127.0.0.1:4000>. To generate the static site only:

```sh
bundle exec jekyll build
```

GitHub Pages can build this repository with its existing Jekyll configuration. No Node build or external JavaScript service is required for the homepage.

## Edit the site

- `_pages/about.md`: biography, internship notice, education, experience, and awards.
- `_pages/teaching.md`: Teaching page and its vertical list of discussion materials.
- `_data/publications.yml`: all publications, grouped by year; preserve author order and verified publication links.
- `_data/photos.yml`: profile photos in display order and alt text.
- `_config.yml`: name, contact email, and social profiles.
- `_layouts/profile.html`: page structure, navigation, WeChat dialog, and theme controls.
- `assets/css/profile.css` and `assets/js/profile.js`: appearance and interactions.
- `images/profile/`: optimized profile images, JPEG fallbacks, and the original WeChat QR image.
- `assets/pdf/eric_resume.pdf`: existing downloadable CV.
- `assets/pdf/STATS20_Discussion2_F26.pdf`: slides for STATS 20 Discussion 10/2.
- `assets/data/ShoeSizeM.csv`: downloadable STATS 20 assignment data.

The photo order is snow → UCLA → mirror selfie → outdoors. Visitors can use the four navigation dots, arrows, keyboard, or swipe. Photos do not advance automatically. The WeChat icon opens the QR card; without JavaScript it links directly to the image. Dark mode is the default, and visitors’ theme and accent preferences are saved locally in their browser.

The internship notice and email links use `ericjiang0318@ucla.edu`. The existing CV PDF is unchanged.

## Credits

The repository originally used [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io). Its original MIT license and supporting theme files are retained. The new homepage uses the bundled Font Awesome icon fonts; the original font assets remain in `assets/fonts/`.

The Chinese name uses a locally hosted [Zhi Mang Xing](https://fonts.google.com/specimen/Zhi+Mang+Xing) subset for 姜汉晨. Its SIL Open Font License is included in `assets/fonts/zhi-mang-xing-OFL.txt`.
