import Link from 'next/link'
import Cookies from 'js-cookie'
import { Box, Flex as UiKitFlex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { usePathname } from 'next/navigation'
import TradingIcon from '../icons/trading.ico'
import SocialIcon from '../icons/social.ico'
import { LiquidityIcon } from '../icons/liquidity.ico'
import { FarmingIcon } from '../icons/farming.ico'
import { MilestoneRewardsIcon } from '../icons/milstone-rewards'
import { UpdateIcon } from '../icons/update.ico'
import { MultipliersIcon } from '../icons/multipliers.ico'
import { PreLaunch } from '../icons/launch.ico'
import { LaunchWeek } from '../icons/launchweek.ico'
import { EngagmentIcons } from '../icons/engagments.ico'
import { routePermissions } from '../types/enums'
import { LockedIcon } from '../icons/lock.ico'

interface MenuWrapperProps {
  isBorder?: boolean
}

interface MenuItemProps {
  isActive?: boolean
}

const SideBarWrapper = styled(Box)`
  max-width: 310px;
  width: 100%;
  background: #252136;
  margin: 2px 0px;
`

const Flex = styled(UiKitFlex)`
  width: 100%;
`
// Styled components
const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0;
  border-radius: 5px;
`
const MenuItemsWrapper = styled.div<MenuWrapperProps>`
  padding: 19px 0px;
  border-bottom: ${({ isBorder, theme }) => (isBorder ? `1px solid ${theme.colors.background}` : 'none')};
`
const MenuItem = styled.button<MenuItemProps>`
  display: flex;
  align-items: center;
  padding: 10px 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  border: none;
  border-radius: 10px;
  background: ${({ isActive, theme }) => (isActive ? theme.colors.background : 'none')};
  color: ${({ isActive, theme }) => isActive && theme.colors.primary}; /* Green color on hover */
  svg path {
    fill: ${({ isActive, theme }) => isActive && theme.colors.primary}; /* Change SVG color on hover */
  }

  &:hover {
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary}; /* Green color on hover */
    svg path {
      fill: ${({ theme }) => theme.colors.primary}; /* Change SVG color on hover */
    }
    &:disabled {
      color: ${({ theme }) => theme.colors.textDisabled}; /* Green color on hover */
      svg path {
        fill: ${({ theme }) => theme.colors.textDisabled};
      } /* Change SVG color on hover */
    }
  }
`

const MenuText = styled.span`
  font-size: 14px;
  overflow-wrap: break-word;
`
const MenuIcon = styled.div`
  margin-right: 10px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
  }
`
const menuItems = [
  {
    icon: <SocialIcon width="20" height="19" viewBox="0 0 20 19" fill="none" />,
    href: '/dashboard/socialmedia-amplification',
    text: 'Social Media Amplification',
  },
  {
    icon: <LiquidityIcon width="20" height="26" viewBox="0 0 20 26" fill="none" />,
    href: '/dashboard/liquidity-provision',
    text: 'Liquidity Provision',
  },
  { icon: <TradingIcon style={{ rotate: '90deg' }} />, href: '/dashboard/trading-swap', text: 'Trading & Swaps' },
  {
    icon: <FarmingIcon width="20" height="20" viewBox="0 0 20 20" fill="none" />,
    href: '/dashboard/farming-staking',
    text: 'Farming & Staking',
  },
  { icon: <TradingIcon />, href: '/dashboard/migrate-lps', text: 'Migrate LPs' },
  {
    icon: <MilestoneRewardsIcon width="20" height="20" viewBox="0 0 20 20" fill="none" />,
    href: '/dashboard/milestone-rewards',
    text: 'Bonus Quests & Milestone Rewards',
  },
  {
    icon: <UpdateIcon width="20" height="20" viewBox="0 0 20 20" fill="none" />,
    href: '/dashboard/realtime-update',
    text: 'Real-Time Updates',
  },
  {
    icon: <MultipliersIcon width="20" height="20" viewBox="0 0 20 20" fill="none" />,
    href: '/dashboard/multipliers-bounses',
    text: 'Multipliers & Bonuses',
  },
  {
    icon: <PreLaunch width="14" height="20" viewBox="0 0 14 20" fill="none" />,
    href: '/dashboard/pre-launch',
    text: 'Pre-Launch',
  },
  {
    icon: <LaunchWeek width="20" height="20" viewBox="0 0 20 20" fill="none" />,
    href: '/dashboard/launch-week',
    text: 'Launch Week',
  },
  {
    icon: <EngagmentIcons width="20" height="20" viewBox="0 0 20 20" fill="none" />,
    href: '/dashboard/ongoing-engagments',
    text: 'Ongoing Engagement',
  },
]
const SideBar = () => {
  const pathname = usePathname()

  // Safely get permissions with fallback

  let permissions = {}
  // console.log(JSON.parse(Cookies.get('permissions')), 'JSON.parse(Cookies.get())')
  try {
    permissions = JSON.parse(Cookies.get('permissions'))
  } catch (error) {
    console.error('Error parsing permissions:', error)
  }

  const defaultRoute = '/dashboard/socialmedia-amplification'
  return (
    <SideBarWrapper>
      <Box padding="34px">
        <Flex width="100%" flexDirection="column">
          <MenuContainer>
            {menuItems.map((item, index) => {
              const requiredPermission = routePermissions[item.href as keyof typeof routePermissions]
              console.log(requiredPermission, 'requiredPermission', permissions)
              const hasPermission =
                (requiredPermission !== undefined && permissions !== undefined && permissions !== null
                  ? permissions[requiredPermission]
                  : false) || item.href === defaultRoute
              return (
                <MenuItemsWrapper isBorder={index !== menuItems.length - 1}>
                  <Link href={item.href} passHref>
                    <MenuItem key={item?.text} disabled={!hasPermission} isActive={pathname === item.href}>
                      <MenuIcon>{item?.icon}</MenuIcon>
                      <MenuText>{item?.text}</MenuText>
                      {!hasPermission && (
                        <MenuIcon style={{ marginLeft: 'auto' }}>
                          <LockedIcon width="18" height="21" viewBox="0 0 18 21" fill="none" />
                        </MenuIcon>
                      )}
                    </MenuItem>
                  </Link>
                </MenuItemsWrapper>
              )
            })}
          </MenuContainer>
        </Flex>
      </Box>
    </SideBarWrapper>
  )
}

export default SideBar
