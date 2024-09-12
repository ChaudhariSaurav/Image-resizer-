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
  Box
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Rating from './RatingPage'; // Adjust the path if needed
import { database } from '../config/firebase';
import useDataStore from '../zustand/userDataStore';
import { ref, push, set, onValue, off } from 'firebase/database'; // Import these from Firebase

// Define validation rules manually
const validateName = (value) => value ? true : 'Name is required';
const validateEmail = (value) => 
  value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Invalid email address';
const validateMessage = (value) => value ? true : 'Message is required';

const ContactForm = ({ userId }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [rating, setRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const toast = useToast();
  const { user } = useDataStore(); // Ensure this hook provides `user` object

  useEffect(() => {
    // Pre-fill email field with the current user's email
    if (user?.email) {
      reset({ email: user.email });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const currentUserId = user?.uid || userId; // Use userId prop or user from Zustand
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
      // Send data to Formspree
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

      // Save data to Firebase Realtime Database
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

      // Reset form fields after successful submission
      reset({ email: user.email }); // Keep the email field pre-filled
      setRating(0); // Reset rating to default

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
      <Stack
        spacing={4}
        maxWidth="500px"
        width="100%"
        margin="0 auto"
        padding="4"
        background="rgba(255, 255, 255, 0.9)" // Light background for readability
        borderRadius="md"
        boxShadow="lg"
      >
        <Text fontSize="2xl" fontWeight="bold">Contact Us</Text>
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
            <Rating value={rating} onChange={setRating} />
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit">Send</Button>
        </form>
      </Stack>
    </Box>
  );
};

export default ContactForm;
