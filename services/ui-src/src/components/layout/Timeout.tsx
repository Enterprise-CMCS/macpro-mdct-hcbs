import { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  Text,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {
  calculateRemainingSeconds,
  refreshCredentials,
  updateTimeout,
  UserContext,
} from "utils";
import { PROMPT_AT, IDLE_WINDOW } from "../../constants";
import { add } from "date-fns";

export const Timeout = () => {
  const context = useContext(UserContext);
  const { logout } = context;
  const [timeLeft, setTimeLeft] = useState((IDLE_WINDOW - PROMPT_AT) / 1000);
  const [showTimeout, setShowTimeout] = useState(false);
  const [timeoutPromptId, setTimeoutPromptId] = useState<number>();
  const [timeoutForceId, setTimeoutForceId] = useState<number>();
  const [updateTextIntervalId, setUpdateTextIntervalId] = useState<number>();
  const location = useLocation();

  useEffect(() => {
    setTimer();
    return () => {
      clearTimers();
    };
  }, [location]);

  const setTimer = () => {
    const expiration = add(new Date(), {
      seconds: IDLE_WINDOW / 1000,
    });
    if (timeoutPromptId) {
      clearTimers();
    }
    updateTimeout();
    setShowTimeout(false);

    // Set the initial timer for when a prompt appears
    const promptTimer = window.setTimeout(() => {
      // Once the prompt appears, set timers for logging out, and for updating text on screen
      setTimeLeft(calculateRemainingSeconds(expiration));
      setShowTimeout(true);
      const forceLogoutTimer = window.setTimeout(() => {
        clearTimers();
        logout();
      }, IDLE_WINDOW - PROMPT_AT);
      const updateTextTimer = window.setInterval(() => {
        setTimeLeft(calculateRemainingSeconds(expiration));
      }, 500);
      setTimeoutForceId(forceLogoutTimer);
      setUpdateTextIntervalId(updateTextTimer);
    }, PROMPT_AT);
    setTimeoutPromptId(promptTimer);
  };

  const clearTimers = () => {
    clearTimeout(timeoutPromptId);
    clearTimeout(timeoutForceId);
    clearTimeout(updateTextIntervalId);
  };

  const refreshAuth = () => {
    setShowTimeout(false);
    setTimer();
    refreshCredentials();
  };

  const formatTime = (time: number) => {
    return `${Math.floor(time)} seconds`;
  };

  return (
    <Modal isOpen={showTimeout} onClose={refreshAuth}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Session timeout</ModalHeader>
        <ModalBody>
          <Text>
            Due to inactivity, you will be logged out in {formatTime(timeLeft)}.
            Choose to stay logged in or log out. Otherwise, you will be logged
            out automatically.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={refreshAuth} type="submit">
            Stay logged in
          </Button>
          <Button onClick={logout} type="submit" variant="outline">
            Log out
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
