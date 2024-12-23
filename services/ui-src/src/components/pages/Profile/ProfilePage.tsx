import { useNavigate } from "react-router-dom";
import { Button, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate, Table } from "components";
import { createEmailLink, useStore } from "utils";
import verbiage from "verbiage/pages/profile";

export const ProfilePage = () => {
  const navigate = useNavigate();

  const { email, given_name, family_name, userRole, state, userIsAdmin } =
    useStore().user ?? {};

  const { intro } = verbiage;

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
    <PageTemplate sx={sx.layout}>
      <Heading as="h1" variant="h1">
        {intro.header}
      </Heading>
      <Text>
        {intro.body}{" "}
        <Link href={createEmailLink(intro.email)} isExternal>
          {intro.email.address}
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

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
      marginBottom: "5rem !important",
    },
  },
};
