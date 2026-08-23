// Phase 3: World Design & Tactile Interactions
console.log('Phase 3 World Design initialized.');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Lighting System (Pointer Tracking)
if (!prefersReducedMotion) {
  document.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
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
      // Accessibility: Move focus to the target section
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    }
  });
});

// 3. Light-On Reveal System (Intersection Observer)
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
  // If reduced motion is on, immediately reveal everything
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('is-revealed');
  });
}

// 4. Tactile Interaction: Grab & Tear on Projects
// We implement a physical 1D spring drag
const projectItems = document.querySelectorAll('.project-item');

projectItems.forEach(item => {
  if (prefersReducedMotion) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let animationFrame;

  // Spring physics constants
  const stiffness = 0.1;
  const damping = 0.8;
  let velocity = 0;

  const updateSpring = () => {
    if (!isDragging) {
      // Snap back to 0
      const force = -stiffness * currentX;
      velocity = (velocity + force) * damping;
      currentX += velocity;

      if (Math.abs(currentX) < 0.1 && Math.abs(velocity) < 0.1) {
        currentX = 0;
        velocity = 0;
        item.style.transform = `translateX(0px)`;
        return;
      }
    }
    
    // Apply physical constraint (harder to pull further)
    const renderX = currentX > 0 ? Math.pow(currentX, 0.85) : -Math.pow(Math.abs(currentX), 0.85);
    item.style.transform = `translateX(${renderX}px)`;
    animationFrame = requestAnimationFrame(updateSpring);
  };

  item.addEventListener('pointerdown', (e) => {
    // Don't drag if clicking a button
    if (e.target.closest('a') || e.target.closest('button')) return;
    
    isDragging = true;
    startX = e.clientX - currentX;
    item.classList.add('is-dragging');
    item.setPointerCapture(e.pointerId);
    cancelAnimationFrame(animationFrame);
  });

  item.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    
    // Physical resistance: only allow dragging right (to reveal)
    if (currentX < 0) currentX = currentX * 0.2; 
    
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(updateSpring);
    }
  });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    item.classList.remove('is-dragging');
    item.releasePointerCapture(e.pointerId);
    
    // If pulled far enough, trigger the action (simulate clicking the demo link)
    if (currentX > 150) {
      const demoLink = item.querySelector('.project-demo-btn');
      if (demoLink) {
        // Subtle haptic feedback if available
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
        // In a real scenario, this might trigger a navigation. 
        // For Phase 3, we just snap it back.
      }
    }
    
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(updateSpring);
    }
  };

  item.addEventListener('pointerup', endDrag);
  item.addEventListener('pointercancel', endDrag);
});
