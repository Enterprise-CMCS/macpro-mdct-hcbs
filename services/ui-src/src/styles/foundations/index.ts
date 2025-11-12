import { breakpoints } from "./breakpoints";
import { fonts } from "./fonts";
import { colors } from "./colors";
import { sizes } from "./sizes";
import { typography } from "./typography";
import { space } from "./space";

export const foundations = {
  breakpoints: breakpoints,
  colors: colors,
  fonts: fonts,
  sizes: sizes,
  ...typography,
  space: space,
};
