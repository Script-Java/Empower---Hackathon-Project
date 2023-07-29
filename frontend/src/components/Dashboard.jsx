import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {

    const [items, setItems] = useState([])
    const navigate = useNavigate()
    async function getItems() {
        const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL
        const response = await fetch(backendBaseUrl + "items/filter", {mode: "cors", headers:{
          "Authorization": "Bearer " + localStorage.getItem("token")
        }})
        if (!response.ok) {
            navigate("/login")
        }
        try{
          const items = await response.json()
          setItems(items)
          console.log(items)
        }
        catch (error) {
          alert(error)
        }
    }
    useEffect(() => {
        getItems()
    }, [])

    return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )

}

export default Dashboard;