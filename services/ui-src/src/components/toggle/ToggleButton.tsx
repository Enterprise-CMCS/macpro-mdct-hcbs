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
  isRequired,
  checked,
  onCheckedChange,
}: Props) => {
  return (
    <Box>
      <FormControl
        display="flex"
        alignItems="center"
        isRequired={isRequired}
        sx={sx}
      >
        <FormLabel htmlFor={id} mb="0">
          {label}
        </FormLabel>
        <Switch
          id={id}
          aria-label={label}
          isChecked={checked}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
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
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const sx = {
  /* no styling yet */
};
