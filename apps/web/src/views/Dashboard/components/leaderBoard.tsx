import styled from 'styled-components'
import { Flex, IconButton as UiKitIconButton, Text, Box, ProfileAvatar } from '@pancakeswap/uikit'
import { AvatarContainer, AvatarImage, CrownBadge, DashBox, PositionLabel } from '../style'
import { ShareIcon } from '../icons/share.ico'
import { CrownIcon } from '../icons/crown.ico'
import { ContentBox } from '../liquidityProvision'

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
      <Box paddingTop="40px">
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
      </Box>
      <Flex width="100%" flexDirection="column" marginTop="20px" style={{ gap: '10px' }}>
        <ContentBox style={{ padding: '0px' }}>
          <Flex justifyContent="space-between" alignItems="center" position="relative">
            {/* Column 1 */}
            <Box width="20%" position="relative" style={{ alignSelf: 'stretch' }}>
              <Text height="100%" paddingTop="auto" textAlign="center" style={{ placeContent: 'center' }}>
                4
              </Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Box>

            {/* Column 2 */}
            <Flex
              style={{ gap: '10px' }}
              alignItems="center"
              width="40%"
              paddingX="16px"
              paddingY="10px"
              position="relative"
            >
              <ProfileAvatar
                width={44}
                height={44}
                style={{
                  border: 'none',
                  flexShrink: 0,
                }}
              />
              <Text> @Jhon</Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Flex>

            {/* Column 3 */}
            <Box width="40%" paddingX="16px">
              <Text fontSize="14px" color="#1FD26F">
                18000 points
              </Text>
            </Box>
          </Flex>
        </ContentBox>
        <ContentBox style={{ padding: '0px' }}>
          <Flex justifyContent="space-between" alignItems="center" position="relative">
            {/* Column 1 */}
            <Box width="20%" position="relative" style={{ alignSelf: 'stretch' }}>
              <Text height="100%" textAlign="center" paddingTop="auto" style={{ placeContent: 'center' }}>
                4
              </Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Box>

            {/* Column 2 */}
            <Flex
              style={{ gap: '10px' }}
              alignItems="center"
              width="40%"
              paddingX="16px"
              paddingY="10px"
              position="relative"
            >
              <ProfileAvatar
                width={44}
                height={44}
                style={{
                  border: 'none',
                  flexShrink: 0,
                }}
              />
              <Text> @Jhon</Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Flex>

            {/* Column 3 */}
            <Box width="40%" paddingX="16px">
              <Text fontSize="14px" color="#1FD26F">
                18000 points
              </Text>
            </Box>
          </Flex>
        </ContentBox>
        <ContentBox style={{ padding: '0px' }}>
          <Flex justifyContent="space-between" alignItems="center" position="relative">
            {/* Column 1 */}
            <Box width="20%" position="relative" style={{ alignSelf: 'stretch' }}>
              <Text height="100%" paddingTop="auto" style={{ placeContent: 'center' }}>
                4
              </Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Box>

            {/* Column 2 */}
            <Flex
              style={{ gap: '10px' }}
              alignItems="center"
              width="40%"
              paddingX="16px"
              paddingY="10px"
              position="relative"
            >
              <ProfileAvatar
                width={44}
                height={44}
                style={{
                  border: 'none',
                  flexShrink: 0,
                }}
              />
              <Text> @Jhon</Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Flex>

            {/* Column 3 */}
            <Box width="40%" paddingX="16px">
              <Text fontSize="14px" color="#1FD26F">
                18000 points
              </Text>
            </Box>
          </Flex>
        </ContentBox>
        <ContentBox style={{ padding: '0px' }}>
          <Flex justifyContent="space-between" alignItems="center" position="relative">
            {/* Column 1 */}
            <Box width="20%" position="relative" style={{ alignSelf: 'stretch' }}>
              <Text height="100%" paddingTop="auto" style={{ placeContent: 'center' }}>
                4
              </Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Box>

            {/* Column 2 */}
            <Flex
              style={{ gap: '10px' }}
              alignItems="center"
              width="40%"
              paddingX="16px"
              paddingY="10px"
              position="relative"
            >
              <ProfileAvatar
                width={44}
                height={44}
                style={{
                  border: 'none',
                  flexShrink: 0,
                }}
              />
              <Text> @Jhon</Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Flex>

            {/* Column 3 */}
            <Box width="40%" paddingX="16px">
              <Text fontSize="14px" color="#1FD26F">
                18000 points
              </Text>
            </Box>
          </Flex>
        </ContentBox>
        <ContentBox style={{ padding: '0px' }}>
          <Flex justifyContent="space-between" alignItems="center" position="relative">
            {/* Column 1 */}
            <Box width="20%" position="relative" style={{ alignSelf: 'stretch' }}>
              <Text height="100%" paddingTop="auto" style={{ placeContent: 'center' }}>
                4
              </Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Box>

            {/* Column 2 */}
            <Flex
              style={{ gap: '10px' }}
              alignItems="center"
              width="40%"
              paddingX="16px"
              paddingY="10px"
              position="relative"
            >
              <ProfileAvatar
                width={44}
                height={44}
                style={{
                  border: 'none',
                  flexShrink: 0,
                }}
              />
              <Text> @Jhon</Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Flex>

            {/* Column 3 */}
            <Box width="40%" paddingX="16px">
              <Text fontSize="14px" color="#1FD26F">
                18000 points
              </Text>
            </Box>
          </Flex>
        </ContentBox>
        <ContentBox style={{ padding: '0px' }}>
          <Flex justifyContent="space-between" alignItems="center" position="relative">
            {/* Column 1 */}
            <Box width="20%" position="relative" style={{ alignSelf: 'stretch' }}>
              <Text height="100%" paddingTop="auto" style={{ placeContent: 'center' }}>
                4
              </Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Box>

            {/* Column 2 */}
            <Flex
              style={{ gap: '10px' }}
              alignItems="center"
              width="40%"
              paddingX="16px"
              paddingY="10px"
              position="relative"
            >
              <ProfileAvatar
                width={44}
                height={44}
                style={{
                  border: 'none',
                  flexShrink: 0,
                }}
              />
              <Text> @Jhon</Text>
              {/* Right separator */}
              <Box
                position="absolute"
                right="0"
                top="50%"
                style={{ transform: 'translateY(-50%)', height: '60%' }}
                width="2px"
                backgroundColor="#252136"
              />
            </Flex>

            {/* Column 3 */}
            <Box width="40%" paddingX="16px">
              <Text fontSize="14px" color="#1FD26F">
                18000 points
              </Text>
            </Box>
          </Flex>
        </ContentBox>
      </Flex>
    </DashBox>
  )
}
