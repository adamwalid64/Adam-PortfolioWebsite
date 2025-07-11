// Card Tilt Effects - Adapted from React ProfileCard component
const { useState, useEffect, useRef } = React;

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
};

const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const round = (value, precision = 3) =>
  parseFloat(value.toFixed(precision));

const adjust = (
  value,
  fromMin,
  fromMax,
  toMin,
  toMax
) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// Initialize tilt effects for all profile cards
const initializeCardTiltEffects = () => {
  const cards = document.querySelectorAll('.pc-card-wrapper');
  
  cards.forEach((cardWrapper) => {
    const card = cardWrapper.querySelector('.pc-card');
    if (!card || !cardWrapper) return;

    let rafId = null;

    const updateCardTransform = (offsetX, offsetY) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        cardWrapper.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (duration, startX, startY) => {
      const startTime = performance.now();
      const targetX = card.clientWidth / 2;
      const targetY = card.clientHeight / 2;

      const animationLoop = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    const handlePointerMove = (event) => {
      const rect = card.getBoundingClientRect();
      updateCardTransform(
        event.clientX - rect.left,
        event.clientY - rect.top
      );
    };

    const handlePointerEnter = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      cardWrapper.classList.add("active");
      card.classList.add("active");
    };

    const handlePointerLeave = (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        offsetX,
        offsetY
      );
      cardWrapper.classList.remove("active");
      card.classList.remove("active");
    };

    // Add event listeners
    card.addEventListener("pointerenter", handlePointerEnter);
    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", handlePointerLeave);

    // Initialize with default position
    const initialX = cardWrapper.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    updateCardTransform(initialX, initialY);
    createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY
    );

    // Cleanup function
    return () => {
      card.removeEventListener("pointerenter", handlePointerEnter);
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  });
};

// Initialize when DOM is ready
const initializeTiltEffects = () => {
  // Wait for cards to be rendered
  const checkForCards = () => {
    const cards = document.querySelectorAll('.pc-card-wrapper');
    if (cards.length > 0) {
      initializeCardTiltEffects();
    } else {
      setTimeout(checkForCards, 100);
    }
  };
  
  checkForCards();
};

// Make functions globally available
window.initializeCardTiltEffects = initializeCardTiltEffects;
window.initializeTiltEffects = initializeTiltEffects;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTiltEffects);
} else {
  initializeTiltEffects();
} 