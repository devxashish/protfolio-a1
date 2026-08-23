import { App } from './src/3d/app.js';

function hasWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hasWebGLSupport() && !isReducedMotion) {
        try {
            window.webglApp = new App();
            document.body.classList.add('webgl-active');
            
            // Allow users to force exit 3D mode
            setTimeout(() => {
                const exitBtn = document.getElementById('exit-3d-btn');
                if (exitBtn) {
                    exitBtn.addEventListener('click', () => {
                        document.body.classList.remove('webgl-active');
                        document.getElementById('webgl-container').style.display = 'none';
                        window.webglApp.audio.enabled = false; // Mute audio if active
                    });
                }
            }, 100);
        } catch (e) {
            console.error("WebGL Failed", e);
        }
    }
});

// Phase 3.1: World Design & Tactile Interactions - Hardened
console.log('Phase 3.1 World Design initialized.');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Lighting System (Pointer Tracking - Fixed Coordinates & Performance)
if (!prefersReducedMotion) {
  let lightRaf = null;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  const rootStyle = document.documentElement.style;

  const updateLight = () => {
    // pageX/pageY ensures light stays with cursor even when scrolled
    // Using a single style update to prevent layout thrashing
    rootStyle.cssText = `--mouse-x: ${mouseX}px; --mouse-y: ${mouseY}px;`;
    lightRaf = null;
  };

  document.addEventListener('pointermove', (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
    if (!lightRaf) {
      lightRaf = requestAnimationFrame(updateLight);
    }
  }, { passive: true });
}

// 2. Navigation: Smooth Scroll with Focus Management
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    }
  });
});

// 3. Light-On Reveal System
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
  });

  document.querySelectorAll('section').forEach(section => {
    revealObserver.observe(section);
  });
} else {
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('is-revealed');
  });
}

// 4. Tactile Interaction: Grab & Tear on Projects (Fixed Lifecycle & Layers)
const projectItems = document.querySelectorAll('.project-item');

projectItems.forEach(item => {
  if (prefersReducedMotion) return;

  const dragSurface = item.querySelector('.project-surface');
  if (!dragSurface) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let animationFrame = null;

  const stiffness = 0.12;
  const damping = 0.82;
  let velocity = 0;

  const updateSpring = () => {
    if (!isDragging) {
      const force = -stiffness * currentX;
      velocity = (velocity + force) * damping;
      currentX += velocity;

      if (Math.abs(currentX) < 0.5 && Math.abs(velocity) < 0.5) {
        currentX = 0;
        velocity = 0;
        dragSurface.style.transform = `translateX(0px)`;
        animationFrame = null; // CRITICAL FIX: Reset RAF state so it can be dragged again
        item.classList.remove('is-torn');
        return; 
      }
    }
    
    // Physical constraint: allow right drag (reveal), heavily resist left drag
    const renderX = currentX > 0 ? Math.pow(currentX, 0.85) : -Math.pow(Math.abs(currentX), 0.7);
    dragSurface.style.transform = `translateX(${renderX}px)`;
    
    // Add class when pulled far enough to show intent
    if (renderX > 100) {
      item.classList.add('is-torn');
    } else {
      item.classList.remove('is-torn');
    }

    animationFrame = requestAnimationFrame(updateSpring);
  };

  item.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    
    isDragging = true;
    // Capture start relative to current displacement
    startX = e.clientX - currentX; 
    item.classList.add('is-dragging');
    item.setPointerCapture(e.pointerId);
    
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(updateSpring);
  });

  item.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    // Strong resistance pushing left past origin
    if (currentX < 0) currentX = currentX * 0.3; 
  });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    item.classList.remove('is-dragging');
    item.releasePointerCapture(e.pointerId);
    
    // Purposeful interaction: If pulled far enough, trigger the demo link
    const demoLink = item.querySelector('.project-demo-btn');
    if (currentX > 150 && demoLink) {
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
      // Give the physics a moment to feel physical before navigating
      setTimeout(() => {
        demoLink.click();
      }, 150);
    }
  };

  item.addEventListener('pointerup', endDrag);
  item.addEventListener('pointercancel', endDrag);
});
