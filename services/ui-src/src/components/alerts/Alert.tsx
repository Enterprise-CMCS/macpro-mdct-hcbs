import {
  Alert as AlertRoot,
  AlertDescription,
  AlertTitle,
  Box,
  Flex,
  Image,
  Link,
  Text,
  SystemStyleObject,
} from "@chakra-ui/react";
import { AlertTypes } from "types";
import alertIcon from "assets/icons/alert/icon_alert.svg";
import { ReactNode, useRef } from "react";

export const Alert = ({
  status = AlertTypes.INFO,
  sx: sxOverride,
  className,
  showIcon = true,
  icon,
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
      sx={sxOverride ?? sx.root}
      className={className ?? status}
    >
      <Flex>
        {showIcon && (
          <Image src={icon ? icon : alertIcon} sx={sx.icon} alt="Alert" />
        )}
        <Box sx={sx.content}>
          {title && <AlertTitle>{title}</AlertTitle>}
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
  sx?: SystemStyleObject;
  showIcon?: boolean;
  icon?: string;
  title?: string;
  className?: string;
  children?: ReactNode;
  link?: string;
}

const sx = {
  root: {
    paddingX: "0",
    paddingY: "spacer2",
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
  descriptionText: {
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
    marginLeft: "spacer3",
  },
};
