import { useEffect } from 'react'
import styled from 'styled-components'
import { Text, Card, CardBody } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Page from '../../components/Layout/Page'

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;

  /* Add top padding to avoid navbar overlap */
  padding-top: clamp(60px, 6vh, 100px);

  @media screen and (max-width: 968px) {
    padding-top: 90px;
    padding-left: 16px;
    padding-right: 16px;
    max-width: 1200px;
  }

  @media screen and (max-width: 480px) {
    padding-top: 80px;
    max-width: 100%;
  }
`

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const GradientText = styled(Text)`
  background: linear-gradient(139deg, #2dfe87 0%, #41499a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
`

const AirdropCard = styled(Card)`
  background: #1b2053;
  border-radius: 20px;
  padding: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 1000px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(46, 254, 135, 0.1);
  }
`

const WidgetContainer = styled.div`
  width: 100%;
  min-height: 600px;
  margin-top: 24px;

  .sw_container {
    width: 100% !important;
    margin: 0 auto;
  }

  iframe {
    width: 100% !important;
    min-height: 600px;
    border: none;
    border-radius: 16px;
  }
`

const InfoSection = styled.div`
  background: rgba(46, 254, 135, 0.1);
  border: 1px solid rgba(46, 254, 135, 0.3);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
`

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(46, 254, 135, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(46, 254, 135, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(46, 254, 135, 0.1);
    border-color: rgba(46, 254, 135, 0.2);
  }
`

const CheckIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2efe87;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: '✓';
    color: #120f1f;
    font-size: 12px;
    font-weight: bold;
  }
`

const AirDrop = () => {
  const { t } = useTranslation()

  useEffect(() => {
    // Load SweepWidget script if not already loaded
    if (!document.querySelector('script[src="https://sweepwidget.com/w/j/w_init.js"]')) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://sweepwidget.com/w/j/w_init.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  return (
    <Page>
      <PageContainer>
        <HeaderSection>
          <GradientText>{t('KaspaFinance Airdrop')}</GradientText>
        </HeaderSection>

        <AirdropCard>
          <CardBody padding="24px">
            <InfoSection>
              <Text fontSize="20px" bold color="#2efe87" mb="16px">
                {t('How to Participate')}
              </Text>
              <Text color="#ffffff" mb="16px" fontSize="14px">
                {t(
                  'Complete the tasks below to enter the airdrop pool. The more tasks you complete, the higher your share.',
                )}
              </Text>
              <Text color="#ffffff" mb="16px" fontSize="14px">
                {t('Join our Phase 1 - Airdrop -  2 Million $KFC pool.')}
              </Text>

              <FeatureList>
                <FeatureItem>
                  <CheckIcon />
                  <Text fontSize="14px" color="#ffffff">
                    {t('Follow our social media')}
                  </Text>
                </FeatureItem>
                <FeatureItem>
                  <CheckIcon />
                  <Text fontSize="14px" color="#ffffff">
                    {t('Share with friends')}
                  </Text>
                </FeatureItem>
                <FeatureItem>
                  <CheckIcon />
                  <Text fontSize="14px" color="#ffffff">
                    {t('Connect your wallet')}
                  </Text>
                </FeatureItem>
              </FeatureList>
            </InfoSection>

            <WidgetContainer>
              <div id="91575-6sem9ukt" className="sw_container">
                {/* SweepWidget will be loaded here */}
              </div>
            </WidgetContainer>
          </CardBody>
        </AirdropCard>
      </PageContainer>
    </Page>
  )
}

export default AirDrop
