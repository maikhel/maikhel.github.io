// AI theme customizer: turns a natural-language request into values for the
// whitelisted CSS custom properties in main.css, using Chrome's built-in
// Prompt API (Gemini Nano). The model only ever picks token values; the CSS
// itself is assembled here from validated data.
(function () {
  'use strict';

  var KEY = 'ai-theme:v1';

  var SYSTEM_PROMPT = [
    'You are a design assistant for a small personal blog. The blog has a',
    'Solarized-style theme: serif body text on a warm light background',
    '(default: bg #fdf6e3, text #073642, accent #b58900).',
    '',
    'The user will describe how they want the site to look or feel. Respond',
    'with a JSON object choosing new values for the design tokens below. Only',
    'include tokens that should change; omit the rest.',
    '',
    'Tokens:',
    '- bg: page background color (6-digit hex). bgSoft: subtle panel background, close to bg.',
    '- text: main text color (hex). Must have at least WCAG AA (4.5:1) contrast with bg.',
    '- textMuted: secondary text (hex), readable on bg. accent: links and highlights (hex), readable on bg.',
    '- fontScale: number 0.9-1.5. Use 1.2-1.4 for poor eyesight or "bigger text".',
    '- lineHeight: number 1.3-2.2. Increase for readability or dyslexia requests.',
    '- letterSpacing: number 0-0.12 (em units). Slightly increase for dyslexia.',
    '- radius: number 0-24 (px). 0 = sharp and brutalist, 16+ = soft and friendly.',
    '- serifFont: one of "source-serif", "georgia", "palatino", "system".',
    '- sansFont: one of "inter", "system", "verdana", "atkinson", "comic".',
    '- bodyFont: "serif" or "sans". Choose "sans" for dyslexia or screen-readability requests.',
    '- shadow: one of "none", "subtle", "medium", "dramatic".',
    '- underlineLinks: true/false. Use true for low-vision or colorblind-friendly requests.',
    '',
    'Semantic guidance: "grandfather", "elderly" or "poor eyesight" mean large',
    'fontScale, high contrast and underlineLinks true. "dyslexia" means sans',
    'bodyFont, high lineHeight and letterSpacing around 0.05. "high contrast"',
    'or "outdoor" mean near-black on near-white or the inverse, with a',
    'saturated accent. "dark" or "night" mean a dark bg with light text,',
    'keeping AA contrast.'
  ].join('\n');

  var HEX = /^#[0-9a-fA-F]{6}$/;

  var SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
      bg: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
      bgSoft: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
      text: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
      textMuted: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
      accent: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
      fontScale: { type: 'number', minimum: 0.9, maximum: 1.5 },
      lineHeight: { type: 'number', minimum: 1.3, maximum: 2.2 },
      letterSpacing: { type: 'number', minimum: 0, maximum: 0.12 },
      radius: { type: 'number', minimum: 0, maximum: 24 },
      serifFont: { enum: ['source-serif', 'georgia', 'palatino', 'system'] },
      sansFont: { enum: ['inter', 'system', 'verdana', 'atkinson', 'comic'] },
      bodyFont: { enum: ['serif', 'sans'] },
      shadow: { enum: ['none', 'subtle', 'medium', 'dramatic'] },
      underlineLinks: { type: 'boolean' }
    }
  };

  var FONT_STACKS = {
    'source-serif': '"Source Serif 4", Georgia, serif',
    georgia: 'Georgia, "Times New Roman", serif',
    palatino: 'Palatino, "Palatino Linotype", serif',
    system: 'system-ui, sans-serif',
    inter: '"Inter", system-ui, sans-serif',
    verdana: 'Verdana, Geneva, sans-serif',
    atkinson: '"Atkinson Hyperlegible", Verdana, sans-serif',
    comic: '"Comic Sans MS", "Comic Sans", cursive'
  };

  var SHADOWS = {
    none: 'none',
    subtle: '0 1px 3px rgba(0,0,0,0.12)',
    medium: '0 4px 12px rgba(0,0,0,0.15)',
    dramatic: '0 8px 30px rgba(0,0,0,0.3)'
  };

  var session = null;

  // --- Validation & CSS building -------------------------------------------

  function clamp(value, min, max) {
    if (typeof value !== 'number' || !isFinite(value)) return null;
    return Math.min(max, Math.max(min, value));
  }

  function luminance(hex) {
    var channels = [1, 3, 5].map(function (i) {
      var c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }

  function contrastRatio(hexA, hexB) {
    var la = luminance(hexA);
    var lb = luminance(hexB);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  // Never trust model output, even schema-constrained: keep only keys that
  // pass the same rules, drop the rest. Returns { vars, notes }.
  function validateTheme(raw) {
    var out = {};
    var notes = [];
    if (!raw || typeof raw !== 'object') return { vars: out, notes: notes };

    ['bg', 'bgSoft', 'text', 'textMuted', 'accent'].forEach(function (key) {
      if (typeof raw[key] === 'string' && HEX.test(raw[key])) out[key] = raw[key].toLowerCase();
    });

    // Readability guard: if the model picked unreadable text-on-bg colors,
    // drop the whole color set rather than apply an illegible page.
    var bg = out.bg || '#fdf6e3';
    var text = out.text || '#073642';
    if ((out.bg || out.text) && contrastRatio(bg, text) < 3) {
      delete out.bg;
      delete out.bgSoft;
      delete out.text;
      delete out.textMuted;
      delete out.accent;
      notes.push('kept your colors readable');
    }

    var fontScale = clamp(raw.fontScale, 0.9, 1.5);
    if (fontScale !== null && 'fontScale' in raw) out.fontScale = fontScale;
    var lineHeight = clamp(raw.lineHeight, 1.3, 2.2);
    if (lineHeight !== null && 'lineHeight' in raw) out.lineHeight = lineHeight;
    var letterSpacing = clamp(raw.letterSpacing, 0, 0.12);
    if (letterSpacing !== null && 'letterSpacing' in raw) out.letterSpacing = letterSpacing;
    var radius = clamp(raw.radius, 0, 24);
    if (radius !== null && 'radius' in raw) out.radius = radius;

    ['serifFont', 'sansFont', 'bodyFont', 'shadow'].forEach(function (key) {
      var allowed = SCHEMA.properties[key].enum;
      if (allowed.indexOf(raw[key]) !== -1) out[key] = raw[key];
    });
    if (typeof raw.underlineLinks === 'boolean') out.underlineLinks = raw.underlineLinks;

    return { vars: out, notes: notes };
  }

  function buildCss(vars) {
    var decl = [];
    if (vars.bg) decl.push('--bg: ' + vars.bg);
    if (vars.bgSoft) decl.push('--bg-soft: ' + vars.bgSoft);
    if (vars.text) decl.push('--text: ' + vars.text);
    if (vars.textMuted) decl.push('--text-muted: ' + vars.textMuted);
    if (vars.accent) decl.push('--accent: ' + vars.accent);
    if ('fontScale' in vars) decl.push('--font-scale: ' + vars.fontScale);
    if ('lineHeight' in vars) decl.push('--line-height: ' + vars.lineHeight);
    if ('letterSpacing' in vars) decl.push('--letter-spacing: ' + vars.letterSpacing + 'em');
    if ('radius' in vars) decl.push('--radius: ' + vars.radius + 'px');
    if (vars.shadow) decl.push('--card-shadow: ' + SHADOWS[vars.shadow]);
    if ('underlineLinks' in vars) decl.push('--link-underline: ' + (vars.underlineLinks ? 'underline' : 'none'));

    // body text uses --font-serif, so "sans body" maps the sans stack onto it
    var sansStack = FONT_STACKS[vars.sansFont || 'inter'];
    if (vars.bodyFont === 'sans') {
      decl.push('--font-serif: ' + sansStack);
    } else if (vars.serifFont) {
      decl.push('--font-serif: ' + FONT_STACKS[vars.serifFont]);
    }
    if (vars.sansFont) decl.push('--font-sans: ' + sansStack);

    if (!decl.length) return '';
    return ':root {\n  ' + decl.join(';\n  ') + ';\n}';
  }

  // --- Theme persistence & application -------------------------------------

  function storedTheme() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
      return null;
    }
  }

  function styleEl() {
    return document.getElementById('ai-theme-style');
  }

  // Turbo's head merge can replace the filled style element with the layout's
  // empty one on navigation, so re-assert from storage (idempotent).
  function reassertThemeStyle() {
    var theme = storedTheme();
    var el = styleEl();
    if (el && theme && theme.css && el.textContent !== theme.css) {
      el.textContent = theme.css;
    }
  }

  function applyTheme(vars, css, promptText) {
    localStorage.setItem(KEY, JSON.stringify({
      vars: vars,
      css: css,
      prompt: promptText,
      createdAt: new Date().toISOString()
    }));
    var el = styleEl();
    if (el) el.textContent = css;
    syncResetChip();
  }

  function resetTheme() {
    localStorage.removeItem(KEY);
    var el = styleEl();
    if (el) el.textContent = '';
    syncResetChip();
  }

  function syncResetChip() {
    var chip = document.getElementById('ai-theme-reset-chip');
    if (chip) chip.hidden = !storedTheme();
  }

  // --- Prompt API -----------------------------------------------------------

  function ensureSession(setStatus) {
    return LanguageModel.availability().then(function (availability) {
      if (availability === 'unavailable') {
        setStatus("On-device AI isn't available on this device.");
        return null;
      }
      if (availability === 'downloadable') {
        setStatus('Downloading on-device model (one-time, this can take a while)…');
      } else if (availability === 'downloading') {
        setStatus('Model download in progress…');
      }
      return LanguageModel.create({
        initialPrompts: [{ role: 'system', content: SYSTEM_PROMPT }],
        monitor: function (m) {
          m.addEventListener('downloadprogress', function (e) {
            setStatus('Downloading model… ' + Math.round(e.loaded * 100) + '%');
          });
        }
      });
    });
  }

  function generateTheme(promptText, setStatus) {
    var ready = session ? Promise.resolve(session) : ensureSession(setStatus);
    return ready.then(function (s) {
      if (!s) return null;
      session = s;
      setStatus('Thinking…');
      return s.prompt(promptText, { responseConstraint: SCHEMA });
    });
  }

  // --- UI wiring ------------------------------------------------------------

  var generating = false;

  function bindWidget(widget) {
    var toggle = widget.querySelector('.ai-theme-toggle');
    var panel = widget.querySelector('#ai-theme-panel');
    var input = widget.querySelector('#ai-theme-input');
    var status = widget.querySelector('.ai-theme-status');
    var applyBtn = widget.querySelector('[data-action="apply"]');
    var resetBtn = widget.querySelector('[data-action="reset"]');

    function setStatus(message) {
      status.textContent = message || '';
    }

    toggle.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) input.focus();
    });

    widget.querySelectorAll('[data-example]').forEach(function (button) {
      button.addEventListener('click', function () {
        input.value = button.textContent.trim();
        input.focus();
      });
    });

    resetBtn.addEventListener('click', function () {
      resetTheme();
      setStatus('Back to defaults.');
    });

    applyBtn.addEventListener('click', function () {
      var promptText = input.value.trim();
      if (!promptText || generating) return;
      generating = true;
      applyBtn.disabled = true;

      generateTheme(promptText, setStatus)
        .then(function (raw) {
          if (raw == null) return; // status already explains why
          var parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          var result = validateTheme(parsed);
          var css = buildCss(result.vars);
          if (!css) {
            setStatus("Couldn't understand that request — try an example.");
            return;
          }
          applyTheme(result.vars, css, promptText);
          var suffix = result.notes.length ? ' (' + result.notes.join(', ') + ')' : '';
          setStatus('Theme applied — reset anytime.' + suffix);
        })
        .catch(function (error) {
          console.error('[ai-theme]', error);
          setStatus("Couldn't generate a theme, try rephrasing.");
          if (session) {
            try { session.destroy(); } catch (e) { /* already gone */ }
            session = null;
          }
        })
        .then(function () {
          generating = false;
          applyBtn.disabled = false;
        });
    });
  }

  function init() {
    syncResetChip();

    var chip = document.getElementById('ai-theme-reset-chip');
    if (chip && !chip.dataset.bound) {
      chip.dataset.bound = 'true';
      chip.addEventListener('click', resetTheme);
    }

    if (!('LanguageModel' in self)) return;

    // data-turbo-permanent keeps this exact node across Turbo visits,
    // so listeners are bound exactly once.
    var widget = document.getElementById('ai-theme-widget');
    if (!widget || widget.dataset.bound) return;
    widget.dataset.bound = 'true';
    widget.hidden = false;
    bindWidget(widget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('turbo:load', function () {
    init();
    reassertThemeStyle();
  });
})();
