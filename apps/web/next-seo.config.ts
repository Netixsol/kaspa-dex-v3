import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Kaspa Finance',
  defaultTitle: 'Kaspa Finance',
  description:
    'Cheaper and faster than Uniswap? Discover Kaspa Finance, the leading DEX on KASPLEX Chain (KAS).',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Kaspa Finance',
    site: '@Kaspa Finance',
  },
  openGraph: {
    title: '👻 Kaspa Finance - A next evolution DeFi exchange on KASPLEX Chain (KAS)',
    description:
      'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by Kaspa Finance), NFTs, and more, on a platform you can trust.',
    images: [{ url: 'https://assets.pancakeswap.finance/web/og/hero.jpg' }],
  },
}
  