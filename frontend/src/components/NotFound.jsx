import {Flex, Heading, Link} from '@chakra-ui/react';
import font from "../styles/font.css";

const NotFoundPage = () => {
    return (
        <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"} w={"100vw"} flexDir={"column"}>
        <Heading size="4xl" color="green.400" fontFamily={font}>
          404 
        </Heading>
        <Heading size="3xl" color="green.400" fontFamily={font}>
          Page Not Found
        </Heading>
        <Link href="/" fontFamily={font} marginTop={"10rem"}>
            <Heading size="3xl" color="green.400" fontFamily={font}>
            Go Home
            </Heading>
        </Link>
      </Flex>
    )
}
export default NotFoundPage;