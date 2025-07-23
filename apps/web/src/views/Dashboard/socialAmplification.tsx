import { useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading, IconButton, Skeleton, Text } from '@pancakeswap/uikit'
import { DashBox } from './style'
import { ContentBox, Highlight as HighlightOrg } from './liquidityProvision'
import TickIcon from './icons/tick.ico'
import { TwitterIcon } from './icons/twitter.ico'
import { RetweetIcon } from './icons/retweet.ico'
import { ContentIcon } from './icons/content.ico'
import { MessageIcon } from './icons/message.ico'
import { ViralIcon } from './icons/viral.ico'
import { useRewardTwitter } from './hooks/useRewardTwitter'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'

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

const SocialAmplificationSkeleton = () => {
  return (
    <>
      <Flex alignItems="center" justifyContent="center" marginTop="36px">
        <Box>
          <Skeleton width={200} height={32} margin="0 auto 6px" />
          {[...Array(5)].map((_, i) => (
            <ContentBox key={`skeleton-${i}`}>
              <Flex justifyContent="space-between" alignItems="center">
                <Flex marginRight="auto" alignItems="center" style={{ gap: 22 }}>
                  {/* Icon Circle */}
                  <Skeleton width={50} height={50} variant="circle" />
                  {/* Text */}
                  <Skeleton width={180} height={20} />
                </Flex>
                {/* Highlight (time/points) */}
                <Skeleton width={80} height={20} />
                {/* Checkmark Circle */}
                <Skeleton width={28} height={28} variant="circle" marginLeft="30px" />
              </Flex>
            </ContentBox>
          ))}

          {/* Button Skeleton */}
          <Skeleton width="100%" height={48} marginTop="6px" borderRadius="16px" />
        </Box>
      </Flex>
      {/* Title Skeleton */}
    </>
  )
}
const SocialAmplification = () => {
  const { data, isLoading } = useRewardTwitter()
  if (isLoading) {
    return (
      <>
        <ScreenShortContainer title="Social Media Amplification" isLoading={isLoading}>
          <SocialAmplificationSkeleton />
        </ScreenShortContainer>
      </>
    )
  }
  return (
    <>
      <ScreenShortContainer title="Social Media Amplification">
        <Flex alignItems="center" justifyContent="center" marginTop="36px">
          <Box>
            <Text fontSize="26px" textAlign="center" marginBottom="6px">
              Twitter/X Actions
            </Text>
            <ContentBox>
              <Flex justifyContent="space-between" alignItems="center">
                <Flex marginRight="auto" alignItems="center" style={{ gap: 22 }}>
                  <Flex
                    width={28}
                    height={28}
                    borderRadius="100%"
                    background={data?.hasFollowed ? '#1FD26F' : '#45434D'}
                    justifyContent="center"
                    alignItems="center"
                    marginLeft="30px"
                  >
                    <TickIcon width={14} height={10} fill="none" padding="auto" />
                  </Flex>
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
                  background={data?.launchPostRetweet ? '#1FD26F' : '#45434D'}
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
                  background={data?.engagemnet ? '#1FD26F' : '#45434D'}
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
                  background={data?.orignalContant ? '#1FD26F' : '#45434D'}
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
                  background={data?.thread ? '#1FD26F' : '#45434D'}
                  justifyContent="center"
                  alignItems="center"
                  marginLeft="30px"
                >
                  <TickIcon width={14} height={10} fill="none" padding="auto" />
                </Flex>
              </Flex>
            </ContentBox>
            <Button marginTop="6px" variant="secondary" style={{ borderRadius: '30px' }}>
              Complete Task with Twitter/X
            </Button>
          </Box>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}

export default SocialAmplification
