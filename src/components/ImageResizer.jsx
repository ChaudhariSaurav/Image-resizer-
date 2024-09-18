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
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import imageCompression from "browser-image-compression";

const ImageResizer = () => {
  const [image, setImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [compressionQuality, setCompressionQuality] = useState(100);
  const [desiredSize, setDesiredSize] = useState(100); // in KB
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [resizeCount, setResizeCount] = useState(0);
  const [resizeLimit, setResizeLimit] = useState(5);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Retrieve the resize count from localStorage on load
  useEffect(() => {
    const storedResizeData = JSON.parse(localStorage.getItem("resizeCount"));
    if (storedResizeData) {
      const { count, timestamp } = storedResizeData;
      const oneDayInMillis = 24 * 60 * 60 * 1000;
      const currentTime = new Date().getTime();

      if (currentTime - timestamp < oneDayInMillis) {
        setResizeCount(count);
      } else {
        localStorage.removeItem("resizeCount"); // Remove data after one day
      }
    }
  }, []);

  // Update the resize count in localStorage after every resize
  useEffect(() => {
    if (resizeCount > 0) {
      const data = {
        count: resizeCount,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem("resizeCount", JSON.stringify(data));
    }
  }, [resizeCount]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"]
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
    },
  });

  const handleResize = async () => {
    if (!image) return;

    if (resizeCount >= resizeLimit) {
      setShowLimitAlert(true); // Show the alert
      return;
    }

    setLoading(true);
    setResizedImage(null);
    setShowLimitAlert(false); // Hide the alert if it was previously shown

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
      setResizeCount((prev) => prev + 1);
      toast({
        title: "Image Resized",
        description: `Your image has been resized and compressed. Resize count: ${resizeCount + 1}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Close the modal after resizing is done
      setTimeout(() => onClose(), 500); // Adjust timeout if needed
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

  const handleDownload = () => {
    if (resizedImage) {
      const link = document.createElement("a");
      link.href = resizedImage;
      link.download = "resized-image.jpg";
      link.click();

      setResizedImage(null);
      setImage(null); // Optional: Uncomment if you want to clear the original image as well
    }
  };

  return (
    <Box p={5}>
      {/* Resize Limit Alert */}
      {resizeCount >= resizeLimit && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          <AlertTitle>Resize Limit Reached</AlertTitle>
          <AlertDescription>
            You have reached the limit of {resizeLimit} resizes. You can try again after 24
            hours.
          </AlertDescription>
        </Alert>
      )}

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

      {loading && <Progress size="xs" isIndeterminate mt={4} />}

      {resizedImage && (
        <Box mt={4}>
          <Image src={resizedImage} boxSize="200px" objectFit="cover" />
          <Button mt={2} colorScheme="blue" onClick={handleDownload}>
            Download Resized Image
          </Button>
        </Box>
      )}

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
            <Progress mt={4} size="xs" isIndeterminate />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleResize}
              isDisabled={resizeCount >= resizeLimit}
            >
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
