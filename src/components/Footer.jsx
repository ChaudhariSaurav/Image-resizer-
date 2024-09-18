import React from "react";
import {
  Box,
  Text,
  HStack,
  Link,
  Icon,
  Flex,
  Container,
  Grid,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  // Adjust spacing based on breakpoint
  const spacing = useBreakpointValue({ base: "4", md: "6" });

  return (
    <Box
      bg="gray.900"
      color="white"
      py={{ base: "6", md: "8" }}
      position={{ base: "relative", md: "relative" }} // Fixed position on mobile, relative on larger screens
      bottom={0}
      left={0}
      width="100%"
      zIndex={10} // Ensure it appears above other content
      boxShadow="md"
    >
      <Container maxW="container.xl">
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={8}
          textAlign={{ base: "center", md: "left" }}
        >
          {/* Column 1: Links */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Quick Links
            </Text>
            <Flex direction="column" gap={2}>
              <Link href="#" color="whiteAlpha.800">
                Home
              </Link>
              <Link href="#" color="whiteAlpha.800">
                About
              </Link>
              <Link href="#" color="whiteAlpha.800">
                Services
              </Link>
              <Link href="#" color="whiteAlpha.800">
                Contact
              </Link>
            </Flex>
          </Box>

          {/* Column 2: Resources */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Resources
            </Text>
            <Flex direction="column" gap={2}>
              <Link href="#" color="whiteAlpha.800">
                Blog
              </Link>
              <Link href="#" color="whiteAlpha.800">
                Help Center
              </Link>
              <Link href="#" color="whiteAlpha.800">
                Privacy Policy
              </Link>
              <Link href="#" color="whiteAlpha.800">
                Terms of Service
              </Link>
            </Flex>
          </Box>

          {/* Column 3: Follow Us */}
          <Box textAlign={{ base: "center", md: "left" }}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Follow Us
            </Text>
            <HStack
              spacing={spacing}
              justify={{ base: "center", md: "flex-start" }}
            >
              <Link href="https://twitter.com" isExternal>
                <Icon as={FaTwitter} boxSize="6" />
              </Link>
              <Link href="https://facebook.com" isExternal>
                <Icon as={FaFacebook} boxSize="6" />
              </Link>
              <Link href="https://instagram.com" isExternal>
                <Icon as={FaInstagram} boxSize="6" />
              </Link>
              <Link href="https://linkedin.com" isExternal>
                <Icon as={FaLinkedin} boxSize="6" />
              </Link>
            </HStack>
          </Box>
          {/* Column 4: Contact Info */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Contact Info
            </Text>
            <Flex direction="column" gap={2}>
              <Text>Email: onlinetestmail93@gmail.com</Text>
              <Text>Phone: 9876543210</Text>
              <Text>Address: 123 Your Street, City, Country</Text>
            </Flex>
          </Box>
        </Grid>

        {/* Bottom Text */}
        <Box mt={8} textAlign="center" color="whiteAlpha.600">
          <Text fontSize="sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
