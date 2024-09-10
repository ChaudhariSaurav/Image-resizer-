import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  HStack,
  Link,
  Button,
  IconButton,
  Icon,
  useDisclosure,
  VStack,
  Box,
  Avatar,
  Image,
} from "@chakra-ui/react";
import {
  FaHome,
  FaDollarSign,
  FaComments,
  FaInfoCircle,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import useDataStore from "../zustand/userDataStore";
import { userSignOut } from "../service/auth";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, user } = useDataStore();
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || null);

  useEffect(() => {
    if (user && user.photoURL) {
      setAvatarUrl(user.photoURL);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await userSignOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    { name: "Home", icon: FaHome, href: "/" },
    { name: "Features", icon: FaInfoCircle, href: "#features" },
    { name: "Pricing", icon: FaDollarSign, href: "#pricing" },
    { name: "Testimonials", icon: FaComments, href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <Flex
      as="nav"
      justify="space-between"
      align="center"
      p="4"
      position="fixed"
      width="100%"
      top="0"
      zIndex="1000"
      bg="white"
      borderBottom="1px solid #e2e8f0"
    >
      <Flex align="center">
        <Image
          src="https://cdn.icon-icons.com/icons2/1381/PNG/512/com_94698.png"
          boxSize="24px" // Adjust size as needed
          mr="2" // Space between image and text
          alt="Brand Icon"
        />
        <Heading size="lg" fontWeight="bold">
          Image Resizer
        </Heading>
      </Flex>
      {/* Desktop View */}
      <HStack spacing="5" display={{ base: "none", md: "flex" }}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            _hover={{ textDecoration: "none", color: "teal.200" }}
          >
            <HStack>
              {item.icon && <Icon as={item.icon} />}
              <span>{item.name}</span>
            </HStack>
          </Link>
        ))}
        {isLoggedIn ? (
          <HStack spacing="3">
            {avatarUrl && <Avatar src={avatarUrl} size="sm" />}
            <VStack align="start" spacing="1">
              <span>{user?.displayName}</span>
              <span>{user?.email}</span>
            </VStack>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={handleLogout}
              leftIcon={<FaSignOutAlt />}
              ml="4"
            >
              Logout
            </Button>
          </HStack>
        ) : (
          <Button
            colorScheme="teal"
            variant="outline"
            leftIcon={<FaSignInAlt />}
          >
            Login
          </Button>
        )}
      </HStack>
      {/* Mobile View */}
      <IconButton
        aria-label="Open Menu"
        icon={isOpen ? <FaTimes /> : <FaBars />}
        display={{ base: "flex", md: "none" }}
        onClick={isOpen ? onClose : onOpen}
      />
      {isOpen && (
        <Box
          position="fixed"
          top="60px"
          left="0"
          width="100%"
          p="6"
          bg="white"
          zIndex="1000"
          borderBottom="1px solid #e2e8f0"
        >
          <VStack spacing="5" align="start">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                _hover={{ textDecoration: "none", color: "teal.200" }}
              >
                <HStack>
                  {item.icon && <Icon as={item.icon} />}
                  <span>{item.name}</span>
                </HStack>
              </Link>
            ))}
            {isLoggedIn ? (
              <VStack spacing="4" align="start">
                <HStack spacing="3" align="center">
                  {avatarUrl && <Avatar src={avatarUrl} size="sm" />}
                  <VStack align="start" spacing="1">
                    <span>{user?.displayName}</span>
                    <span>{user?.email}</span>
                  </VStack>
                </HStack>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={handleLogout}
                  leftIcon={<FaSignOutAlt />}
                >
                  Logout
                </Button>
              </VStack>
            ) : (
              <Button
                colorScheme="teal"
                variant="outline"
                leftIcon={<FaSignInAlt />}
              >
                Login
              </Button>
            )}
          </VStack>
        </Box>
      )}
    </Flex>
  );
};

export default Navbar;
