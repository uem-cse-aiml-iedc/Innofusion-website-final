import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shield, Trophy, Users, Clock, Crown, Camera } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const navItems = [
  { label: "Village", href: "#hero", icon: Shield, isRoute: false, tooltip: "🏠 Return to Home Base" },
  { label: "War Map", href: "#timeline", icon: Clock, isRoute: false, tooltip: "⚔️ Battle Timeline & Schedule" },
  { label: "Treasury", href: "#prizes", icon: Trophy, isRoute: false, tooltip: "💰 Loot & Rewards Await!" },
  { label: "Allies", href: "#sponsors", icon: Users, isRoute: false, tooltip: "🤝 Allied Clans (Sponsors)" },
  { label: "Photo Album", href: "#photo-album", icon: Camera, isRoute: false, tooltip: "📸 Relive InnoFusion 2.0" },
  { label: "Clan Leaders", href: "/clan-leaders", icon: Crown, isRoute: true, tooltip: "👑 Meet Your War Chiefs" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isNight } = useTheme();

  const scrollToSection = (href: string) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: href } });
      setIsOpen(false);
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      scrollToSection("#hero");
    }
  };

  /*
   * The mobile overlay is a modal surface, so Escape must dismiss it and the
   * page behind it must not scroll while it is open. Neither was handled
   * before, which left keyboard users stuck inside the menu.
   */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Theme-based colors
  const hoverColor = isNight ? 'hover:text-purple-400' : 'hover:text-gold-coin';
  const iconColor = isNight ? 'text-purple-400' : 'text-gold-coin';
  const iconAccentColor = isNight ? 'text-purple-300' : 'text-yellow-400';
  const panelClass = 'nav-glass';

  return (
    <>
      {/*
        Desktop Navbar.

        The slide-down entrance animation lives on an inner <motion.div>,
        not on this outer fixed nav. Safari has a long-standing bug where a
        `position: fixed` element carrying `backdrop-filter` (here, nested
        `.nav-glass`) leaves stale/"ghosted" pixels behind as the page
        scrolls — reported worse when that fixed element also has its own
        transform history from an entrance animation. Keeping this element
        itself untransformed, and forcing it onto its own stable compositing
        layer with a static translateZ(0), is the standard workaround.
      */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 hidden md:block"
        style={{ transform: "translateZ(0)" }}
        aria-label="Primary"
      >
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-4 mt-4"
        >
          <div className={`${panelClass} flex items-center justify-between px-4 lg:px-6 py-3`}>
            {/* Logo Section with Institution Logos */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer flex items-center gap-2 lg:gap-3 rounded-lg"
              onClick={handleLogoClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLogoClick();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="InnoFusion 3.0 - back to top"
            >
              {/* Institution Logos */}
              <div className="hidden lg:flex items-center gap-2">
                <img 
                  src="/UEM.webp" 
                  alt="UEM Logo" 
                  className="h-8 xl:h-10 w-auto object-contain rounded"
                  style={{
                    filter: isNight ? 'drop-shadow(0 0 6px rgba(168,85,247,0.4))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
                  }}
                decoding="async" width={1280} height={926} />
                <img 
                  src="/IEM.webp" 
                  alt="IEM Logo" 
                  className="h-9 xl:h-11 w-auto object-contain rounded"
                  style={{
                    filter: isNight ? 'drop-shadow(0 0 6px rgba(168,85,247,0.4))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
                  }}
                decoding="async" width={600} height={457} />
                <div className={`w-px h-8 xl:h-10 ${isNight ? 'bg-purple-500/30' : 'bg-gold-coin/30'} mx-1`} />
              </div>
              {/* Main InnoFusion Logo */}
              <img 
                src="/Innofusion3.0_Logo.webp" 
                alt="InnoFusion 2026" 
                className="h-9 md:h-10 lg:h-11 xl:h-12 w-auto object-contain"
                style={{
                  filter: isNight ? 'drop-shadow(0 0 10px rgba(168,85,247,0.5))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              decoding="async" width={1280} height={1280} />
            </motion.div>

            {/* Nav Items */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link key={item.label} to={item.href} className="relative group" onClick={(e) => e.currentTarget.blur()}>
                    <motion.div
                      whileHover={{ scale: 1.05, backgroundColor: isNight ? 'rgba(168,85,247,0.15)' : 'rgba(234,179,8,0.15)' }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 font-body font-bold text-foreground ${hoverColor} transition-all cursor-pointer px-4 py-3 rounded-lg`}
                    >
                      <item.icon size={18} className={iconAccentColor} />
                      {item.label}
                    </motion.div>
                    {/* Tooltip */}
                    <div aria-hidden="true" className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-lg text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none z-50 ${
                      isNight 
                        ? 'bg-purple-900/95 text-purple-100 border border-purple-500/50 shadow-lg shadow-purple-500/20' 
                        : 'bg-amber-900/95 text-amber-100 border border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                    }`}>
                      <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                        isNight ? 'bg-purple-900 border-l border-t border-purple-500/50' : 'bg-amber-900 border-l border-t border-yellow-500/50'
                      }`}></div>
                      {item.tooltip}
                    </div>
                  </Link>
                ) : (
                  <div key={item.label} className="relative group">
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: isNight ? 'rgba(168,85,247,0.15)' : 'rgba(234,179,8,0.15)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        scrollToSection(item.href);
                        /*
                         * The tooltip shows on group-focus-within (for keyboard
                         * users tabbing to the button) as well as group-hover.
                         * A mouse click also focuses the button, and that focus
                         * never clears on its own, so without this the tooltip
                         * stayed stuck open until the user happened to click
                         * something else on the page.
                         */
                        e.currentTarget.blur();
                      }}
                      className={`flex items-center gap-2 font-body font-bold text-foreground ${hoverColor} transition-all px-4 py-3 rounded-lg`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </motion.button>
                    {/* Tooltip */}
                    <div aria-hidden="true" className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-lg text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none z-50 ${
                      isNight
                        ? 'bg-purple-900/95 text-purple-100 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'bg-amber-900/95 text-amber-100 border border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                    }`}>
                      <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                        isNight ? 'bg-purple-900 border-l border-t border-purple-500/50' : 'bg-amber-900 border-l border-t border-yellow-500/50'
                      }`}></div>
                      {item.tooltip}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </motion.div>
      </nav>

      {/*
        Mobile Bottom Bar — same fixed + backdrop-filter + entrance-transform
        combination as the desktop nav above, so it gets the same fix: the
        transform lives on an inner <motion.div>, the outer fixed element
        stays untransformed (aside from the static translateZ(0) layer hint).
      */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe"
        style={{ transform: "translateZ(0)" }}
        aria-label="Primary mobile"
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
        <div className="mx-1 sm:mx-2 mb-1 sm:mb-2">
          <div className={`${panelClass} flex items-center justify-around px-1 sm:px-2 py-2 sm:py-3`}>
            {navItems.slice(0, 4).map((item) => (
              item.isRoute ? (
                <Link key={item.label} to={item.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-0.5 sm:gap-1 min-w-[48px]"
                  >
                    <item.icon className={iconColor} size={20} />
                    <span className="font-body text-[10px] sm:text-xs text-foreground truncate">{item.label}</span>
                  </motion.div>
                </Link>
              ) : (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scrollToSection(item.href)}
                  className="flex flex-col items-center gap-0.5 sm:gap-1 min-w-[48px]"
                >
                  <item.icon className={iconColor} size={20} />
                  <span className="font-body text-[10px] sm:text-xs text-foreground truncate">{item.label}</span>
                </motion.button>
              )
            ))}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col items-center gap-0.5 sm:gap-1 min-w-[48px] rounded-lg"
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <Menu className={iconColor} size={20} />
              <span className="font-body text-[10px] sm:text-xs text-foreground">More</span>
            </motion.button>
          </div>
        </div>
        </motion.div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 ${isNight ? 'bg-slate-900/95' : 'bg-dark-elixir/95'} md:hidden flex flex-col items-center justify-center`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 rounded-lg p-1"
              type="button"
              aria-label="Close menu"
            >
              <X className={iconColor} size={32} />
            </motion.button>

            {/* Institution Logos at top of mobile menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 left-6 flex items-center gap-2"
            >
              <img 
                src="/UEM.webp" 
                alt="UEM Logo" 
                className="h-8 w-auto object-contain rounded"
                style={{
                  filter: isNight ? 'drop-shadow(0 0 6px rgba(168,85,247,0.4))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
                }}
              decoding="async" width={1280} height={926} />
              <img 
                src="/IEM.webp" 
                alt="IEM Logo" 
                className="h-9 w-auto object-contain rounded"
                style={{
                  filter: isNight ? 'drop-shadow(0 0 6px rgba(168,85,247,0.4))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
                }}
              decoding="async" width={600} height={457} />
            </motion.div>

            <div className="flex flex-col items-center gap-4 sm:gap-6">
              {navItems.map((item, index) => (
                item.isRoute ? (
                  <Link key={item.label} to={item.href} onClick={() => setIsOpen(false)}>
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 sm:gap-4 font-display text-xl sm:text-2xl text-foreground ${hoverColor}`}
                    >
                      <item.icon size={24} className={iconAccentColor} />
                      {item.label}
                    </motion.div>
                  </Link>
                ) : (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center gap-3 sm:gap-4 font-display text-xl sm:text-2xl text-foreground ${hoverColor}`}
                  >
                    <item.icon size={24} />
                    {item.label}
                  </motion.button>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
