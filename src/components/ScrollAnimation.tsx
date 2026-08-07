import { useEffect, useRef, ReactNode, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.config({
  force3D: true,
  nullTargetWarn: false,
});

/*
 * Scroll-triggered reveal wrapper.
 *
 * Only the variants the site actually uses are kept. The previous version
 * shipped seven, including slideLeft/slideRight (which translated whole
 * sections 100px along X and caused horizontal overflow) and bounceIn (an
 * elastic ease on a full section, which read as a glitch rather than a
 * flourish). It also exported an unused Parallax component whose cleanup
 * called ScrollTrigger.getAll().forEach(kill) - that destroyed every trigger
 * on the page, not just its own.
 */
type Animation = 'fadeUp' | 'fadeIn' | 'scaleIn';

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: number;
  /**
   * ScrollTrigger `start` position. Defaults to 'top 88%' (fires once the
   * element is 12% into the viewport). Sections with a background that has
   * to colour-match its neighbours (e.g. WarMap's cavern gradient) can pass
   * an earlier value like 'top bottom+=500' so the fade-in finishes before
   * the section is actually on screen — otherwise a fast scroll or a
   * scroll-behavior:smooth jump can catch it mid-fade, and the still-
   * fading-in background reads as a hard edge against its neighbour for a
   * moment before it settles.
   */
  start?: string;
}

const FROM: Record<Animation, gsap.TweenVars> = {
  fadeUp: { opacity: 0, y: 28 },
  fadeIn: { opacity: 0 },
  scaleIn: { opacity: 0, scale: 0.96 },
};

const TO: Record<Animation, gsap.TweenVars> = {
  fadeUp: { opacity: 1, y: 0 },
  fadeIn: { opacity: 1 },
  scaleIn: { opacity: 1, scale: 1 },
};

const ScrollAnimation = memo(({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.55,
  className = '',
  stagger = 0,
  start = 'top 88%',
}: ScrollAnimationProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Respect the OS-level motion preference: show content, skip the reveal.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(element, { opacity: 1, y: 0, scale: 1, clearProps: 'willChange' });
      return;
    }

    const ctx = gsap.context(() => {
      const targets: gsap.TweenTarget =
        stagger > 0 && element.children.length > 0 ? element.children : element;

      gsap.set(targets, FROM[animation]);

      gsap.to(targets, {
        ...TO[animation],
        duration,
        delay,
        stagger,
        ease: 'power2.out',
        force3D: true,
        /*
         * will-change is applied for the duration of the tween and cleared on
         * completion. The old version set it permanently as an inline style,
         * so every wrapper on the page held a composited layer for the whole
         * session whether or not it was animating.
         */
        onStart: () => gsap.set(targets, { willChange: 'transform, opacity' }),
        onComplete: () => gsap.set(targets, { clearProps: 'willChange' }),
        scrollTrigger: {
          trigger: element,
          start,
          once: true,
          fastScrollEnd: true,
        },
      });
    }, element);

    // gsap.context scopes cleanup to this component's own tweens and triggers.
    return () => ctx.revert();
  }, [animation, delay, duration, stagger, start]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
});

ScrollAnimation.displayName = 'ScrollAnimation';

export default ScrollAnimation;
