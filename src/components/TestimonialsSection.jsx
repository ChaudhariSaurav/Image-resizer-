import React from 'react';
import { Box, Heading, SimpleGrid, Text, Container, Icon } from '@chakra-ui/react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const testimonials = [
  { text: "This image resizer saved me hours of work!", author: "John Doe", icon: FaQuoteLeft },
  { text: "Super easy and efficient tool for my business!", author: "Jane Smith", icon: FaQuoteLeft },
  { text: "A must-have for anyone working with images.", author: "Mark Wilson", icon: FaQuoteLeft },
  { text: "The batch processing feature is fantastic!", author: "Emily Johnson", icon: FaQuoteLeft },
  { text: "Highly recommend this tool for all my clients.", author: "Michael Brown", icon: FaQuoteLeft },
  { text: "The quality of resized images is top-notch.", author: "Sarah Davis", icon: FaQuoteLeft },
  { text: "User-friendly interface makes resizing a breeze.", author: "David Garcia", icon: FaQuoteLeft },
  { text: "Fast and reliable - just what I needed.", author: "Laura Martinez", icon: FaQuoteLeft },
  { text: "Great tool for managing large image files.", author: "Robert Wilson", icon: FaQuoteLeft },
  { text: "Simple and effective - love the results.", author: "Jennifer Taylor", icon: FaQuoteLeft },
  { text: "Excellent support and easy to use.", author: "William Anderson", icon: FaQuoteLeft },
  { text: "Makes resizing images effortless and quick.", author: "Linda Thomas", icon: FaQuoteLeft },
];

const TestimonialsSection = () => (
  <Box bg="white" py="20" id="testimonials">
    <Container maxW="container.lg">
      <Heading textAlign="center" mb="10">
        What Our Users Say
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="10">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            text={testimonial.text}
            author={testimonial.author}
            icon={testimonial.icon}
                        
          />
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

const TestimonialCard = ({ text, author, icon }) => (
  <Box p="8" bg="gray.50" shadow="md" borderRadius="lg" maxW="sm" mx="auto"  transition="all 0.3s"
  _hover={{
    shadow: "xl",
    borderColor: "blue.400",
    borderWidth: '1px'
  }}>
    <Text fontSize="lg" mb="4">
      <Icon as={icon} mr="2" />
      {text}
      <Icon as={FaQuoteRight} ml="2" />
    </Text>
    <Text fontWeight="bold" textAlign="right">
      - {author}
    </Text>
  </Box>
);

export default TestimonialsSection;
