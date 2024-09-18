import React, { useEffect } from 'react';
import { Box, Spinner, Text, Stack, Heading } from '@chakra-ui/react';
import useUserStore from '../zustand/AllUser'; // Adjust path accordingly

const UserListPage = () => {
  const { users, fetchAllUsers, loading, error } = useUserStore((state) => ({
    users: state.users,
    fetchAllUsers: state.fetchAllUsers,
    loading: state.loading,
    error: state.error,
  }));

  useEffect(() => {
    fetchAllUsers(); // Fetch all users when the component mounts
  }, [fetchAllUsers]);

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
    <Box p={4}>
      <Heading size="lg" mb={4}>User List</Heading>
      <Stack spacing={4}>
        {users.map((user) => (
          <Box key={user.id} p={4} borderWidth="1px" borderRadius="md">
            <Text>{user.email || 'No email available'}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default UserListPage;
