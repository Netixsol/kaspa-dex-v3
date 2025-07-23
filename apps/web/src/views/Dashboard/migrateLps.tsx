import { Flex, Heading, IconButton, Text } from '@pancakeswap/uikit'
import MigrateTokens from './components/MigrateTokens'
import { DashBox } from './style'
import VerticalStepProgress from './components/StepsProgressBar'
import TickIcon from './icons/tick.ico'
import { ContentBox } from './liquidityProvision'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'
import styled from 'styled-components'

const BigDashBox = styled(DashBox)`
  min-width: 588px;

  @media (max-width: 657px) {
    min-width: 508px;
  }

   @media (max-width: 575px) {
    min-width: 100%;
  }
`;

const MigrateLps = () => {
  const steps = [
    {
      id: 'step1',
      label: 'V2 LPs Connected',
      completed: true,
      icon: <TickIcon width={14} height={10} fill="none" padding="auto" />,
    },
    {
      id: 'step2',
      label: 'Migration Successfully Initiated',
      completed: true,
      icon: <TickIcon width={14} height={10} fill="none" padding="auto" />,
    },
    {
      id: 'step3',
      label: 'Power Locked & Secured',
      completed: false,
      icon: <TickIcon width={14} height={10} fill="none" padding="auto" />,
    },
    {
      id: 'step4',
      label: 'Points Accumulated',
      completed: false,
      icon: <TickIcon width={14} height={10} fill="none" padding="auto" />,
    },
  ]
  return (
    <>
      <ScreenShortContainer title="Migrate LPs from V2 to V3">
        <Flex justifyContent="space-between" style={{ gap: 33 }} marginTop="32px" flexWrap="wrap">
          <BigDashBox style={{ flexGrow: 5 }}>
            <MigrateTokens />
          </BigDashBox>
          {/* <DashBox>
            <Text fontSize="24px" fontWeight={500} marginBottom="22px">
              Progress
            </Text>
            <VerticalStepProgress steps={steps} activeStep="step3" />
          </DashBox> */}
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Points & Rewards
            </Text>
            <Flex flexDirection="column" marginTop="20px" style={{ gap: '20px' }}>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="24px" fontWeight={500} color="#1FD26F">
                    10,000
                  </Text>
                  <Flex width="45%" justifyContent="space-between" alignItems="center">
                    <Text>Points Earned </Text>
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
                </Flex>
              </ContentBox>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    Points Earned LPs from V2 to V3
                  </Text>
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
              </ContentBox>
            </Flex>
          </DashBox>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}

export default MigrateLps
