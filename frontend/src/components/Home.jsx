import React from "react";
import {
  Box,
  Image,
  Heading,
  Container,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";
import font from "../styles/font.css";
import img1 from "../assets/1_image.png";
const Home = () => {
  return (
    <Box
      bgImage={img1}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        h="90"
        align="center"
        justify="center"
        direction="column"
        marginTop={"-17rem"}
        fontFamily={font}
      >
        <Heading size="4xl" color="#458862" fontFamily={font} opacity={"1.1"}>
          Empower
        </Heading>
        <Text
          paddingTop={"3rem"}
          fontWeight="bold"
          fontSize="4xl"
          color={"green"}
        >
           Connecting Kindness, Sharing Hope
        </Text>
        <Text 
          marginTop={"10rem"}
          fontSize="2xl"
          color={"#CA054D"}
          textAlign={"center"}
        >
          Welcome to Empower: Bridging Generosity, Uplifting Lives! <br/>
A Compassionate Online Community, Where Giving is Caring. <br/>
Share Your Blessings, Empower the Less Fortunate Today!
        </Text>
      </Flex>
    </Box>
  );
};

export default Home;
