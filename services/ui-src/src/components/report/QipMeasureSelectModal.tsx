import {
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChoiceList, Dropdown } from "@cmsgov/design-system";
import {
  LiteReport,
  MeasureTargetInfo,
  MeasureTargetMapping,
  ReportStatus,
  ReportType,
} from "types";
import { useParams } from "react-router-dom";
import { getReportsForState } from "utils";

type Props = {
  measureTargetMapping: MeasureTargetMapping;
  onClose: (modalOpen: boolean) => void;
  onSubmit: (
    params: MeasureTargetInfo & { measureName: string }
  ) => Promise<void>;
};

export const QipMeasureSelectModal = ({
  measureTargetMapping,
  onClose,
  onSubmit,
}: Props) => {
  const state = useParams().state;
  const [selectedMeasure, setSelectedMeasure] =
    useState<MeasureTargetMapping[number]>();
  const [measureError, setMeasureError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reports, setReports] = useState<LiteReport[]>();
  const [qmsReportId, setQmsReportId] = useState<string>();
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>([]);
  const [deliveryMethodError, setDeliveryMethodError] = useState<string>();
  const [rates, setRates] = useState<string[]>([]);
  const [rateError, setRateError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();

  useEffect(() => {
    (async () => {
      console.assert(state, "Can't load QMS reports: state not in URL");
      try {
        const allReports = await getReportsForState(ReportType.QMS, state!);
        setReports(
          allReports.filter((r) => r.status === ReportStatus.SUBMITTED)
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const validateAndSubmit = () => {
    let allValid = true;
    if (!selectedMeasure) {
      setMeasureError("Please select a measure.");
      allValid = false;
    }
    if (deliveryMethods.length === 0) {
      setDeliveryMethodError("Please select one or more delivery methods.");
      allValid = false;
    }
    if (rates.length === 0) {
      setRateError("Please select one or more rates.");
      allValid = false;
    }

    if (allValid) {
      setSubmitting(true);
      setSubmitError(undefined);
      // "FFS" is before "MLTSS", so default sort works
      deliveryMethods.sort();
      // Match the rate order in the measure target info
      rates.sort(
        (a, b) =>
          selectedMeasure!.rates.findIndex((r) => r.id === a) -
          selectedMeasure!.rates.findIndex((r) => r.id === b)
      );

      onSubmit({
        measureId: selectedMeasure!.measureId,
        measureName: selectedMeasure!.measureName,
        qmsReportId,
        deliveryMethods,
        rates,
      })
        .catch(() => {
          setSubmitError("Something went wrong");
        })
        .finally(() => setSubmitting(false));
    }
  };

  return (
    <>
      <ModalBody>
        <p>
          Select a measure from the dropdown to add to this Quality Improvement
          Plan. You may either enter the measure rate details or copy the
          baseline values from an existing QMS where possible.
        </p>
        <form onSubmit={validateAndSubmit}>
          <Dropdown
            label="Measure report"
            name="measure"
            value={selectedMeasure?.measureId ?? ""}
            options={[
              { label: "Select measure", value: "" },
              ...measureTargetMapping.map((mti) => ({
                label: mti.measureName,
                value: mti.measureId,
              })),
            ]}
            errorMessage={measureError}
            onChange={(evt) => {
              setMeasureError(undefined);
              const measure = measureTargetMapping.find(
                ({ measureId }) => measureId === evt.target.value
              );
              setSelectedMeasure(measure);
              if (!measure || !measure.includedInQms) {
                setQmsReportId(undefined);
              }
              // Note: If we ever have a measure with unique delivery methods,
              // we will also need to clear the delivery method checkboxes here.
              setRates([]);
            }}
          />
          {selectedMeasure === undefined ? (
            <></>
          ) : (
            <>
              {(function renderQmsReportDropdown() {
                if (!selectedMeasure?.includedInQms) {
                  // TODO: Render the dropdown anyway, but disabled? Double check the designs.
                  return <></>;
                } else if (isLoading) {
                  return (
                    <Flex justify="center">
                      <Spinner size="md" />
                    </Flex>
                  );
                } else if (!reports) {
                  return "Error loading QMS reports! Please refresh the page.";
                } else {
                  return (
                    <Dropdown
                      label="Please select from which submitted Quality Measure Set report you would like to copy over baseline values (optional)"
                      hint="Only measures submitted as part of the HCBS Quality Measure Set report are available for copy-over."
                      name="qms-report-id"
                      value={qmsReportId ?? ""}
                      disabled={!selectedMeasure?.includedInQms}
                      options={[
                        { label: "Select report", value: "" },
                        ...reports.map((r) => ({
                          label: r.name,
                          value: r.id!, // TODO: Do we ever have report w/o id?!
                        })),
                      ]}
                      onChange={(evt) => setQmsReportId(evt.target.value)}
                    />
                  );
                }
              })()}
              {/* TODO: Is it weird that we use radio buttons in QMS but checkboxes in QIP for this same question? */}
              <ChoiceList
                label="Which delivery sub-type will you be reporting on?"
                name="delivery-method"
                type="checkbox"
                choices={Object.keys(selectedMeasure.deliveryMethods).map(
                  (deliveryMethodId) => ({
                    label: `Delivery Method: ${deliveryMethodId}`,
                    value: deliveryMethodId,
                    checked: deliveryMethods.includes(deliveryMethodId),
                  })
                )}
                errorMessage={deliveryMethodError}
                onChange={(evt) => {
                  const dm = evt.target.value;
                  setDeliveryMethodError(undefined);
                  if (deliveryMethods.includes(dm)) {
                    setDeliveryMethods(deliveryMethods.filter((m) => m !== dm));
                  } else {
                    setDeliveryMethods([...deliveryMethods, dm]);
                  }
                }}
              />
              <ChoiceList
                label="Which rates will you be reporting on?"
                name="rates"
                type="checkbox"
                choices={selectedMeasure.rates.map((r) => ({
                  label: r.label,
                  value: r.id,
                  checked: rates.includes(r.id),
                }))}
                errorMessage={rateError}
                onChange={(evt) => {
                  const rate = evt.target.value;
                  setRateError(undefined);
                  if (rates.includes(rate)) {
                    setRates(rates.filter((r) => r !== rate));
                  } else {
                    setRates([...rates, rate]);
                  }
                }}
              />
            </>
          )}
        </form>
        {submitError && (
          <Text color="red.600" mt={4}>
            {submitError}
          </Text>
        )}
      </ModalBody>
      <ModalFooter gap="4">
        <Button
          colorScheme="blue"
          mr={3}
          onClick={validateAndSubmit}
          isLoading={submitting}
        >
          Save
        </Button>
        <Button variant="link" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
