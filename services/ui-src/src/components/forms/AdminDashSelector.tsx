import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { AnyObject } from "types";
import formJson from "forms/adminDashSelector/adminDashSelector";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("dashboard");
  };

  return (
    <Box sx={sx.root} data-testid="read-only-view">
      <Heading as="h1" sx={sx.headerText}>
        {verbiage.header}
      </Heading>

      <form onSubmit={handleSubmit}>
        {formJson.fields.map((field) => {
          if (field.type === "dropdown") {
            return (
              <div key={field.id}>
                <br />
                <label htmlFor={field.id}>{field.props.hint}</label>
                <br />
                <select
                  id={field.id}
                  value={selectedState}
                  onChange={handleStateChange}
                  aria-label={field.props.ariaLabel}
                  required
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  {field.props.options?.map(
                    (option: { label: string; value: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>
            );
          }
          if (field.type === "radio") {
            return (
              <div key={field.id}>
                <br />
                <p>{field.props.hint}</p>
                {field.props.choices?.map(
                  (choice: { id: string; label: string }) => (
                    <div key={choice.id}>
                      <input
                        type="radio"
                        id={choice.id}
                        name="report"
                        value={choice.id}
                        checked={selectedReport === choice.id}
                        onChange={handleReportChange}
                        aria-label={field.props.ariaLabel}
                        required
                      />
                      <label htmlFor={choice.id}>{choice.label}</label>
                    </div>
                  )
                )}
              </div>
            );
          }
          return null;
        })}

        <br />
        <Flex sx={sx.navigationButton}>
          <Button
            type="submit"
            form={formJson.id}
            onClick={() => navigate("dashboard")}
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
  },
  navigationButton: {
    padding: "1.5rem 0 2rem 0",
  },
};
