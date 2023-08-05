import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Item} from "./Item"
import { Button, Flex, Grid, Heading, Text, Link } from '@chakra-ui/react';
import font from "../styles/font.css";
const Dashboard = () => {

    const [items, setItems] = useState([{title:""}])
    const [loaded, setLoaded] = useState(false)
    const navigate = useNavigate()
    async function getItems() {
        const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL
        const response = await fetch(backendBaseUrl + "items/filter?" + new URLSearchParams({
            "with_images": true
        }), { headers:{
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
      })
        const json = await response.json()
        
        if (response.status == 401 || response.status == 403) {
            navigate("/login")
        }
        else if (!response.ok){
          alert("Something went wrong" + JSON.stringify(json))
        }
        // try{
        const itemsRetrived = json["items"]
        setItems(itemsRetrived)
        setLoaded(true)
        console.log(itemsRetrived)
    }
    useEffect(() => {
        getItems()
    }, [])

    if(loaded && items.length == 0){
      return <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"} w={"100vw"} flexDir={"column"} gap={"10vh"}>
        <Heading size="4xl" color="green.400" fontFamily={font}>
          No Items Found
        </Heading>
        <Link href="/create">
          <Button marginTop={"1rem"} colorScheme={"green"} h={"10rem"} fontSize={"5rem"} borderRadius={"1rem"}>
            Add Some
          </Button>
        </Link>
      </Flex>
    }
    return (
    <>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', 
            lg: 'repeat(3, 1fr)', 
            "2xl": 'repeat(4, 1fr)', }} 
            gap={6}
            gridAutoFlow="dense" 
             
            width={"90vw"}
            height={"90vh"}
            marginX={"5vw"}
            marginY={"5vh"}
      > 
        {loaded ? items.map((item) => {
          
          return (
              <Item item={item} key={item.id}/>
          )
        }) : <Flex justifyContent={"center"} alignItems={"center"} height={"90vh"} w={"90vw"} flexDir={"column"}>
        <Heading size="4xl" color="green.400" fontFamily={font}>
          Loading ...
        </Heading>
      </Flex>}
      </Grid>
    </>
  )

}

export default Dashboard;