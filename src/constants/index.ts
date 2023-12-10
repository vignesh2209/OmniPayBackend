export const CoinGeckoId: Record<string, string> = {
  "84531": "ethereum",
  "80001": "matic-network",
  "421613": "ethereum",
  "5001": "mantle",
  "534351": "ethereum",
};

export const SupportedNetworks = [84531, 80001, 421613, 534351, 5001];

export const coingeckoUrl = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd';

export const bundlerUrls: Record<string, string> = {
    '84531': 'https://basegoerli-bundler.etherspot.io',
    '80001': 'https://mumbai-bundler.etherspot.io',
    '421613': 'https://arbitrumgoerli-bundler.etherspot.io',
    '5001': 'https://mantletestnet-bundler.etherspot.io/',
    '534351': 'https://scrollsepolia-bundler.etherspot.io/',
}

export const PaymasterAddresses: Record<string, string> = {
    '84531': '0x898c530A5fA37720DcF1843AeCC34b6B0cBaEB8a',
    '80001': '0x8350355c08aDAC387b443782124A30A8942BeC2e',
    '421613': '0x898c530A5fA37720DcF1843AeCC34b6B0cBaEB8a',
    '5001': '0xb56eC212C60C47fb7385f13b7247886FFa5E9D5C',
    '534351': '0xe893A26DD53b325BffAacDfA224692EfF4C448c4',
}

export * as PaymasterAbi from './paymasterAbi'
