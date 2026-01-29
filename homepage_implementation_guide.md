# Homepage Implementation Guide

This document describes how to implement the redesigned homepage for **maikhel.github.io** using Jekyll, based on the decisions we made together. It is intended to be used by a coding agent or by you directly.

The goal is to implement a **working homepage first**, see it in the browser, and iterate later.

---

## 1. Goals of the Homepage

The homepage should:
- Feel calm, editorial, and senior
- Be fast and simple (no JS required)
- Use semantic HTML
- Be readable in light and dark mode
- Present curated content (not exhaustive lists)

The homepage contains:
1. Identity + positioning
2. Short professional introduction
3. Selected talks (3)
4. Selected writing (3)
5. Books section (1 for now)
6. Quiet footer with links

---

## 2. Typography & Visual System

### Fonts
- Serif (body + headings): **Source Serif 4**
- Sans (meta text): **Inter**

Both should be loaded via Google Fonts or self-hosted.

### Design Principles
- One centered content column
- Max text width: ~70ch
- Generous vertical spacing
- No cards, no borders, no shadows
- Whitespace defines structure

---

## 3. CSS System

Create a single main stylesheet, e.g. `assets/css/main.css`.

### Design Tokens

```css
:root {
  --font-serif: "Source Serif 4", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;

  --text-base: 18px;
  --line-height: 1.65;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2.5rem;
  --space-6: 4rem;

  --content-width: 70ch;

  /* Solarized-inspired light mode */
  --bg: #fdf6e3;
  --bg-soft: #eee8d5;
  --text: #073642;
  --text-muted: #586e75;
  --accent: #b58900;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #002b36;
    --bg-soft: #073642;
    --text: #eee8d5;
    --text-muted: #93a1a1;
    --accent: #cb9b3f;
  }
}
```

### Base Styles

```css
html {
  font-size: var(--text-base);
}

body {
  margin: 0;
  font-family: var(--font-serif);
  line-height: var(--line-height);
  background: var(--bg);
  color: var(--text);
}

main {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-5) var(--space-3);
}
```

### Typography

```css
h1, h2, h3 {
  font-family: var(--font-serif);
  font-weight: 600;
  line-height: 1.3;
  margin-top: var(--space-6);
  margin-bottom: var(--space-3);
}

h1 {
  font-size: 2.4rem;
  margin-top: 0;
}

h2 { font-size: 1.6rem; }

h3 { font-size: 1.2rem; }

p { margin: var(--space-3) 0; }

.meta {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-muted);
}
```

### Links

```css
a {
  color: var(--accent);
  text-decoration: none;
}

a:hover { text-decoration: underline; }
```

### Utilities

```css
.stack > * + * { margin-top: var(--space-3); }

.stack-lg > * + * { margin-top: var(--space-5); }

.preview { margin-top: var(--space-4); }

.preview img {
  max-width: 100%;
  height: auto;
  margin-bottom: var(--space-2);
}

section { margin-top: var(--space-6); }

footer {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-muted);
}
```

---

## 4. Jekyll Structure

Recommended minimal structure:

```
_layouts/
  default.html
  home.html
_includes/
  talk_preview.html
  post_preview.html
_talks/
_posts/
index.md
```

Talks are implemented as a **collection**.

### `_config.yml`

```yml
collections:
  talks:
    output: true
    permalink: /talks/:name/
```

---

## 5. Layouts

### `_layouts/default.html`

Wraps all pages.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ page.title | default: site.title }}</title>
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  {{ content }}
</body>
</html>
```

---

### `_layouts/home.html`

```html
---
layout: default
---

<header class="stack">
  <h1>{{ site.title }}</h1>
  <p class="meta">Software engineer focused on thinking, responsibility, and getting features done.</p>
</header>

<main>
  <section class="stack-lg">
    {{ content }}
  </section>

  <section>
    <h2>Selected Talks</h2>

    {% assign talks = site.talks | where: "homepage", true | sort: "order" %}
    {% for talk in talks %}
      {% include talk_preview.html talk=talk %}
    {% endfor %}

    <p class="meta"><a href="/talks/">All talks</a></p>
  </section>

  <section>
    <h2>Selected Writing</h2>

    {% assign posts = site.posts | where: "homepage", true | slice: 0, 3 %}
    {% for post in posts %}
      {% include post_preview.html post=post %}
    {% endfor %}

    <p class="meta"><a href="/blog/">Browse all posts</a></p>
  </section>

  <section>
    <h2>Books</h2>
    <article>
      <h3>Getting Things Done — David Allen</h3>
      <p class="meta">A system I’ve used for over a decade to manage both professional and personal work with clarity and calm.</p>
    </article>
  </section>

  <footer class="stack">
    <p>
      <a href="/blog/">Blog</a> ·
      <a href="/talks/">Talks</a> ·
      <a href="https://github.com/maikhel">GitHub</a> ·
      <a href="https://www.linkedin.com/">LinkedIn</a> ·
      <a href="https://500px.com/">Photos</a>
    </p>
  </footer>
</main>
```

---

## 6. Homepage Content

### `index.md`

```md
---
layout: home
---

I’m a Ruby developer with over a decade of experience building and maintaining production Rails systems.

Over time, my focus shifted from writing code alone to thinking about ownership, responsibility, and how teams design, ship, and sustain software.

This site is where I write, collect talks, and share ideas I keep returning to.
```

---

## 7. Talks (example)

Example file: `_talks/more-ruby-less-rails.md`

```md
---
title: "More Ruby, Less Rails: Rediscover the Beauty of Ruby"
homepage: true
order: 1
slides_url: https://example.com/slides
---

A reminder of how expressive and elegant Ruby can be beyond Rails. This talk revisits core language features, lesser-known ideas like refinements, and what we often forget when working inside frameworks.
```

---

## 8. Post Previews

Posts featured on the homepage should include:

```yml
homepage: true
image: /assets/images/example.jpg
tags:
  - ruby
  - architecture
```

Excerpt or first paragraph will be used as the homepage blurb.

---

## 9. Definition of Done (for homepage)

The homepage is considered implemented when:
- It renders correctly in browser
- Light and dark mode both work
- Content feels balanced vertically
- No JavaScript is required
- You can scroll and read comfortably

At this point, iteration can begin.

---

## 10. Next Steps (after homepage)

1. Adjust spacing and copy after seeing the page
2. Implement `/talks` index page
3. Implement `/blog` with tags and pagination

The homepage is the reference point for all future pages.

