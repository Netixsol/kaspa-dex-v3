import { useTheme } from "styled-components";
import { Svg, SvgProps } from "..";

const BunnyKnownPlaceholder: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  const theme = useTheme();
  const primaryColor = theme.isDark ? "#3C3742" : "#e9eaeb";
  const secondaryColor = theme.isDark ? "#666171" : "#bdc2c4";

  return (
   <img src={"https://kaspa-dex-v3-lake.vercel.app/KF_06.png"} width={80} height={80} />
  );
};

export default BunnyKnownPlaceholder;
