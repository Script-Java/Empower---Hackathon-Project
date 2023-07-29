import React, { useEffect, useState } from "react";
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
import {SideBarNotLoggedIn} from "./sidebar/NotLoggedIn"
import {SideBarLoggedIn} from "./sidebar/LoggedIn"
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loggedIn, setLoggedIn] = useState(false)
  function decodeJwt(token){
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (error) {
      return undefined
    }
  }

  useEffect(() => {
    console.log("hi")
    try{
      const token = localStorage.getItem("token")
      if (token){
        const info = decodeJwt(token)
        console.log(info)
        const exp = new Date(info["exp"] * 1000)
        const nbf = new Date(info["nbf"] * 1000)
        const date = new Date()
        if (date > exp || date < nbf){
          localStorage.removeItem("token")
          setLoggedIn(false)
        }
        else{
          setLoggedIn(true)
        }
        
      }
      else{
        localStorage.removeItem("token")
        setLoggedIn(false)
      }
    }
    catch(err){
      
      localStorage.removeItem("token")
      setLoggedIn(false)
      console.log(err)
    }
  }, [isOpen])

  return (loggedIn ? SideBarLoggedIn(isOpen, onOpen, onClose) : SideBarNotLoggedIn(isOpen, onOpen, onClose));
};

export default Header;
