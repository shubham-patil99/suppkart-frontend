import axios from "axios";

// export const BASE_URL = "https://supkart.csbuzz.com"
export const BASE_URL = "https://api.suppkart.com"

const callApi = (url, method, payload ,token) => {
    return new Promise(async (resolve, reject) => {
        let config = payload ? {
            method: method,
            url: url,
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            },
            data: payload
        }:{
            method: method,
            url: BASE_URL+url,
            headers: {
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            },  
        }
        try {
            const response = await axios(config)
            // console.log(response);
            if (response.status == 200) {
                resolve(response.data)
            }
            else{
                reject(response)
            }
        }
        catch (error) {
            reject(error)
        }
    })
}
export { callApi }