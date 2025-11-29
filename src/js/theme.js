export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const backgroundGradient = document.querySelector('.background-gradient');
    const themedSections = document.querySelectorAll('[data-bg-theme]');

    // Check local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    if (backgroundGradient && themedSections.length) {
        const backgroundObserver = new IntersectionObserver((entries) => {
            const inView = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!inView) return;
            const theme = inView.target.getAttribute('data-bg-theme');
            if (theme) {
                backgroundGradient.setAttribute('data-theme', theme);
            }
        }, { threshold: 0.5 });

        themedSections.forEach(section => backgroundObserver.observe(section));
    }
}
