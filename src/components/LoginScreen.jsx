import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  FormControl,
  FormLabel,
  Button,
  Stack,
  Text,
  Box,
  useToast,
  Link,
  IconButton,
  Icon,
  Divider,
  AbsoluteCenter,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { userLogin, GoogleLogin } from "../service/auth";
import { FaGoogle } from "react-icons/fa";
import useDataStore from "../zustand/userDataStore";

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  const navigate = useNavigate();
  const setUser = useDataStore((state) => state.setUser);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleError = (error) => {
    let errorMessage = "An unexpected error occurred";
    if (error?.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    toast({
      title: "Login failed",
      description: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-center",
    });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const result = await userLogin(email, password);

      if (typeof result === "string") {
        // Backend returned a string error
        toast({
          title: "Login Error",
          description: result,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Assuming result contains user info
        const userName = result.user?.displayName || "User";
        toast({
          title: `Welcome, ${userName}!`,
          description: "Login Successful",
          status: "success",
          duration: 5000,
          position: "top-center",
          isClosable: true,
        });
        navigate("/welcome");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(() => {
    setIsLoading(true);
    GoogleLogin()
      .then((user) => {
        toast({
          title: `Welcome, ${user.displayName || "User"}!`,
          description: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });
        setUser(user);
        navigate("/welcome");
      })
      .catch((error) => {
        console.error("Error in Google Login", error);
        handleError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate, toast]);

  return (
    <Box
      maxW="md"
      mx="auto"
      p={4}
      borderWidth={1}
      width="100%"
      maxWidth="500px"
      borderRadius="md"
      mb={5}
      mt={5}
    >
      {/* Heading and Introductory Text */}
      <Box textAlign="center" mb={8}>
        <Text fontSize="2xl" fontWeight="bold" mt={5}>
          Sign in to your account
        </Text>
        {/* Styled message */}
        <Text
          mb={6}
          bg="#fff2f0"
          border="1px"
          borderColor="#000"
          p={2}
          mt={5}
          borderRadius="md"
          textAlign="left"
          fontSize="sm"
        >
          Welcome Back! Please enter your details to login..
        </Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                />
              )}
            />
            {errors.email && (
              <Text color="red.500">{errors.email.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <HStack justify="space-between">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link color="teal.500" href="/forgot-password">
                Forgot Password?
              </Link>
            </HStack>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              )}
            />
            {errors.password && (
              <Text color="red.500">{errors.password.message}</Text>
            )}
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            isLoading={isLoading}
            loadingText="Please Wait..."
          >
            Login
          </Button>
        </Stack>
      </form>

      <Box mt={4}>
        <Text textAlign="center">
          Don't have an account?{" "}
          <Link color="teal.500" href="/register">
            Register here
          </Link>
        </Text>
      </Box>

      <Box textAlign="center">
        <Box position='relative' padding='10'>
          <Divider />
          <AbsoluteCenter bg='white' px='4'>
            <Text>Or sign in with:</Text>
          </AbsoluteCenter>
        </Box>

        <Stack spacing={4} direction="row" justify="center">
          <IconButton
            aria-label="Sign in with Google"
            p={5}
            icon={
              <HStack spacing={2}>
                <Icon as={FaGoogle} />
                <Text>Sign in with Google</Text>
              </HStack>
            }
            onClick={handleGoogleLogin}
            colorScheme="blue"
            variant="solid"
            w="full"
            justifyContent="flex-start"
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
