import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "aws-amplify/auth";
import { Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { ErrorAlert } from "components";
import { ErrorVerbiage } from "types";

export const LoginCognito = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ErrorVerbiage>();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await signIn({ username, password });
      navigate(`/`);
    } catch (err) {
      const message = err instanceof Error ? err.message : undefined;
      setError({
        title: "Unable to login",
        children: message,
      });
    }
  };

  return (
    <Stack>
      <Heading fontSize="heading_xl" as="h2" sx={sx.heading}>
        Log In with Cognito
      </Heading>
      <ErrorAlert error={error} alertSxOverride={sx.error} />
      <form onSubmit={handleLogin}>
        <Box>
          <label>
            <Text sx={sx.labelDescription}>Email</Text>
            <Input
              id="email"
              name="email"
              type="email"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
              className="field"
            />
          </label>
        </Box>
        <Box>
          <label>
            <Text sx={sx.labelDescription}>Password</Text>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              className="field"
            />
          </label>
        </Box>
        <Button sx={sx.button} onClick={handleLogin} type="submit">
          Log In with Cognito
        </Button>
      </form>
    </Stack>
  );
};

const sx = {
  heading: {
    alignSelf: "center",
  },
  error: {
    marginY: "spacer2",
  },
  labelDescription: {
    marginBottom: "spacer1",
  },
  button: {
    marginTop: "spacer4",
    width: "100%",
  },
};
