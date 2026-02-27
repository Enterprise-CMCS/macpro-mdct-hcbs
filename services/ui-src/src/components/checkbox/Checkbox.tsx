import {
  Box,
} from "@chakra-ui/react";
import { Choice } from "@cmsgov/design-system";

export const Checkbox = ({
  id,
  label,
  checked,
  onCheckedChange,
  name,
  value = id,
  hint,
}: Props) => {
  return (
    <Box>
    <Choice
      id={id}
      type="checkbox"
      name={name}
      value={value}
      label={label}
      checked={checked}
      hint={hint}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange(e.target.checked);
      }}
    />
    </Box>
  );
};

interface Props {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  name: string;
  value?: string;
  hint?: string;
}

const sx = {
  /* no styling yet */
};
