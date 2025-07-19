import styled from 'styled-components'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import moment from 'moment';


const SpinHistory = ({ data }) => {
  const spinData = data?.data?.history || [];

  return (
    <Flex
      background="#252136"
      borderRadius="25px"
      p="25px"
      width="390px"
      overflowY="auto"
      flexDirection="column"
      style={{ gap: '20px' }}
    >
      <DailySpinHeading>Spin History</DailySpinHeading>
      <Flex flexDirection="column" mt="5px">
        <TableHead>
          <Text bold>Spin Date</Text>
          <Flex style={{ gap: '10px' }}>
            <Divider />
            <Text bold>Points</Text>
          </Flex>
        </TableHead>

        <Box mt="10px">
          {spinData.map((item) => (
            <Flex
              key={item.id}
              justifyContent="space-between"
              py="10px"
              px="20px"
              style={{ borderBottom: '1px solid #38364a' }}
            >
              <Text>{moment(item.reward_date).format('ll')}</Text>
              <Text>{item.points_awarded}</Text>
            </Flex>
          ))}
        </Box>
      </Flex>
    </Flex>
  );
};

const DailySpinHeading = styled.div`
  font-size: 24px;
  font-weight: 500;
`;

const TableHead = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #120F1F;
  border: 1px solid #1FCD6D;
  padding: 12px 20px;
  margin-bottom: 12px;
  border-radius: 8px;
`;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: #1FCD6D;
`;

export default SpinHistory;
