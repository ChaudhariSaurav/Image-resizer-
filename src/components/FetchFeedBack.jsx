import React, { useState, useEffect, useMemo } from 'react';
import { Box, Stack, Text, Heading, Button, useBreakpointValue, useToast, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { database } from '../config/firebase'; // Adjust the path if needed
import { ref, onValue, off, remove } from 'firebase/database';
import useDataStore from '../zustand/userDataStore';

const FeedbackPage = ({ userId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [feedbackToDelete, setFeedbackToDelete] = useState(null); // Feedback to delete
  const user = useDataStore((state) => state.user);
  const toast = useToast(); // Hook for showing toast notifications

  useEffect(() => {
    if (!userId && !user?.uid) return; // Early return if neither userId nor user.uid is available

    const currentUserId = user?.uid || userId;
    const feedbackRef = ref(database, `users/${currentUserId}/feedback`);

    const handleValue = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const feedbackList = Object.entries(data).map(([id, feedback]) => ({
          id,
          ...feedback,
        }));
        setFeedbacks(feedbackList);
      } else {
        setFeedbacks([]); // No data found
      }
      setLoading(false); // Set loading to false after fetching data
    };

    const handleError = (error) => {
      setError(error.message);
      setLoading(false); // Set loading to false if there's an error
    };

    const unsubscribe = onValue(feedbackRef, handleValue, handleError);

    return () => {
      off(feedbackRef, 'value', handleValue);
    };
  }, [userId, user]);

  const handleDelete = async (feedbackId) => {
    try {
      const currentUserId = user?.uid || userId;
      const feedbackRef = ref(database, `users/${currentUserId}/feedback/${feedbackId}`);
      await remove(feedbackRef);

      // Update state to remove the deleted feedback from the list
      setFeedbacks((prevFeedbacks) => prevFeedbacks.filter(feedback => feedback.id !== feedbackId));

      // Show success toast
      toast({
        title: 'Feedback Deleted',
        description: 'The feedback has been successfully deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      setError(error.message);

      // Show error toast
      toast({
        title: 'Delete Failed',
        description: 'There was an issue deleting the feedback.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsModalOpen(false); // Close modal after operation
      setFeedbackToDelete(null); // Clear feedback to delete
    }
  };

  const openDeleteModal = (feedbackId) => {
    setFeedbackToDelete(feedbackId);
    setIsModalOpen(true);
  };

  const responsiveColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const feedbackItems = useMemo(() => (
    feedbacks.map((feedback) => (
      <Box
        key={feedback.id}
        p={4}
        borderWidth="1px"
        borderRadius="md"
        bg="white"
        shadow="md"
        width="full"
        maxW="400px"
      >
        <Text fontWeight="bold">Name:</Text>
        <Text mb={2}>{feedback.name}</Text>
        <Text fontWeight="bold">Email:</Text>
        <Text mb={2}>{feedback.email}</Text>
        <Text fontWeight="bold">Message:</Text>
        <Text mb={2}>{feedback.message}</Text>
        <Text fontWeight="bold">Rating:</Text>
        <Text>{feedback.rating} / 5</Text>
        <Button 
          mt={4}
          colorScheme="red" 
          size="sm" 
          onClick={() => openDeleteModal(feedback.id)}
        >
          Delete
        </Button>
      </Box>
    ))
  ), [feedbacks]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height="100vh" 
        flexDirection="column"
      >
        <Spinner size="xl" mb={4} />
        <Text fontSize="xl">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height="100vh" 
        flexDirection="column"
      >
        <Text fontSize="xl" color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      minHeight="100vh"
      bgImage="url('https://formspree.io/img/watermark.svg')"
      bgSize="cover"
      bgPosition="center"
    >
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        mb={6}
      >
        <Heading size="lg" mb={4}>User Feedback</Heading>
      </Box>
      <Stack
        spacing={4}
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="center"
        wrap="wrap"
        gridTemplateColumns={`repeat(${responsiveColumns}, 1fr)`}
      >
        {feedbacks.length === 0 ? (
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            width="full"
            p={4}
          >
            <Text textAlign="center" color="gray.500">No feedback available.</Text>
          </Box>
        ) : (
          feedbackItems
        )}
      </Stack>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this feedback?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={() => handleDelete(feedbackToDelete)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FeedbackPage;
