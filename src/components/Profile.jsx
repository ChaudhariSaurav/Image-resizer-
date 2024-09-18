import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Spinner,
  VStack,
  Heading,
  Divider,
  Text,
  Image,
  useToast,
  Grid,
  GridItem
} from '@chakra-ui/react';
import useDataStore from '../zustand/userDataStore';
import { onValue, ref, update } from 'firebase/database';
import { database } from '../config/firebase';

const Profile = () => {
  const { user, setUser } = useDataStore((state) => ({
    user: state.user,
    setUser: state.setUser
  }));

  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (user?.uid) {
      const subscriptionRef = ref(database, `users/${user.uid}/subscription`);
      onValue(subscriptionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSubscriptionPlan(data);
        }
      });

      const userAllDataRef = ref(database, `users/${user.uid}`);
      onValue(userAllDataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(data);
          setFormData(data); // Sync formData with userData initially
          setIsLoading(false);
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await update(ref(database, `users/${user.uid}`), formData);
      setUser(formData);
      setIsEditing(false);
      toast({
        title: 'Profile updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Failed to update profile.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  if (!user) return <Text>No user data available</Text>;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" p={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={{ base: 2, md: 5 }} maxW="1200px" mx="auto" overflowY="auto" height="100vh">
      <VStack spacing={6} align="start">
        {user.profileImageURL && (
          <Image
            src={user.profileImageURL}
            alt="Profile Image"
            borderRadius="full"
            boxSize="150px"
            objectFit="cover"
            mb={6}
            alignSelf="center"
          />
        )}

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={6}
          width="full"
          mb={6}
        >
          <GridItem colSpan={{ base: 1, md: 3 }}>
            <Heading as="h3" size="md" mb={4}>
              Personal Information
            </Heading>
          </GridItem>

          <GridItem>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                isReadOnly={!isEditing}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="dob">
              <FormLabel>Date of Birth</FormLabel>
              <Input
                name="dob"
                type="date"
                value={formData.dob || ''}
                onChange={handleChange}
                isReadOnly={!isEditing}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                isReadOnly={!isEditing}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="mobile">
              <FormLabel>Mobile</FormLabel>
              <Input
                name="mobile"
                value={formData.mobile || ''}
                onChange={handleChange}
                isReadOnly={!isEditing}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 3 }}>
            <Heading as="h3" size="md" mb={4}>
              Account Details
            </Heading>
          </GridItem>

          <GridItem>
            <FormControl id="plan">
              <FormLabel>Plan</FormLabel>
              <Input
                name="plan"
                value={subscriptionPlan ? subscriptionPlan.plan : 'Fetching...'}
                isReadOnly
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="createdAt">
              <FormLabel>Account Created</FormLabel>
              <Input
                name="createdAt"
                type="text"
                value={userData.createdAt || ''}
                isReadOnly
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="updatedAt">
              <FormLabel>Last Updated</FormLabel>
              <Input
                name="updatedAt"
                type="text"
                value={formData.updatedAt || ''}
                isReadOnly
              />
            </FormControl>
          </GridItem>
        </Grid>

        <VStack spacing={4} align="center" width="full">
          <Button onClick={() => setIsEditing(!isEditing)} colorScheme="blue">
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} colorScheme="teal">
              Save
            </Button>
          )}
        </VStack>

        <Divider my={6} />
      </VStack>
    </Box>
  );
};

export default Profile;
