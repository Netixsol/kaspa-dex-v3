import { Button, Flex, Heading, Text, Box as UiKitBox } from '@pancakeswap/uikit'
import styled from 'styled-components'
import TickIcon from '../icons/tick.ico'
import { ArrowIcon } from '../icons/arrow.ico'

const Box = styled(UiKitBox)`
  background: ${({ theme }) => theme.colors.background};
  padding-inline: 30px;
  padding-block: 18px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 10px;
  align-items: stretch;
  /* max-width: 362px; */
  min-height: 175px;
  height: 100%;
  width: 100%;
`

const ResponsiveFlexCover = styled(Flex)`
  @media (max-width: 575px) {
    flex-direction: column;
  }
`

const ResponsiveFlexArrowIcon = styled(Flex)`
  @media (max-width: 575px) {
    transform: rotate(90deg);
    width: 35px;
    height: 84px;
  }
`

const MigrateTokens = () => {
  return (
    <>
      <ResponsiveFlexCover alignItems="center" height="100%">
        <Box marginRight={['0px', null, '-10px']} marginBottom={['-10px', null, '0px']}>
          <Heading scale="xxl" color="#1FD26F">
            $1,000
          </Heading>
          <Text fontSize="18px">ZealousSwap/ Kaspa V2</Text>
          <Flex alignItems="center" marginTop="auto">
            <Flex
              width={28}
              height={28}
              borderRadius="100%"
              background="#1FD26F"
              justifyContent="center"
              alignItems="center"
            >
              <TickIcon width={14} height={10} fill="none" padding="auto" />
            </Flex>
            <Text marginLeft="5px">In Progress</Text>
          </Flex>
        </Box>
        <ResponsiveFlexArrowIcon
          width={86}
          height={36}
          borderRadius="50%"
          background="#1FD26F"
          justifyContent="center"
          alignItems="center"
          zIndex="999"
        >
          <ArrowIcon width="21" height="16" viewBox="0 0 21 16" fill="none" />
        </ResponsiveFlexArrowIcon>
        <Box marginLeft={['0px', null, '-10px']} marginTop={['-10px', null, '0px']}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="18px">Kaspa Finance V3</Text>
            <Flex
              width={28}
              height={28}
              borderRadius="100%"
              background="#1FD26F"
              justifyContent="center"
              alignItems="center"
            >
              <TickIcon width={14} height={10} fill="none" padding="auto" />
            </Flex>
          </Flex>
          <Button variant="secondary" marginTop="auto" style={{ borderRadius: '30px' }}>
            Migrate
          </Button>
        </Box>
      </ResponsiveFlexCover>
    </>
  )
}

export default MigrateTokens
