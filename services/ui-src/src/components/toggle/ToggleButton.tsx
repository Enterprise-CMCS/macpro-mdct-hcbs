import React, { useState, useEffect, ReactNode } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Switch,
  SystemStyleObject,
} from "@chakra-ui/react";

export const ToggleButton = ({ label, id, children, sx: sxOverride }: Props) => {
  return (
    <Box>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0">
          {label}
        </FormLabel>
        <Switch id={id} />
      </FormControl>
    </Box>
  );
};

interface Props {
  children?: ReactNode | ReactNode[];
  label?: string;
  id: string;
  sx?: SystemStyleObject;
}

const sx = {
  children: {
    padding: "0 22px",
    border: "4px #0071BC solid",
    borderWidth: "0 0 0 4px",
    margin: "0 14px",
    "input:not(.ds-c-choice)": {
      width: "240px",
    },
    textarea: {
      maxWidth: "440px",
    },
  },
};
