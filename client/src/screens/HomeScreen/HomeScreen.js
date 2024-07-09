import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
} from "@chakra-ui/react";
import Login from "../../components/authentication/Login";
import Signup from "../../components/authentication/Signup";

const HomeScreen = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"White"}
        w="100%"
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={"black"}
      >
        <Text
          fontSize={"4xl"}
          fontFamily={"Work sans"}
          color={"black"}
          textAlign={"center"}
        >
          Chit-Chat
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        p={"4"}
        color={"black"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomeScreen;
