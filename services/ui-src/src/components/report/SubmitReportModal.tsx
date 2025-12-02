import { ModalBody, ModalFooter, Button } from "@chakra-ui/react";

export const SubmitReportModal = (
  onClose: (modalOpen: boolean) => void,
  onSubmit: () => Promise<void>,
  reportType: string
) => {
  const submitHandler = async () => {
    await onSubmit();
  };

  const submitModalText = `You won’t be able to make edits after submitting unless you send a request to CMS to unlock your submission. After review, your CMS LABS Lead will contact you if there are corrections to be made, and your report status will change to “In revision” in the ${reportType} Report dashboard.`;

  return (
    <>
      <ModalBody>{submitModalText}</ModalBody>
      <ModalFooter gap="4">
        <Button colorScheme="blue" mr={3} onClick={() => submitHandler()}>
          {`Submit ${reportType} Report`}
        </Button>
        <Button variant="link" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
