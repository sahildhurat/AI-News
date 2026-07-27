---
name: Lumina AI
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#4fdbc8'
  on-tertiary: '#003731'
  tertiary-container: '#00a392'
  on-tertiary-container: '#00302a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  code-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for a premium, tech-forward AI news intelligence platform. It targets professionals and enthusiasts who require rapid information processing without cognitive overload. The brand personality is visionary, precise, and high-fidelity.

The visual style is a sophisticated blend of **Glassmorphism** and **High-Contrast Modernism**. It leverages deep charcoal environments punctuated by vibrant, neon-inflected accents. The aesthetic prioritizes depth through layering, using translucent surfaces and "internal glows" to simulate a high-end digital cockpit. The emotional response should be one of "effortless intelligence"—where the UI feels alive, responsive, and cutting-edge.

## Colors
The palette is rooted in a **Deep Slate (#020617)** background to maximize the luminosity of the accent colors. 

- **Electric Blue (Primary):** Used for critical actions, active states, and primary AI-generated insights.
- **Neon Purple (Secondary):** Reserved for trend analysis, high-priority notifications, and premium features.
- **Bright Teal (Accent):** Utilized for positive growth metrics, "new" indicators, and success states.
- **Glass Surfaces:** Surfaces use a translucent Slate base with 60% opacity to allow background gradients and glows to bleed through subtly.

## Typography
This design system employs a dual-font strategy. **Plus Jakarta Sans** provides a friendly yet geometric character for headlines, making the AI feel approachable. **Inter** is used for body copy and data-dense labels to ensure maximum legibility and a systematic, technical feel.

Tighten letter-spacing on display headings to maintain a "tucked" premium look. Use high contrast in weights—pairing ExtraBold headlines with Regular body text—to establish a clear information hierarchy in fast-moving news feeds.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop. 

- **Desktop:** 12 columns, 24px gutters, 40px side margins.
- **Tablet:** 8 columns, 20px gutters, 24px side margins.
- **Mobile:** 4 columns, 16px gutters, 16px side margins.

The spacing rhythm is strictly based on an **8px base unit**. Significant whitespace is used around featured news items to prevent visual clutter, while data-heavy sidebars utilize tighter 4px and 8px increments.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional drop shadows. 

1.  **Base Layer:** The Deep Slate background, occasionally featuring blurred radial gradients of Primary/Secondary colors (opacity 15%) in the corners.
2.  **Surface Layer:** Cards use `backdrop-blur-md` (12px-16px) with a semi-transparent fill.
3.  **The "Glow" Border:** Instead of a shadow, cards feature a 1px solid border at 10% white opacity. On hover, this border transitions to a subtle gradient of the Primary color.
4.  **Floating Elements:** Modals and tooltips use a higher blur (`backdrop-blur-xl`) and a 1px border at 20% white opacity to appear closer to the user.

## Shapes
The shape language is consistently **Rounded**. 

- **Standard Elements:** 0.5rem (8px) for input fields, small cards, and buttons.
- **Large Components:** 1rem (16px) for main content containers and feature news cards.
- **Interactive Triggers:** Pill-shaped (fully rounded) for tags, chips, and AI-status indicators to differentiate them from structural layout blocks.

## Components

### Buttons
- **Primary:** Solid Electric Blue fill with white text. High-gloss finish. On hover, add a `0px 0px 20px` outer glow in the primary color.
- **Secondary:** Transparent background with the "Glow" border (1px Primary color).
- **Ghost:** No border or fill; text color is Primary.

### Cards
- **News Card:** Glassmorphic background. On hover: card lifts (-4px Y-axis) and the border brightness increases.
- **Insight Card:** Features a subtle radial gradient in the top-right corner using the Accent Teal color at 5% opacity.

### Inputs & Search
- **Search Bar:** Fully rounded (pill), 20% Slate-800 fill, `backdrop-blur-sm`. The icon should be Primary Blue.
- **Checkboxes:** Square with 4px border-radius. Active state uses a Primary Blue fill with a white checkmark.

### AI Indicators
- **Live-Line:** A thin, animated SVG line using a gradient of Primary to Secondary colors, used to indicate live data streaming or AI processing.
- **Sentiment Chips:** Pill-shaped with low-opacity fills (e.g., Teal for positive, Red for negative) and high-saturation text.