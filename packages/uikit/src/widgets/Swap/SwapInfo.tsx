import { useTranslation } from "@pancakeswap/localization";
import { useIsMounted } from "@pancakeswap/hooks";
import { PropsWithChildren, ReactNode } from "react";
import { AutoColumn, RowBetween, Text, TextProps } from "../../components";

type SwapInfoType = {
  price: ReactNode;
  allowedSlippage: number;
  onSlippageClick?: () => void;
};

export const SwapInfoLabel = (props: PropsWithChildren<TextProps>) => (
  <Text fontSize="12px" bold color="secondary" {...props} />
);

export const SwapInfo = ({ allowedSlippage, price }: SwapInfoType) => {
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  return (
    <AutoColumn style={{ padding: "0 24px" }}>
      <RowBetween alignItems="center">{price}</RowBetween>
      <RowBetween alignItems="center" style={{ paddingTop: "6px" }}>
        <SwapInfoLabel>{t("Slippage Tolerance")}</SwapInfoLabel>
        {isMounted && (
          <Text bold color="primary">
            {allowedSlippage / 100}%
          </Text>
        )}
      </RowBetween>
    </AutoColumn>
  );
};
