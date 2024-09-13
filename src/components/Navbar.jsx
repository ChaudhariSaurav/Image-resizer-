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
  FaCompress,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBoxOpen
} from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { MdOutlineFeedback, MdNotifications } from "react-icons/md";
import useDataStore from "../zustand/userDataStore";
import { userSignOut } from "../service/auth";
import UserSubscription from "../utils/SubscriptionPlan";
import { MdOutlineRssFeed } from 'react-icons/md';
import { BsFiletypePdf } from "react-icons/bs";
import { database } from "../config/firebase";
import { ref } from "firebase/database";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, user } = useDataStore();
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || null);
  const [name, setName] = useState('');


  const fetchUserData = async (uid) => {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return data.name || ''; // Return only the name property
      } else {
        console.log("No user data available");
        return ''; // Return an empty string if no name is available
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return ''; // Return an empty string in case of error
    }
  };
  


  useEffect(() => {
    if (user) {
      if (user.photoURL) {
        setAvatarUrl(user.photoURL);
      }
  
      const userId = user?.id;
      if (userId) {
        fetchUserData(userId).then(userName => {
          setName(userName?.name); // Set only the name
        });
      }
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

  // Define navItems based on login state
  const navItems = isLoggedIn
    ? [
        { name: "Home", icon: FaHome, href: "/" },
        { name: "Pdf", icon: BsFiletypePdf, href: "/pdf-resize" },
        { name: "Feedback", icon: MdOutlineFeedback, href: "/feedback" },
        { name: "Transaction", icon: AiOutlineTransaction, href: "/transaction-history" },
        {
          name: "Subscription",
          icon: FaBoxOpen,
          submenu: <UserSubscription /> // Ensure this component returns the correct submenu items
        },
      ]
    : [
        { name: "Home", icon: FaHome, href: "/" },
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
              <MenuItem>{name}</MenuItem>
              <MenuItem>{user?.email}</MenuItem>
              <Link href="/profile">
                <MenuItem icon={<MdOutlineRssFeed />}>Profile</MenuItem>
              </Link>
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
          width="100%"
          p="6"
          bg="white"
          zIndex="1000"
          borderBottom="1px solid #e2e8f0"
        >
          <VStack spacing="5" align="stretch">
            {navItems.map((item) => (
              <React.Fragment key={item.name}>
                {item.submenu ? (
                  <Menu>
                    <MenuButton as={Button} rightIcon={<FaCompress />} width="full">
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
              <VStack spacing="4" align="stretch">
                <Menu>
                  <MenuButton width="full">
                    <Avatar src={avatarUrl} size="sm" />
                  </MenuButton>
                  <MenuList>
                    {avatarUrl && (
                      <MenuItem>
                        <Avatar src={avatarUrl} size="md" />
                      </MenuItem>
                    )}
                    <MenuItem>Name: {name}</MenuItem>
                    <MenuItem>Email: {user?.email}</MenuItem>
                    <Link href="/profile">
                      <MenuItem icon={<MdOutlineRssFeed />}>Profile</MenuItem>
                    </Link>
                    <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </VStack>
            ) : (
              <VStack spacing="4" align="stretch">
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={handleLogin}
                  leftIcon={<FaSignInAlt />}
                  w="full"
                >
                  Login
                </Button>
                <Button
                  colorScheme="teal"
                  variant="solid"
                  onClick={handleRegister}
                  w="full"
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
