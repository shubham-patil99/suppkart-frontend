import axios from "axios"

export const NewServiceCall = async (config) => {
    try {
        const response = await axios.request(config)
        .then((response)=>{
            return response.data
        })
        .catch((error)=>{
            // console.log(error)
            return error
        })
        return response; // You may want to return some data to the caller
    } catch (error) {
        console.error("error>>", error);
        throw error; // Rethrow the error to allow the calling code to handle it
    } finally {
        // always executed
    }
}