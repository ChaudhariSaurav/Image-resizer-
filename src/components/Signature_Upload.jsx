import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  Progress,
  useToast,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FaUpload, FaEllipsisV } from "react-icons/fa";
import imageCompression from "browser-image-compression";

const MAX_SIGNATURES = 10; // Maximum allowed signatures resize in a day
const RESET_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const SignatureUpload = () => {
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signatureSizeError, setSignatureSizeError] = useState(false);
  const [compressionValue, setCompressionValue] = useState(100); // Default compression quality
  const [maxSize, setMaxSize] = useState(50); // Default max size in KB
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [width, setWidth] = useState(1920); // Default width in pixels
  const [height, setHeight] = useState(100); // Default height in pixels
  const [dpi, setDpi] = useState(200); // Default DPI
  const [signatureCount, setSignatureCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // Time left for reset
  const toast = useToast();
  const [toastVisible, setToastVisible] = useState(false); // Track toast visibility

  useEffect(() => {
    const count = parseInt(localStorage.getItem("signatureCount")) || 0;
    const timestamp = parseInt(localStorage.getItem("signatureTimestamp")) || 0;

    if (Date.now() - timestamp > RESET_TIME) {
      resetSignatureCount();
    } else {
      setSignatureCount(count);
      setTimeLeft(RESET_TIME - (Date.now() - timestamp)); // Calculate time left
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          resetSignatureCount();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const showToast = (title, description, status) => {
    if (!toastVisible) {
      toast({
        title,
        description,
        status,
        duration: 5000,
        isClosable: true,
      });
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 5000);
    }
  };

  const resetSignatureCount = () => {
    localStorage.setItem("signatureCount", 0);
    localStorage.setItem("signatureTimestamp", Date.now());
    setSignatureCount(0);
    setTimeLeft(0);
    showToast("Reset Complete", "You can resize your signature again.", "info");
  };

  const updateSignatureCount = (count) => {
    localStorage.setItem("signatureCount", count);
    localStorage.setItem("signatureTimestamp", Date.now());
    setSignatureCount(count);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const options = {
          maxSizeMB: maxSize / 1024, // Convert KB to MB
          maxWidthOrHeight: Math.max(width, height),
          initialQuality: compressionValue / 100,
          useWebWorker: true,
        };

        setLoading(true);
        try {
          const compressedFile = await imageCompression(file, options);
          const compressedUrl = URL.createObjectURL(compressedFile);
          setSignature(compressedUrl);
          setSignatureSizeError(false);
        } catch (error) {
          showToast(
            "Compression Error",
            "Failed to compress the signature image.",
            "error"
          );
        } finally {
          setLoading(false);
        }
      }
    },
  });

  const handleDownload = () => {
    if (signature) {
      const link = document.createElement("a");
      link.href = signature;
      link.download = "signature-image.jpg";
      link.click();

      const newCount = signatureCount + 1;
      if (newCount > MAX_SIGNATURES) {
        showToast(
          "Limit Reached",
          "You can only resize your signature 10 times a day.",
          "warning"
        );
        return;
      }
      updateSignatureCount(newCount);
      setSignature(null);
    }
  };

  return (
    <Box p={5} maxW={{ base: "100%", md: "100%" }} mx="auto">
      {signatureCount >= MAX_SIGNATURES && (
       <Alert status="warning" mb={4}>
       <AlertIcon />
       You have reached the maximum of {MAX_SIGNATURES} signature resizes today.
       {timeLeft > 0 && (
         <Text ml={2}>
           Reset in {Math.floor(timeLeft / 3600000)}h{" "} {/* Convert milliseconds to hours */}
           {Math.floor((timeLeft % 3600000) / 60000)}m{" "} {/* Remaining minutes */}
           {Math.floor((timeLeft % 60000) / 1000)}s {/* Remaining seconds */}
         </Text>
       )}
     </Alert>
      )}

      {signatureSizeError && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          The signature image must be between 20 KB and 35 KB.
        </Alert>
      )}

      <Alert status="success" mb={4} borderColor={"blue.400"} borderWidth={"1px"}>
        <AlertIcon />
        You have a daily limit of 10 signature resizes. If you need more, feel
        free to reach out for options!.
      </Alert>

      <Box mb={4} position="relative">
        <IconButton
          icon={<FaEllipsisV />}
          onClick={() => setIsModalOpen(true)}
          aria-label="More settings"
          position="absolute"
          top={2}
          right={2}
          isDisabled={signatureCount >= MAX_SIGNATURES}
        />
        <Box
          {...getRootProps()}
          border="2px dashed"
          borderColor="gray.300"
          p={5}
          textAlign="center"
          borderRadius="md"
          _hover={{ borderColor: "blue.400" }}
        >
          <input {...getInputProps()} />
          <Text mb={2}>
            Drag & drop a signature image here, or click to select from your
            device.
          </Text>
          <Button
            leftIcon={<FaUpload />}
            colorScheme="blue"
            isDisabled={signatureCount >= MAX_SIGNATURES}
          >
            Upload Signature Image
          </Button>
        </Box>
      </Box>

      {loading && <Progress size="xs" isIndeterminate mt={4} />}

      {signature && !loading && (
        <Box mt={4}>
          <Image
            src={signature}
            boxSize={{ base: "100%", md: "150px" }}
            objectFit="contain"
            border="1px solid gray"
            borderRadius="md"
            filter={signatureCount >= MAX_SIGNATURES ? "blur(5px)" : "none"}
          />
          <Button
            mt={2}
            colorScheme="blue"
            onClick={handleDownload}
            isDisabled={signatureCount >= MAX_SIGNATURES}
          >
            Download Signature Image
          </Button>
        </Box>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adjust Signature Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Select the desired compression quality (%):</Text>
            <Slider
              defaultValue={compressionValue}
              min={20}
              max={100}
              onChange={(val) => setCompressionValue(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text>Current Value: {compressionValue}%</Text>

            <Text mt={4} mb={2}>Set the maximum signature size (KB):</Text>
            <Slider
              defaultValue={maxSize}
              min={0}
              max={100}
              onChange={(val) => setMaxSize(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text>Current Maximum Size: {maxSize} KB</Text>

            <Text mt={4} mb={2}>Set the width (px):</Text>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Width in px"
            />

            <Text mt={4} mb={2}>Set the height (px):</Text>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height in px"
            />

            <Text mt={4} mb={2}>Set the DPI:</Text>
            <Input
              type="number"
              value={dpi}
              onChange={(e) => setDpi(e.target.value)}
              placeholder="DPI (e.g., 72, 96, 300)"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Save Settings
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SignatureUpload;
