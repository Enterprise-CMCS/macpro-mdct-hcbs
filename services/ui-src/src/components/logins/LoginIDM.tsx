import { useContext } from "react";
import { UserContext } from "utils";
import { Box, Button, Heading } from "@chakra-ui/react";

export const LoginIDM = () => {
  const context = useContext(UserContext);
  const { loginWithIDM } = context;

  return (
    <Box sx={sx.root}>
      <Heading as="h2" fontSize="heading_xl" sx={sx.heading}>
        Log In with IDM
      </Heading>
      <Button sx={sx.button} onClick={loginWithIDM}>
        Log In with IDM
      </Button>
    </Box>
  );
};

const sx = {
  root: {
    textAlign: "center",
  },
  heading: {
    marginBottom: "spacer4",
    alignSelf: "center",
  },
  button: {
    width: "100%",
  },
};
