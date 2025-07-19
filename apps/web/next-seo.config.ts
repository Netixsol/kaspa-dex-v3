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
      'Discover the most used AMM on KASPLEX! Farm KFC tokens, take part in innovative token launches through Initial Farm Offerings by Kaspa Finance, collect unique NFTs, and enjoy a reliable, community-driven platform.',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0644/1566/2164/files/meta_icon_6edb7aaf-4504-43fc-8c16-4c87bfebe241.png' }],
  },
}
