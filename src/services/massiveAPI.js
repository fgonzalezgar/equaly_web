// Massive API Service (api.massive.com)
const MASSIVE_API_KEY = 'qkhB7ofhYXj9Ue0bi36KNsXl1A78mjm5';
const MASSIVE_BASE_URL = 'https://api.massive.com';
const CACHE_KEY = 'equaly_stocks_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Popular tickers to fetch - Limited to 5 to avoid rate limiting (free tier: 5 req/min)
const POPULAR_TICKERS = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' }
];

// Stock icons mapping
const STOCK_ICONS = {
    'AAPL': '🍎',
    'MSFT': '💻',
    'GOOGL': '🔍',
    'AMZN': '📦',
    'TSLA': '🚗'
};

// Stock colors mapping
const STOCK_COLORS = {
    'AAPL': '#007AFF',
    'MSFT': '#00A4EF',
    'GOOGL': '#4285F4',
    'AMZN': '#FF9900',
    'TSLA': '#CC0000'
};

/**
 * Get cached stocks from localStorage
 * @returns {Array|null} Cached stocks or null if expired/not found
 */
const getCachedStocks = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
            console.log('📦 Using cached stock data');
            return data;
        }

        console.log('⏰ Cache expired, fetching fresh data');
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
};

/**
 * Save stocks to localStorage cache
 * @param {Array} stocks - Array of stock objects
 */
const setCachedStocks = (stocks) => {
    try {
        const cacheData = {
            data: stocks,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('💾 Stock data cached successfully');
    } catch (error) {
        console.error('Error saving cache:', error);
    }
};

/**
 * Sleep helper function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch previous day's data for a ticker (only 1 API call per stock)
 * @param {string} ticker - Stock ticker symbol
 * @param {string} name - Stock full name
 * @returns {Promise<Object>} Stock data
 */
export const fetchStockPrevData = async (ticker, name) => {
    try {
        const response = await fetch(
            `${MASSIVE_BASE_URL}/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${MASSIVE_API_KEY}`
        );

        if (!response.ok) {
            if (response.status === 429) {
                console.warn(`⚠️ Rate limit hit for ${ticker}`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                symbol: ticker,
                name: name, // Use provided name instead of fetching from API
                price: result.c,
                change: result.c - result.o,
                changePercent: ((result.c - result.o) / result.o) * 100,
                icon: STOCK_ICONS[ticker] || '📈',
                color: STOCK_COLORS[ticker] || '#3B82F6',
                volume: result.v,
                high: result.h,
                low: result.l,
                open: result.o
            };
        }

        return null;
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        return null;
    }
};

/**
 * Fetch all popular stocks with current prices
 * Uses caching and sequential requests to avoid rate limiting
 * FREE TIER: 5 requests per minute (12s minimum between requests)
 * @returns {Promise<Array>} Array of stock objects
 */
export const fetchPopularStocks = async () => {
    // Check cache first
    const cachedStocks = getCachedStocks();
    if (cachedStocks) {
        return cachedStocks;
    }

    try {
        const results = [];

        console.log('🚀 Fetching stock data from Massive API...');

        for (let i = 0; i < POPULAR_TICKERS.length; i++) {
            const { symbol, name } = POPULAR_TICKERS[i];

            try {
                console.log(`🔄 Fetching ${symbol} (${i + 1}/${POPULAR_TICKERS.length})...`);

                // Fetch only price data (1 API call instead of 2)
                const stockData = await fetchStockPrevData(symbol, name);

                if (stockData) {
                    results.push(stockData);
                    console.log(`✅ ${symbol}: $${stockData.price.toFixed(2)} (${stockData.changePercent >= 0 ? '+' : ''}${stockData.changePercent.toFixed(2)}%)`);
                } else {
                    console.warn(`⚠️ Could not fetch data for ${symbol}`);
                }

                // Add delay between requests (except for last stock)
                // 13 seconds ensures we stay below 5 req/min limit
                if (i < POPULAR_TICKERS.length - 1) {
                    console.log(`⏳ Waiting 13s before next request...`);
                    await sleep(13000);
                }

            } catch (error) {
                console.error(`❌ Error fetching ${symbol}:`, error);
            }
        }

        console.log(`🎉 Loaded ${results.length}/${POPULAR_TICKERS.length} stocks successfully`);

        // Cache the results
        if (results.length > 0) {
            setCachedStocks(results);
        }

        return results;
    } catch (error) {
        console.error('Error fetching popular stocks:', error);
        return [];
    }
};

/**
 * Clear the stocks cache
 */
export const clearStocksCache = () => {
    try {
        localStorage.removeItem(CACHE_KEY);
        console.log('🗑️ Cache cleared');
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

export default {
    fetchStockPrevData,
    fetchPopularStocks,
    clearStocksCache,
    POPULAR_TICKERS,
    STOCK_ICONS,
    STOCK_COLORS
};
