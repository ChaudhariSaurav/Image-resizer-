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
  Divider,
  Switch,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorMode,
  useColorModeValue,
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
import { BsFillPersonFill, BsGraphUp, BsFillGearFill } from "react-icons/bs";
import { HiOutlineLightBulb } from "react-icons/hi";
import { AiOutlineTransaction } from "react-icons/ai";
import { MdOutlineFeedback, MdOutlineRssFeed } from "react-icons/md";
import { BsFiletypePdf } from "react-icons/bs";

import useDataStore from "../zustand/userDataStore";
import { userSignOut } from "../service/auth";
import UserSubscription from "../utils/SubscriptionPlan";
import { database } from "../config/firebase";
import { ref, get } from "firebase/database";

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
        return data.name || '';
      } else {
        console.log("No user data available");
        return '';
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return '';
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
          setName(userName);
        });
      }
    }
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirecturl');
    if (redirectUrl && isLoggedIn) {
      window.location.href = `${redirectUrl}`;
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await userSignOut();
      window.location.href = ('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const buildUrl = (path, params = {}) => {
    const url = new URL(window.location.origin + path);
    Object.keys(params).forEach(key => url.searchParams.set(key, params[key]));
    return url.toString();
  };

  const handleRedirect = (path, extraParams) => {
    const currentUrl = window.location.href;
    const params = { returnurl: encodeURIComponent(currentUrl), ...extraParams };
    window.location.href = buildUrl(path, params);
  };

  const handleLogin = () => {
    handleRedirect('/login', { ssrc: 'head' });
  };

  const handleRegister = () => {
    handleRedirect('/register', { ssrc: 'head' });
  };

  const navItems = isLoggedIn
    ? [
        { name: "Home", icon: FaHome, href: "/" },
        { name: "Pdf", icon: BsFiletypePdf, href: "/pdf-resize" },
        { name: "Feedback", icon: MdOutlineFeedback, href: "/feedback" },
        { name: "Transaction", icon: AiOutlineTransaction, href: "/transaction-history" },
        {
          name: "Subscription",
          icon: FaBoxOpen,
          submenu: <UserSubscription />
        },
      ]
    : [{ name: "Home", icon: FaHome, href: "/" }];

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
                <MenuButton as={Link} rightIcon={<FaCompress />}>
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
            <VStack align="start" p={4}>
              <Avatar src={avatarUrl} size="lg" mb={2} />
              <Text fontWeight="bold">{name}</Text>
              <Text fontSize="sm" color="gray.500">
                {user?.email}
              </Text>
            </VStack>
            <Divider />


            {/* Profile Menu Items */}
            <MenuItem icon={<BsFillPersonFill />}>Your profile</MenuItem>
            <MenuItem icon={<BsFillGearFill />}>Account settings</MenuItem>

            <Divider />

            {/* Logout */}
            <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Flex>
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={handleLogin}
            leftIcon={<FaSignInAlt />}
            mr={2}
          >
            Login
          </Button>
          <Button colorScheme="teal" variant="solid" onClick={handleRegister}>
            Register
          </Button>
        </Flex>
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
                    <HStack>
                      {item.icon && <Icon as={item.icon} />}
                      <span>{item.name}</span>
                    </HStack>
                  </Link>
                )}
              </React.Fragment>
            ))}
            {isLoggedIn ? (
              <Button width="full" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Flex direction="column">
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={handleLogin}
                  leftIcon={<FaSignInAlt />}
                  mb={2}
                >
                  Login
                </Button>
                <Button colorScheme="teal" variant="solid" onClick={handleRegister}>
                  Register
                </Button>
              </Flex>
            )}
          </VStack>
        </Box>
      )}
    </Flex>
  );
};

export default Navbar;
