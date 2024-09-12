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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  FaHome,
  FaDollarSign,
  FaCompress,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import useDataStore from "../zustand/userDataStore";
import { userSignOut } from "../service/auth";
import UserSubscription from "../utils/SubscriptionPlan";
import { MdCardMembership, MdOutlineRssFeed } from 'react-icons/md';  

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

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleRegister = () => {
    window.location.href = "/register";
  };

  const navItems = [
    { name: "Home", icon: FaHome, href: "/" },
    { name: "Recent Feedback", icon: MdOutlineRssFeed, href: "/feedback" },
    {
      name: "Subscription",
      icon: MdCardMembership,
      submenu: (
        <UserSubscription /> // Ensure this component returns the correct submenu items
      ),
    },
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
          boxSize="24px"
          mr="2"
          alt="Brand Icon"
        />
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Heading size="lg" fontWeight="bold">
            Image Resizer
          </Heading>
        </Link>
      </Flex>

      {/* Desktop View */}
      <HStack spacing="5" display={{ base: "none", md: "flex" }}>
        {navItems.map((item) => (
          <React.Fragment key={item.name}>
            {item.submenu ? (
              <Menu>
                <MenuButton as={Button} rightIcon={<FaCompress />}>
                  {item.name}
                </MenuButton>
                <MenuList>{item.submenu}</MenuList>
              </Menu>
            ) : (
              <Link href={item.href} _hover={{ textDecoration: "none", color: "teal.200" }}>
                <HStack>
                  {item.icon && <Icon as={item.icon} />}
                  <span>{item.name}</span>
                </HStack>
              </Link>
            )}
          </React.Fragment>
        ))}
        {isLoggedIn ? (
          <Menu>
            <MenuButton>
              <Avatar src={avatarUrl} size="sm" />
            </MenuButton>
            <MenuList>
              {avatarUrl && (
                <MenuItem>
                  <Avatar src={avatarUrl} size="md" />
                </MenuItem>
              )}
              <MenuItem>Name: {user?.displayName}</MenuItem>
              <MenuItem>Email: {user?.email}</MenuItem>
              <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={handleLogin}
              leftIcon={<FaSignInAlt />}
            >
              Login
            </Button>
            <Button
              colorScheme="teal"
              variant="solid"
              onClick={handleRegister}
            >
              Register
            </Button>
          </>
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
          width="100%" // Full width
          p="6"
          bg="white"
          zIndex="1000"
          borderBottom="1px solid #e2e8f0"
        >
          <VStack spacing="5" align="stretch"> {/* Align items to stretch full width */}
            {navItems.map((item) => (
              <React.Fragment key={item.name}>
                {item.submenu ? (
                  <Menu>
                    <MenuButton as={Button} rightIcon={<FaCompress />} width="full"> {/* Full width */}
                      {item.name}
                    </MenuButton>
                    <MenuList>{item.submenu}</MenuList>
                  </Menu>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    _hover={{ textDecoration: "none", color: "teal.200" }}
                  >
                    <HStack width="full" spacing="4">
                      {item.icon && <Icon as={item.icon} />}
                      <span>{item.name}</span>
                    </HStack>
                  </Link>
                )}
              </React.Fragment>
            ))}
            {isLoggedIn ? (
              <VStack spacing="4" align="stretch"> {/* Full width */}
                <Menu>
                  <MenuButton width="full"> {/* Full width */}
                    <Avatar src={avatarUrl} size="sm" />
                  </MenuButton>
                  <MenuList>
                    {avatarUrl && (
                      <MenuItem>
                        <Avatar src={avatarUrl} size="md" />
                      </MenuItem>
                    )}
                    <MenuItem>Name: {user?.displayName}</MenuItem>
                    <MenuItem>Email: {user?.email}</MenuItem>
                    <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </VStack>
            ) : (
              <VStack spacing="4" align="stretch"> {/* Full width */}
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={handleLogin}
                  leftIcon={<FaSignInAlt />}
                  w={'100%'}
                >
                  Login
                </Button>
                <Button
                  colorScheme="teal"
                  variant="solid"
                  onClick={handleRegister}
                  w={'100%'}
                >
                  Register
                </Button>
              </VStack>
            )}
          </VStack>
        </Box>
      )}
    </Flex>
  );
};

export default Navbar;
