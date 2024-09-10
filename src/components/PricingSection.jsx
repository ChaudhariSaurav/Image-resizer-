import React, { useCallback } from "react";
import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

// PriceWrapper Component
function PriceWrapper({ children }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}

// Main Component
export default function ThreeTierPricing() {
  const handlePayment = useCallback((plan) => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Script load error"));
        document.body.appendChild(script);
      });
    };

    const initiatePayment = async () => {
      try {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        const options = {
          key: "rzp_test_OWxWTbj8UnSC1W", // Your Razorpay key
          amount: plan.amount * 100, // Amount in smallest currency (paise for INR)
          currency: "INR",
          name: "Image Resizer",
          description: plan.description,
          image: "https://cdn.icon-icons.com/icons2/1381/PNG/512/com_94698.png", // Optional: add your logo
          handler: function (response) {
            // Function triggered on successful payment
            alert(
              `Payment successful! Payment ID: ${response.razorpay_payment_id}`,
            );
          },
          prefill: {
            name: "", // You can prefill customer data here
            email: "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error("Error loading Razorpay script:", error);
        alert("Failed to load payment gateway. Please try again later.");
      }
    };

    initiatePayment();
  }, []);

  const plans = [
    {
      title: "Basic Plam",
      price: "₹0/month",
      amount: 0,
      description: "Free Plan",
      features: [
        "Resize images up to 1MB",
        "Basic image compression",
        "Only 5 Image resize",
        "Basic support",
      ],
      btnText: "Start trial",
    },
    {
      title: "Growth",
      price: "$149/month",
      amount: 14900,
      description: "Growth Plan",
      features: [
        "Resize images up to 10MB",
        "High-quality compression",
        "Priority support",
      ],
      btnText: "Start trial",
      isPopular: true,
    },
    {
      title: "Scale",
      price: "$349/month",
      amount: 34900,
      description: "Scale Plan",
      features: [
        "Unlimited file size",
        "Custom image formats",
        "Dedicated support",
        "You have 50%",
        "No advertising",
        "24*7 support",
      ],
      btnText: "Start trial",
    },
  ];

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Plans that fit your need
        </Heading>
        <Text fontSize="lg" color={"gray.500"}>
          Start with a 14-day free trial. No credit card needed. Cancel at any
          time.
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        {plans.map((plan, index) => (
          <PriceWrapper key={index}>
            <Box position="relative">
              {plan.isPopular && (
                <Box
                  position="absolute"
                  top="-16px"
                  left="50%"
                  style={{ transform: "translate(-50%)" }}
                >
                  <Text
                    textTransform="uppercase"
                    bg={useColorModeValue("red.300", "red.700")}
                    px={3}
                    py={1}
                    color={useColorModeValue("gray.900", "gray.300")}
                    fontSize="sm"
                    fontWeight="600"
                    rounded="xl"
                  >
                    Most Popular
                  </Text>
                </Box>
              )}
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  {plan.title}
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="3xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="5xl" fontWeight="900">
                    {plan.amount / 100}
                  </Text>
                  <Text fontSize="3xl" color="gray.500">
                    /month
                  </Text>
                </HStack>
              </Box>
              <VStack
                bg={useColorModeValue("gray.50", "gray.700")}
                py={4}
                borderBottomRadius={"xl"}
              >
                <List spacing={3} textAlign="start" px={12}>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx}>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      {feature}
                    </ListItem>
                  ))}
                </List>
                <Box w="80%" pt={7}>
                  <Button
                    w="full"
                    colorScheme="red"
                    variant={plan.isPopular ? "solid" : "outline"}
                    onClick={() => handlePayment(plan)}
                  >
                    {plan.btnText}
                  </Button>
                </Box>
              </VStack>
            </Box>
          </PriceWrapper>
        ))}
      </Stack>
    </Box>
  );
}
