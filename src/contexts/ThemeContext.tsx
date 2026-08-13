import { createContext, useContext, ReactNode } from 'react';

/*
 * Single dark theme.
 *
 * The site previously shipped two complete themes - a daytime village and a
 * Builder Base night mode - that swapped on a clock and via a toggle button.
 * The redesign is one flat-black surface, so that machinery is gone: no
 * time-of-day polling, no manual override state, no fifteen-image preload on
 * mount, and no second set of background art.
 *
 * `useTheme()` is kept as a stable seam so consuming components did not all
 * have to change at once. `isNight` is permanently false, which means every
 * `isNight ? night : day` expression in the tree now resolves to its day
 * branch - and the day branch is what the new palette is built around.
 */
interface ThemeContextType {
  isNight: boolean;
  toggleTheme: () => void;
  imagesPreloaded: boolean;
}

const VALUE: ThemeContextType = {
  isNight: false,
  toggleTheme: () => {},
  imagesPreloaded: true,
};

const ThemeContext = createContext<ThemeContextType>(VALUE);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
  <ThemeContext.Provider value={VALUE}>{children}</ThemeContext.Provider>
);

/*
 * Shared art and accent tokens. Kept as a single set now that there is only
 * one theme; `getThemeAssets` still takes a flag so existing call sites keep
 * compiling, but both branches return the same object.
 */
export const dayAssets = {
  // Characters (transparent cut-outs, sit directly on black)
  welcomeCharacter: '/characters/barbarian.webp',
  warCharacter: '/characters/giant.webp',
  armyCharacter: '/characters/dart-goblin.webp',
  treasuryCharacter: '/characters/goblin-barrel.webp',

  // Icons
  shieldIcon: '/ShieldClan Badge Icon.webp',
  coinIcon: '/Gold Coin Icon.webp',
  elixirIcon: '/Elixir Drop Icon.webp',
  gemIcon: '/Gem Icon.webp',

  // Accents
  primaryGold: '#FFC81E',
  primaryText: 'rgb(250 240 220)',
  bubbleBg: 'from-neutral-900 to-neutral-950',
  borderColor: 'border-white/10',
  accentColor: 'border-[#FFC81E]/40',
  glowColor: 'rgba(255,200,30,0.35)',
};

export const nightAssets = dayAssets;

export const getThemeAssets = (_isNight: boolean) => dayAssets;

export default ThemeContext;
