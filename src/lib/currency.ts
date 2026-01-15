/**
 * Currency System - Selector de Moneda CLP/USD
 */

export type Currency = 'CLP' | 'USD';

const CURRENCY_KEY = 'kode_currency';

// Tasa de conversión aproximada (CLP por 1 USD)
const USD_TO_CLP_RATE = 950;

// ============ CONFIGURACIÓN ============

const currencyConfig: Record<Currency, {
    symbol: string;
    code: string;
    locale: string;
    decimals: number;
}> = {
    CLP: {
        symbol: '$',
        code: 'CLP',
        locale: 'es-CL',
        decimals: 0,
    },
    USD: {
        symbol: '$',
        code: 'USD',
        locale: 'en-US',
        decimals: 2,
    },
};

// ============ FUNCIONES ============

/**
 * Obtiene la moneda actual
 */
export function getCurrency(): Currency {
    if (typeof window === 'undefined') return 'CLP';

    const stored = localStorage.getItem(CURRENCY_KEY) as Currency | null;
    return stored || 'CLP';
}

/**
 * Guarda la moneda
 */
export function setCurrency(currency: Currency): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CURRENCY_KEY, currency);
}

/**
 * Convierte precio de CLP a la moneda seleccionada
 * Los precios en el backend están en CLP
 */
export function convertPrice(priceCLP: number, to?: Currency): number {
    const currency = to || getCurrency();

    if (currency === 'CLP') return priceCLP;
    if (currency === 'USD') return priceCLP / USD_TO_CLP_RATE;

    return priceCLP;
}

/**
 * Formatea un precio en la moneda seleccionada
 */
export function formatPrice(priceCLP: number, currency?: Currency): string {
    const curr = currency || getCurrency();
    const config = currencyConfig[curr];
    const converted = convertPrice(priceCLP, curr);

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
    }).format(converted);
}

/**
 * Toggle entre monedas
 */
export function toggleCurrency(): Currency {
    const current = getCurrency();
    const next: Currency = current === 'CLP' ? 'USD' : 'CLP';
    setCurrency(next);
    return next;
}

/**
 * Obtiene la configuración de la moneda
 */
export function getCurrencyConfig(currency?: Currency) {
    const curr = currency || getCurrency();
    return currencyConfig[curr];
}

/**
 * Inicializa la moneda
 */
export function initCurrency(): Currency {
    const currency = getCurrency();
    setCurrency(currency);
    return currency;
}
