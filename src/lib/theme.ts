/**
 * Theme System - Toggle Claro/Oscuro
 * 
 * Maneja el tema de la aplicación con persistencia en localStorage
 */

export type Theme = 'light' | 'dark';

const THEME_KEY = 'kode_theme';

/**
 * Obtiene el tema actual
 */
export function getTheme(): Theme {
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored) return stored;

    // Detectar preferencia del sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
}

/**
 * Aplica el tema al documento
 */
export function applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Guarda el tema en localStorage
 */
export function saveTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * Toggle entre temas
 */
export function toggleTheme(): Theme {
    const current = getTheme();
    const next: Theme = current === 'light' ? 'dark' : 'light';
    saveTheme(next);
    applyTheme(next);
    return next;
}

/**
 * Inicializa el tema al cargar la página
 */
export function initTheme(): void {
    const theme = getTheme();
    applyTheme(theme);
    saveTheme(theme);
}
