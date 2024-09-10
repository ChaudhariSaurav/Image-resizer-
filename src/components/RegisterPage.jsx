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
} from "@chakra-ui/react";
import { registerUser } from "../service/auth";
import { useDropzone } from "react-dropzone";

const RegisterPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState(null);

  const onDrop = React.useCallback((acceptedFiles) => {
    setProfileImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { email, password, name, dob, mobileNo } = data;

    try {
      if (!profileImage) {
        throw new Error("Please upload a profile image.");
      }

      const result = await registerUser(
        email,
        password,
        name,
        dob,
        mobileNo,
        profileImage,
      );

      if (result instanceof Error) {
        throw result;
      }

      // Reset form fields
      reset();

      // Clear the profile image
      setProfileImage(null);

      toast({
        title: "Registration Successful",
        description: "Welcome!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Registration Error",
        description: error.message || "An unknown error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  return (
    <Box maxW="md" mx="auto" p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={field.value || ""} // Ensure controlled input
                  onChange={field.onChange}
                />
              )}
            />
            {errors.name && <Text color="red.500">{errors.name.message}</Text>}
          </FormControl>

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
                  value={field.value || ""} // Ensure controlled input
                  onChange={field.onChange}
                />
              )}
            />
            {errors.email && (
              <Text color="red.500">{errors.email.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.mobileNo}>
            <FormLabel htmlFor="mobileNo">Mobile Number</FormLabel>
            <Controller
              name="mobileNo"
              control={control}
              rules={{
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid mobile number",
                },
              }}
              render={({ field }) => (
                <Input
                  id="mobileNo"
                  placeholder="Enter your mobile number"
                  value={field.value || ""} // Ensure controlled input
                  onChange={field.onChange}
                />
              )}
            />
            {errors.mobileNo && (
              <Text color="red.500">{errors.mobileNo.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={field.value || ""} // Ensure controlled input
                  onChange={field.onChange}
                />
              )}
            />
            {errors.password && (
              <Text color="red.500">{errors.password.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field }) => (
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={field.value || ""} // Ensure controlled input
                  onChange={field.onChange}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text color="red.500">{errors.confirmPassword.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.dob}>
            <FormLabel htmlFor="dob">Date of Birth</FormLabel>
            <Controller
              name="dob"
              control={control}
              rules={{ required: "Date of Birth is required" }}
              render={({ field }) => (
                <Input
                  id="dob"
                  type="date"
                  value={field.value || ""} // Ensure controlled input
                  onChange={field.onChange}
                />
              )}
            />
            {errors.dob && <Text color="red.500">{errors.dob.message}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel>Profile Image</FormLabel>
            <Box
              p={4}
              borderWidth={1}
              borderRadius="md"
              borderStyle="dashed"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {profileImage ? (
                <Text>{profileImage.name}</Text>
              ) : (
                <Text>
                  Drag & drop a profile image here, or click to select one
                </Text>
              )}
            </Box>
          </FormControl>

          <Button colorScheme="teal" type="submit" isLoading={isLoading}>
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default RegisterPage;
