import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { ref, set, onValue, push, update } from "firebase/database";
import { database } from '../config/firebase';
import useDataStore from '../zustand/userDataStore';
import { nanoid } from 'nanoid';

// PriceWrapper Component
function PriceWrapper({ children, isActive }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
      bg={isActive ? useColorModeValue("blue.100", "blue.700") : "transparent"}
    >
      {children}
    </Box>
  );
}

// Add a subscription history record
const addSubscriptionHistory = async (userId, transactionId, razorpayId, datetime) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const historyRecord = {
      transactionId: transactionId || nanoid(), // Use nanoid for unique transaction ID
      razorpayId: razorpayId || null,
      datetime: datetime || new Date().toISOString(),
      
    };

    const historyRef = ref(database, `users/${userId}/subscription/history`);
    await push(historyRef, historyRecord); // Use push() to create a new entry with a unique key
  } catch (error) {
    console.error("Error updating subscription history:", error);
    throw new Error("An error occurred while updating subscription history.");
  }
};


// Main Component
export default function ThreeTierPricing() {
  const toast = useToast();
  const user = useDataStore((state) => state.user);
  const UserId = user?.uid;
  const [activePlan, setActivePlan] = useState(null); // State to track active plan
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null); // State to track subscription expiry
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

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
        setLoading(true);
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  
        const options = {
          key: "rzp_test_OWxWTbj8UnSC1W",
          amount: plan.amount * 100,
          currency: "INR",
          name: "Image Resizer",
          description: plan.description,
          image: "https://cdn.icon-icons.com/icons2/1381/PNG/512/com_94698.png",
          handler: async function (response) {
            if (UserId) {
              try {
                const trialDays = plan.title === "Basic Plan" ? 7 : plan.title === "Growth Plan" ? 30 : 365;
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + trialDays);
  
                // Update subscription data
                const subscriptionRef = ref(database, `users/${UserId}/subscription`);
                await update(subscriptionRef, { // Use update() to preserve other fields
                  plan: plan.title,
                  amount: plan.amount,
                  paymentId: response.razorpay_payment_id,
                  date: new Date().toISOString(),
                  expiryDate: expiryDate.toISOString(),
                });
  
                // Add to subscription history
                await addSubscriptionHistory(
                  UserId,
                  nanoid(), // Generate unique transaction ID
                  response.razorpay_payment_id,
                  new Date().toISOString()
                );
  
                // Update state and show success message
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
                  title: "Payment successful but failed to update subscription.",
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
          prefill: {
            name: "",
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
  }, [UserId, toast]);
  
  

  const plans = [
    {
      title: "Basic Plan",
      price: "₹0/month",
      amount: 0,
      description: "Free Plan",
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
      price: "₹199/month",
      amount: 199,
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
      price: "₹499/month",
      amount: 499,
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

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Plans that fit your need
        </Heading>
        <Text fontSize="lg" color={"gray.500"}>
          Start with a 14-day free trial. No credit card needed. Cancel at any time.
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
            const isActive = activePlan === plan.title && new Date() < subscriptionExpiry;
            return (
              <PriceWrapper
                key={index}
                isActive={isActive} // Highlight active plan
              >
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
                        color={useColorModeValue("gray.900", "white")}
                        fontSize="sm"
                        fontWeight="bold"
                        borderRadius="full"
                      >
                        Popular
                      </Text>
                    </Box>
                  )}
                  <VStack py={8} px={6} spacing={6} align="start">
                    <Heading fontSize="xl" fontWeight="bold">
                      {plan.title}
                    </Heading>
                    <Text fontSize="2xl" fontWeight="bold">
                      {plan.price}
                    </Text>
                    <List spacing={3}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx}>
                          <ListIcon as={FaCheckCircle} color="teal.500" />
                          {feature}
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      colorScheme="blue"
                      onClick={() => handlePayment(plan)}
                    >
                      {plan.btnText}
                    </Button>
                  </VStack>
                </Box>
              </PriceWrapper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
