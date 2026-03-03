
const API_KEY = 'f2565d09491726512ab477f57fb7803af500b42c3ee9518681cfc25e38373138';
const BASE_URL = 'https://api.changenow.io/v2';

// Merchant's receiving address (Where the money goes after conversion)
// In a real app, this should be configurable per coin or a main wallet
// Assuming we want to receive USDT (TRC20) as it's a stablecoin
const MERCHANT_WALLET = 'THPvaUhoh2Qn2y9THCZML3H815hhFhn5YC'; // Example TRC20 address (USDT)

/**
 * Get available currencies (filtered for popular ones)
 */
export const getAvailableCurrencies = async () => {
    // For better UX, we'll stick to a curated list of popular coins supported by ChangeNow
    // fetching all 500+ coins might be slow and overwhelming
    return [
        { ticker: 'btc', name: 'Bitcoin', icon: 'https://changenow.io/images/coins/btc.svg' },
        { ticker: 'eth', name: 'Ethereum', icon: 'https://changenow.io/images/coins/eth.svg' },
        { ticker: 'usdttrc20', name: 'Tether (TRC20)', icon: 'https://changenow.io/images/coins/usdt.svg' },
        { ticker: 'ltc', name: 'Litecoin', icon: 'https://changenow.io/images/coins/ltc.svg' },
        { ticker: 'trx', name: 'Tron', icon: 'https://changenow.io/images/coins/trx.svg' },
        { ticker: 'xrp', name: 'Ripple', icon: 'https://changenow.io/images/coins/xrp.svg' },
        { ticker: 'doge', name: 'Dogecoin', icon: 'https://changenow.io/images/coins/doge.svg' },
        { ticker: 'sol', name: 'Solana', icon: 'https://changenow.io/images/coins/sol.svg' },
        { ticker: 'matic', name: 'Polygon', icon: 'https://changenow.io/images/coins/matic.svg' },
        { ticker: 'bnb', name: 'BNB (BSC)', icon: 'https://changenow.io/images/coins/bnb.svg' }
    ];
};

/**
 * Get estimated amount of crypto required to get target USDT
 * @param {string} fromTicker - Ticker of the coin user is paying with (e.g. 'btc')
 * @param {number} targetUsdAmount - Amount in USD (we assume 1 USD = 1 USDT)
 */
export const getEstimatedAmount = async (fromTicker, targetUsdAmount) => {
    try {
        // Strategy: Get rate for 1 unit of 'from' coin to 'usdttrc20'
        // Then calculate needed amount
        // Limit: ChangeNow min amount checks should be handled

        // 1. Get minimal exchange amount to ensure we are above it
        const minResponse = await fetch(`${BASE_URL}/min-amount/${fromTicker}_usdttrc20?api_key=${API_KEY}`);
        const minData = await minResponse.json();
        const minAmount = minData.minAmount || 0;

        // 2. Get Exchange Rate
        // Asking: How much USDT do I get for 1 unit of FROM?
        // Note: usage of estimated-amount endpoint
        const rateResponse = await fetch(`${BASE_URL}/exchange/estimated-amount?from=${fromTicker}&to=usdttrc20&amount=1&api_key=${API_KEY}`);
        const rateData = await rateResponse.json();

        if (!rateData || !rateData.estimatedAmount) {
            throw new Error('Could not fetch exchange rate');
        }

        const rate = rateData.estimatedAmount; // 1 FROM = rate USDT

        // Calculate required FROM amount to get targetUsdAmount
        // FORMULA: Required = Target / Rate
        const requiredAmount = targetUsdAmount / rate;

        // Add a small buffer (1%) for fluctuations
        const amountWithBuffer = requiredAmount * 1.01;

        return {
            estimatedAmount: amountWithBuffer.toFixed(6), // 6 decimals is usually safe for crypto
            rate: rate,
            minAmount: minAmount,
            valid: amountWithBuffer >= minAmount
        };

    } catch (error) {
        console.error('Error calculating estimate:', error);
        return null;
    }
};

/**
 * Create a transaction
 * @param {string} fromTicker - User's coin
 * @param {number} amount - Amount of user's coin to send
 */
export const createTransaction = async (fromTicker, amount) => {
    try {
        const body = {
            from: fromTicker,
            to: 'usdttrc20', // Merchant receives USDT TRC20
            address: MERCHANT_WALLET, // Merchant's wallet
            amount: amount,
            extraId: '', // Optional
            userId: '', // Optional
            contactEmail: '' // Optional
        };

        const response = await fetch(`${BASE_URL}/exchange`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-changenow-api-key': API_KEY
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return data; // returns { id, payinAddress, ... }

    } catch (error) {
        console.error('Error creating transaction:', error);
        return null;
    }
};

/**
 * Check transaction status
 * @param {string} id - Transaction ID
 */
export const getTransactionStatus = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/exchange/${id}?api_key=${API_KEY}`);
        return await response.json();
    } catch (error) {
        console.error('Error checking status:', error);
        return null;
    }
};

/**
 * Get Buy Crypto Link (Simplex/Guardarian)
 * @param {number} amountUsd 
 */
export const getBuyCryptoUrl = (amountUsd) => {
    // Redirects to ChangeNow Buy interface prefilled
    // We set 'to' as USDTTRC20 and 'address' as Merchant Wallet
    return `https://changenow.io/buy?from=usd&to=usdttrc20&amount=${amountUsd}&recipient=${MERCHANT_WALLET}`;
};


/**
 * Get Widget URL for IFrame embedding
 * @param {number} amountUsd 
 */
export const getWidgetUrl = (amountUsd) => {
    // Constructing the widget URL with parameters to match the app's design
    const params = new URLSearchParams({
        amount: amountUsd,
        from: 'usd',
        to: 'usdttrc20',
        toTheMoon: 'true', // Enables "Buy" mode often
        isFiat: 'true',
        lang: 'es-ES',
        darkMode: 'true',
        backgroundColor: '111827', // App background
        primaryColor: '10B981', // App Green
        logo: 'false',
        recipient: MERCHANT_WALLET // Attempt to prefill
    });

    return `https://changenow.io/embeds/exchange-widget/v2/widget.html?${params.toString()}`;
};
