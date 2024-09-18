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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { registerUser } from "../service/auth";
import { useDropzone } from "react-dropzone";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

const RegisterPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobileNo: "",
      password: "",
      confirmPassword: "",
      dob: "",
    },
  });
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState(null);
  const [imageToCrop, setImageToCrop] = React.useState(null);
  const [croppedImage, setCroppedImage] = React.useState(null);
  const [crop, setCrop] = React.useState({ unit: '%', width: 30, aspect: 1 });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageToCrop(URL.createObjectURL(file));
    onOpen();
  }, [onOpen]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1, // Ensure only one file is accepted
  });

  const handleCropComplete = (crop) => {
    if (imageToCrop && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = document.createElement('img');
      image.src = imageToCrop;
      image.onload = () => {
        canvas.width = crop.width;
        canvas.height = crop.height;
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        const croppedImageURL = canvas.toDataURL();
        setCroppedImage(croppedImageURL);
      };
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { email, password, name, dob, mobileNo } = data;

    try {
      if (!croppedImage) {
        throw new Error("Please crop and upload a profile image.");
      }

      // Convert croppedImage back to a file object if needed
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });

      // Register the user
      await registerUser(
        email,
        password,
        name,
        dob,
        mobileNo,
        file
      );

      // Reset form fields and profile image
      reset();
      setProfileImage(null);
      setCroppedImage(null);

      toast({
        title: "Registration Successful",
        description: "Welcome! You have successfully registered your account.",
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
      <Box textAlign="center" mb={8}>
        <Text fontSize="2xl" fontWeight="bold">
          Sign up to your account
        </Text>
      </Box>

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
                  {...field}
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
                  {...field}
                />
              )}
            />
            {errors.email && <Text color="red.500">{errors.email.message}</Text>}
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
                  {...field}
                />
              )}
            />
            {errors.mobileNo && <Text color="red.500">{errors.mobileNo.message}</Text>}
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
                  {...field}
                />
              )}
            />
            {errors.password && <Text color="red.500">{errors.password.message}</Text>}
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
                  {...field}
                />
              )}
            />
            {errors.confirmPassword && <Text color="red.500">{errors.confirmPassword.message}</Text>}
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
                  {...field}
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
              cursor="pointer"
              textAlign="center"
            >
              <input {...getInputProps()} />
              {croppedImage ? (
                <Image src={croppedImage} alt="Profile Image" boxSize="100px" objectFit="cover" />
              ) : (
                <Text>Drag & drop a profile image here, or click to select one</Text>
              )}
            </Box>
          </FormControl>

          <Button colorScheme="teal" type="submit" isLoading={isLoading}>
            Register
          </Button>
        </Stack>

        <Box textAlign="center" mt={4}>
          <Link href="/login" display="flex" alignItems="center" color="teal.500">
            <ChevronLeftIcon boxSize={5} mr={2} />
            Return to Sign In
          </Link>
        </Box>
      </form>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crop Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {imageToCrop && (
              <ReactCrop
                src={imageToCrop}
                crop={crop}
                onChange={setCrop}
                onComplete={handleCropComplete}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Save
            </Button>
            <Button variant="ghost" ml={3} onClick={() => setImageToCrop(null)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RegisterPage;
