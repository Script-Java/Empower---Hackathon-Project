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
import img2 from "../assets/empower.png";
import img3 from "../assets/earth_3.svg";
const Home = () => {
  return (
    <Box
      bgImage={img3}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color={"white"}
      minH={"100vh"}
    >
      <Flex
        // h="90"
        align="center"
        justify="center"
        direction="column"
        padding={"4rem"}
        fontFamily={font}
        borderRadius={"1rem"}
        backdropFilter={"blur(10px)"}
      >
        <Heading size="4xl" color="#75eb75" fontFamily={font} opacity={"1.1"}>
          Empower
        </Heading>
        {/* <img src={img2} alt="" /> */}
        <Text
          // paddingTop={"3rem"}
          margin={"1rem"}
          fontWeight="bold"
          fontSize="4xl"
          color={"lightgreen"}
          padding={"1rem"}
          textAlign={"center"}
        >
           Connecting Kindness, Sharing Hope
        </Text>
        <Text 
          // marginTop={"3rem"}
          fontSize="2xl"
          // color={"#CA054D"}
          color={"lightgreen"}
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
