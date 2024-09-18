import React from 'react';
import {
  Heading,
  Text,
  Button,
  VStack,
  Center,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const NotFound = () => {
  return (
    <Center h="100vh" bg="gray.50">
      <VStack spacing={6} textAlign="center">
        <Heading as="h1" size="2xl">
          404 - Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Sorry, the page you are looking for does not exist.
        </Text>

        <Button
          as={Link}
          to="/"
          colorScheme="teal"
          size="lg"
        >
          Go to Homepage
        </Button>
      </VStack>
    </Center>
  );
};

export default NotFound;
