import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  Container,
  Grid,
  GridItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue
} from "@chakra-ui/react";
import { ArrowForwardIcon, CheckCircleIcon, RepeatClockIcon, LockIcon } from "@chakra-ui/icons";

const heroImage = "https://lp.simplified.com/siteimages/design/image-resizer-01.png";

const featureData = [
  {
    title: "Easy to Use",
    text: "Our tool is designed to be user-friendly and intuitive, making image resizing a breeze.",
    icon: <CheckCircleIcon boxSize={10} color="teal.500" />,
  },
  {
    title: "Fast and Reliable",
    text: "Get your images resized quickly without compromising on quality.",
    icon: <RepeatClockIcon boxSize={10} color="teal.500" />,
  },
  {
    title: "Free and Secure",
    text: "Our tool is free to use and ensures that your images are processed securely.",
    icon: <LockIcon boxSize={10} color="teal.500" />,
  },
];

const faqData = [
  {
    question: "What image formats are supported?",
    answer: "We support a wide range of image formats including JPG, PNG, GIF, and more."
  },
  {
    question: "Is there a limit on image size?",
    answer: "Yes, our tool supports images up to 20MB in size. For larger images, please contact our support."
  },
  {
    question: "How secure is my data?",
    answer: "Your data is highly secure. We use encryption and adhere to strict privacy policies to ensure the safety of your images."
  },
  {
    question: "Do I need to create an account to use the tool?",
    answer: "No, you do not need to create an account to use our image resizing tool. It’s free and accessible to everyone."
  },
  {
    question: "What are the benefits of creating an account?",
    answer: "Creating an account allows you to save your preferences, access your resize history, and receive personalized recommendations. Additionally, you'll get faster access to new features and updates."
  },
  {
    question: "Can I manage my resized images if I create an account?",
    answer: "Yes, with an account, you can manage your resized images, organize them into folders, and easily retrieve them whenever needed."
  },
  {
    question: "How do I create an account?",
    answer: "To create an account, click on the 'Sign Up / Register ' button on the top of this page and fill in the required details. It’s quick and easy!"
  },
];

function HomePage() {
  const gridTemplateColumns = useBreakpointValue({ base: '1fr', md: 'repeat(3, 1fr)' });

  const handleLoginButton = () => {
    window.location.href = "/login";
  };

  return (
    <Box>
      {/* Hero Section with Gradient Background */}
      <Box
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)" // Apply gradient background
        color="white"
        textAlign="center"
        p={10}
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Container maxW="container.md">
          <Heading as="h1" size="2xl" mb={4}>
            Resize Your Images Effortlessly
          </Heading>
          <Text fontSize="xl" mb={6}>
            Easily resize your images to the desired dimensions without compromising quality.
          </Text>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleLoginButton}
            rightIcon={<ArrowForwardIcon />}
          >
            Get Started
          </Button>
          <Image
            src={heroImage}
            alt="Hero Image"
            borderRadius="md"
            boxShadow="md"
            mt={8}
            maxW="100%"
          />
        </Container>
      </Box>

      {/* Features Section */}
      <Box p={10} bg="gray.100">
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Heading as="h2" size="xl" textAlign="center">
              Why Choose Us?
            </Heading>
            <Grid templateColumns={gridTemplateColumns} gap={6}>
              {featureData.map((feature, index) => (
                <GridItem
                  key={index}
                  p={5}
                  borderWidth={1}
                  borderRadius="md"
                  bg="white"
                  shadow="md"
                  textAlign="center"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  {feature.icon}
                  <Heading as="h3" size="lg" mt={4} mb={4}>
                    {feature.title}
                  </Heading>
                  <Text>{feature.text}</Text>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box p={10} bg="gray.50">
        <Container maxW="container.md">
          <Heading as="h2" size="xl" textAlign="center" mb={6}>
            Frequently Asked Questions
          </Heading>
          <Accordion allowToggle>
            {faqData.map((item, index) => (
              <AccordionItem key={index}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {item.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {item.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box bg="teal.500" color="white" textAlign="center" p={10}>
        <Container maxW="container.md">
          <Heading as="h2" size="xl" mb={4}>
            Ready to Resize Your Images?
          </Heading>
          <Text fontSize="lg" mb={6}>
            Start using our tool today and experience effortless image resizing!
          </Text>
          <Button
            colorScheme="teal"
            size="lg"
            rightIcon={<ArrowForwardIcon />}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
