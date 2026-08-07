import { motion } from "framer-motion";
import { TreeDeciduous } from "lucide-react";
import { toast } from "sonner";

interface FooterProps {
  onEasterEgg: () => void;
}

const contacts = [
  { name: "Diptimayee Patra", phone: "7003057157" },
  { name: "MD ASIF", phone: "7439346955" },
  { name: "Pratyay Chatterjee", phone: "8918389523" },
];

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/innofusionindia/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/innofusionindia/" },
  { name: "Twitter", href: "https://x.com/InnoFusionIndia" },
  { name: "Discord", href: "https://discord.gg/UhjCnh9R5U" },
  { name: "Facebook", href: "https://www.facebook.com/InnoFusionIndia" },
];

const pastEditions = [
  { name: "InnoFusion 1.0", href: "https://v1.innofusion.tech/", year: "2024" },
  { name: "InnoFusion 2.0", href: "https://v2.innofusion.tech/", year: "2025" },
];

const Footer = ({ onEasterEgg }: FooterProps) => {
  const handleObstacleClick = () => {
    onEasterEgg();
    toast.success("+5 Gems! You found a hidden treasure!", {
      icon: "💎",
      style: {
        background: "hsl(120 100% 41%)",
        color: "hsl(0 0% 10%)",
        border: "none",
      },
    });
  };

  return (
    <footer className="relative bg-dark-elixir overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grass-pattern opacity-5" />

      {/*
        The footer's fill is opaque and wraps real content, so it can't be
        masked like the other sections. Instead this strip fades the page's
        black down into the footer colour, dissolving the seam where the two
        meet.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent"
      />

      {/* Mini P.E.K.K.A standing guard in the empty corner */}
      <img
        src="/characters/mini-pekka.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-2 bottom-16 h-32 object-contain opacity-20 hidden xl:block"
        style={{ filter: 'drop-shadow(0 0 16px rgba(99,102,241,0.3))' }}
      />

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        {/* Mobile: Stack everything, Tablet: 2 columns, Desktop: 4 columns.
            The location map used to live here as a 5th column — it's now its
            own section right after Mentors, so this grid dropped a column. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
          
          {/* Organised By */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h2 className="font-display text-lg sm:text-xl text-foreground mb-4 sm:mb-5 underline underline-offset-4 decoration-gold-coin/50">
              Organised By
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {/* UEM */}
              <div className="flex items-center gap-3 sm:gap-4">
                <img 
                  src="/UEM.webp" 
                  alt="UEM Logo" 
                  className="w-9 h-9 sm:w-11 sm:h-11 object-contain flex-shrink-0 rounded"
                loading="lazy" decoding="async" width={1280} height={926} />
                <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  University of Engineering and Management, Kolkata
                </p>
              </div>
              {/* IEM */}
              <div className="flex items-center gap-3 sm:gap-4">
                <img 
                  src="/IEM.webp" 
                  alt="IEM Logo" 
                  className="w-9 h-9 sm:w-11 sm:h-11 object-contain flex-shrink-0 rounded"
                loading="lazy" decoding="async" width={600} height={457} />
                <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Institute of Engineering & Management, Kolkata
                </p>
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="col-span-1">
            <h2 className="font-display text-lg sm:text-xl text-foreground mb-4 sm:mb-5 underline underline-offset-4 decoration-gold-coin/50">
              Contacts
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              {contacts.map((contact) => (
                <li key={contact.name}>
                  <a
                    href={`tel:${contact.phone}`}
                    className="font-body text-sm sm:text-base text-muted-foreground hover:text-gold-coin transition-colors block"
                  >
                    {contact.name}: {contact.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          {/* Socials */}
          <div className="col-span-1">
            <h2 className="font-display text-lg sm:text-xl text-foreground mb-4 sm:mb-5 underline underline-offset-4 decoration-gold-coin/50">
              Socials
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm sm:text-base text-muted-foreground hover:text-gold-coin transition-colors block rounded"
                  >
                    <span className="sr-only">InnoFusion on </span>{social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Past Editions */}
          <div className="col-span-1">
            <h2 className="font-display text-lg sm:text-xl text-foreground mb-4 sm:mb-5 underline underline-offset-4 decoration-gold-coin/50">
              Past Editions
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              {pastEditions.map((edition) => (
                <li key={edition.name}>
                  <a
                    href={edition.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm sm:text-base text-muted-foreground hover:text-gold-coin transition-colors flex items-center gap-2"
                  >
                    <span className="text-gold-coin/70 text-xs">⚔️</span>
                    <span>{edition.name}</span>
                    <span className="text-xs text-muted-foreground/60">({edition.year})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar with Copyright */}
      <div className="relative z-10 bg-destructive/90 py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <p className="font-body text-xs sm:text-sm text-white text-center">
              ©2026 InnoFusion 3.0
            </p>
            
            {/* Easter egg obstacle - hidden in the corner */}
            <motion.button
              onClick={handleObstacleClick}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 sm:right-4 opacity-30 hover:opacity-100 focus-visible:opacity-100 transition-opacity rounded"
              type="button"
              title="What's this?"
              aria-label="Hidden treasure: claim 5 gems"
            >
              <TreeDeciduous size={18} className="text-white sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
