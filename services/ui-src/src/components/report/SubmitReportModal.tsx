import { ModalBody, ModalFooter, Button } from "@chakra-ui/react";

export const SubmitReportModal = (
  onClose: (modalOpen: boolean) => void,
  onSubmit: () => Promise<void>
) => {
  const submitHandler = async () => {
    await onSubmit();
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
          Submit QMS Report
        </Button>
        <Button variant="link" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
