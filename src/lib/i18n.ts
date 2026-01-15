/**
 * i18n System - Internacionalización ES/EN
 */

export type Locale = 'es' | 'en';

const LOCALE_KEY = 'kode_locale';

// ============ DICCIONARIOS ============

const translations = {
    es: {
        // Navbar
        'nav.home': 'Inicio',
        'nav.shop': 'Tienda',
        'nav.men': 'Hombre',
        'nav.women': 'Mujer',
        'nav.new': 'Nuevo',
        'nav.sale': 'Ofertas',
        'nav.cart': 'Carrito',
        'nav.account': 'Mi Cuenta',
        'nav.login': 'Iniciar Sesión',
        'nav.register': 'Registrarse',
        'nav.logout': 'Cerrar Sesión',
        'nav.search': 'Buscar productos...',

        // Hero
        'hero.title': 'Nueva Colección',
        'hero.subtitle': 'Descubre las últimas tendencias en moda urbana',
        'hero.cta': 'Explorar Ahora',

        // Categories
        'categories.title': 'Categorías',
        'categories.viewAll': 'Ver Todo',

        // Products
        'products.featured': 'Productos Destacados',
        'products.new': 'Nuevos Productos',
        'products.addToCart': 'Agregar al Carrito',
        'products.viewDetails': 'Ver Detalles',
        'products.outOfStock': 'Agotado',
        'products.sale': 'Oferta',

        // Footer
        'footer.about': 'Sobre Nosotros',
        'footer.help': 'Ayuda',
        'footer.contact': 'Contacto',
        'footer.shipping': 'Envíos',
        'footer.returns': 'Devoluciones',
        'footer.privacy': 'Privacidad',
        'footer.terms': 'Términos',
        'footer.followUs': 'Síguenos',
        'footer.newsletter': 'Suscríbete a nuestro newsletter',
        'footer.emailPlaceholder': 'Tu email',
        'footer.subscribe': 'Suscribirse',
        'footer.rights': 'Todos los derechos reservados',

        // Common
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        'common.retry': 'Reintentar',
        'common.seeMore': 'Ver más',
        'common.seeLess': 'Ver menos',
    },
    en: {
        // Navbar
        'nav.home': 'Home',
        'nav.shop': 'Shop',
        'nav.men': 'Men',
        'nav.women': 'Women',
        'nav.new': 'New',
        'nav.sale': 'Sale',
        'nav.cart': 'Cart',
        'nav.account': 'My Account',
        'nav.login': 'Sign In',
        'nav.register': 'Sign Up',
        'nav.logout': 'Sign Out',
        'nav.search': 'Search products...',

        // Hero
        'hero.title': 'New Collection',
        'hero.subtitle': 'Discover the latest trends in urban fashion',
        'hero.cta': 'Explore Now',

        // Categories
        'categories.title': 'Categories',
        'categories.viewAll': 'View All',

        // Products
        'products.featured': 'Featured Products',
        'products.new': 'New Arrivals',
        'products.addToCart': 'Add to Cart',
        'products.viewDetails': 'View Details',
        'products.outOfStock': 'Out of Stock',
        'products.sale': 'Sale',

        // Footer
        'footer.about': 'About Us',
        'footer.help': 'Help',
        'footer.contact': 'Contact',
        'footer.shipping': 'Shipping',
        'footer.returns': 'Returns',
        'footer.privacy': 'Privacy',
        'footer.terms': 'Terms',
        'footer.followUs': 'Follow Us',
        'footer.newsletter': 'Subscribe to our newsletter',
        'footer.emailPlaceholder': 'Your email',
        'footer.subscribe': 'Subscribe',
        'footer.rights': 'All rights reserved',

        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.retry': 'Retry',
        'common.seeMore': 'See more',
        'common.seeLess': 'See less',
    }
} as const;

export type TranslationKey = keyof typeof translations.es;

// ============ FUNCIONES ============

/**
 * Obtiene el locale actual
 */
export function getLocale(): Locale {
    if (typeof window === 'undefined') return 'es';

    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (stored) return stored;

    // Detectar idioma del navegador
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') return 'en';

    return 'es';
}

/**
 * Guarda el locale
 */
export function setLocale(locale: Locale): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale;
}

/**
 * Obtiene una traducción
 */
export function t(key: TranslationKey, locale?: Locale): string {
    const currentLocale = locale || getLocale();
    return translations[currentLocale][key] || key;
}

/**
 * Obtiene todas las traducciones para un locale
 */
export function getTranslations(locale?: Locale): Record<TranslationKey, string> {
    const currentLocale = locale || getLocale();
    return translations[currentLocale];
}

/**
 * Toggle entre idiomas
 */
export function toggleLocale(): Locale {
    const current = getLocale();
    const next: Locale = current === 'es' ? 'en' : 'es';
    setLocale(next);
    return next;
}

/**
 * Inicializa el locale
 */
export function initLocale(): Locale {
    const locale = getLocale();
    setLocale(locale);
    return locale;
}
