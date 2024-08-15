import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  useDisclosure,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Box,
  FormControl,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";

import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModel = ({ fetchMessages }) => {
  const { fetchAgain, setFetchAgain, selectedChat, setSelectedChat, user } =
    ChatState();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleRename = async () => {
    setRenameLoading(true);
    console.log(selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setFetchAgain(data);
      setSelectedChat(data);
      setRenameLoading(false);
      setGroupChatName("");

      toast({
        title: "GroupName updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

      setRenameLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User Already in the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // if (selectedChat.groupAdmin._id !== user._id) {
    //   toast({
    //     title: "Only Admins can add someone into the group",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   });
    //   return;
    // }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    setSearch(query);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      const newData = data.filter(
        (user) => !selectedChat.users.some((u) => u._id === user._id)
      );

      setSearchResult(newData);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: "Only admins can remove someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );
      console.log(data);
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} flex={"wrap"} pb={3} w={"100%"}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
