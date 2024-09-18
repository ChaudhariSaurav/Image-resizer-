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
  const [compressionValue, setCompressionValue] = useState(50);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureCount, setSignatureCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // Time left for reset
  const toast = useToast();
  const [toastVisible, setToastVisible] = useState(false); // Track toast visibility

  // Load signature count and timestamp from local storage
  useEffect(() => {
    const count = parseInt(localStorage.getItem("signatureCount")) || 0;
    const timestamp = parseInt(localStorage.getItem("signatureTimestamp")) || 0;

    // Check if RESET_TIME has passed
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
      setTimeout(() => setToastVisible(false), 5000); // Reset visibility after duration
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
          maxSizeMB: compressionValue / 100,
          maxWidthOrHeight: 150,
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
          You have reached the maximum of {MAX_SIGNATURES} signature resizes
          today.
          {timeLeft > 0 && (
            <Text ml={2}>
              Reset in {Math.floor(timeLeft / 60000)}m{" "}
              {Math.floor((timeLeft % 60000) / 1000)}s
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

<Alert status="success" mb={4}   borderColor={"blue.400"} borderWidth= {'1px'}>
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
            boxSize={{ base: "100%", md: "150px" }} // Responsive size
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
            <Text mb={4}>Select the desired compression size (KB):</Text>
            <Slider
              defaultValue={50}
              min={20}
              max={100}
              onChange={(val) => setCompressionValue(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text>Current Value: {compressionValue} KB</Text>
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
