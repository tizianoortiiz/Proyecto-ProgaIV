const hero = document.querySelector('.hero');
const backgroundAudio = document.querySelector('#bg-audio');

if (backgroundAudio) {
    const startAudio = () => {
        backgroundAudio.play().catch(() => {
            
        });
    };

    document.addEventListener('click', startAudio, { once: true, capture: true });
}

if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;

    const updateParallax = () => {
        const offset = Math.max(-70, Math.min(70, window.scrollY * 0.12));
        hero.style.setProperty('--parallax-y', `${offset}px`);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    updateParallax();
}
