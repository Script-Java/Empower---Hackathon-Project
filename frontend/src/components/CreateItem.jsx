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
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pos, setPos] = useState(null);

    const navigate = useNavigate()
    const fileUploader = useRef()

    function handleFileChange(e){
        setImage(URL.createObjectURL(e.target.files[0]))
        // The image is not a raw file, but a URL
        // The URL is stored in the state
    }

    const handlePosition = (position) => setPos(position.coords)
    const handleErrorPosition = (error) => console.log(error)
    const positionConfig = {
        enableHighAccuracy: true, 
        // response should provide a more accurate position
        timeout: 10000, 
        // the device is allowed to take 10 seconds in order to return a position
    }
    const readerFunction = (file) => 
        {return new Promise((resolve, reject) => {
            const reader = new FileReader()
            
            reader.onload = async (e) => {
                
                try{
                    resolve(reader.result)
                }
                catch(err){
                    reject(err)
                }
            }
            reader.onerror = (error) => {reject(error)}
            reader.readAsDataURL(file)
        })}
    // This function creates a promise of the FileReader.readAsDataURL() function which is used in the handleSubmit


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(handlePosition, handleErrorPosition, positionConfig)  
        }
      , [])

    async function handleSubmit(e){
        let imageDataURL = ""
        imageDataURL = await readerFunction(await fetch(image).then(r => r.blob()))
        // The imageDataURL uses the promise created in the readerFunction to retrive the dataUrl representation of the image url stored in the image state
        
        const lat = pos.latitude
        const lon = pos.longitude
        // Get the longitude and latitude from the position state
        const data = {
            "title": title,
            "description": description,
            "item_image": imageDataURL,
            "coordinates": `(${lat}, ${lon})`
        }
        // Create a data object with the data from the form
        //There is no need to check for empty fields since chakra UI does that for us
        const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL
        const response = await fetch(backendBaseUrl + "items/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(data)
        })
        if(response.ok){
            alert("Item created successfully")
            // If the data is not empty, the user is redirected to the dashboard
            navigate("/dashboard")
        }
        else if(response.status === 401){
            navigate("/login")
        }
        else{
            alert("Error creating item" + (await response.json())["message"])
        }
    }
    

    return (
        <Container maxW={"container.lg"}>
      <form onSubmit={(e) => {
            e.preventDefault()
            return handleSubmit(e)}}>
        
        <Grid 
            templateColumns={{  base: "1fr", 
                                md: "1fr 1fr"}} 
            alignItems={"stretch"}
            my={"16"}
            gap={"1rem"}
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
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
            </GridItem>
            <GridItem colStart={{
                base: 1,
                md: 2
            }}>
                <Textarea
                    placeholder="Description"
                    focusBorderColor="green.500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
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