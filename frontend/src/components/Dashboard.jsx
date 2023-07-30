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
        const json = await response.json()
        if (response.status == 401 || response.status == 403) {
            navigate("/login")
        }
        else if (!response.ok){
          alert("Something went wrong" + JSON.stringify(json))
        }
        try{
          const items = json
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