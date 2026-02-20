import React, { useState, useEffect, ReactNode } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Switch,
  SystemStyleObject,
} from "@chakra-ui/react";

export const ToggleButton = ({
  label,
  id,
  sx: sxOverride,
  isRequired,
}: Props) => {
  const [checked, setChecked] = useState(false);

  return (
    <Box>
      <FormControl
        display="flex"
        alignItems="center"
        isRequired={isRequired}
        sx={sxOverride ?? sx.root}
      >
        <FormLabel htmlFor={id} mb="0">
          {label}
        </FormLabel>
        <Switch
          id={id}
          aria-label={label}
          isChecked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </FormControl>
    </Box>
  );
};

interface Props {
  label?: string;
  id: string;
  sx?: SystemStyleObject;
  isRequired?: boolean;
}

const sx = {
  /* no styling yet */
};
