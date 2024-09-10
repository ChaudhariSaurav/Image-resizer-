import React from "react";
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
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { userLogin, GoogleLogin } from "../service/auth";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const result = await userLogin(email, password);
      if (typeof result === "string") {
        toast({
          title: "Login Error",
          description: result,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
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
      toast({
        title: "An error occurred",
        description: "Something went wrong during login.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderLogin = async (loginFunction) => {
    setIsLoading(true);
    GoogleLogin();
    try {
      const user = await loginFunction();
      const userName = user?.displayName || "User";
      toast({
        title: `Welcome, ${userName}!`,
        description: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/welcome");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={4}>
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
            <FormLabel htmlFor="password">Password</FormLabel>
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

          <Box textAlign="center">
            <Link color="teal.500" href="/forgot-password">
              Forgot Password?
            </Link>
          </Box>
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

      <Box mt={4} textAlign="center">
        <Text mb={2}>Or sign in with:</Text>
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
            onClick={() => handleProviderLogin(GoogleLogin)}
            colorScheme="teal"
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
