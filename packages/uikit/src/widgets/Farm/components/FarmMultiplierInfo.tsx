import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { Text } from "../../../components/Text";
import { Link } from "../../../components/Link";

const InlineText = styled(Text)`
  display: inline;
`;

const InlineLink = styled(Link)`
  display: inline-block;
  margin: 0 4px;
`;

interface FarmMultiplierInfoProps {
  farmKFCPerSecond: string;
  totalMultipliers: string;
}

export const FarmMultiplierInfo: React.FC<React.PropsWithChildren<FarmMultiplierInfoProps>> = ({
  farmKFCPerSecond,
  totalMultipliers,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Text bold style={{ color: 'black' }}>
        {t("Farm’s KFC Per Second:")}
        <InlineText marginLeft={2} style={{ color: 'black' }}>{farmKFCPerSecond}</InlineText>
      </Text>
      <Text bold style={{ color: 'black' }}>
        {t("Total Multipliers:")}
        <InlineText marginLeft={2} style={{ color: 'black' }}>{totalMultipliers}</InlineText>
      </Text>
      <Text my="24px" style={{ color: 'black' }}>
        {t(
          "The Farm Multiplier represents the proportion of KFC rewards each farm receives as a proportion of its farm group."
        )}
      </Text>
      <Text my="24px" style={{ color: 'black' }}>
        {t("For example, if a 1x farm received 1 KFC per block, a 40x farm would receive 40 KFC per block.")}
      </Text>
      <Text style={{ color: 'black' }}>
        {t("Different farm groups have different sets of multipliers.")}
        {/* <InlineLink
          mt="8px"
          display="inline"
          href="https://docs.panKFCswap.finance/products/yield-farming/faq#why-a-2x-farm-in-v3-has-less-apr-than-a-1x-farm-in-v2"
          external
        >
          {t("Learn More")}
        </InlineLink> */}
      </Text>
    </>
  );
};
