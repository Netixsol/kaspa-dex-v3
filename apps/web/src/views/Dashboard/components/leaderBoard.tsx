import styled from 'styled-components'
import { Flex, IconButton as UiKitIconButton, Text, Box, ProfileAvatar } from '@pancakeswap/uikit'
import { AvatarContainer, AvatarImage, CrownBadge, DashBox, PositionLabel } from '../style'
import { ShareIcon } from '../icons/share.ico'
import { CrownIcon } from '../icons/crown.ico'

const IconButton = styled(UiKitIconButton)`
  background: transparent;
  padding: 0px;
`
interface LeaderboardAvatarProps {
  imageUrl: string
  position: 1 | 2 | 3
  labelText: string
  avatarSize?: number // Base avatar size (px)
  crownScale?: number // Multiplier for crown size (0.8, 1, 1.2 etc)
  labelScale?: number // Multiplier for label size
}
const Row = styled.div`
  display: contents;
  align-items: center;

  & > div {
    padding: 16px 33px 16px 33px;
    font-size: 14px;
    font-weight: 400;
    margin-top: 20px;
    background: #120f1f;
    position: relative;
    width: 100%;
    &:first-child {
      width: 10px;
    }
    &:not(:first-child)::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 60%;
      width: 2px;
      background-color: #252136;
    }
  }
`
const LeaderboardAvatar = ({
  imageUrl,
  position,
  labelText,
  avatarSize = 80,
  crownScale = 1,
  labelScale = 1,
}: LeaderboardAvatarProps) => {
  // Dynamic sizing calculations
  const baseCrownSize = avatarSize * 0.4 // Crown scales with avatar
  const labelHeight = avatarSize * 0.25

  const crownSizes = {
    1: { size: baseCrownSize * crownScale, color: '#ffffff' },
    2: { size: baseCrownSize * crownScale, color: '#1fd26f' },
    3: { size: baseCrownSize * crownScale, color: '#ffffff' },
  }

  return (
    <AvatarContainer $size={avatarSize}>
      <CrownBadge $position={position} $avatarSize={avatarSize} $crownSize={crownSizes[position].size}>
        {position !== 1 ? (
          <CrownIcon
            //   size={crownSizes[position].size * 0.6} // Icon size within SVG container
            width={crownSizes[position].size}
            height={crownSizes[position].size}
            //   viewBox="0 0 64 51"
            viewBox="0 0 27 19"
            fill="none"
            color={crownSizes[position].color}
            //   fill={position === 1 ? 'gold' : 'none'}
          />
        ) : (
          <img src="/crown.png" alt="crown" />
        )}
      </CrownBadge>

      <AvatarImage src={imageUrl} alt="User avatar" $size={avatarSize} />

      <PositionLabel $position={position} $avatarSize={avatarSize} $labelScale={labelScale} $labelHeight={labelHeight}>
        {labelText}
      </PositionLabel>
    </AvatarContainer>
  )
}
export const LeaderBoard = ({ title }) => {
  return (
    <DashBox style={{ width: '100%', flexGrow: 5 }}>
      <Flex alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Text fontSize="24px" fontWeight={500}>
          {title}
        </Text>
        <IconButton width="24px" height="10px">
          <ShareIcon color="#ffffff" width="24" height="22" viewBox="0 0 24 22" fill="none" />
        </IconButton>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" justifyContent="center" alignItems="center" style={{ gap: 10 }}>
          <LeaderboardAvatar
            labelText="2"
            position={2}
            imageUrl="https://as2.ftcdn.net/v2/jpg/03/25/73/59/1000_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg"
            avatarSize={70}
            crownScale={1}
          />
          <Box>
            <Text textAlign="center">@hilary</Text>
            <Text textAlign="center" color="#1FD26F" fontSize="14px">
              25000 Points
            </Text>
          </Box>
        </Flex>
        <Flex flexDirection="column" justifyContent="center" alignItems="center" style={{ gap: 10 }}>
          <LeaderboardAvatar
            labelText="1"
            position={1}
            imageUrl="https://as2.ftcdn.net/v2/jpg/03/25/73/59/1000_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg"
            avatarSize={90}
            crownScale={2}
          />
          <Box>
            <Text textAlign="center">@tessa</Text>
            <Text textAlign="center" color="#1FD26F" fontSize="14px">
              32000 Points
            </Text>
          </Box>
        </Flex>
        <Flex flexDirection="column" justifyContent="center" alignItems="center" style={{ gap: 10 }}>
          <LeaderboardAvatar
            labelText="3"
            position={3}
            imageUrl="https://as2.ftcdn.net/v2/jpg/03/25/73/59/1000_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg"
            avatarSize={70}
            crownScale={1}
          />
          <Box>
            <Text textAlign="center">@roland</Text>
            <Text textAlign="center" color="#1FD26F" fontSize="14px">
              25000 Points
            </Text>
          </Box>
        </Flex>
        {/* <LeaderboardAvatar
          labelText="1"
          position={1}
          imageUrl="https://as2.ftcdn.net/v2/jpg/03/25/73/59/1000_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg"
          avatarSize={90}
          crownScale={2}
        />
        <LeaderboardAvatar
          labelText="3"
          position={3}
          imageUrl="https://as2.ftcdn.net/v2/jpg/03/25/73/59/1000_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg"
          avatarSize={70}
          crownScale={1}
          /> */}
      </Flex>
      <Flex width="100%">
        <Row>
          <div
            style={{
              borderRadius: '10px 0 0 10px',
            }}
          >
            <Flex alignItems="center" height="100%">
              <Text>4</Text>
            </Flex>
          </div>
          <div
            style={{
              borderRadius: '0',
            }}
          >
            <Flex style={{ gap: '10px' }} alignItems="center">
              <ProfileAvatar width={44} height={44} style={{ border: 'none' }} />
              <Text> @Jhon</Text>
            </Flex>
          </div>
          <div
            style={{
              borderRadius: '0 10px 10px 0',
            }}
          >
            <Flex alignItems="center" height="100%">
              <Text>32000 points</Text>
            </Flex>
          </div>
        </Row>
      </Flex>
    </DashBox>
  )
}
