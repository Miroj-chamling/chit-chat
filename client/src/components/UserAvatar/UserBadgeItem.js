import React from "react";
import { Box } from "@chakra-ui/layout";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      fontSize={12}
      bgColor={"purple"}
      cursor={"pointer"}
      color={"whitesmoke"}
      fontWeight={"bold"}
    >
      {user.name}
      <CloseIcon
        pl={2}
        fontWeight={"bold"}
        fontSize={16}
        onClick={handleFunction}
      ></CloseIcon>
    </Box>
  );
};

export default UserBadgeItem;
