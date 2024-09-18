import { v4 as uuidv4 } from "uuid";
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  useToast,
  Spinner,
  Container,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { ref, set, onValue, push, update } from "firebase/database";
import { database } from "../config/firebase";
import useDataStore from "../zustand/userDataStore";
import { nanoid } from "nanoid";

function PriceWrapper({ children, isActive }) {
  return (
    <Box
      mb={4}
      shadow="lg"
      borderWidth="2px"
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.700")}
      borderColor={
        isActive ? "blue.500" : useColorModeValue("gray.200", "gray.600")
      }
      p={6}
      transition="all 0.3s"
      _hover={{
        shadow: "xl",
        borderColor: "blue.400",
      }}
      _active={{
        bg: useColorModeValue("blue.50", "blue.800"),
      }}
    >
      {children}
    </Box>
  );
}

const addSubscriptionHistory = async (
  userId,
  subscriptionData,
  razorpayId,
  datetime
) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const historyRef = ref(database, `users/${userId}/subscription/history`);
    await push(historyRef, subscriptionData);
  } catch (error) {
    console.error("Error updating subscription history:", error);
    throw new Error("An error occurred while updating subscription history.");
  }
};

export default function PremiumPricingPlan() {
  const toast = useToast();
  const user = useDataStore((state) => state.user);
  const UserId = user?.uid;
  const [activePlan, setActivePlan] = useState(null);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (UserId) {
      const subscriptionRef = ref(database, `users/${UserId}/subscription`);
      onValue(subscriptionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setActivePlan(data.plan);
          setSubscriptionExpiry(new Date(data.expiryDate));
        }
      });
    }
  }, [UserId]);

  const handlePayment = useCallback(
    (plan) => {
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
          setLoading(true);
          await loadScript("https://checkout.razorpay.com/v1/checkout.js");

          const options = {
            key: "rzp_test_OWxWTbj8UnSC1W",
            amount: plan.amount * 100,
            currency: "INR",
            name: "Image Resizer",
            description: plan.description,
            image:
              "https://cdn.icon-icons.com/icons2/1381/PNG/512/com_94698.png",
            handler: async function (response) {
              if (UserId) {
                try {
                  const trialDays =
                    plan.title === "Basic Plan"
                      ? 7
                      : plan.title === "Growth Plan"
                      ? 30
                      : 365;
                  const expiryDate = new Date();
                  expiryDate.setDate(expiryDate.getDate() + trialDays);

                  function generateOrderId() {
                    // Generate a UUID
                    const uuid = uuidv4();

                    // Remove non-numeric characters and take the first 16 digits
                    const numericString = uuid
                      .replace(/[^0-9]/g, "")
                      .slice(0, 16);

                    // Ensure we have exactly 16 digits; if not, pad with zeros
                    return numericString.padEnd(16, "0");
                  }

                  const subscriptionData = {
                    plan: plan.title,
                    amount: plan.amount,
                    receipt_number: nanoid(16),
                    transactionId: response.razorpay_payment_id,
                    rzpay_order_id: generateOrderId(),
                    rzpay_order_amount: plan.amount,
                    rzpay_order_status: "Success",
                    mode_of_payment: "Razorpay",
                    date: new Date().toISOString(),
                    expiryDate: expiryDate.toISOString(),
                  };

                  const subscriptionRef = ref(
                    database,
                    `users/${UserId}/subscription/history`
                  );
                  await update(subscriptionRef, subscriptionData);

                  await addSubscriptionHistory(UserId, subscriptionData);

                  setActivePlan(plan.title);
                  setSubscriptionExpiry(expiryDate);
                  toast({
                    title: "Payment successful!",
                    description: `Payment ID: ${response.razorpay_payment_id}`,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                } catch (error) {
                  console.error("Error updating Firebase:", error);
                  toast({
                    title:
                      "Payment successful but failed to update subscription.",
                    description: `Error: ${error.message}`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                }
              } else {
                toast({
                  title: "User not authenticated.",
                  description: "Unable to update subscription.",
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              }
              setLoading(false);
            },
            theme: {
              color: "#3399cc",
            },
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        } catch (error) {
          console.error("Error loading Razorpay script:", error);
          toast({
            title: "Failed to load payment gateway.",
            description: "Please try again later.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          setLoading(false);
        }
      };

      initiatePayment();
    },
    [UserId, toast, user]
  );

  
const plans = [
  {
    title: "Basic Plan",
    monthlyPrice: "₹99/month",
    yearlyPrice: "₹999/year",
    monthlyAmount: 99,
    yearlyAmount: 999,
    description: "Trial Plan",
    features: [
      "Resize images up to 1MB",
      "Basic image compression",
      "Only 5 Image resize",
      "Basic support",
    ],
    btnText: "Start Free trial",
  },
  {
    title: "Growth Plan",
    monthlyPrice: "₹199/month",
    yearlyPrice: "₹1999/year",
    monthlyAmount: 199,
    yearlyAmount: 1999,
    description: "Pro Plan",
    features: [
      "Resize images up to 10MB",
      "High-quality compression",
      "Priority support",
    ],
    btnText: "Buy Now",
  },
  {
    title: "Enterprises",
    monthlyPrice: "₹699/month",
    yearlyPrice: "₹6999/year",
    monthlyAmount: 699,
    yearlyAmount: 6999,
    description: "Enterprises Plan",
    features: [
      "Unlimited file size",
      "Custom image formats",
      "Dedicated support",
      "You have 50% discount",
      "No advertising",
      "24*7 support",
    ],
    btnText: "Buy Now",
    isPopular: true,
  },
];

// yea
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={4} textAlign="center">
        <Heading as="h1" fontSize="4xl" mb={4}>
          Plans That Fit Your Needs
        </Heading>
        <Text fontSize="lg" color={"gray.500"}>
          Start with a 14-day free trial. No credit card needed. Cancel at any
          time.
        </Text>
      </VStack>
      {loading ? (
        <VStack spacing={4} py={10}>
          <Spinner size="xl" />
          <Text>Processing your payment...</Text>
        </VStack>
      ) : error ? (
        <VStack spacing={4} py={10}>
          <Text color="red.500">Error: {error}</Text>
        </VStack>
      ) : (
        <Stack
          direction={{ base: "column", md: "row" }}
          textAlign="center"
          justify="center"
          spacing={{ base: 4, lg: 10 }}
          py={10}
        >
          {plans.map((plan, index) => {
            const isActive =
              activePlan === plan.title && new Date() < subscriptionExpiry;
            return (
              <PriceWrapper key={index} isActive={isActive}>
                <Box position="relative">
                  {plan.isPopular && (
                    <Box
                      position="absolute"
                      top="-34px"
                      left="50%"
                      transform="translate(-50%)"
                      zIndex={1}
                    >
                      <Text
                        textTransform="uppercase"
                        bg={useColorModeValue("red.300", "red.700")}
                        px={3}
                        py={1}
                        color={useColorModeValue("gray.900", "white")}
                        fontSize="sm"
                        fontWeight="bold"
                        borderRadius="full"
                      >
                        Popular
                      </Text>
                    </Box>
                  )}
                  <VStack spacing={8} align="start">
                    <Heading fontSize="xl" fontWeight="bold">
                      {plan.title}
                    </Heading>
                    <Text fontSize="2xl" fontWeight="bold">
                      {plan.price}
                    </Text>
                    <List spacing={3} align="start">
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx}>
                          <HStack align="center" spacing={2}>
                            <ListIcon as={FaCheckCircle} color="teal.500" />
                            <Text>{feature}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      colorScheme="blue"
                      onClick={() => handlePayment(plan)}
                      isDisabled={isActive}
                      width={"100%"}
                    >
                      {isActive ? "Active Plan" : plan.btnText}
                    </Button>
                  </VStack>
                </Box>
              </PriceWrapper>
            );
          })}
        </Stack>
      )}
    </Container>
  );
}
