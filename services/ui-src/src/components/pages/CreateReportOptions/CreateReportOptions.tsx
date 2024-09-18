import { Button, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { useState } from "react";
import { useStore } from "utils";
import { useNavigate } from "react-router-dom";
import { createReport } from "utils/api/requestMethods/report";

// TODO: Make this a real page name

export const CreateReportOptions = () => {
  const [rulesOne, setRulesOne] = useState("0");
  const [rulesTwo, setRulesTwo] = useState("0");
  const { state } = useStore().user ?? {};
  const navigate = useNavigate();

  const createForm = async () => {
    if (!state) throw new Error("Cannot create report without state on user");
    const stateOptions = [];

    // Jank but proof of concept
    if (rulesOne == "1") {
      stateOptions.push("rulesOne");
    }
    if (rulesTwo == "1") {
      stateOptions.push("rulesTwo");
    }

    const formOptions = { stateOptions };
    const report = await createReport("QM", state, formOptions);
    navigate(`${state}/${report.id}`);
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
        onClick={async () => await createForm()}
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
