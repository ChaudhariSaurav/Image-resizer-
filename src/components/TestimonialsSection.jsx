import React from 'react';
import { Box, Heading, Stack, Text, Container, Icon } from '@chakra-ui/react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const TestimonialsSection = () => (
  <Box bg="white" py="20" id="testimonials">
    <Container maxW="container.lg">
      <Heading textAlign="center" mb="10">
        What Our Users Say
      </Heading>
      <Stack direction={['column', 'row']} spacing="10" justify="center">
        <TestimonialCard
          text="This image resizer saved me hours of work!"
          author="John Doe"
          icon={FaQuoteLeft}
        />
        <TestimonialCard
          text="Super easy and efficient tool for my business!"
          author="Jane Smith"
          icon={FaQuoteLeft}
        />
        <TestimonialCard
          text="A must-have for anyone working with images."
          author="Mark Wilson"
          icon={FaQuoteLeft}
        />
      </Stack>
    </Container>
  </Box>
);

const TestimonialCard = ({ text, author, icon }) => (
  <Box p="8" bg="gray.50" shadow="md" borderRadius="lg" maxW="sm">
    <Text fontSize="lg">
      <Icon as={icon} mr="2" />
      {text}
      <Icon as={FaQuoteRight} ml="2" />
    </Text>
    <Text mt="4" fontWeight="bold" textAlign="right">
      - {author}
    </Text>
  </Box>
);

export default TestimonialsSection;
