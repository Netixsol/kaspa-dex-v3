import { useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, IconButton, ModalV2, Text } from '@pancakeswap/uikit'
import { DashBox } from '../style'
import CrossIcon from '../icons/cross.ico'
import { useGetToken } from '../hooks/useGetToken'

export const CrossIconBtn = styled(IconButton)`
  background: #120f1f;
  width: 28px;
  height: 28px;
`
const LoginModal = () => {
  // const [isOpen, setIsOpen] = useState(true)
  const isOpen = true
  const { data } = useGetToken()
  return (
    <ModalV2 isOpen={isOpen}>
      <Flex alignItems="center" justifyContent="center" maxWidth="522px" zIndex={999}>
        <DashBox>
          {/* <Flex justifyContent="end">
            <CrossIconBtn onClick={() => setIsOpen(false)}>
              <CrossIcon width="10" height="10" viewBox="0 0 10 10" fill="none" />
            </CrossIconBtn>
          </Flex> */}
          <Flex flexDirection="column" alignItems="center" style={{ gap: '10px' }}>
            <Text fontWeight={500} fontSize="34px" color="#1FD26F">
              Login with Twitter/X
            </Text>
            <Text textAlign="center">
              Sign in with X (Twitter) to unlock full access — no actions can be performed without logging in.
            </Text>
            <img alt="login illustration" src="/images/twitter-login-illustration.png" />
            <Button
              variant="secondary"
              width="100%"
              as="a"
              style={{ borderRadius: '30px' }}
              href={`${process.env.NEXT_PUBLIC_DASHBOARD_API}/auth/twitter?token=${data?.token}`}
            >
              Login Now
            </Button>
          </Flex>
        </DashBox>
      </Flex>
    </ModalV2>
  )
}

export default LoginModal
