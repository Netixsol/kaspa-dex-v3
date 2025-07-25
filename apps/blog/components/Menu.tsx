import { Box, Flex, Logo, ThemeSwitcher, Link, Button, LangSelector } from '@pancakeswap/uikit'
import { useTheme as useNextTheme } from 'next-themes'
import { useTranslation, languageList } from '@pancakeswap/localization'
import { useTheme } from '@pancakeswap/hooks'
import NoSSR from 'components/NoSSR'

const Menu = () => {
  const theme = useTheme()
  const { setTheme } = useNextTheme()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const isDark = true

  return (
    <Flex height="56px" bg="backgroundAlt" px="16px" alignItems="center" justifyContent="space-between" zIndex={9}>
      <Flex>
        <Logo href="/" />
      </Flex>
      <Flex alignItems="center">
        <NoSSR>
          <Box mr="16px">
            <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme('dark')} />
          </Box>
        </NoSSR>
        <LangSelector
          buttonScale="xs"
          color="textSubtle"
          hideLanguage
          currentLang={currentLanguage.code}
          langs={languageList}
          setLang={setLanguage}
        />
        {/* <Link external href="https://pancakeswap.finance/"> */}
        <Link external href="/">
          <Button scale="sm">{t('Launch App')}</Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default Menu
