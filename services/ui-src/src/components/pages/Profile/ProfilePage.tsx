import { useNavigate } from "react-router-dom";
import { Button, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate, Table } from "components";
import { useStore } from "utils";
import { HELP_DESK_EMAIL_ADDRESS } from "../../../constants";

export const ProfilePage = () => {
  const navigate = useNavigate();

  const { email, given_name, family_name, userRole, state, userIsAdmin } =
    useStore().user ?? {};

  const tableContent = {
    caption: "Profile Account Information",
    bodyRows: [
      ["Email", email!],
      ["First Name", given_name!],
      ["Last Name", family_name!],
      ["Role", userRole!],
      ["State", state || "N/A"],
    ],
  };

  return (
    <PageTemplate>
      <Heading as="h1" variant="h1">
        My Account
      </Heading>
      <Text>
        If any information is incorrect, please contact the Managed Care
        Reporting (MCR) Help Desk at{" "}
        <Link href={`mailto:${HELP_DESK_EMAIL_ADDRESS}`} isExternal>
          {HELP_DESK_EMAIL_ADDRESS}
        </Link>
        .
      </Text>
      <Table content={tableContent} variant="striped" />
      {userIsAdmin && (
        <Button onClick={() => navigate("/admin")}>Banner Editor</Button>
      )}
    </PageTemplate>
  );
};
