import { Button, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { useState } from "react";
import { useStore } from "utils";
import { buildForm } from "./generation/formBuilder";

export const ExampleForm = () => {
  const [rulesOne, setRulesOne] = useState("0");
  const [rulesTwo, setRulesTwo] = useState("0");
  // const [form, setForm] = useState();
  const { email, state } = useStore().user ?? {};

  const createForm = () => {
    const stateOptions = [];
    if (rulesOne == "1") {
      // Jank but proof of concept
      stateOptions.push("rulesOne");
    }
    if (rulesTwo == "1") {
      stateOptions.push("rulesTwo");
    }

    const formOptions = { stateOptions, state, createdBy: email };
    buildForm(formOptions);
    // setForm(form);
  };

  return (
    <PageTemplate sx={sx.layout}>
      Does the state have specific rules one?
      <RadioGroup onChange={setRulesOne} value={rulesOne}>
        <Stack direction="column">
          <Radio value="0">No</Radio>
          <Radio value="1">Yes</Radio>
        </Stack>
      </RadioGroup>
      Does the state have specific rules two?
      <RadioGroup onChange={setRulesTwo} value={rulesTwo}>
        <Stack direction="column">
          <Radio value="0">No</Radio>
          <Radio value="1">Yes</Radio>
        </Stack>
      </RadioGroup>
      <Button
        sx={sx.adminButton}
        onClick={() => createForm()}
        data-testid="banner-admin-button"
      >
        Generate Form
      </Button>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
      marginBottom: "5rem !important",
    },
  },
  adminButton: {
    marginTop: "2rem",
  },
};
