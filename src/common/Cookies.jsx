// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   AlertIcon,
//   AlertTitle,
//   AlertDescription,
//   Button,
//   Box,
//   useDisclosure,
// } from "@chakra-ui/react";

// const CookieConsent = ({ setUser }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [consent, setConsent] = useState(null);

//   useEffect(() => {
//     const storedConsent = localStorage.getItem("cookiesConsent");
//     if (!storedConsent) {
//       onOpen(); // Open consent dialog if no consent is stored
//     } else {
//       setConsent(storedConsent);
//     }
//   }, [onOpen]);

//   const handleAccept = () => {
//     localStorage.setItem("cookiesConsent", "true");
//     setConsent("true");
//     onClose();
//   };

//   const handleDecline = () => {
//     alert("Session cannot be stored without cookies consent.");
//     setUser(null); // Prevent session storage if no consent
//     onClose();
//   };

//   return (
//     <>
//       {isOpen && (
//         <Box position="fixed" bottom="20px" left="40%" transform="translateX(-50%)" zIndex="1000">
//           <Alert status="info" borderRadius="md">
//             <AlertIcon />
//             <AlertTitle mr={2}>Cookie Consent</AlertTitle>
//             <AlertDescription>
//               This site uses cookies for session storage. Do you accept?
//             </AlertDescription>
//             <Button onClick={handleAccept} colorScheme="blue" ml={4}>
//               Accept
//             </Button>
//             <Button onClick={handleDecline} colorScheme="red" ml={2}>
//               Decline
//             </Button>
//           </Alert>
//         </Box>
//       )}
//     </>
//   );
// };

// export default CookieConsent;
