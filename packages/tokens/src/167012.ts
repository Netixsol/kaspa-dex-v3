import { ChainId, ERC20Token } from '@pancakeswap/sdk'
// TODO Add Tokens for Kasplex here
export const kasplexTokens = {
  usdt: new ERC20Token(ChainId.KASPLEX_TESTNET, '0xEcff9AabD043e49C450A73808c7a16Aa96e2000F', 18, 'USDT', 'USDT'),
  ksp: new ERC20Token(ChainId.KASPLEX_TESTNET, '0x4ab2780eb419A360cefd46631769B6EB6d34D869', 18, 'KSP', 'Kasperium'),
  // ksd: new ERC20Token(ChainId.KASPLEX_TESTNET, '0x05dc5256c4dC48fBCC3A1879B039989BB68D4453', 18, 'KSD', 'KasDoge'),
  // ksm: new ERC20Token(ChainId.KASPLEX_TESTNET, '0x4541Bb227B999fD206bbe2D108CBBD47b6926335', 18, 'KSM', 'kasMeme'),
  kfc: new ERC20Token(
    ChainId.KASPLEX_TESTNET,
    '0xf87e587AB945F7B111329a6ace6dc497D34f098B',
    18,
    'KFC',
    'Kaspa Finance',
  ),
  blk: new ERC20Token(ChainId.KASPLEX_TESTNET, '0x9cbF7D0146d0bbD1F8294bBAD2bb6208A0b85cFf', 18, 'BLK', 'Blokkplay'),
  fnc: new ERC20Token(
    ChainId.KASPLEX_TESTNET,
    '0x8869040c9AFABDAbC6D0Dc773D4c98a681BA4a92',
    18,
    'FCN',
    'Fight Club Network',
  ),
  gem: new ERC20Token(ChainId.KASPLEX_TESTNET, '0xC6173Ed9c6EBF8A56C633C64887833f0De4b75e8', 18, 'GEM', 'Gem Launch'),
  stat: new ERC20Token(ChainId.KASPLEX_TESTNET, '0x4fECeb643DeDF73c4BC17aB743De7C349470be3f', 18, 'STAT', 'StatBreak'),
  usdc: new ERC20Token(ChainId.KASPLEX_TESTNET, '0x593Cd4124ffE9D11B3114259fbC170a5759E0f54', 18, 'USDC', 'USD Coin'),
  kas: new ERC20Token(ChainId.KASPLEX_TESTNET, '0x0000000000000000000000000000000000000000', 18, 'KAS', 'Kaspa'),
}

export const kasplexTokensListForUI = {
  // kas: { ...kasplexTokens.kas },
  usdc: { ...kasplexTokens.usdc },
  usdt: { ...kasplexTokens.usdt },
  kfc: { ...kasplexTokens.kfc },
  blk: { ...kasplexTokens.blk },
  fnc: { ...kasplexTokens.fnc },
  gem: { ...kasplexTokens.gem },
}
