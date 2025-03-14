import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import {
  Dropdown,
  ChoiceList,
  DropdownChangeObject,
} from "@cmsgov/design-system";
import { DropdownOptions } from "types";
import { StateNames } from "../../constants";

export const AdminDashSelector = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string>("");
  const navigate = useNavigate();

  const handleStateChange = (event: DropdownChangeObject) => {
    setSelectedState(event.target.value);
  };

  const handleReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReport(event.target.value);
  };

  const handleSubmit = () => {
    navigate(`report/${selectedReport}/${selectedState}`);
  };

  const reportChoices = [
    {
      value: "QMS",
      label: "Quality Measure Set (QMS)",
    },
    {
      value: "TBD",
      label: "To be determined (TBD)",
    },
  ];

  const buildStates = (): DropdownOptions[] => {
    const dropdownStates: DropdownOptions[] = Object.keys(StateNames).map(
      (value) => ({
        label: StateNames[value as keyof typeof StateNames],
        value,
      })
    );
    return [
      {
        label: "- Select an option -",
        value: "",
      },
      ...dropdownStates,
    ];
  };

  const dropdownStates = buildStates();

  return (
    <Box sx={sx.root}>
      <Heading as="h1" sx={sx.headerText}>
        View State/Territory Reports
      </Heading>

      <form onSubmit={handleSubmit}>
        <>
          {Dropdown({
            name: "state",
            id: "state",
            label: "Select state or territory:",
            options: dropdownStates,
            onChange: (change) => handleStateChange(change),
            value: selectedState,
          })}
        </>
        <ChoiceList
          name="radio"
          type="radio"
          label="Select a report:"
          choices={reportChoices}
          onChange={handleReportChange}
        />
        <Flex sx={sx.navigationButton}>
          <Button
            type="submit"
            form="adminDashSelector"
            onClick={() => handleSubmit()}
            disabled={!selectedState || !selectedReport}
          >
            Go to Report Dashboard
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

const sx = {
  root: {
    ".ds-c-field__hint": {
      fontSize: "md",
      color: "palette.base",
    },
  },
  headerText: {
    fontSize: "2rem",
    fontWeight: "normal",
    paddingBottom: "1.5rem",
  },
  navigationButton: {
    padding: "1.5rem 0 2rem 0",
  },
};
