import { useSearchParams } from 'next/navigation'
import styled from 'styled-components'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { DashBox } from './style'
import { ContentBox, Highlight as HighlightOrg } from './liquidityProvision'
import TickIcon from './icons/tick.ico'
import { TwitterIcon } from './icons/twitter.ico'
import { RetweetIcon } from './icons/retweet.ico'
import { ContentIcon } from './icons/content.ico'
import { MessageIcon } from './icons/message.ico'
import { ViralIcon } from './icons/viral.ico'

const Box = styled(DashBox)`
  padding-inline: 64px;
  padding-block: 36px;
  max-width: 898px;
  width: 31%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`
const Highlight = styled(HighlightOrg)`
  font-size: 24px;
  font-weight: 400px;
`
const SocialAmplification = () => {
  const searchParams = useSearchParams()
  return (
    <>
      <Heading textAlign="center" scale="xxl">
        Social Media Amplification
      </Heading>
      <Flex alignItems="center" justifyContent="center" marginTop="36px">
        <Box>
          <Text fontSize="24px" textAlign="center" marginBottom="6px">
            Twitter/X Actions
          </Text>
          <ContentBox>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex marginRight="auto" alignItems="center" style={{ gap: 22 }}>
                <Flex
                  width={50}
                  height={50}
                  borderRadius="100%"
                  background="#1FD26F"
                  justifyContent="center"
                  alignItems="center"
                >
                  <TwitterIcon width="33" height="33" viewBox="0 0 33 33" fill="none" />
                </Flex>
                <Text fontSize="16px">Follow @KaspaFinance:</Text>
              </Flex>
              <Highlight>12h 22m</Highlight>
              <Flex
                width={28}
                height={28}
                borderRadius="100%"
                background="#1FD26F"
                justifyContent="center"
                alignItems="center"
                marginLeft="30px"
              >
                <TickIcon width={14} height={10} fill="none" padding="auto" />
              </Flex>
            </Flex>
          </ContentBox>
          <ContentBox>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex marginRight="auto" alignItems="center" style={{ gap: 22 }}>
                <Flex
                  width={50}
                  height={50}
                  borderRadius="100%"
                  background="#1FD26F"
                  justifyContent="center"
                  alignItems="center"
                >
                  <RetweetIcon width="30" height="20" viewBox="0 0 30 20" fill="none" />
                </Flex>
                <Text fontSize="16px">Retweet launch announcement:</Text>
              </Flex>
              <Highlight>100 Points</Highlight>
              <Flex
                width={28}
                height={28}
                borderRadius="100%"
                background="#1FD26F"
                justifyContent="center"
                alignItems="center"
                marginLeft="30px"
              >
                <TickIcon width={14} height={10} fill="none" padding="auto" />
              </Flex>
            </Flex>
          </ContentBox>
          <ContentBox>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex marginRight="auto" alignItems="center" style={{ gap: 22 }}>
                <Flex
                  width={50}
                  height={50}
                  borderRadius="100%"
                  background="#1FD26F"
                  justifyContent="center"
                  alignItems="center"
                >
                  <ContentIcon width="24" height="28" viewBox="0 0 24 28" fill="none" />
                </Flex>
                <Text fontSize="16px">Follow @KaspaFinance:</Text>
              </Flex>
              <Highlight>12h 22m</Highlight>
              <Flex
                width={28}
                height={28}
                borderRadius="100%"
                background="#1FD26F"
                justifyContent="center"
                alignItems="center"
                marginLeft="30px"
              >
                <TickIcon width={14} height={10} fill="none" padding="auto" />
              </Flex>
            </Flex>
          </ContentBox>
          <ContentBox>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex marginRight="auto" alignItems="center" style={{ gap: 22 }}>
                <Flex
                  width={50}
                  height={50}
                  borderRadius="100%"
                  background="#1FD26F"
                  justifyContent="center"
                  alignItems="center"
                >
                  <MessageIcon width="28" height="26" viewBox="0 0 28 26" fill="none" />
                </Flex>
                <Text fontSize="16px">Follow @KaspaFinance:</Text>
              </Flex>
              <Highlight>12h 22m</Highlight>
              <Flex
                width={28}
                height={28}
                borderRadius="100%"
                background="#1FD26F"
                justifyContent="center"
                alignItems="center"
                marginLeft="30px"
              >
                <TickIcon width={14} height={10} fill="none" padding="auto" />
              </Flex>
            </Flex>
          </ContentBox>
          <ContentBox>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex marginRight="auto" alignItems="center" style={{ gap: 22 }}>
                <Flex
                  width={50}
                  height={50}
                  borderRadius="100%"
                  background="#1FD26F"
                  justifyContent="center"
                  alignItems="center"
                >
                  <ViralIcon width="27" height="28" viewBox="0 0 27 28" fill="none" />
                </Flex>
                <Text fontSize="16px">Follow @KaspaFinance:</Text>
              </Flex>
              <Highlight>12h 22m</Highlight>
              <Flex
                width={28}
                height={28}
                borderRadius="100%"
                background="#1FD26F"
                justifyContent="center"
                alignItems="center"
                marginLeft="30px"
              >
                <TickIcon width={14} height={10} fill="none" padding="auto" />
              </Flex>
            </Flex>
          </ContentBox>
          <Button marginTop="6px" variant="secondary">
            Complete Task with Twitter/X
          </Button>
        </Box>
      </Flex>
    </>
  )
}

export default SocialAmplification
