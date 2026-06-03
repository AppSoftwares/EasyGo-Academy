---
name: Vibrant Kinetic Academy
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd5ff'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f1ff'
  surface-container: '#f0ebff'
  surface-container-high: '#eae5ff'
  surface-container-highest: '#e4dfff'
  on-surface: '#1b1737'
  on-surface-variant: '#5a413a'
  inverse-surface: '#302c4d'
  inverse-on-surface: '#f3eeff'
  outline: '#8f7069'
  outline-variant: '#e3beb6'
  surface-tint: '#b42901'
  primary: '#b42901'
  on-primary: '#ffffff'
  primary-container: '#ff5e36'
  on-primary-container: '#5b1000'
  inverse-primary: '#ffb4a2'
  secondary: '#6c39d0'
  on-secondary: '#ffffff'
  secondary-container: '#8556eb'
  on-secondary-container: '#fffbff'
  tertiary: '#006d35'
  on-tertiary: '#ffffff'
  tertiary-container: '#00aa55'
  on-tertiary-container: '#003416'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a2'
  on-primary-fixed: '#3c0700'
  on-primary-fixed-variant: '#8a1d00'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d1bcff'
  on-secondary-fixed: '#24005b'
  on-secondary-fixed-variant: '#561aba'
  tertiary-fixed: '#62ff96'
  tertiary-fixed-dim: '#00e475'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#005226'
  background: '#fcf8ff'
  on-background: '#1b1737'
  surface-variant: '#e4dfff'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  h1-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 20px
  gutter: 16px
  touch-target-min: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for a high-energy, professional mobile learning experience. It targets Spanish speakers in the US, balancing the urgency of "Action" with the reliability of "Trust." 

The style is **Modern-Vibrant**, utilizing a sophisticated mix of **Glassmorphism** for depth and **Corporate Modern** structures for clarity. The interface must feel fast, responsive, and motivating, using high-contrast gradients to signal progression and achievement. The atmosphere is optimistic and premium, moving away from "childish" gamification toward a sleek, performance-oriented educational tool.

## Colors

The palette is anchored by **Coral Orange** (#FF5E36) to drive action and **Electric Purple** (#5D26C1) to establish authority and trust. 

- **Primary Action:** Use the Coral Orange for main CTAs and interactive elements.
- **Brand Gradient:** Reserved for high-impact moments like streak milestones, level completions, and premium feature headers.
- **Surface Strategy:** The default mode is light, using Pure White for content cards and Soft Gray for the underlying canvas. For the "Deep Night Blue" (#120E2E), use it for immersive dark mode transitions or high-contrast navigation bars.
- **Success & Progression:** The Bright Green is strictly for positive reinforcement (streaks, correct answers).

## Typography

This design system utilizes **Plus Jakarta Sans** for headlines to provide a modern, friendly, yet professional voice. Its slightly wider apertures ensure readability at high speeds. **Inter** handles the heavy lifting for learning content, chosen for its exceptional legibility and systematic feel.

- **Headlines:** Use Bold (700) for H1/H2 and SemiBold (600) for H3 to create clear hierarchy.
- **Body Text:** Standardize on 16px (body-md) for lesson content to ensure comfort for Spanish speakers reading English text.
- **Logo Treatment:** "EasyGo" uses Poppins Bold; "Academy" uses Poppins Light Italic. This specific pairing should not be used elsewhere in the UI to maintain brand exclusivity.

## Layout & Spacing

The design system follows a **Fluid Grid** model optimized for mobile-first constraints. 

- **Safe Zones:** A 20px horizontal margin is maintained for all main containers to ensure content doesn't hit the screen edges.
- **Vertical Rhythm:** Elements scale on a 4px baseline grid. Use 16px (stack-md) for standard component spacing and 24px (stack-lg) to separate major content sections.
- **Touch Targets:** No interactive element (links, buttons, icons) should have a hit area smaller than 48x48px, even if the visual asset is smaller.

## Elevation & Depth

Visual hierarchy is managed through a combination of **Ambient Shadows** and **Glassmorphism**:

- **Primary Elevation:** Use the soft Electric Purple shadow (0 4px 24px rgba(93,38,193,0.15)) for active cards and main action buttons. This provides a "glow" that feels energetic rather than heavy.
- **Glassmorphism:** Apply to floating navigation bars and over-image content blocks using `blur(12px)` and a white overlay at 8% opacity. Ensure a 1px inner border (white, 10% opacity) is used to define edges on dark backgrounds.
- **Layering:** Background (Soft Gray) > Content Card (White/Sharp) > Interactive Element (Shadowed/Floating).

## Shapes

The shape language is sophisticated and varied, moving away from simple circles to more organic, high-end geometric forms.

- **Standard Components:** Buttons and input fields use **12px (radius-md)**.
- **Content Cards:** Main lesson cards and dashboard modules use **16px (radius-lg)**.
- **Feature Banners:** Large promotional or milestone cards use **24px (radius-xl)**.
- **Icon Enclosures:** Use the **28px Squircle** for app-like icons within the UI and category badges to create a premium, tactile feel.

## Components

- **Buttons:** 
  - *Primary:* Solid Coral Orange with White text. Bold weight.
  - *Secondary:* White background with Electric Purple border (2px) and text.
  - *Ghost:* No border, Purple text, for "Skip" or "Back" actions.
- **Chips & Tags:** Use 8px radius with a subtle version of the status colors (e.g., Success tag uses light green background at 10% opacity with dark green text).
- **Input Fields:** 12px radius, Soft Gray background. On focus, transition to an Electric Purple 2px border with a soft purple outer glow.
- **Lesson Lists:** Use a 16px radius card. Include a progress bar at the bottom of the card using the Brand Gradient for completed percentages.
- **Progress Bars:** Always rounded/pill-shaped. Use a background of #E0E0E0 and a fill of the Brand Gradient for "Global Progress" or Bright Green for "Session Streaks."
- **Badges:** Metallic finishes (Gold, Silver, Bronze) should use a subtle linear gradient (Top-Left to Bottom-Right) to simulate luster, rather than flat fills.