import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import img2 from "../assets/empower.png";

const SignUp = () => {
  return (
    <Container maxW={"container.xl"} h={"100vh"}>
      <form>
        <VStack w={["full", "96"]} spacing={"7"} m={"auto"} p={"2rem"}>
          <Heading textAlign={"center"} h={"100%"}>
            <Image src={img2} w={"100%"} />
          </Heading>
          <Input
            placeholder="Enter Name"
            type="text"
            focusBorderColor="green.500"
            required
          />
          <Input
            placeholder="Enter Email"
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
          <Input
            placeholder="Enter Your Country"
            type="text"
            focusBorderColor="green.500"
            required
          />
          <Button type="submit" colorScheme="green">
            Sign Up!
          </Button>

          <Text textAlign={"right"}>
            Already a user?{" "}
            <Button variant={"link"} colorScheme="green">
              <Link to={"/login"}>Log In</Link>
            </Button>
          </Text>
        </VStack>
      </form>
    </Container>
  );
};

export default SignUp;
