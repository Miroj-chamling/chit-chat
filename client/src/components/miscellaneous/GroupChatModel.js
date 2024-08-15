import {
  Button,
  FormControl,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

import { ChatState } from "../../context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createChatLoading, setCreateChatLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const showToast = ({ title, description }) => {
    return toast({
      title: title,
      description: description,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-center",
    });
  };

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({ title: "User already added", description: "" });
      return;
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== user._id));
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      showToast({
        title: "Error Occured!",
        description: "Failed to load the Search Result!",
      });
    }
  };

  const handleSubmit = async () => {
    setCreateChatLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:8000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setCreateChatLoading(false);
      setChats([data, ...chats]);
      setSelectedUsers([]);
      setSearchResult([]);

      onClose();
      toast({
        title: "Group Chat Created Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-center",
      });
    } catch (error) {
      showToast({ title: error.response.data.message });
      setCreateChatLoading(false);
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder="Search Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
            <Button colorScheme="blue" onClick={handleSubmit}>
              {createChatLoading ? (
                <Spinner bgColor={"blue"} fontWeight={"bold"} />
              ) : (
                <>Create Chat</>
              )}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
