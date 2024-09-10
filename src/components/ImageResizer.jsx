import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FaDropbox, FaGoogleDrive, FaUpload } from "react-icons/fa";
import axios from "axios";
import imageCompression from "browser-image-compression";

const ImageResizer = () => {
  const [image, setImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [compressionQuality, setCompressionQuality] = useState(100);
  const [desiredSize, setDesiredSize] = useState(100); // in KB
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false); // State to toggle URL input
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*", // Only accept images
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
    },
  });

  const handleResize = async () => {
    if (!image) return;

    setLoading(true);
    setProgress(0);
    setResizedImage(null); // Reset resized image before resizing

    try {
      const imageFile = await fetch(image).then((res) => res.blob());
      const options = {
        maxSizeMB: desiredSize / 1024, // Convert KB to MB for the library
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: compressionQuality / 100,
      };

      const compressedFile = await imageCompression(imageFile, options);
      const compressedUrl = URL.createObjectURL(compressedFile);

      setResizedImage(compressedUrl);
      setProgress(100);
      toast({
        title: "Image Resized",
        description: "Your image has been resized and compressed.",
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
    // Implement Google Drive file picker and OAuth
    // For demo purposes, this will simply show a toast
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
      link.download = "resized-image.jpg"; // Set file name here
      link.click();
    }
  };

  return (
    <Box p={5}>
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
          <Button mt={2} colorScheme="blue" onClick={onOpen}>
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
                onChange={(e) => setCompressionQuality(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4} id="size">
              <FormLabel>Desired Size (KB)</FormLabel>
              <Input
                type="number"
                value={desiredSize}
                onChange={(e) => setDesiredSize(e.target.value)}
              />
            </FormControl>
            <Button mt={4} colorScheme="blue" onClick={handleResize}>
              Resize
            </Button>
            <Progress mt={4} value={progress} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ImageResizer;
