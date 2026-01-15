import {
  Alert as AlertRoot,
  AlertDescription,
  AlertTitle,
  Box,
  Flex,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { AlertTypes } from "types";
import { ReactNode, useRef } from "react";
import infoIcon from "assets/icons/alert/icon_info.svg";
import errorIcon from "assets/icons/alert/icon_error.svg";
import warningIcon from "assets/icons/alert/icon_warning.svg";
import successIcon from "assets/icons/alert/icon_success.svg";

const ALERT_ICONS: Record<AlertTypes, string> = {
  [AlertTypes.ERROR]: errorIcon,
  [AlertTypes.SUCCESS]: successIcon,
  [AlertTypes.WARNING]: warningIcon,
  [AlertTypes.INFO]: infoIcon,
};

export const Alert = ({
  status = AlertTypes.INFO,
  showIcon = true,
  title,
  children,
  link,
}: Props) => {
  // Focus the alert whenever an error is rendered (or re-rendered)
  const ref = useRef<HTMLDivElement>(null);
  if (ref.current && status === AlertTypes.ERROR) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    ref.current.focus({ preventScroll: true });
  }

  return (
    <AlertRoot
      ref={ref}
      status={status}
      variant="left-accent"
      sx={sx.root}
      className={status}
    >
      <Flex>
        {showIcon && (
          <Image src={ALERT_ICONS[status]} sx={sx.icon} alt="Alert" />
        )}
        <Box sx={sx.content}>
          {title && <AlertTitle sx={sx.title}>{title}</AlertTitle>}
          {children && (
            <AlertDescription>
              <Box sx={sx.descriptionText}>{children}</Box>
              {link && (
                <Text>
                  <Link href={link} isExternal>
                    {link}
                  </Link>
                </Text>
              )}
            </AlertDescription>
          )}
        </Box>
      </Flex>
    </AlertRoot>
  );
};

interface Props {
  status?: AlertTypes;
  showIcon?: boolean;
  title: string;
  children?: ReactNode;
  link?: string;
}

const sx = {
  root: {
    padding: "spacer2",
    borderInlineStartWidth: "0.5rem",
    alignItems: "start",
    "&.info": {
      backgroundColor: "palette.secondary_lightest",
      borderInlineStartColor: "palette.secondary",
    },
    "&.success": {
      backgroundColor: "palette.success_lightest",
      borderInlineStartColor: "palette.success",
    },
    "&.warning": {
      backgroundColor: "palette.warn_lightest",
      borderInlineStartColor: "palette.warn",
    },
    "&.error": {
      backgroundColor: "palette.error_lightest",
      borderInlineStartColor: "palette.error",
    },
  },
  content: {
    paddingX: "spacer2",
  },
  title: {
    fontSize: "lg",
  },
  descriptionText: {
    fontSize: "md",
    marginY: "spacer1",
    p: {
      marginY: "spacer1",
    },
    ul: {
      paddingLeft: "spacer2",
    },
  },
  icon: {
    color: "palette.base",
    minWidth: "1.5rem",
    height: "1.5rem",
    marginLeft: "spacer1",
  },
};
