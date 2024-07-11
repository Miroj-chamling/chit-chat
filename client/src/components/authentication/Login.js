import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";

import { ChatState } from "../../context/ChatProvider";

import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const history = useHistory();
  const { setUser } = ChatState();

  const handleClick = () => {
    setShow(!show);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const config = {
        Headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:8000/api/user/login",
        {
          email,
          password,
        },
        config
      );

      setUser(data);
      localStorage.setItem("user-credentails", JSON.stringify(data));

      setLoading(false);

      history.push("/chats");

      toast({
        title: "Login successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack>
      <FormControl id="email-login" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          variant={"flushed"}
          placeholder="Enter Your Name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password-login" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
      >
        Login
      </Button>

      <Button
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("test@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
