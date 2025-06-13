import { ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { ReportType } from "types";

export const SubmitReportModal = (
  onClose: (modalOpen: boolean) => void,
  onSubmit: () => Promise<void>,
  reportType: string = "QMS"
) => {
  const submitHandler = async () => {
    await onSubmit();
  };

  let submitButtonText;
  let submitModalText;
  if (reportType == ReportType.TA) {
    submitButtonText = "Submit TACM Report";
    submitModalText = `You won’t be able to make edits after submitting unless you send a request to CMS to unlock your submission. After review, your CMS HCBS Lead will contact you if there are corrections to be made, and your report status will change to “In revision” in the TACM Report dashboard.`;
  } else {
    submitButtonText = `Submit ${reportType} Report`;
    submitModalText = `You won’t be able to make edits after submitting unless you send a request to CMS to unlock your submission. After review, a CMS representative will contact you if there are corrections to be made and your report status will change to “In revision” in the QMS Report dashboard.`;
  }

  return (
    <>
      <ModalBody>{submitModalText}</ModalBody>
      <ModalFooter gap="4">
        <Button colorScheme="blue" mr={3} onClick={() => submitHandler()}>
          {submitButtonText}
        </Button>
        <Button variant="link" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
