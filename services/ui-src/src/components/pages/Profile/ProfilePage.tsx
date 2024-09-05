import { useNavigate } from "react-router-dom";
import { Button, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate, Table } from "components";
import { createEmailLink, useStore } from "utils";
import verbiage from "verbiage/pages/profile";
import { useEffect, useState } from "react";
import { getHelloWorld } from "utils/api/requestMethods/helloWorld";

export const ProfilePage = () => {
  const navigate = useNavigate();

  const [helloWorldMessage, setHelloWorldMessage] = useState<string>(
    "default value thing"
  ); //remove

  const [loading, setLoading] = useState<boolean>(false);

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

  //TODO: remove this useEffect
  useEffect(() => {
    const fetchStuff = async () => {
      setLoading(true);
      try {
        const response = await getHelloWorld();
        setHelloWorldMessage(response);
      } catch (e: any) {
        /* eslint-disable no-console */
        console.log(e.message);
        setHelloWorldMessage(e.message);
      }
      setLoading(false);
    };
    fetchStuff();
  }, []);

  return (
    <PageTemplate sx={sx.layout} data-testid="profile-view">
      <Heading as="h1" sx={sx.headerText}>
        {intro.header}
      </Heading>
      {!loading && (
        <Heading as="h1" sx={sx.headerText}>
          {helloWorldMessage}
        </Heading>
      )}
      <Text>
        {intro.body}{" "}
        <Link href={createEmailLink(intro.email)} isExternal>
          {intro.email.address}
        </Link>
        .
      </Text>
      <Table content={tableContent} variant="striped" sxOverride={sx.table} />
      {userIsAdmin && (
        <Button
          sx={sx.adminButton}
          onClick={() => navigate("/admin")}
          data-testid="banner-admin-button"
        >
          Banner Editor
        </Button>
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
  headerText: {
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  table: {
    marginTop: "2rem",
    maxWidth: "100%",
    "tr td:first-of-type": {
      width: "8rem",
      fontWeight: "semibold",
    },
    td: {
      padding: "0.5rem",
    },
  },
  adminButton: {
    marginTop: "2rem",
  },
};
