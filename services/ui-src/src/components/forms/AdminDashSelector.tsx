import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Dropdown, ChoiceList } from "@cmsgov/design-system";
import { AnyObject, DropdownOptions } from "types";
import { States } from "../../constants";

interface FormProps {
  verbiage: AnyObject;
}

export const AdminDashSelector = ({ verbiage }: FormProps) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string>("");
  const navigate = useNavigate();

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
      value: "QM",
      label: "Quality Measures (QM)",
    },
    {
      value: "TBD",
      label: "To be determined (TBD)",
    },
  ];

  const buildStates = (): DropdownOptions[] => {
    const dropdownStates: DropdownOptions[] = Object.keys(States).map(
      (value) => ({
        label: States[value as keyof typeof States],
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
        {verbiage.header}
      </Heading>

      <form onSubmit={handleSubmit}>
        <Dropdown
          name="state"
          id="state"
          label="Select state or territory:"
          options={dropdownStates}
          onChange={handleStateChange}
          value={selectedState}
        />
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
            {verbiage.buttonLabel}
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
