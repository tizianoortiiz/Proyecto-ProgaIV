const hero = document.querySelector('.hero');
const backgroundAudio = document.querySelector('#bg-audio');

if (backgroundAudio) {
    const savedTime = Number(sessionStorage.getItem('spiderVerseAudioTime'));

    if (Number.isFinite(savedTime) && savedTime > 0) {
        backgroundAudio.currentTime = savedTime;
    }

    const startAudio = () => {
        backgroundAudio.muted = false;
        backgroundAudio.defaultMuted = false;
        backgroundAudio.volume = 1;

        backgroundAudio.play().catch(() => {
            // El navegador puede bloquear el audio hasta una interacción válida.
        });
    };

    window.addEventListener('pagehide', () => {
        sessionStorage.setItem('spiderVerseAudioTime', String(backgroundAudio.currentTime));
    });

    startAudio();
    document.addEventListener('pointerdown', startAudio, { once: true, capture: true });
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
