import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";

import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "./NotificationBadge";

const SideDrawer = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("user-credentails");
    history.push("/");
  };

  const showToast = (title) => {
    return toast({
      title: title,
      description: "Failed to Load the Search Results",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  };

  const handleSearch = async () => {
    if (!search) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);

      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log(data);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      showToast("Error finding the chat");
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label={"Search Users to chat"} hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa fa-search" aria-hidden="true"></i>
            <Text display={{ base: "none", md: "flex" }} px={"4px"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Chit - Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <div className="notification">
                {notification.length === 0 ? (
                  <></>
                ) : (
                  <NotificationBadge
                    num={notification.length}
                  ></NotificationBadge>
                )}
                <BellIcon fontSize={"2xl"} m={1}></BellIcon>
              </div>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);

                    setNotification(
                      notification.filter(
                        (n) => n.sender._id !== notif.sender._id
                      )
                    );
                    console.log(notification.length);
                  }}
                >
                  {notif.chat.isGroupChat ? (
                    <p>
                      <b>{notif.chat.chatName}</b> : <br />
                      <b>{notif.content}</b>
                    </p>
                  ) : (
                    `New Message from ${getSender(user, notif.chat.users)}`
                  )}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={"sm"} cursor={"pointer"} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
            <DrawerBody>
              <Box display={"flex"} pb={2}>
                <Input
                  placeholder={"Search by name or email"}
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <i class="fa fa-search" aria-hidden="true"></i>
                </Button>
              </Box>
              {loading ? (
                <ChatLoading></ChatLoading>
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default SideDrawer;
