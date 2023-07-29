import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightElement

} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import img2 from "../assets/empower.png";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [distance, setDistance] = useState(0);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate()

  const handlePosition = (position) => setPos(position.coords)
  const handleErrorPosition = (error) => console.log(error)
  const positionConfig = {
    enableHighAccuracy: true, 
    // response should provide a more accurate position
    timeout: 10000, 
    // the device is allowed to take 10 seconds in order to return a position
  }

  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handlePosition, handleErrorPosition, positionConfig)  
    }
  , [])
  // gets the current position of the device at page load
  
  async function handleSubmit(e) {
    
    const lat = pos.latitude
    const lon = pos.longitude
    //get the longitude and latitude of the device
    const data = {
      "username": username,
      "email": email,
      "passwordHash": password,
      "coordinates": `(${lat}, ${lon})`,
      "max_distance": distance,
      "accuracy": pos.accuracy
    }
    
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    //check if the passwords match
    if (password.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }
    //check if the password is at least 8 characters long
    console.log(data)
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const response = await fetch(backendBaseUrl + "auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data),
      }
    )
    if (response.ok){
      const json = await response.json()
      console.log(json["token"])
      localStorage.setItem("token", json["token"])
      navigate("/dashboard")
    }
    else{
      alert("Something went wrong")
      navigate("/signup")
    }
  }
  const parse = (valueString) => valueString.replace(/^km/, "")
  const format = (value) => value + " km"

  return (
    <Container maxW={"container.xl"} h={"100vh"}>
      <form onSubmit={(e) => {
        e.preventDefault();
        return handleSubmit(e)
      }}>
        <VStack w={["full", "96"]} spacing={"7"} m={"auto"} p={"2rem"}>
          <Heading textAlign={"center"} h={"100%"}>
            <Image src={img2} w={"100%"} />
          </Heading>
          <Input
            placeholder="Enter Username"
            type="text"
            focusBorderColor="green.500"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <Input
            placeholder="Enter Email"
            type="email"
            focusBorderColor="green.500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <InputGroup size="md">
            <Input
              placeholder="Enter Password"
              type={show ? "text" : "password"}
              focusBorderColor="green.500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={(e) => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
        </InputGroup>
          
        <InputGroup size="md">
            <Input
              placeholder="Confirm Password"
              type={showConfirm ? "text" : "password"}
              focusBorderColor="green.500"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={(e) => setShowConfirm(!showConfirm)}>
                {showConfirm ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
        </InputGroup>
          <NumberInput step={1} defaultValue={15} min={0}
            onChange={(valueString) => setDistance(parse(valueString))}
            value={format(distance)}
            focusBorderColor="green.500"
            required
            width={"100%"}
            >
            <NumberInputField pattern=".*"/>
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
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
