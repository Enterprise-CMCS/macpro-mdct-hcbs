import { createEmailLink } from "./email";

const testEmailAddress = "test@testme.com";
const testEmailSubject = "TestSubject";

describe("utils/email", () => {
  describe("createEmailLink()", () => {
    test("only address passed", () => {
      const mailTo = createEmailLink({ address: testEmailAddress });
      expect(mailTo).toEqual("mailto:test@testme.com");
    });

    test("all fields passed", () => {
      const mailTo = createEmailLink({
        address: testEmailAddress,
        subject: testEmailSubject,
      });
      expect(mailTo).toEqual("mailto:test@testme.com?TestSubject");
    });
  });
});
