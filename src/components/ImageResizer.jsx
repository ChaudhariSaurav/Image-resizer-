import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Image,
  Text,
  Progress,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FaDropbox, FaGoogleDrive, FaUpload } from "react-icons/fa";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { listenForUserPlan } from "../utils/firebaseUtils"; // Adjust the import according to your setup
import { auth } from "../config/firebase"; // Ensure this import is correct

const ImageResizer = () => {
  const [image, setImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [compressionQuality, setCompressionQuality] = useState(100);
  const [desiredSize, setDesiredSize] = useState(100); // in KB
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [resizeCount, setResizeCount] = useState(0);
  const [resizeLimit, setResizeLimit] = useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const plan = await listenForUserPlan(user.uid);
          setResizeLimit(plan.maxResizes);
        } else {
          throw new Error("User is not authenticated.");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch plan information.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchPlanData();
  }, [toast]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
    },
  });

  const handleResize = async () => {
    if (!image) return;

    if (resizeCount >= resizeLimit) {
      toast({
        title: "Resize Limit Reached",
        description: `You have reached the limit of ${resizeLimit} resizes. Current resize count: ${resizeCount}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    setResizedImage(null);

    try {
      const imageFile = await fetch(image).then((res) => res.blob());
      const options = {
        maxSizeMB: desiredSize / 1024,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: compressionQuality / 100,
      };

      const compressedFile = await imageCompression(imageFile, options);
      const compressedUrl = URL.createObjectURL(compressedFile);

      setResizedImage(compressedUrl);
      setProgress(100);
      setResizeCount((prev) => prev + 1);
      toast({
        title: "Image Resized",
        description: `Your image has been resized and compressed. Resize count: ${
          resizeCount + 1
        }`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resize and compress the image.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a valid image URL.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    axios
      .get(imageUrl, { responseType: "blob" })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setImage(url);
        setImageUrl("");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to fetch image from URL.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleGoogleDrive = () => {
    toast({
      title: "Google Drive Integration",
      description: "Google Drive integration is not yet implemented.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleDownload = () => {
    if (resizedImage) {
      const link = document.createElement("a");
      link.href = resizedImage;
      link.download = "resized-image.jpg";
      link.click();
    }
  };

  const handleReset = () => {
    setImage(null);
    setResizedImage(null);
    setProgress(0);
    setResizeCount(0);
    toast({
      title: "Reset",
      description: "Image and progress have been reset.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={5}>
      <Box mb={4}>
        <Alert status="warning">
          <AlertIcon />
          Resize Limit: {resizeCount} / {resizeLimit}
        </Alert>
      </Box>

      <Box
        mb={4}
        {...getRootProps()}
        border="2px dashed"
        borderColor="gray.300"
        p={5}
        textAlign="center"
      >
        <input {...getInputProps()} />
        <Text mb={2}>
          Drag & drop an image here, or click to select from your device.
        </Text>
        <Button leftIcon={<FaUpload />} colorScheme="blue">
          Upload Image
        </Button>
      </Box>

      <Box mb={4}>
        <Button
          leftIcon={<FaDropbox />}
          onClick={() =>
            toast({
              title: "Dropbox Integration",
              description: "Dropbox integration is not yet implemented.",
              status: "info",
              duration: 5000,
              isClosable: true,
            })
          }
          w="full"
          mb={4}
        >
          From Dropbox
        </Button>
        <Button
          leftIcon={<FaGoogleDrive />}
          onClick={handleGoogleDrive}
          w="full"
        >
          From Google Drive
        </Button>
      </Box>

      <Button
        colorScheme="teal"
        w="full"
        onClick={() => setShowUrlInput((prev) => !prev)}
      >
        {showUrlInput ? "Hide URL Input" : "Load Image from URL"}
      </Button>

      {showUrlInput && (
        <Box mt={4}>
          <Input
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button w="full" mt={2} colorScheme="teal" onClick={handleUrlSubmit}>
            Submit URL
          </Button>
        </Box>
      )}

      {image && !loading && !resizedImage && (
        <Box mt={4}>
          <Image src={image} boxSize="200px" objectFit="cover" />
          <Button
            mt={2}
            colorScheme="blue"
            w="full"
            onClick={onOpen}
            isDisabled={resizeCount >= resizeLimit}
          >
            Resize Image
          </Button>
        </Box>
      )}

      {loading && <Spinner mt={4} />}

      {resizedImage && (
        <Box mt={4}>
          <Image src={resizedImage} boxSize="200px" objectFit="cover" />
          <Button mt={2} colorScheme="blue" onClick={handleDownload}>
            Download Resized Image
          </Button>
        </Box>
      )}

      <Button mt={4} colorScheme="red" w="full" onClick={handleReset}>
        Reset
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resize Image</ModalHeader>
          <ModalBody>
            <FormControl id="quality">
              <FormLabel>Compression Quality (%)</FormLabel>
              <Input
                type="number"
                value={compressionQuality}
                onChange={(e) => setCompressionQuality(Number(e.target.value))}
              />
            </FormControl>
            <FormControl mt={4} id="size">
              <FormLabel>Desired Size (KB)</FormLabel>
              <Input
                type="number"
                value={desiredSize}
                onChange={(e) => setDesiredSize(Number(e.target.value))}
              />
            </FormControl>
            <Progress mt={4} value={progress} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleResize} isDisabled={resizeCount >= resizeLimit}>
              Resize
            </Button>
            <Button colorScheme="red" onClick={onClose} ml={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ImageResizer;
