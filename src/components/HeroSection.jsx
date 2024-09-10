import React from "react";
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

const HeroSection = () => {
  const { colorMode } = useColorMode();

  return (
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
        <Button colorScheme="teal" size="lg" rightIcon={<FaArrowRight />}>
          Try Now for Free
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
