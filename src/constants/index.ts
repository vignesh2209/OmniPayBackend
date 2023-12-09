// Markup price for gas price calculation in usd to nullify the transactions which consumes more at the time of submitting
export const Markup: Record<string, number> = {
    '84531': 0.2,
    '80001': 0.2,
    '421613': 0.2,
    '5001': 0.2,
    '534351': 0.2,
}

export const CoinGeckoId: Record<string, string> = {
    '84531': 'ethereum',
    '80001': 'matic-network',
    '421613': 'ethereum',
    '5001': 'mantle',
    '534351': 'ethereum',
}

export const SupportedNetworks = [84531, 80001, 421613, 534351, 5001];

export const coingeckoUrl = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd';