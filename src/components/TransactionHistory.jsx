import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import useDataStore from "../zustand/userDataStore";
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
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Stack,
  Badge,
  Icon,
} from "@chakra-ui/react";
import {
  FaRegQuestionCircle,
  FaBoxOpen,
  FaRegCalendarCheck,
  FaSearch,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Utility function to format date in DD/MM/YYYY format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const generateResponsivePDF = (transactions) => {
  const doc = new jsPDF();
  
  // Determine the size of the page (A4 size in this case)
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Adjust font size based on page width
  const fontSize = pageWidth < 595 ? 10 : 12; // Smaller font for smaller devices
  const margin = 10; // Set margins for the PDF
  
  // Setting the default style for the document
  doc.setFontSize(fontSize);
  doc.text("Transaction Details", margin, margin + 10); // Add a title

  // Loop through transactions and add data to the PDF
  transactions.forEach((transaction, index) => {
    const yPosition = margin + 20 + (index * 60); // Adjust y position based on transaction index

    // Add transaction data
    doc.text("Date:", margin, yPosition);
    doc.text(formatDate(transaction.date), margin + 40, yPosition);
    
    doc.text("Transaction Id:", margin, yPosition + 10);
    doc.text(transaction.transactionId, margin + 40, yPosition + 10);

    doc.text("Receipt Id:", margin, yPosition + 20);
    doc.text(transaction.receipt_number, margin + 40, yPosition + 20);
    
    doc.text("Plan:", margin, yPosition + 30);
    doc.text(transaction.plan, margin + 40, yPosition + 30);
    
    doc.text("Amount:", margin, yPosition + 40);
    doc.text(transaction.amount.toString(), margin + 40, yPosition + 40);

    doc.text("Order Id:", margin, yPosition + 50);
    doc.text(transaction.rzpay_order_id, margin + 40, yPosition + 50);

    doc.text("Mode of Payment:", margin, yPosition + 60);
    doc.text(transaction.mode_of_payment, margin + 40, yPosition + 60);
    
    doc.text("Status:", margin, yPosition + 70);
    doc.text(transaction.rzpay_order_status, margin + 40, yPosition + 70);

    doc.text("Plan Expire:", margin, yPosition + 80);
    doc.text(formatDate(transaction.expiryDate), margin + 40, yPosition + 80);

    // Add a blank line after each transaction for separation
    doc.text("", margin, yPosition + 90);
  });

  // Add page number
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.text(
    `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
    pageWidth - margin - 30,
    pageHeight - margin
  );

  // Save the document
  doc.save("transactions_responsive.pdf");
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
      <Text mx={2}>
        {currentPage} / {totalPages}
      </Text>
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
  const alertSize = useBreakpointValue({ base: "sm", md: "md" });

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
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
            Subscription Plan
          </Text>
        </Stack>
        <Box
          borderWidth={1}
          borderRadius="md"
          p={4}
          bg="gray.50"
          borderColor="gray.200"
        >
          <Stack spacing={2}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
              Plan:
            </Text>
            <Badge colorScheme="teal" fontSize={{ base: "sm", md: "md" }}>
              {subscription.plan}
            </Badge>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
              Expiry Date:
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
              {formatDate(subscription.expiryDate)}
            </Text>
          </Stack>
        </Box>
        <Box textAlign="center">
          <Icon as={FaRegCalendarCheck} boxSize={8} color="teal.500" />
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt={2}>
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
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
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
      setError("Failed to load data.");
      setLoading(false);
    };

    // Subscribe to both data sources
    const unsubscribeSubscription = onValue(
      subscriptionRef,
      fetchSubscription,
      handleError
    );
    const unsubscribeHistory = onValue(
      historyRef,
      fetchTransactions,
      handleError
    );

    return () => {
      unsubscribeSubscription();
      unsubscribeHistory();
    };
  }, [user]);

  const alertSize = useBreakpointValue({ base: "sm", md: "md" }); // Responsive size for the Alert component

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.orderId?.toLowerCase().includes(searchLower) ||
      transaction.transactionId?.toLowerCase().includes(searchLower) ||
      (transaction.amount && transaction.amount.toString().includes(searchTerm))
    );
  });

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        p={4}
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} maxW="600px" mx="auto">
        <Alert status="error" variant="subtle" borderRadius="md">
          <AlertIcon
            as={FaRegQuestionCircle}
            boxSize={alertSize === "sm" ? "20px" : "24px"}
          />
          <Box ml={3}>
            <AlertTitle fontSize={alertSize === "sm" ? "md" : "lg"}>
              Error
            </AlertTitle>
            <AlertDescription fontSize={alertSize === "sm" ? "sm" : "md"}>
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
            <AlertIcon
              as={FaRegQuestionCircle}
              boxSize={alertSize === "sm" ? "20px" : "24px"}
            />
            <Box ml={3}>
              <AlertTitle fontSize={alertSize === "sm" ? "md" : "lg"}>
                No Subscription Found
              </AlertTitle>
              <AlertDescription fontSize={alertSize === "sm" ? "sm" : "md"}>
                No active subscription plan found.
              </AlertDescription>
            </Box>
          </Alert>
        )}
        <Box mb={4}>
          <Text mb={2} fontWeight="bold">
            Search Transactions:
          </Text>
          <InputGroup size={{ base: "sm", md: "md" }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search by Order Id, Transaction Id, Amount"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>
        <Box mb={4}>
          <Button
           onClick={() => generateResponsivePDF(filteredTransactions)}
            colorScheme="teal"
            size={{ base: "sm", md: "md" }}
          >
            Download PDF
          </Button>
        </Box>
        {currentTransactions.length > 0 ? (
          <>
            <Box overflowX="auto">
              <Table variant="simple" size={{ base: "sm", md: "md" }}>
              <TableCaption>Transaction History</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Transaction Id</Th>
                    <Th>Receipt Id</Th>
                    <Th>Plan</Th>
                    <Th>Amount</Th>
                    <Th>Order Id</Th>
                    <Th>Mode</Th>
                    <Th>Status</Th>
                    <Th>Plan Expire</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentTransactions.map((transaction, index) => (
                    <Tr key={index}>
                      <Td>{formatDate(transaction.date)}</Td>
                      <Td>{transaction.transactionId}</Td>
                      <Td>{transaction.receipt_number}</Td>
                      <Td>{transaction.plan}</Td>
                      <Td>{transaction.amount}</Td>
                      <Td>{transaction.rzpay_order_id}</Td>
                      <Td>{transaction.mode_of_payment}</Td>
                      <Td>{transaction?.rzpay_order_status}</Td>
                      <Td>{formatDate(transaction.expiryDate)}</Td>
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
            <AlertIcon
              as={FaRegQuestionCircle}
              boxSize={alertSize === "sm" ? "20px" : "24px"}
            />
            <Box ml={3}>
              <AlertTitle fontSize={alertSize === "sm" ? "md" : "lg"}>
                No Transactions Found
              </AlertTitle>
              <AlertDescription fontSize={alertSize === "sm" ? "sm" : "md"}>
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
