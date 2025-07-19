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

const MigrateTokens = () => {
  return (
    <>
      <Flex alignItems="center" height="100%">
        <Box marginRight="-10px">
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
        <Flex
          width={86}
          height={36}
          borderRadius="50%"
          background="#1FD26F"
          justifyContent="center"
          alignItems="center"
          zIndex="999"
        >
          <ArrowIcon width="21" height="16" viewBox="0 0 21 16" fill="none" />
        </Flex>
        <Box marginLeft="-10px">
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
      </Flex>
    </>
  )
}

export default MigrateTokens
