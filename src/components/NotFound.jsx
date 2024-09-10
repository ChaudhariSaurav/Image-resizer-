// components/NotFound.js
import React from 'react';
import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <VStack
      spacing={4}
      align="center"
      justify="center"
      height="100vh"
      textAlign="center"
    >
      <Heading as="h1" size="2xl">404</Heading>
      <Text fontSize="xl">Page Not Found</Text>
      <Button colorScheme="blue" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </VStack>
  );
};

export default NotFound;
