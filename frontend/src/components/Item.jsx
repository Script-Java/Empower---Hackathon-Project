import { useState, useEffect } from "react"
import {
  Image,
  Box,
  GridItem,
  Text,
  Flex
} from "@chakra-ui/react"
import {formatAddress} from "localized-address-format"
export const Item = ({item}) => {
  const [image, setImage] = useState(null)
  const [street, setStreet] = useState(null)
  async function getImage() {
    const blob = await (await fetch(item.img)).blob(); 
    setImage(URL.createObjectURL(blob))
    console.log(URL.createObjectURL(blob))
    const coords = item.coordinates.replace("(", "").replace(")", "").replace(" ", "").split(",")
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