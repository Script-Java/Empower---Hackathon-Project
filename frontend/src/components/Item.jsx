import { useState, useEffect } from "react"
import {
  Image,
  Box,
  GridItem,
  Text,
  Flex,
  Button,
  Link
} from "@chakra-ui/react"
import {formatAddress} from "localized-address-format"
import { useNavigate } from "react-router-dom"
export const Item = ({item}) => {
  const [image, setImage] = useState(null)
  const [street, setStreet] = useState(null)
  const nav = useNavigate()

  function getCoordinates(){
    return item.coordinates.replace("(", "").replace(")", "").replace(" ", "").split(",")
  }
  
  var getPosition = function (options) {
    return new Promise(function (resolve, reject) {
      const options = {
        enableHighAccuracy: true, 
        timeout: 10000, 
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  async function handleClaim(e){
    const pos = await getPosition()
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const data = {
      "user_coords": `(${pos.coords.latitude}, ${pos.coords.longitude})`
    }
    
    const response = await fetch(backendBaseUrl + "items/claim/" + item.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      alert("Claimed item successfully")
      window.location.reload(false)
    }
    else if (response.status === 401) {
      alert("You are not logged in")
      nav("/login")
    }
    else if (response.status === 400) {
      alert("You are not close enough to the item")
    }
  }
  
  async function getImage() {
    const blob = await (await fetch(item.img)).blob(); 
    setImage(URL.createObjectURL(blob))
    console.log(URL.createObjectURL(blob))
    const coords = getCoordinates()
    console.log(coords)
    const response = await fetch(`https://geocode.maps.co/reverse?lat=${coords[0]}&lon=${coords[1]}`)
    const data = await response.json()
    // const adressData = data["address"]
    // const adress = {
    //   "postalCountry": adressData["country_code"].toUpperCase(),
    //   "administrativeArea": adressData["county"],
    //   "locality": adressData["town"],
    //   "postalCode": adressData["postcode"],
    //   "adressLines": [adressData["road"] + " " + adressData["house_number"]]
    // }
    // console.log(adress)
    // console.log(formatAddress(adress, "latin"))
    setStreet(data["display_name"])
  }
  useEffect(() => {getImage()}, [])

  

  return (
    
    <Flex 
      justifyContent={"end"}
      align={"start"}
      flexDir={"column"}
      style={{
        "backgroundImage": `linear-gradient(0deg, #F0CEA0 0%, rgba(9,9,121,0) 50%, rgba(0,0,0,0) 100%), url(${image})`
      }}
      borderRadius={"20px"}
      bgSize={"cover"}
      w={"100%"}
      maxH={"400px"}
      height={"100%"}
      padding={"1rem"}
      bgPos={"center"}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"auto"}
        w={"100%"}
      >
        <Link href={`http://www.google.com/maps/place/${getCoordinates()[0]},${getCoordinates()[1]}`} isExternal >
          <Button  colorScheme="green">
            
              Google Maps
          </Button>
        </Link>
        <Button onClick={handleClaim} colorScheme="green">
          Claim
        </Button>
      </Flex>
      <Text
        fontWeight="bold"
        fontSize="2xl"
        color={"#77bd9f"}
        // padding={"1rem"}
        textAlign={"center"}
      >
        {item.title}
      </Text>
      <Text
        // fontWeight="bold"
        fontSize="1xl"
        color={"green"}
        // padding={"1rem"}
        textAlign={"center"}
      >
        {item.description}
      </Text>
      <Text
      fontSize={"x-small"}>
        {street}
      </Text>
    </Flex>
  )
}