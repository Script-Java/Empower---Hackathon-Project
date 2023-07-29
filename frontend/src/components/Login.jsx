
import {
  Button,
  Container,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import img2 from "../assets/empower.png";

const Login = () => {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [loginFailed, setLoginFailed] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    console.log(backendBaseUrl)
    const response = await fetch(backendBaseUrl + "auth/login", {
        "method": "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "email": email,
          "password": password
        })
      }
    )
    if (response.status === 200) {
      const json = await response.json()
      console.log(json["token"])
      localStorage.setItem("token", json["token"])
      navigate("/dashboard")
    }
    else{
      setLoginFailed(true)
      setPassword("")
      setEmail("")
    }
  }

  return (
    <Container maxW={"container.md"} h={"100vh"} overflow={"hidden"}>
      <form onSubmit={(e) => {
            e.preventDefault()
            return handleSubmit(e)}}>
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
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Enter Password"
            type="password"
            focusBorderColor="green.500"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant={"link"} alignSelf={"flex-end"}>
            <Link to={"/forgetpassword"}>Forget Password?</Link>
          </Button>

          <Button type="submit" colorScheme="green" >
            Log In
          </Button>

          <Text textAlign={"right"}>
            New user?{" "}
            <Button variant={"link"} colorScheme="green">
              <Link to={"/signup"}>Sign Up</Link>
            </Button>
          </Text>
          {loginFailed ? <Text color={"red"}>Invalid Credentials</Text>: null}
        </VStack>
      </form>
    </Container>
  );
};

export default Login;
