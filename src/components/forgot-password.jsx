import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  Container,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase"; // Adjust the path to your firebase config

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent.",
        description: "Check your inbox for the password reset link.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setEmail(""); // Clear the input field after successful request
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast({
        title: "Error.",
        description:
          "There was an error sending the password reset email. Please try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" centerContent>
      <Box
        p={6}
        rounded="md"
        shadow="md"
        borderWidth={1}
        width="100%"
        maxWidth="500px"
      >
        <Heading mb={6}>Forgot Password</Heading>
        <form onSubmit={handlePasswordReset}>
          <FormControl mb={4} id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          <Button colorScheme="teal" type="submit" width="full">
            Send Password Reset Email
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
