import axios from "axios";
import { useEffect, useState } from "react";

const Friends=()=>{
    const [friends,setFriends] = useState([]);
    const email = localStorage.getItem("email")

    useEffect(()=>{
        const fetchFriends = async()=>{
            try{
                const response=await axios.get("http://localhost:5000/api/friends/getall");
                setFriends(response.data);
            } catch(error){
                console.log("error",error);            
            }
            fetchFriends();
        }

    },[])
    return(
        <div>
            <h1>List firends</h1>
            <p>{friends}</p>
        </div>
    )

}

export default Friends;