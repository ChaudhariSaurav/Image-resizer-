import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import useDataStore from '../zustand/userDataStore';
import {
  Box,
  Text,
  Spinner,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useBreakpointValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Select,
  Button,
  Stack,
  Badge,
  Icon,
  useBreakpointValue as useBreakpointValueChakra,
} from '@chakra-ui/react';
import { FaRegQuestionCircle, FaCalendarAlt, FaRegCalendarCheck, FaBoxOpen } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Utility function to format date in DD/MM/YYYY format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to generate PDF
const generatePDF = (data, subscriptionAmount) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [['Date', 'Razorpay Id', 'Transaction Id', 'Amount']],
    body: data.map(transaction => [
      formatDate(transaction.datetime),
      transaction.razorpayId,
      transaction.transactionId,
      subscriptionAmount || transaction.amount, // Use subscriptionAmount if available
    ]),
  });
  doc.save('transactions.pdf');
};

// Custom Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        mr={2}
      >
        Previous
      </Button>
      <Text mx={2}>{currentPage} / {totalPages}</Text>
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        ml={2}
      >
        Next
      </Button>
    </Box>
  );
};

// Subscription Plan Card View
const SubscriptionPlanCard = ({ subscription }) => {
  const alertSize = useBreakpointValueChakra({ base: 'sm', md: 'md' });

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      bg="white"
      mb={4}
    >
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} align="center">
          <Icon as={FaBoxOpen} boxSize={6} color="teal.500" />
          <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">Subscription Plan</Text>
        </Stack>
        <Box
          borderWidth={1}
          borderRadius="md"
          p={4}
          bg="gray.50"
          borderColor="gray.200"
        >
          <Stack spacing={2}>
            <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">Plan:</Text>
            <Badge colorScheme="teal" fontSize={{ base: 'sm', md: 'md' }}>{subscription.plan}</Badge>
            <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">Expiry Date:</Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">{formatDate(subscription.expiryDate)}</Text>
          </Stack>
        </Box>
        <Box textAlign="center">
          <Icon as={FaRegCalendarCheck} boxSize={8} color="teal.500" />
          <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" mt={2}>
            Your subscription is active and will renew on the expiry date.
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

const TransactionHistory = () => {
  const { user } = useDataStore();
  const [transactions, setTransactions] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // State for filter option
  const [sort, setSort] = useState('date'); // State for sorting option
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const subscriptionRef = ref(db, `users/${user.uid}/subscription`);
    const historyRef = ref(db, `users/${user.uid}/subscription/history`);

    // Fetch subscription data
    const fetchSubscription = (snapshot) => {
      const data = snapshot.val();
      setSubscription(data || null);
    };

    // Fetch transaction history
    const fetchTransactions = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTransactions(Object.values(data));
      } else {
        setTransactions([]);
      }
      setLoading(false);
    };

    // Handle error
    const handleError = (error) => {
      setError('Failed to load data.');
      setLoading(false);
    };

    // Subscribe to both data sources
    const unsubscribeSubscription = onValue(subscriptionRef, fetchSubscription, handleError);
    const unsubscribeHistory = onValue(historyRef, fetchTransactions, handleError);

    return () => {
      unsubscribeSubscription();
      unsubscribeHistory();
    };
  }, [user]);

  const alertSize = useBreakpointValueChakra({ base: 'sm', md: 'md' }); // Responsive size for the Alert component

  // Filter transactions based on filter state
  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(transaction => transaction.type === filter);

  // Sort transactions based on sort state
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sort === 'date') {
      return new Date(b.datetime) - new Date(a.datetime);
    } else if (sort === 'amount') {
      return b.amount - a.amount;
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" p={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} maxW="600px" mx="auto">
        <Alert status="error" variant="subtle" borderRadius="md">
          <AlertIcon as={FaRegQuestionCircle} boxSize={alertSize === 'sm' ? '20px' : '24px'} />
          <Box ml={3}>
            <AlertTitle fontSize={alertSize === 'sm' ? 'md' : 'lg'}>Error</AlertTitle>
            <AlertDescription fontSize={alertSize === 'sm' ? 'sm' : 'md'}>
              {error}
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4} maxW="100%" mx="auto">
      <VStack spacing={4} align="stretch">
        {subscription ? (
          <SubscriptionPlanCard subscription={subscription} />
        ) : (
          <Alert status="info" variant="subtle" borderRadius="md" mb={4}>
            <AlertIcon as={FaRegQuestionCircle} boxSize={alertSize === 'sm' ? '20px' : '24px'} />
            <Box ml={3}>
              <AlertTitle fontSize={alertSize === 'sm' ? 'md' : 'lg'}>No Subscription Found</AlertTitle>
              <AlertDescription fontSize={alertSize === 'sm' ? 'sm' : 'md'}>
                No active subscription plan found.
              </AlertDescription>
            </Box>
          </Alert>
        )}
        <Box mb={4}>
          <Text mb={2} fontWeight="bold">Filter Transactions:</Text>
          <Select placeholder="Select filter" onChange={(e) => setFilter(e.target.value)} size={{ base: 'sm', md: 'md' }}>
            <option value="all">All</option>
            <option value="payment">Payments</option>
            <option value="refund">Refunds</option>
            <option value="subscription">Subscription</option>
          </Select>
        </Box>
        <Box mb={4}>
          <Text mb={2} fontWeight="bold">Sort Transactions:</Text>
          <Select placeholder="Select sort option" onChange={(e) => setSort(e.target.value)} size={{ base: 'sm', md: 'md' }}>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </Select>
        </Box>
        <Box mb={4}>
          <Button onClick={() => generatePDF(sortedTransactions, subscription?.amount)} colorScheme="teal" size={{ base: 'sm', md: 'md' }}>
            Download PDF
          </Button>
        </Box>
        {currentTransactions.length > 0 ? (
          <>
            <Box overflowX="auto">
              <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
                <TableCaption>Transaction History</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Razorpay Id</Th>
                    <Th>Transaction Id</Th>
                    <Th>Plan</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentTransactions.map((transaction, index) => (
                    <Tr key={index}>
                      <Td>{formatDate(transaction.datetime)}</Td>
                      <Td>{transaction.razorpayId}</Td>
                      <Td>{transaction.transactionId}</Td>
                      <Td>{subscription.plan}</Td>
                      <Td>{subscription.amount}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              mb={4}
            />
          </>
        ) : (
          <Alert status="info" variant="subtle" borderRadius="md">
            <AlertIcon as={FaRegQuestionCircle} boxSize={alertSize === 'sm' ? '20px' : '24px'} />
            <Box ml={3}>
              <AlertTitle fontSize={alertSize === 'sm' ? 'md' : 'lg'}>No Transactions Found</AlertTitle>
              <AlertDescription fontSize={alertSize === 'sm' ? 'sm' : 'md'}>
                There are no transactions matching the selected filter.
              </AlertDescription>
            </Box>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default TransactionHistory;
