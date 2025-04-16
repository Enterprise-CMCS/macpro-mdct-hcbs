import { ModalBody, ModalFooter, Button, Spinner } from "@chakra-ui/react";
import { useState } from "react";

export const SubmitReportModal = (onClose: Function, onSubmit: Function) => {
  const [submitting, setSubmitting] = useState(false);
  const submitHandler = async () => {
    setSubmitting(true);
    await onSubmit();
    setSubmitting(false);
  };
  return (
    <>
      <ModalBody>
        You won’t be able to make edits after submitting unless you send a
        request to CMS to unlock your submission. After review, a CMS
        representative will contact you if there are corrections to be made and
        your report status will change to “In revision” in the QMS Report
        dashboard.
      </ModalBody>
      <ModalFooter gap="4">
        <Button colorScheme="blue" mr={3} onClick={() => submitHandler()}>
          {submitting ? <Spinner size="md" /> : "Submit QMS Report"}
        </Button>
        <Button variant="link" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
