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
import { ReactNode } from "react";

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
  return (
    <AlertRoot
      status={status}
      variant="left-accent"
      sx={sxOverride ?? sx.root}
      className={className ?? status}
    >
      <Flex>
        {showIcon && (
          <Image src={icon ? icon : alertIcon} sx={sx.icon} alt="Alert" />
        )}
        <Box sx={sx.contentBox} className={!showIcon ? "no-icon" : ""}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {children && (
            <AlertDescription>
              <Box sx={sx.descriptionText}>{children}</Box>
              {link && (
                <Text sx={sx.linkText}>
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
    alignItems: "start",
    minHeight: "5.25rem",
    borderInlineStartWidth: "0.5rem",
    marginTop: "1.25rem",
    marginBottom: "1.25rem",
    padding: "1rem",
    "&.info": {
      backgroundColor: "palette.secondary_lightest",
      borderInlineStartColor: "palette.secondary",
    },
    "&.success": {
      bgColor: "palette.success_lightest",
      borderInlineStartColor: "palette.success",
    },
    "&.warning": {
      bgColor: "palette.warn_lightest",
      borderInlineStartColor: "palette.warn",
    },
    "&.error": {
      bgColor: "palette.error_lightest",
      borderInlineStartColor: "palette.error",
    },
  },
  descriptionText: {
    marginTop: ".25rem",
    p: {
      marginY: ".5rem",
    },
    ul: {
      paddingLeft: "1rem",
    },
  },
  linkText: {
    marginTop: ".25rem",
    marginBottom: ".25rem",
  },
  icon: {
    position: "absolute",
    color: "palette.base",
    marginBottom: "1.75rem",
    width: "1.375rem",
  },
  contentBox: {
    marginLeft: "2rem",
    "&.no-icon": {
      marginLeft: 0,
    },
  },
};
