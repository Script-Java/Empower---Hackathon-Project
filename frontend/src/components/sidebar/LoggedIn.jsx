import React from "react";
import img2 from "../../assets/empower.png";
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
import pdf from "./../../assets/Empower_Business_Plan.pdf"
export const SideBarLoggedIn = (isOpen, onOpen, onClose) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();

    const logout = () => {
      localStorage.removeItem("token");
      onClose()
    }

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
            <Link to="/">
                <Button onClick={onClose} variant={"ghost"} colorScheme="green">
                  Home
                </Button>
              </Link>
              <Link to={pdf} target="_blank">
                <Button onClick={onClose} variant={"ghost"} colorScheme="green">
                  About
                </Button>
              </Link>
              <Link to="/dashboard">
              <Button onClick={onClose} variant={"ghost"} colorScheme="green">
                Dashboard
              </Button>
              </Link>
              <Link to="/create">
                <Button onClick={onClose} variant={"ghost"} colorScheme="green">
                  Create
                </Button>
              </Link>
              <HStack
              pos={"absolute"}
              bottom={"10"}
              right={"0"}
              w={"full"}
              justifyContent={"space-evenly"}
            >
              <Link to={"/"}>
                <Button onClick={logout} colorScheme="green" variant={"outline"}>
                  Log Out
                </Button>
              </Link>
            </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};


