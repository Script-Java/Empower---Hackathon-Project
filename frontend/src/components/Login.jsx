import {
  Button,
  Container,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import img2 from "../assets/empower.png";

const Login = () => {
  return (
    <Container maxW={"container.md"} h={"100vh"} overflow={"hidden"}>
      <form>
        <VStack
          alignItems={"stretch"}
          w={["full", "96"]}
          spacing={"8"}
          m={"auto"}
          my={"16"}
        >
          <Image src={img2} w={"280px"} alignSelf={"center"} />
          <Input
            placeholder="Enter Username"
            type="email"
            focusBorderColor="green.500"
            required
          />
          <Input
            placeholder="Enter Password"
            type="password"
            focusBorderColor="green.500"
            required
          />

          <Button variant={"link"} alignSelf={"flex-end"}>
            <Link to={"/forgetpassword"}>Forget Password?</Link>
          </Button>

          <Button type="submit" colorScheme="green">
            Log In
          </Button>

          <Text textAlign={"right"}>
            New user?{" "}
            <Button variant={"link"} colorScheme="green">
              <Link to={"/signup"}>Sign Up</Link>
            </Button>
          </Text>
        </VStack>
      </form>
    </Container>
  );
};

export default Login;
