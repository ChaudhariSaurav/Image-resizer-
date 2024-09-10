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
  Text,
  Link,
  
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase"; // Adjust the path to your firebase config
import { ChevronLeftIcon } from "@chakra-ui/icons"; // Import an icon

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState(""); // State to manage email message
  const toast = useToast();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Check if email field is empty
    if (!email) {
      toast({
        title: "Email Required.",
        description: "Please enter your email address.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailMessage(`We're sending the reset link to this email id: ${email}`);
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
      setEmailMessage(""); // Clear email message on error
      if (error.code === "auth/invalid-email") {
        toast({
          title: "Invalid Email Address.",
          description: "Please enter a valid email address.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else if (error.code === "auth/user-not-found") {
        toast({
          title: "Email Not Found.",
          description: "There is no account associated with this email address.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error.",
          description: "There was an error sending the password reset email. Please try again.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Container maxW="md" centerContent mt={5} mb={5}>
      <Box
        p={6}
        borderWidth={1}
        width="100%"
        maxWidth="800px"
      >
        <Heading mb={6}>Forgot Password</Heading>
        {/* Styled message */}
        <Text
          mb={6}
          bg="#fff2f0"
          border="1px"
          borderColor="#000"
          p={2}
          borderRadius="md"
          textAlign="left"
          fontSize="sm"
        >
          Enter the email address associated with your account to reset your password.
        </Text>
        {/* Conditional email message */}
        {emailMessage && (
          <Text
            mb={4}
            bg="#dff0d8"
            border="1px"
            borderColor="#d0e9c6"
            p={2}
            borderRadius="md"
            textAlign="left"
            fontSize="sm"
          >
            {emailMessage}
          </Text>
        )}
        <form onSubmit={handlePasswordReset}>
          <FormControl mb={4} id="email">
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

          <Box textAlign="center" mt={4}>
            <Link href="/login" display="flex" alignItems="center" color="teal.500">
              <ChevronLeftIcon boxSize={5} mr={2} /> {/* Home icon */}
              Return to Sign In
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
