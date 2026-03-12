import axios from "axios";

export const testApi = async () => {
    const token = localStorage.getItem("token");
    console.log("get user",token)
    const res = await axios.get(`/api/test`,{
        headers: {
            Authorization: `Bearer ${token}`,   
        },
    });

    return res.data;
}