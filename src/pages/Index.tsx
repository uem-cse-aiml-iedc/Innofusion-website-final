import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ResourceStats from "@/components/ResourceStats";
import StorySection from "@/components/StorySection";
import WarMap from "@/components/WarMap";
import Treasury from "@/components/Treasury";
import Sponsors from "@/components/Sponsors";
import MentorsSection from "@/components/MentorsSection";
import LocationSection from "@/components/LocationSection";
import PastEditions from "@/components/PastEditions";
import PhotoAlbum from "@/components/PhotoAlbum";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";

import WelcomePopup from "@/components/WelcomePopup";
import ScrollAnimation from "@/components/ScrollAnimation";

const Index = () => {
  const location = useLocation();
  const [gems, setGems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true); // Show welcome popup on load
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  /*
   * Starts false, not true. This used to default to true (optimistically
   * assuming the mount-time autoplay below would succeed), but browsers
   * regularly block that first play() call without a user gesture — Safari
   * and Brave especially. When blocked, the toggle button still rendered as
   * "playing" until the play() promise's .catch() flipped it, which could
   * lag. That left the button showing sound-on while audio was actually
   * paused, so a user's first click just resynced the UI (pause a no-op,
   * flip to false) and only their second click actually started playback.
   * Starting from false means the button always reflects reality, and the
   * first genuine click reliably starts the music.
   */
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isWarMapSection, setIsWarMapSection] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const warMapAudioRef = useRef<HTMLAudioElement>(null);
  const warMapSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to section when navigating from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      // Wait for content to render, then scroll to the target section
      setTimeout(() => {
        const targetElement = document.querySelector(location.state.scrollTo);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  // One soundtrack per surface now that the Builder Base theme is gone.
  const themeMusic = '/theme_music.ogg';
  const warMusic = '/Clan_Wars_BGM.mp3.mpeg';

  // Mirror of the latest playback state, read by listeners that must not
  // re-subscribe every render.
  const latest = useRef({ isMusicPlaying, isWarMapSection });
  latest.current = { isMusicPlaying, isWarMapSection };

  /*
   * Try to start the soundtrack, falling back to the first user gesture when
   * the browser blocks autoplay.
   *
   * Previously this bound five listeners (click, keydown, touchstart,
   * touchend, pointerdown) for what is one gesture - a single tap fires
   * pointerdown, touchstart, touchend and click - and guarded against the
   * resulting re-entry with a mutable flag plus a brittle aria-label lookup.
   * pointerdown already covers mouse, touch and pen.
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 1;
    audio.play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false));

    const controller = new AbortController();
    const startOnGesture = (e: Event) => {
      /*
       * Ignore the gesture if it landed on the music toggle itself.
       *
       * This listener runs on `pointerdown`, which fires *before* `click`.
       * When Safari had blocked autoplay, a user's first press on the toggle
       * would hit this handler first: audio was paused, so it started
       * playback and set isMusicPlaying → true. The `click` event then fired
       * a moment later, toggleMusic saw isMusicPlaying === true, and dutifully
       * paused the music again. Net effect: the first press appeared to do
       * nothing and only the second press "worked" — the two-click bug.
       *
       * The toggle has its own handler that already starts playback on a
       * gesture, so this fallback simply stays out of its way. `once: true`
       * is deliberately not relied on here — see the re-arm below.
       */
      const target = e.target as Element | null;
      if (target?.closest?.('[data-music-toggle]')) return;

      if (!audioRef.current || !audioRef.current.paused) return;
      if (latest.current.isWarMapSection) return;
      audioRef.current.play()
        .then(() => {
          setIsMusicPlaying(true);
          controller.abort();
        })
        .catch(() => undefined);
    };

    /*
     * Not `once: true`: if the very first gesture is on the toggle button we
     * bail out above without starting anything, and a `once` listener would
     * have already unsubscribed itself — leaving no autoplay fallback for any
     * later gesture. The listener instead removes itself (via the controller)
     * only once playback has actually begun.
     */
    const opts = { passive: true, signal: controller.signal } as const;
    document.addEventListener('pointerdown', startOnGesture, opts);
    document.addEventListener('keydown', startOnGesture, opts);

    return () => controller.abort();
  }, []);

  // Handle War Map section music switching
  useEffect(() => {

    // Ensure war map audio is at max volume
    if (warMapAudioRef.current) {
      warMapAudioRef.current.volume = 1.0;
    }

    const warMapElement = document.getElementById('timeline');
    if (!warMapElement) return;

    // Optimized observer with fewer threshold points
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            // User scrolled to War Map section
            setIsWarMapSection(true);
            
            // ALWAYS pause main theme when entering war map
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            // Play war music only if music is enabled
            if (warMapAudioRef.current && isMusicPlaying) {
              warMapAudioRef.current.volume = 1.0;
              warMapAudioRef.current.currentTime = 0;
              warMapAudioRef.current.play().catch(console.error);
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
            // User scrolled away from War Map section
            setIsWarMapSection(false);
            
            // ALWAYS pause war music when leaving war map
            if (warMapAudioRef.current) {
              warMapAudioRef.current.pause();
              warMapAudioRef.current.currentTime = 0;
            }
            // Resume main theme only if music is enabled
            if (audioRef.current && isMusicPlaying) {
              audioRef.current.play().catch(console.error);
            }
          }
        });
      },
      { 
        threshold: [0.1, 0.3],
        rootMargin: '-5% 0px -5% 0px'
      }
    );

    observer.observe(warMapElement);

    return () => observer.disconnect();
  }, [isMusicPlaying]);

  /*
   * A plain click handler is enough: browsers synthesise click from a tap.
   * The old version bound both onClick and onTouchEnd and then tried to
   * de-duplicate them with a dataset flag and a timer, which double-toggled
   * whenever the timing drifted.
   */
  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();

    const active = isWarMapSection ? warMapAudioRef.current : audioRef.current;
    if (!active) return;

    /*
     * Branch on the element's real `paused` flag rather than isMusicPlaying.
     * React state can briefly disagree with the actual audio element — an
     * autoplay attempt resolving late, or another handler starting playback
     * in the same tick — and trusting it made the button toggle the opposite
     * way from what the user saw. `paused` is always ground truth.
     */
    if (!active.paused) {
      active.pause();
      setIsMusicPlaying(false);
    } else {
      active.play().then(() => setIsMusicPlaying(true)).catch(() => {
        // Playback can still be refused (e.g. low-power mode); keep the UI honest.
        setIsMusicPlaying(false);
      });
    }
  };

  const handleFindMatch = () => {
    setIsModalOpen(true);
  };

  const handleEasterEgg = () => {
    setGems((prev) => prev + 5);
  };

  return (
    <>
      {/* Keyboard users can jump past the fixed nav straight to content. */}
      <a href="#hero" className="skip-link">Skip to main content</a>

      {/* Background soundtrack */}
      <audio
        ref={audioRef}
        src={themeMusic}
        loop
        preload="auto"
        playsInline
      />

      {/* War Map soundtrack */}
      <audio
        ref={warMapAudioRef}
        src={warMusic}
        loop
        preload="auto"
        playsInline
      />

      {/* Music Toggle Button - CoC Style */}
      <button
        onClick={toggleMusic}
        /* Marks this subtree so the document-level autoplay-fallback listener
           can skip gestures aimed at the toggle — see startOnGesture above. */
        data-music-toggle
        className="fixed bottom-[72px] sm:bottom-[80px] md:bottom-6 right-3 sm:right-4 z-[60] group touch-manipulation select-none rounded-xl"
        title={isMusicPlaying ? 'Mute music' : 'Play music'}
        aria-label={isMusicPlaying ? 'Mute music' : 'Play music'}
        aria-pressed={isMusicPlaying}
        type="button"
      >
        {/* Outer wood frame */}
        <div 
              className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-active:scale-95 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, #8B6914 0%, #5D4510 100%)',
                boxShadow: '0 4px 0 #3D2A08, 0 6px 15px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,215,0,0.3)',
                border: '3px solid #3D2A08',
              }}
            >
              {/* Inner gold panel */}
              <div 
                className="absolute inset-0.5 sm:inset-1 rounded-md sm:rounded-lg flex items-center justify-center pointer-events-none"
                style={{
                  background: isMusicPlaying 
                    ? 'linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)' 
                    : 'linear-gradient(180deg, #8B0000 0%, #5D0000 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Music icon */}
                {isMusicPlaying ? (
                  <div className="relative pointer-events-none">
                    {/* War horn / speaker icon */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-300 drop-shadow-lg" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    {/* Sound waves animation */}
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-2 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-0.5 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="w-0.5 h-2 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-300/70 drop-shadow-lg" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    {/* X mark */}
                    <div className="absolute -right-0.5 sm:-right-1 top-1/2 -translate-y-1/2 text-red-400 font-bold text-xs sm:text-sm md:text-lg pointer-events-none">
                      ✕
                    </div>
                  </div>
                )}
              </div>
              
              {/* Corner rivets */}
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 shadow-inner pointer-events-none" />
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 shadow-inner pointer-events-none" />
              <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 shadow-inner pointer-events-none" />
              <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 shadow-inner pointer-events-none" />
            </div>
      </button>

      {/*
        Page backdrop.

        One `position: fixed` layer painted once at load. The night-village
        photo sits inside it as an absolutely positioned child rather than via
        `background-attachment: fixed`, which would repaint the whole viewport
        on every scroll frame. At 7% opacity it only reads as texture — every
        section's own gradient still sits on top and is unaffected.
      */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-background"
        style={{
          backgroundImage:
            'radial-gradient(70% 45% at 50% -5%, hsl(45 100% 55% / 0.09) 0%, transparent 65%),' +
            'radial-gradient(50% 40% at 85% 100%, hsl(307 100% 45% / 0.055) 0%, transparent 70%)',
        }}
      />

      {/*
        Night village texture.

        This sits ABOVE the page content rather than behind it, which is the
        whole point: sections have their own opaque backgrounds, so a backdrop
        layer would be blocked by some sections and visible through others —
        producing exactly the hard horizontal edge at each section boundary.
        As an overlay nothing can occlude it, so it reads uniformly from the
        hero to the footer with no seams anywhere.

        `mix-blend-mode: screen` only ever brightens, never darkens, so text
        and card contrast are untouched — the village's moon, sky and hut
        lights come through as a faint glow and the black areas contribute
        nothing at all. z-15 keeps it under the navbar (z-40) and the audio
        toggle (z-60), and pointer-events-none keeps it non-interactive.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[15]"
        style={{
          backgroundImage: "url('/night-village-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
          /* Dialled right down and crushed toward black: only the moon, the
             brightest sky and the hut lights survive; everything else falls
             away into the page. */
          opacity: 0.085,
          mixBlendMode: "screen",
          filter: "saturate(0.65) brightness(0.75) contrast(1.08)",
          /* Falloff is deliberately tight: full strength only through the
             middle, then a long ramp that reaches zero well before the
             viewport edge, so every border and corner is pure black. */
          WebkitMaskImage:
            "radial-gradient(ellipse 62% 58% at 50% 42%, #000 0%, rgba(0,0,0,0.9) 28%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.16) 76%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 62% 58% at 50% 42%, #000 0%, rgba(0,0,0,0.9) 28%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.16) 76%, transparent 90%)",
        }}
      />

      {/* Welcome Popup - only show if not dismissed */}
      {showWelcome && !welcomeDismissed && (
        <WelcomePopup onClose={() => {
          setShowWelcome(false);
          setWelcomeDismissed(true);
        }} />
      )}

      <Navbar />
      {/*
        Section reveals are all fadeUp now. The previous mix of slideLeft /
        slideRight / rotateIn / bounceIn translated whole sections along X or
        rotated them, which pushed content past the viewport edge and produced
        the horizontal scrollbar on narrow screens. A single vertical reveal
        also reads as far more deliberate than six competing entrances.

        overflow-x-clip replaces overflow-hidden so that position: sticky
        continues to work for descendants.
      */}
      <main id="main" className="overflow-x-clip relative z-10 pb-24 md:pb-0">
        <HeroSection onFindMatch={handleFindMatch} />

        <ScrollAnimation animation="fadeUp">
          <ResourceStats />
        </ScrollAnimation>

        <ScrollAnimation animation="fadeUp">
          <StorySection />
        </ScrollAnimation>

        {/*
          Fires while WarMap is still well below the viewport (rather than
          the usual 'top 88%') so its fade-up finishes before any part of it
          is actually visible. Its cavern background has to colour-match
          StorySection above it exactly; catching it mid-fade during a fast
          scroll made that boundary flash as a hard edge for a moment before
          settling.
        */}
        <ScrollAnimation animation="fadeUp" start="top bottom+=600">
          <WarMap />
        </ScrollAnimation>

        <ScrollAnimation animation="fadeUp">
          <Treasury />
        </ScrollAnimation>

        <ScrollAnimation animation="fadeUp">
          <Sponsors />
        </ScrollAnimation>

        <ScrollAnimation animation="fadeUp">
          <MentorsSection />
        </ScrollAnimation>

        <ScrollAnimation animation="fadeUp">
          <LocationSection />
        </ScrollAnimation>

        <ScrollAnimation animation="fadeUp">
          <PastEditions />
        </ScrollAnimation>

        <ScrollAnimation animation="fadeUp">
          <PhotoAlbum />
        </ScrollAnimation>

        <ScrollAnimation animation="fadeUp">
          <FAQ />
        </ScrollAnimation>
      </main>
      <Footer onEasterEgg={handleEasterEgg} />
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Index;
