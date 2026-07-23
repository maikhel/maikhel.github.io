# Concept Summary: Client-Side AI-Driven Design System

This project explores using Google Chrome’s built-in **Gemini Nano** (via the experimental **Prompt API**) to allow users to dynamically customize the visual design of a website (specifically, a blog with home/article views) using natural language.

---

## 💡 The Core Idea

Instead of relying on rigid, pre-defined accessibility widgets (like standard "Dark Mode" or "A+" text buttons), we leverage a local LLM to translate natural language inputs (e.g., *"make this readable for my grandfather"* or *"give me a high-contrast theme for outdoor reading"*) into custom CSS.

To guarantee stability and prevent the LLM from breaking the page layout, we use a **hybrid approach**:

* **The Developer** writes a bulletproof, responsive layout (using Flexbox/Grid) controlled by CSS custom properties (variables).
* **The LLM** is responsible only for generating the values of these variables within a `:root` block.

---

## 🛠️ Proposed Tech Stack & Architecture

### 1. The Design System (CSS Skeleton)

We define variables in `:root` that govern both **aesthetic** and **ergonomic** aspects of the website:

```css
:root {
  /* Aesthetics */
  --main-bg: #ffffff;
  --card-bg: #f8f9fa;
  --text-main: #333333;
  --accent-color: #007bff;
  --accent-glow: none;
  --font-family: system-ui, sans-serif;
  --border-radius: 8px;
  --card-shadow: 0 4px 6px rgba(0,0,0,0.1);
  --border-style: none;
  --backdrop-blur: none;

  /* Ergonomics & Accessibility */
  --font-scale: 1; /* Used as: font-size: calc(1rem * var(--font-scale)) */
  --line-height: 1.5;
  --letter-spacing: normal;
  --interactive-padding: 12px 20px; /* To make buttons easier to tap */
}

```

### 2. Strict Prompt Engineering

Because Gemini Nano is a lightweight local model, we must use rigorous system instructions paired with a "mapping dictionary" to translate human needs into technical CSS rules.

* **System Prompt:** Instructs the model to output *only* valid CSS (specifically, just the `:root` block) with no Markdown wrappers (```css), no introductory polite remarks, and strict adherence to WCAG contrast standards.
* **Semantic Mapping:** Explicitly instructs the model to increase `--font-scale` and `--interactive-padding` if the user mentions poor eyesight, or to increase `--line-height` and select a clean sans-serif font if the user mentions reading difficulties like dyslexia.

### 3. Safety Fallbacks (The Parser & UI Reset)

* **JS Sanitization:** Since LLMs can occasionally ignore system instructions, a simple JavaScript utility will clean the model's raw string output (stripping Markdown tags and any conversational text) before injecting it into the DOM.
* **The Emergency Reset:** An inline-styled, highly visible "Reset to Default" button ensures that if the AI generates unreadable CSS, the user can instantly restore the site's default style.

---

## 📱 Hardware & Platform Constraints (2026 Status)

While this setup is incredibly powerful, current platform limitations dictate where we can run it:

| Platform | Gemini Nano Local API Support | Fallback Strategy |
| --- | --- | --- |
| **Desktop Chrome** (Win, Mac, Linux) | **Yes** (via `chrome://flags` for testing) | Full local AI experience. |
| **Android Chrome** | **No** (The OS has Gemini Nano via AICore/ML Kit, but Chrome's JS doesn't expose it yet). | Default to standard accessibility controls (buttons/sliders) or optionally route to a cheap cloud API (e.g., Gemini Flash). |
| **iOS** (iPhone/iPad) | **No** (Apple's WebKit restrictions prevent Google from running Chromium's native AI APIs). | Fall back to standard, pre-defined accessibility controls. |
