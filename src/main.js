// Main JavaScript
import { initTheme } from './js/theme.js';
import { initCursor } from './js/cursor.js';
import { initAnimations } from './js/animations.js';
import { initNavigation } from './js/navigation.js';
import { initExplorer } from './js/explorer.js';
import { SimpleQuoteModal } from './simple-quote.js';

console.log('ARCH. Digital Studio loaded');

// Initialize modules
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCursor();
    initAnimations();
    initNavigation();
    initExplorer();
    new SimpleQuoteModal();
});
