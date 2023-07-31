import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Item} from "./Item"
import { Grid, GridItem } from '@chakra-ui/react';
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
        }) : <p>Loading...</p>}
      </Grid>
    </>
  )

}

export default Dashboard;