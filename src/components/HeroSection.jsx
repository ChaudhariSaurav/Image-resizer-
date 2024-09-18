import React, { useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { FaArrowRight, FaImage } from "react-icons/fa";
import ImageResizer from "./ImageResizer";
import SignatureUpload from "./Signature_Upload";

const HeroSection = () => {
  const { colorMode } = useColorMode();
  // Create a ref for the Image Resize section
  const imageResizeRef = useRef(null);

  // Function to handle button click and scroll into view
  const handleButtonClick = () => {
    if (imageResizeRef.current) {
      imageResizeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Box bg={colorMode === "dark" ? "gray.700" : "gray.100"} py="20" id="home">
        <Container maxW="container.lg" textAlign="center">
          <Heading size="2xl" mb="4">
            <Icon as={FaImage} mr="2" /> Effortless Image Resizing
          </Heading>
          <Text
            fontSize="lg"
            mb="6"
            color={colorMode === "dark" ? "gray.200" : "gray.600"}
          >
            Quickly resize, compress, and optimize your images for any platform.
          </Text>
          <Button
            colorScheme="teal"
            size="lg"
            rightIcon={<FaArrowRight />}
            onClick={handleButtonClick} // Add onClick handler
          >
            Try Now for Free
          </Button>
        </Container>
      </Box>

      {/* Image Resize Section */}
      <Box ref={imageResizeRef} bg={colorMode === "dark" ? "gray.800" : "whitw"} py="20" id="image-resize">
        <Container maxW="container.lg" textAlign="center">
          <Heading size="xl" mb="4">
            Image Resize Tool
          </Heading>
          <Text
            fontSize="lg"
            mb="6"
          >
            Here you can resize your images to the desired dimensions.
          </Text>
          {/* Add more content for the Image Resize section here */}
          <ImageResizer/>
          <SignatureUpload/>
        </Container>
      </Box>
    </>
  );
};

export default HeroSection;
