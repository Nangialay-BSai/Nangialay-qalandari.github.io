// Horizontal Scroll Animation
document.addEventListener('DOMContentLoaded', () => {
    const scrollTrack = document.querySelector('.project-scroll-track');
    
    if (scrollTrack) {
        // Enhanced hover effects for project cards
        const projectCards = document.querySelectorAll('.project-card-scroll');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Pause animation on hover
                scrollTrack.style.animationPlayState = 'paused';
                
                // GSAP hover animation
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    // Animate tech tags
                    gsap.to(card.querySelectorAll('.project-tech span'), {
                        scale: 1.1,
                        duration: 0.2,
                        stagger: 0.05,
                        ease: "power2.out"
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                // Resume animation
                scrollTrack.style.animationPlayState = 'running';
                
                // Reset hover animation
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    // Reset tech tags
                    gsap.to(card.querySelectorAll('.project-tech span'), {
                        scale: 1,
                        duration: 0.2,
                        stagger: 0.05,
                        ease: "power2.out"
                    });
                }
            });
        });
        
        // Add scroll speed control based on user preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            scrollTrack.style.animationDuration = '120s'; // Slower for accessibility
        }
        
        // Optional: Add manual scroll control
        let isManualScrolling = false;
        
        scrollTrack.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                isManualScrolling = true;
                scrollTrack.style.animationPlayState = 'paused';
                
                // Resume after a delay
                clearTimeout(scrollTrack.resumeTimeout);
                scrollTrack.resumeTimeout = setTimeout(() => {
                    if (!scrollTrack.matches(':hover')) {
                        scrollTrack.style.animationPlayState = 'running';
                        isManualScrolling = false;
                    }
                }, 2000);
            }
        });
    }
});