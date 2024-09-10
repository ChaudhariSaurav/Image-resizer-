import React from "react";
import {
  Box,
  Text,
  HStack,
  Link,
  Icon,
  Flex,
  Container,
} from "@chakra-ui/react";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => (
  <Box bg="gray.900" color="white" py="6">
    <Container maxW="container.lg">
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">
          Image Resizer
        </Text>
        <HStack spacing="4">
          <Link href="https://twitter.com" isExternal>
            <Icon as={FaTwitter} boxSize="5" />
          </Link>
          <Link href="https://facebook.com" isExternal>
            <Icon as={FaFacebook} boxSize="5" />
          </Link>
          <Link href="https://instagram.com" isExternal>
            <Icon as={FaInstagram} boxSize="5" />
          </Link>
        </HStack>
      </Flex>
    </Container>
  </Box>
);

export default Footer;
