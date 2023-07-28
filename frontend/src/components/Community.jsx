import { React, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Input,
  Text,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import img3 from "../assets/img6.png";
const Community = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Perform form submission logic here
    // For demonstration purposes, let's assume the submission is successful after a brief delay
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate an asynchronous operation
    setIsSubmitted(true);
  };
  return (
    <Box bgColor={"#F4ECDC"} w={"100%"} h={"100vh"}>
      <Container
        bg={"white"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        borderRadius={"30px"}
        gap={"2rem"}
        h={"100vh"}
      >
        <Box
          p={"1.2rem"}
          display={"flex"}
          flexDirection={"column"}
          gap={"2rem"}
          flex={"1"}
        >
          <Heading>Share Resources</Heading>
          <Text>
            Please fill out the form below to share the resources you can offer
            to those in need. Your kindness can make a significant difference in
            our community!
          </Text>
          <Image src={img3} w={"350px"} />
        </Box>
        <Box>
          <form>
            <VStack gap={"1rem"} m={"0.7rem"}>
              <Input
                placeholder="Type of Resource"
                type="text"
                focusBorderColor="green.500"
              />
              <Input
                placeholder="Description"
                type="text"
                focusBorderColor="green.500"
              />
              <Input
                placeholder="Quantity or Amount"
                type="text"
                focusBorderColor="green.500"
              />
              <Input
                placeholder="City"
                type="text"
                focusBorderColor="green.500"
              />
              <Button
                onClick={handleSubmit}
                variant={"ghost"}
                colorScheme={"green"}
                alignSelf={"center"}
                p={"1rem"}
              >
                Submit
              </Button>
              {isSubmitted && (
                <Alert status="success" mt={4}>
                  <AlertIcon />
                  Thanks for submission!
                </Alert>
              )}
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Community;
