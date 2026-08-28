import { Button, Image } from "@chakra-ui/react";
import { Ref } from "react";
import addIcon from "assets/icons/add/icon_add_blue.svg";

type AddIconButtonProps = {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
  mb?: string;
  buttonRef?: Ref<HTMLButtonElement>;
};

export const AddIconButton = ({
  label,
  onClick,
  isDisabled,
  mb,
  buttonRef,
}: AddIconButtonProps) => {
  return (
    <Button
      ref={buttonRef}
      variant="outline"
      leftIcon={<Image src={addIcon} alt="" />}
      onClick={onClick}
      isDisabled={isDisabled}
      mb={mb}
    >
      {label}
    </Button>
  );
};
