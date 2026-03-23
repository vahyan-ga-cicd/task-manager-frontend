import axios from "axios"

export const getalldata=async()=>{
    try {
        const res=await axios.get("/api/decentralized")
        return res.data;
    } catch (error) {
        console.log(error)
    }
}