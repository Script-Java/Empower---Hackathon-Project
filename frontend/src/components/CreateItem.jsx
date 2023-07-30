import React, {useState, useEffect, useRef} from 'react';
import {
    Button,
    Container,
    Heading,
    Image,
    Input,
    Text,
    Textarea,
    VStack,
    HStack,
    Grid,
    GridItem
  } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
const CreateItem = () => {
    const [image, setImage] = useState(null);
    const fileUploader = useRef()

    function handleFileChange(e){
        setImage(URL.createObjectURL(e.target.files[0]))
    }

    

    return (
        <Container maxW={"container.md"}>
      <form onSubmit={(e) => {
            e.preventDefault()
            return handleSubmit(e)}}>
        
        <Grid 
            templateColumns={{  base: "1fr", 
                                md: "1fr 1fr"}} 
            // templateRows={"1fr 1fr 1fr"}
            alignItems={"stretch"}
            my={"16"}
            gap={"1rem"}
            // overflowY={"scroll"}
            // h={"100vh"}
        >
            
            <GridItem colStart={{
                base: 1,
                md: 2
            }}>
                <Input
                    placeholder="Title"
                    type="text"
                    fontSize={"5rem"}
                    h={"7rem"}
                    letterSpacing={"wide"}
                    focusBorderColor="green.500"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
            </GridItem>
            <GridItem colStart={{
                base: 1,
                md: 2
            }}>
                <Textarea
                    placeholder="Description"
                    focusBorderColor="green.500"
                />
            </GridItem>
            <GridItem colStart={1} rowStart={1} rowEnd={3}>
                <Input
                    display={image ? "none" : "inherit"}
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    ref={fileUploader}
                    required
                />
            </GridItem>
            <GridItem
                display={image ? "inherit" : "none"}
                colStart={{
                    base: 1,
                    md: 1
                }}
                rowStart={{
                    base: 2,
                    md: 3
                }}
            >
                <Button colorScheme="green" w="full" onClick={() => {
                    setImage(null)
                    fileUploader.current.value = null
                }}>
                    Take a new photo
                </Button>
            </GridItem>
            <GridItem display={image ? "inherit" : "none"} colStart={1} colEnd={2} rowStart={1} rowEnd={{
                base: 2,
                md: 3
            }}>
                <Image src={image}/>
            </GridItem>
            <GridItem colStart={1} colEnd={{
                base: 2,
                md: 3
            }}>
                <Button type="submit" colorScheme="green" w="full">
                    Create Item
                </Button>
            </GridItem>
        </Grid>
      </form>
    </Container>
    )
}

export default CreateItem;