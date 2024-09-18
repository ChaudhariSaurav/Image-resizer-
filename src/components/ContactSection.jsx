import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Stack,
  Text,
  useToast,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Rating from './RatingPage'; // Adjust the path if needed
import { database } from '../config/firebase';
import useDataStore from '../zustand/userDataStore';
import { ref, push, set, onValue, off } from 'firebase/database';

const validateName = (value) => value ? true : 'Name is required';
const validateEmail = (value) => 
  value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Invalid email address';
const validateMessage = (value) => value ? true : 'Message is required';

const ContactForm = ({ userId }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [rating, setRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const toast = useToast();
  const { user } = useDataStore();

  useEffect(() => {
    if (user?.email) {
      reset({ email: user.email });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const currentUserId = user?.uid || userId;
    if (!currentUserId) {
      toast({
        title: 'Error.',
        description: 'User ID is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const formspreeResponse = await fetch('https://formspree.io/f/mwpejlld', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ...data, rating }),
      });

      if (!formspreeResponse.ok) {
        throw new Error('Formspree submission failed.');
      }

      const feedbackRef = ref(database, `users/${currentUserId}/feedback`);
      const newFeedbackRef = push(feedbackRef);
      await set(newFeedbackRef, {
        ...data,
        rating,
        timestamp: Date.now(),
      });

      toast({
        title: 'Message sent.',
        description: 'We have received your message.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      reset({ email: user.email });
      setRating(0);
    } catch (error) {
      toast({
        title: 'Error.',
        description: 'There was a problem sending your message.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!userId) return;

    const feedbackRef = ref(database, `users/${userId}/feedback`);
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      const data = snapshot.val();
      const feedbackList = data ? Object.entries(data).map(([id, feedback]) => ({
        id,
        ...feedback,
      })) : [];
      setFeedbacks(feedbackList);
    });

    return () => off(feedbackRef, 'value', unsubscribe);
  }, [userId]);

  return (
    <Box
      bgImage="url('https://formspree.io/img/watermark.svg')"
      bgSize="cover"
      bgPosition="center"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        maxWidth="1200px"
        width="100%"
        padding="4"
        margin="0 auto"
        bg="rgba(255, 255, 255, 0.9)"
        borderRadius="md"
        boxShadow="lg"
        borderWidth="1px"
        borderColor="blue.500"
        direction={{ base: 'column', md: 'row' }} // Stack on mobile, side by side on larger screens
      >
        <Box flex="1" padding="4">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            How to Reach Out
          </Text>
          <Text fontSize="md" color="gray.600">
            If you have any questions or need further assistance, feel free to fill out the contact form on the right side. We’re here to help you with any inquiries or support you may need.
          </Text>
        </Box>
        <Box flex="1" padding="4">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Contact Us</Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                placeholder="Your Name"
                {...register('name', { validate: validateName })}
              />
              <Text color="red.500" fontSize="sm">{errors.name?.message}</Text>
            </FormControl>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                disabled
                placeholder="Your Email"
                {...register('email', { validate: validateEmail })}
              />
              <Text color="red.500" fontSize="sm">{errors.email?.message}</Text>
            </FormControl>
            <FormControl isInvalid={!!errors.message}>
              <FormLabel htmlFor="message">Message</FormLabel>
              <Textarea
                id="message"
                placeholder="Your Message"
                {...register('message', { validate: validateMessage })}
              />
              <Text color="red.500" fontSize="sm">{errors.message?.message}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Feedback Rating</FormLabel>
              <Box width="full">
                <Rating value={rating} onChange={setRating} />
              </Box>
            </FormControl>
            <Button mt={4} colorScheme="teal" type="submit" width="full">Send</Button>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default ContactForm;
