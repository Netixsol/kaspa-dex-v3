import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import {
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  InstagramIcon,
  GithubIcon,
  DiscordIcon,
  YoutubeIcon,
  MediumIcon,
  GitBook,
} from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.pancakeswap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://blog.pancakeswap.finance/",
      },
      {
        label: "Community",
        href: "https://docs.pancakeswap.finance/contact-us/telegram",
      },
      {
        label: "CAKE",
        href: "https://docs.pancakeswap.finance/tokenomics/cake",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://pancakeswap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.pancakeswap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.pancakeswap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.pancakeswap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/pancakeswap",
      },
      {
        label: "Documentation",
        href: "https://docs.pancakeswap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.pancakeswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.pancakeswap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Telegram",
    icon: TelegramIcon,
    href: "https://t.me/KaspaFinanceIO",
    // items: [
    //   {
    //     label: "English",
    //     href: "https://t.me/pancakeswap",
    //   },
    //   {
    //     label: "Bahasa Indonesia",
    //     href: "https://t.me/pancakeswapIndonesia",
    //   },
    //   {
    //     label: "中文",
    //     href: "https://t.me/pancakeswap_CN",
    //   },
    //   {
    //     label: "Tiếng Việt",
    //     href: "https://t.me/PancakeSwapVN",
    //   },
    //   {
    //     label: "Italiano",
    //     href: "https://t.me/pancakeswap_Ita",
    //   },
    //   {
    //     label: "русский",
    //     href: "https://t.me/pancakeswap_ru",
    //   },
    //   {
    //     label: "Türkiye",
    //     href: "https://t.me/pancakeswapturkiye",
    //   },
    //   {
    //     label: "Português",
    //     href: "https://t.me/pancakeswapPortuguese",
    //   },
    //   {
    //     label: "Español",
    //     href: "https://t.me/pancakeswapES",
    //   },
    //   {
    //     label: "日本語",
    //     href: "https://t.me/pancakeswapJP",
    //   },
    //   {
    //     label: "Français",
    //     href: "https://t.me/pancakeswapFR",
    //   },
    //   {
    //     label: "Filipino",
    //     href: "https://t.me/pancakeswap_PH",
    //   },
    //   {
    //     label: "हिन्दी",
    //     href: "https://t.me/pancakeswap_INDIA",
    //   },
    //   {
    //     label: "한국어",
    //     href: "https://t.me/PancakeSwapSouthKorea",
    //   },
    //   {
    //     label: "Announcements",
    //     href: "https://t.me/PancakeSwapAnn",
    //   },
    // ],
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/KaspaFinance",
  },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "https://www.youtube.com/@KaspaFinance",
  },
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://x.com/KaspaFinance",
  },
  {
    label: "GitBook",
    icon: GitBook,
    href: "https://kaspa-finance.gitbook.io/kaspa-finance-whitepaper",
  },
  {
    label: "Medium",
    icon: MediumIcon,
    href: "https://medium.com/@kaspafinance",
  },
  // {
  //   label: "Reddit",
  //   icon: RedditIcon,
  //   href: "https://reddit.com/r/pancakeswap",
  // },
  // {
  //   label: "Instagram",
  //   icon: InstagramIcon,
  //   href: "https://instagram.com/pancakeswap_official",
  // },
  // {
  //   label: "Discord",
  //   icon: DiscordIcon,
  //   href: "https://discord.gg/pancakeswap",
  // },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
