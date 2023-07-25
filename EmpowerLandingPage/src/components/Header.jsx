import React from "react";
import img2 from "../assets/empower.png";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BiMenuAltLeft } from "react-icons/bi";
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        pos={"fixed"}
        top={"4"}
        left={"4"}
        colorScheme="green"
        p={"0"}
        w={"10"}
        h={"10"}
        zIndex={"overlay"}
        borderRadius={"full"}
        onClick={onOpen}
      >
        <BiMenuAltLeft size={"20"} />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <img src={img2} alt="" />
          </DrawerHeader>
          <DrawerBody>
            <VStack alignItems={"flex-start"}>
              <Button onClick={onClose} variant={"ghost"} colorScheme="green">
                <Link to="/">Home</Link>
              </Button>
              <Button onClick={onClose} variant={"ghost"} colorScheme="green">
                <Link to="/about">About</Link>
              </Button>
            </VStack>
            <HStack
              pos={"absolute"}
              bottom={"10"}
              right={"0"}
              w={"full"}
              justifyContent={"space-evenly"}
            >
              <Button onClick={onClose} colorScheme="green">
                <Link to={"/login"}>Login</Link>
              </Button>
              <Button onClick={onClose} colorScheme="green" variant={"outline"}>
                <Link to={"/signup"}>SignUp</Link>
              </Button>
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
