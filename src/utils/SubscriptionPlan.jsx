import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import useDataStore from '../zustand/userDataStore';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Spinner, Box, useBreakpointValue, Text } from '@chakra-ui/react';
import { MdCardMembership } from 'react-icons/md';  // Example icon for subscription
import { FaRegQuestionCircle } from 'react-icons/fa'; // Example icon for "no subscription"

// Utility function to format date in DD/MM/YYYY format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Utility function to calculate days remaining
const calculateDaysRemaining = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDiff = expiry - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

const UserSubscription = () => {
  const { user } = useDataStore();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}/subscription`);

    const handleSubscriptionChange = (snapshot) => {
      const data = snapshot.val();
      setSubscription(data || null);
      setLoading(false);
    };

    const unsubscribe = onValue(userRef, handleSubscriptionChange);

    return () => unsubscribe();
  }, [user]);

  const alertSize = useBreakpointValue({ base: 'sm', md: 'md' }); // Responsive size for the Alert component

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" p={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4} maxW="600px" mx="auto">
      {subscription ? (
        <Alert status="success" variant="subtle" borderRadius="md">
          <AlertIcon as={MdCardMembership} boxSize={alertSize === 'sm' ? '20px' : '24px'} />
          <Box ml={3}>
            <AlertTitle fontSize={alertSize === 'sm' ? 'md' : 'lg'}>Current subscription plan:</AlertTitle>
            <AlertDescription fontSize={alertSize === 'sm' ? 'sm' : 'md'}>
              <b>{subscription.plan}</b>
              {subscription.expiryDate && (
                <Box mt={2}>
                  <Text>Expiry Date: {formatDate(subscription.expiryDate)}</Text>
                  <Text mt={1}>
                    Days Remaining: {calculateDaysRemaining(subscription.expiryDate)} days
                  </Text>
                </Box>
              )}
            </AlertDescription>
          </Box>
        </Alert>
      ) : (
        <Alert status="error" variant="subtle" borderRadius="md">
          <AlertIcon as={FaRegQuestionCircle} boxSize={alertSize === 'sm' ? '20px' : '24px'} />
          <Box ml={3} m={2}>
            <AlertTitle fontSize={alertSize === 'sm' ? 'md' : 'lg'}>No subscription plan found.</AlertTitle>
            <AlertDescription fontSize={alertSize === 'sm' ? 'sm' : 'md'}>
              You do not have a subscription plan at this time.
            </AlertDescription>
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default UserSubscription;
