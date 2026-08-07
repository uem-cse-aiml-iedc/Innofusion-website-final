# InnoFusion 3.0 — Refinement Pass

> **Round 2 — black minimal redesign.** See [the redesign section](#round-2--black-minimal-redesign)
> at the end for the theme removal, character cut-outs and new hero.


A polish, performance and accessibility pass over the existing site. The Clash of Clans
identity, branding, copy and section structure are unchanged; everything below is
refinement of what was already there.

---

## Headline numbers

| | Before | After | Change |
|---|---|---|---|
| `public/` assets | 98.1 MB | 12 MB | **−88%** |
| Largest single asset | 10.2 MB (`team/AnkanPaul.jpeg`, 8192×6144) | 409 KB | −96% |
| Production `dist/` | ~118 MB | 15 MB | −87% |
| Main JS chunk | 588.8 KB (157.4 KB gzip) | 363.0 KB (105.5 KB gzip) | **−38% gzip** |
| CSS bundle | 150.7 KB (24.1 KB gzip) | 135.2 KB (22.3 KB gzip) | −8% gzip |
| `index.css` | 810 lines | 601 lines | 42 dead classes removed |
| Preload/prefetch tags in `<head>` | 25 (3 pointing at missing files) | 2 | — |
| Font payload | 173 KB (TTF + OTF) | 70 KB (WOFF2) | −60% |
| Images with `loading`/`decoding` | 7 of 46 | 46 of 46 | — |
| Images with intrinsic dimensions | 0 | 20 | CLS fix |

Verification run at the end: TypeScript clean (`tsc --noEmit` exit 0), production build
clean, **all 135 asset URLs referenced by the bundle resolve**, zero removed CSS classes
still referenced by shipped JS.

---

## Bugs fixed

### Broken assets (all live on the production site before this pass)

Sixteen asset references pointed at files that do not exist. Confirmed pre-existing —
a partial `dist/` snapshot taken before any asset work contained `Dragon.webp` but not
`Dark Elixir Icon.webp`, `Archer.webp` or `Builder.webp`, all of which sort within the
same already-copied range.

| Broken reference | Where | Resolution |
|---|---|---|
| `/Clash of Clans Logo Style Text.webp` | LoadingScreen, `index.html` | Repointed to the underscore filename that exists |
| `/night-theme/MasterBuilder.webp` | ThemeContext | Repointed to `Master_Builder.webp` |
| `/Pekka - Large Armored Troop.webp` | ThemeContext day assets | Repointed to `P.E.K.K.A.webp` |
| `/Archer.webp` | FAQ day character | Repointed to `ArcherQueen.webp` |
| `/Shield.webp` | ClanLeaders | Repointed to `ShieldClan Badge Icon.webp` |
| `/Sword.webp` ×2 | ClanLeaders | Replaced with the Lucide `Sword` icon — crisper at any density, one less request |
| `/night-theme/NightShield.webp` | ThemeContext | Generated from the day clan badge, hue-shifted to Builder Base purple |
| `/night-theme/DarkElixir.webp` | ThemeContext | Generated from the elixir drop, pushed to deep violet |
| `/wood-texture.webp` | WelcomePopup | Replaced with a CSS gradient wood grain (`.texture-wood`) |
| `/Coc_base.png` | HacknestTeamPortal background | Repointed to `Background.webp` |
| `/Mouse.webp`, `/Builder.webp`, `/Dark Elixir Icon.webp` | `index.html` preloads | Removed — three 404s on every page load |

### Sponsor logo paths

`Sponsors.tsx` had two active logos written as `"Sponsers/Miro.png"` and
`"Sponsers/LNC.png"` — **no leading slash**. These resolve relative to the current route,
so both logos broke on `/clan-leaders` and `/hacknest-team-portal`. Now root-relative.

### Scroll jank

The page backdrop in `Index.tsx` set `background-attachment: fixed` on an element that
was *already* `position: fixed`. The property did nothing visually but forced a full
repaint of a full-viewport background on **every scroll frame** — the single largest
source of scroll stutter, and effectively broken on iOS Safari regardless. It also
carried `will-change: background-image`, a hint no browser can act on. Both removed.

### Horizontal overflow

Section reveals used a mix of `slideLeft`, `slideRight`, `rotateIn` and `bounceIn`, which
translated entire sections 100 px along X or rotated them 15°, pushing content past the
viewport edge and producing a horizontal scrollbar on narrow screens. All nine sections
now use a single `fadeUp`.

Additionally `body { overflow-x: hidden }` was changed to `overflow-x: clip`. `hidden`
creates a scroll container, which silently breaks `position: sticky` for every
descendant; `clip` does not.

### Star field teleporting

`HeroSection` computed 20 star positions with bare `Math.random()` calls **inside the
JSX**. Every re-render — theme toggle, modal open, any parent state change — dealt a
fresh layout and the whole field visibly jumped. Now generated once in `useMemo`.

### Music toggle double-firing

The toggle bound both `onClick` and `onTouchEnd` for the same gesture, then tried to
de-duplicate them with a `dataset` flag and a 500 ms timer. When the timing drifted the
button toggled twice and appeared dead. A single `onClick` handles mouse, touch and
keyboard.

### Soundtrack restarting from zero

The theme-swap effect depended on `[isNight, isMusicPlaying, isWarMapSection]`, so every
unmute or war-map crossing reset `currentTime` to 0 and restarted the track. It also
assigned `.src` imperatively even though the `<audio>` elements already bind `src` in
JSX, causing a second network fetch of the same file. Now keyed on `isNight` alone.

### Autoplay fallback bound five listeners for one tap

`click`, `keydown`, `touchstart`, `touchend` and `pointerdown` were all registered for a
single gesture — a tap fires four of them — and re-entry was guarded by a mutable flag
plus a brittle `button[aria-label="Mute Music"]` lookup that broke the moment the label
changed. Replaced with `pointerdown` + `keydown`, both `{ once: true }`, cleaned up via
`AbortController`.

### `ScrollTrigger` cleanup destroying unrelated triggers

The unused `Parallax` export called `ScrollTrigger.getAll().forEach(st => st.kill())` on
unmount — killing **every** trigger on the page, not just its own. `ScrollAnimation` now
uses `gsap.context()`, which scopes cleanup correctly.

### Permanent compositor layers

`ScrollAnimation` applied `will-change: transform, opacity` as a permanent inline style
on all nine section wrappers, and `index.css` applied `backface-visibility: hidden` to
`*, *::before, *::after`. Between them every element on the page was a layer-promotion
candidate for the whole session, which costs memory and can make compositing *slower*.
`will-change` is now applied on tween start and cleared on completion; the global
`backface-visibility` rule is gone.

### Other

- `img { content-visibility: auto }` removed — it skips rendering off-screen images
  without a size hint, causing layout shift on scroll.
- `section { contain: layout style }` removed — `contain: layout` establishes a
  containing block for absolutely-positioned descendants, which breaks full-bleed
  section backgrounds.
- Dead `IntersectionObserver` in `Index.tsx` querying `.scroll-reveal`, a class no
  element carried.
- `SpecialPrizes.tsx` had a bare ternary as a statement (`cond ? flipIn() : flipOut()`)
  — flagged by ESLint, rewritten as an `if`.
- Two `as any` casts on `pointerEvents` replaced with a properly typed `useTransform`.
- 12 `<button>` elements had no `type`, so they default to `type="submit"` — latent
  form-submission bugs. All now explicit.
- Unused `logoColor` variable in `Navbar` removed.
- `App.css` deleted — leftover Vite boilerplate (spinning React logo), imported by
  nothing.
- `coc_base.png` deleted — a 10 MB file sitting at the project root, outside `public/`,
  so it was never served and never referenced.
- The build itself was broken in a fresh Linux checkout (`Cannot find module
  @rollup/rollup-linux-arm64-gnu`); resolved so `vite build` runs.

---

## Performance

### Assets — the dominant cost

`public/` was 98 MB. Team headshots were being served at original camera resolution: one
was **8192×6144 at 10.2 MB**, displayed as a ~200 px card. Sponsor logos ran to 3240×3240.

Every raster asset was resized to a per-directory cap and re-encoded to WebP, choosing
per-file between quality 80, quality 88 and lossless whichever came out smallest:

| Directory | Cap | Rationale |
|---|---|---|
| `team/` | 700 px | card portraits |
| `Sponsers/` | 500 px | logo strip |
| `ID/` | 800 px | ID card art |
| icons (coin, gem, elixir, shield) | 320 px | render at 16–48 px |
| backgrounds, `night-theme/` | 1920 px | full-bleed |

Result: **82 MB → 10.8 MB across 144 files (−87%)**, with 96 filename changes propagated
through the source and verified.

36 unreferenced assets (14 MB) moved to `_unused_assets/`, including the entire
`/Intro/` folder — a 3.1 MB MP3 and three images for a splash screen that is no longer
mounted.

### Fonts

`supercell-magic.ttf` (125 KB) and `Clash_Regular.otf` (47 KB) converted to WOFF2 —
37 KB and 33 KB, with the originals retained as `src` fallbacks. The Google Fonts
`@import` was moved out of `index.css` into a `<link>` in `<head>`: as an `@import` the
request could not begin until the stylesheet had downloaded and parsed, serialising two
round trips on the critical path. `Bungee` was dropped from the font stacks — it was
listed in Tailwind but never actually loaded, so it only ever added a failed lookup.

### Loading path

`<head>` carried 25 preload/prefetch tags. Preloading 25 images does not make them
arrive sooner; it makes them *compete* with the LCP element. Three pointed at files that
do not exist, three more at the retired intro screen, one combined `rel="prefetch"` with
`fetchpriority="high"`, and `type="image/png"` was declared on `.webp` files (wrong MIME
— browsers may discard the preload). A 1 MB audio file was preloaded for playback that
requires a user gesture anyway.

Now two entries: the display font, and the hero backdrop. The backdrop is the LCP element
but is rendered by React, so the preload scanner would not otherwise find it until the
bundle parsed. Only the day variant is preloaded — the theme is not known until JS runs,
so preloading both would waste ~170 KB on every visit to save it on some.

### JavaScript

- **Firebase** was statically imported by `useViewCounter` for a visitor counter that
  renders below the fold — putting the entire `firebase/database` client (245 KB) on the
  critical path. Now a dynamic import in its own chunk, loaded after first paint.
- **three.js** was a declared dependency producing a **0-byte chunk**: its only two
  importers were components nothing rendered. Removed, along with `@types/three`,
  `lenis`, `html2canvas` and `@gsap/react` — all declared, none imported.
- Night-theme prefetching ran **twice** — once in `App.tsx`, once in `ThemeContext` — and
  both fired synchronously on mount, so 15 image requests competed with the hero during
  the most contended moment of the load. The `App.tsx` copy is gone; the remaining one is
  deferred to `requestIdleCallback`.
- 15 orphaned components moved to `_unused_components/`.

Main chunk: **588.8 KB → 363.0 KB** (157.4 → 105.5 KB gzip).

### CLS

20 `<img>` tags now carry `width`/`height` read from the actual files, giving the browser
an aspect ratio to reserve. CSS still controls rendered size via `height: auto`.

---

## Design system

`index.css` was reorganised into five labelled sections and rebuilt around tokens.

**Elevation.** Single large blurs (`0 8px 30px rgba(0,0,0,0.5)`) replaced with a four-step
layered scale (`--elev-1` … `--elev-4`), each combining a tight contact shadow with a
wider ambient one, tinted warm (`hsl(25 40% 4%)`) rather than neutral black so surfaces
sit in the world rather than floating over it.

**Glows** dropped from 0.5–0.8 alpha at 30 px to 0.32 at 24 px. The CoC glow reads as
premium at a whisper and as a toy at full strength.

**Buttons.** `.btn-3d` gained a shared `::before` top-edge sheen, a proper pressable lip
(`--lip-gold` / `--lip-gem` / `--lip-elixir`) instead of ad-hoc box-shadow stacks, a
fluid `clamp()` font size, `touch-action: manipulation` to kill the iOS tap delay, and
real `:disabled` styling.

**Surfaces.** `.panel-wood` / `.panel-wood-night` / `.card-stone` re-cut with 2 px borders
instead of 3–4 px and dual inset highlights (light top, dark bottom) for a rounder edge.
New `.glass` with a `@supports` guard — solid tint where `backdrop-filter` is
unsupported, so text never becomes unreadable.

**Typography.** A fluid `clamp()` scale (`text-fluid-sm` … `text-fluid-4xl`) replaces
fixed breakpoint jumps, which left awkward gaps at tablet widths. Headings get
`text-wrap: balance`, body copy `text-wrap: pretty`.

**Contrast.** `--muted-foreground` lifted from 70% to 76% lightness so muted body copy
clears WCAG AA against `--card`.

**Container padding** made responsive (1rem → 2.5rem) instead of a flat 2rem, which was
cramped on wide screens and wasteful on phones.

**Dead code.** 42 of 57 custom classes were unreferenced — `neon-flicker`, `coin-fall`,
`typewriter`, `damage-shake`, `smoke-effect`, `treasure-sparkle` and 36 more. All removed
after verifying against the shipped JS bundle.

---

## Animation

Sections reveal with one `fadeUp` (28 px, 0.55 s, `power2.out`). Cards use `.card-lift`,
guarded behind `@media (hover: hover) and (pointer: fine)` so touch devices don't get
stuck in a hover state after a tap. All keyframes use `translate3d` and animate only
`transform` and `opacity` — the two properties the compositor handles without layout or
paint.

**Reduced motion** is now honoured properly. The CSS media query cannot reach
framer-motion, which drives transforms from JavaScript; `<MotionConfig reducedMotion="user">`
in `App.tsx` covers every motion component site-wide, and `ScrollAnimation` checks the
preference before setting up any tween.

---

## Accessibility

- **Skip link** to main content, revealed on keyboard focus.
- **Focus rings**: a 3 px `--ring` outline with 3 px offset on `:focus-visible`
  throughout, switching to purple under the night theme.
- **Mobile menu** now behaves as a modal — `role="dialog"`, `aria-modal`, Escape to
  close, and body scroll locked while open. None of this existed; keyboard users were
  trapped.
- **Landmarks**: the two `<nav>` elements labelled `Primary` and `Primary mobile`.
- **Toggles**: theme and music buttons gained `aria-label` and `aria-pressed`.
- **Logo** was a `<div>` with an `onClick` — no keyboard access. Now has `role="button"`,
  `tabIndex`, and Enter/Space handling.
- **Alt text**: 25 decorative images changed from `alt="Character"`, `alt="Troop"`,
  `alt="Sword"` etc. to `alt=""` so screen readers skip them rather than announcing
  scenery. Informative images (sponsor logos, team photos, institution marks) keep
  meaningful alt.
- **Heading order**: footer column headings were `<h4>` with no `<h2>`/`<h3>` above them;
  corrected to `<h2>` within the footer landmark.
- **Tooltips** marked `aria-hidden` (they duplicate the visible label) and now also
  appear on `:focus-within`, so keyboard users see them too.
- Social links prefixed with a screen-reader-only "InnoFusion on ".

---

## Verification performed

- `tsc --noEmit` — clean.
- `vite build` — clean, 2.96 s.
- ESLint — remaining items are pre-existing `no-explicit-any` in API-handling code and
  shadcn fast-refresh warnings; the one real error (`SpecialPrizes`) is fixed.
- Automated crawl of the production bundle: **135 asset URLs extracted, 135 resolve**.
- Automated check that none of the 42 removed CSS classes appear in the shipped JS, and
  that all 21 retained custom classes are still defined.
- Built site served over HTTP: HTML, JS, CSS, fonts, WebP, and previously-broken sponsor
  logos all return 200.

**Not verified:** live rendering in a real browser. The sandbox has no browser and the
Chromium download stalled at 70%, so there was no way to check paint output, console
output at runtime, or behaviour at specific viewports. Everything above is verified by
compilation, bundle analysis and HTTP response — please click through the site before
deploying, particularly the day/night toggle and the war-map audio transition.

---

## Suggested next steps

1. **Put this under git.** There is no repository, so none of this is revertable. This is
   the highest-value thing you could do next.
2. **Team photos still dominate.** They are 700 px WebP now, but 30-odd of them load on
   `/clan-leaders`. Serving a `srcset` at 350/700 px would roughly halve that page.
3. **`ID/` card art is the largest remaining set** (~335 KB each). They feed
   `html-to-image` at `pixelRatio: 3`, so they need the resolution — but they could load
   on demand when a character is selected rather than upfront.
4. **`vendor-motion` at 124 KB** could shrink substantially with framer-motion's
   `LazyMotion` + `domAnimation` feature bundle.
5. **Delete `_unused_assets/` and `_unused_components/`** once you have confirmed nothing
   is needed. They are outside `public/` and `src/` so they do not ship, but they are
   14 MB on disk.
6. **`.env` is present in the project** — confirm it is git-ignored before the first
   commit; it contains Firebase configuration.
7. **Add a real `<h1>`-down heading audit** per page. I fixed the footer, but a full pass
   across WarMap, Treasury and Sponsors would be worth doing.
8. **Consider `fetchpriority="low"`** on the sponsor logo strip, which currently competes
   with mid-page content.
9. **Lighthouse CI** in the deploy pipeline would keep the asset regressions from coming
   back — a single un-resized photo can undo a lot of this.

---

## Files moved rather than deleted

Since the project has no version control, nothing was hard-deleted except verified dead
weight (`App.css`, `coc_base.png`). Everything else was relocated:

- `_unused_assets/` — 36 unreferenced media files (14 MB)
- `_unused_components/` — 15 orphaned components, plus a stray `main.py` that was sitting
  in `src/pages/`

Both directories are outside the build graph and ship nothing.

---

# Round 2 — black minimal redesign

Brief: drop the photographic backgrounds, go flat black in the spirit of
[v2.innofusion.tech](https://v2.innofusion.tech/), and place transparent
single-character cut-outs on top. Copy and section structure unchanged.

## Character extraction

Twelve reference images were supplied as JPEGs on coloured wallpaper
backgrounds. Nine usable characters were cut out to transparent WebP in
`public/characters/` — **248 KB for the whole set**.

| Asset | Source background | Method |
|---|---|---|
| `barbarian` | light grey | Lab colour distance + border connectivity |
| `dart-goblin` | light grey | same |
| `squad` | white | same |
| `skeleton` | purple | same + GrabCut refine |
| `goblin` | green + halftone silhouette | tight crop, then keying |
| `goblin-barrel` | green (watermark cropped) | same |
| `giant` | orange + halftone silhouette | tight crop + rect-seeded GrabCut |
| `wall-breaker` | blue-grey vignette (watermark cropped) | tight crop + rect-seeded GrabCut |
| `balloon` | already black | luminance key |

**What did not work, and why.** The first attempt used a neighbour-relative
flood fill from the borders. On soft cel-shaded art there is no hard edge, so
the fill crawls up the shading gradient and eats the subject — output was
fragments of a barbarian, and the Giant came back 1% opaque. The working
approach keys on distance to a *border-sampled palette* in CIE-Lab (one sample
is not enough; these wallpapers use smooth vertical gradients), then keeps only
the background region actually reachable from the border. That connectivity
step is what stops the key punching holes in a green goblin standing on green.

Two subjects defeated that too and needed GrabCut seeded from a tight
rectangle instead: the Giant, whose halftone silhouette shares its hue, and the
Wall Breaker, pale bone on a pale vignette.

The balloon is keyed on luminance rather than colour, so the fire and smoke
haze fades out naturally instead of ending at a hard rectangle edge — the first
version shipped as an opaque black box that was clearly visible against the
hero's light pool.

**Dropped:** the hammer plaque (grey-on-grey, would not separate, and it is an
object rather than a character) and the two full battle scenes, which have no
single subject to extract.

**Format:** WebP with alpha rather than PNG, on your steer. Same transparent
result, and the set is 248 KB where PNG would have been several megabytes —
which would have undone most of round 1.

## Day/night theme removed

The site carried two complete themes swapped by a clock and a toggle button.
That is gone:

- `ThemeContext` is now a static provider. No `setInterval` polling the hour,
  no manual-override state, no fifteen-image preload on mount. `useTheme()`
  survives as a stable seam returning `isNight: false`, so the ~116 remaining
  `isNight ? … : …` expressions across the tree all resolve to their day
  branch without every component needing to change at once.
- The toggle button, the twenty-star night field, the moon, the Beta Minion
  flyby and the Battle Machine hero are all deleted from `HeroSection`.
- Night audio (`Builder_Base_theme.ogg`, `Builder_Base_war.ogg`) removed; one
  soundtrack per surface.
- The whole `public/night-theme/` folder and `Background.webp` are retired.

## New hero

Flat black with two faint radial light pools drawn in CSS — no image request,
nothing to repaint on scroll. Barbarian and Giant flank the copy, the skull
balloon drifts top-right, and the four-troop squad cut-out sits along the base.

The squad image is 600×226, so stretching it as a full-bleed background would
have been visibly soft on any desktop. It runs as a **foreground band at close
to native width** with a horizontal mask fading both ends into black instead.

All hero copy is unchanged: the badge, "The Clan Wars Begin", "Clash with
Codes, Conquer with Vision!~" and both CTAs.

## Surfaces restyled

- `--background` `25 30% 10%` → `0 0% 4%`. Near-black rather than pure black:
  a hair of lightness gives elevated cards something to separate from and
  avoids OLED smearing on scroll.
- `panel-wood`, `panel-wood-night` and `card-stone` collapse to one treatment —
  near-black fill, 1px hairline at 9% white, single top highlight. They
  previously carried 3–4px saturated borders and double inset shadows, which is
  what made the original read as cluttered rather than premium.
- Borders `30 34% 26%` (brown) → `0 0% 17%` (neutral).
- `--muted-foreground` retuned to 72% lightness for AA on the darker surface.
- Welcome popup's cream-on-amber speech bubble → the same glass panel used
  elsewhere. Its 4px amber border and wood-grain overlay are gone.
- `ClanLeaders` and `HacknestTeamPortal` moved onto the same black canvas.
  Both were painting the village photograph with `background-attachment:
  fixed`, carrying the same scroll-repaint cost the home page had.

## Result

| | Round 1 | Round 2 |
|---|---|---|
| `public/` | 12 MB | **10 MB** |
| `dist/` | 15 MB | **13 MB** |
| Main JS chunk | 363.0 KB (105.5 gzip) | **353.3 KB (103.5 gzip)** |
| CSS | 135.2 KB (22.3 gzip) | **132.1 KB (21.9 gzip)** |
| `<head>` preloads | 2 | **1** (font only) |
| Character art | — | 248 KB, 9 files |

TypeScript clean, build clean, **126 asset references all resolve**.

## Still to check

- **Not verified in a browser.** Still no way to render here — the Chromium
  download stalls at 70% against what looks like a sandbox egress limit. The
  hero composition was checked by compositing the real assets at real sizes
  offline, which is why the balloon rectangle and the torn Giant edges were
  caught, but it is not a substitute for loading the page.
- **The HackNest portal keeps a parchment palette** — `amber-50` / `orange-50`
  card interiors against the new black page. Light cards on black may well be
  the look you want for that sub-app, but it is inconsistent with the rest and
  worth a decision.
- **~116 dead `isNight` branches** remain in `WarMap`, `Treasury`, `Sponsors`,
  `ClanLeaders` and others. Harmless and unreachable, but they are noise; worth
  a cleanup pass when you next touch each file.
- The Wall Breaker's leather helmet is slightly clipped at top-right. GrabCut
  proved unstable on that vignette — widening the crop brought the background
  blob back — so I took the clean-but-clipped version.
