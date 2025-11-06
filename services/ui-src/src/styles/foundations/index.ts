import { breakpoints } from "./breakpoints";
import { fonts } from "./fonts";
import { colors } from "./colors";
import { sizes } from "./sizes";
import { typography } from "./typography";

export const foundations = {
  breakpoints: breakpoints,
  colors: colors,
  fonts: fonts,
  sizes: sizes,
  ...typography,
};
