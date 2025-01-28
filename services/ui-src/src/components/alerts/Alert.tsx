import {
  Alert as AlertRoot,
  AlertDescription,
  AlertTitle,
  Box,
  CSSObject,
  Flex,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { AlertTypes } from "types";
import alertIcon from "assets/icons/alert/icon_alert.svg";
import { ReactNode } from "react";

export const Alert = ({
  status = AlertTypes.INFO,
  title,
  children,
  link,
  showIcon = true,
  icon,
  ...props
}: Props) => {
  return (
    <AlertRoot
      status={status}
      variant="left-accent"
      sx={sx.root}
      className={status}
      {...props}
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
  title?: string;
  link?: string;
  showIcon?: boolean;
  icon?: string;
  children?: ReactNode;
  className?: string;
  sx?: CSSObject;
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
