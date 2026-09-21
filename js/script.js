const hero = document.querySelector('.hero');
const backgroundAudio = document.querySelector('#bg-audio');
const dropdownTrigger = document.querySelector('.has-dropdown > a');

const loadPageWithoutReload = async (url, { updateHistory = true } = {}) => {
    try {
        const response = await fetch(url.href);

        if (!response.ok) {
            throw new Error(`No se pudo cargar ${url.href}`);
        }

        const pageHTML = await response.text();
        const parsedPage = new DOMParser().parseFromString(pageHTML, 'text/html');
        const nextMain = parsedPage.querySelector('main');
        const currentMain = document.querySelector('main');

        if (!nextMain || !currentMain) {
            throw new Error('La página no contiene un elemento main válido.');
        }

        currentMain.replaceWith(nextMain);
        document.title = parsedPage.title;

        if (updateHistory) {
            window.history.pushState({}, '', url.href);
        }

        document.querySelector('.has-dropdown')?.classList.remove('is-open');
        document.querySelector('.has-dropdown > a')?.setAttribute('aria-expanded', 'false');
        window.scrollTo(0, 0);
        window.dispatchEvent(new CustomEvent('pagecontentloaded'));
    } catch {
        window.location.href = url.href;
    }
};

document.addEventListener('click', (event) => {
    const link = event.target.closest('a');

    if (!link || link.target === '_blank' || link.hasAttribute('download')) {
        return;
    }

    const url = new URL(link.href, window.location.href);
    const isInternalPage = url.origin === window.location.origin && url.pathname.endsWith('.html');

    if (link === dropdownTrigger
        && window.matchMedia('(max-width: 900px)').matches
        && !dropdownTrigger.parentElement.classList.contains('is-open')) {
        event.preventDefault();
        dropdownTrigger.parentElement.classList.add('is-open');
        dropdownTrigger.setAttribute('aria-expanded', 'true');
        return;
    }

    if (isInternalPage && !url.hash) {
        event.preventDefault();
        loadPageWithoutReload(url);
    }
});

window.addEventListener('popstate', () => {
    loadPageWithoutReload(new URL(window.location.href), { updateHistory: false });
});

if (dropdownTrigger) {
    const dropdownItem = dropdownTrigger.parentElement;

    document.addEventListener('click', (event) => {
        if (!dropdownItem.contains(event.target)) {
            dropdownItem.classList.remove('is-open');
            dropdownTrigger.setAttribute('aria-expanded', 'false');
        }
    });
}

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
