import axios from "axios";
axios.defaults.withCredentials = true;


const axiosGet = async (url, params, headers) => {
    try {
        const res = await axios.get(`/back${url}`, {
            params,
            headers
        });

        return res.data;
    } catch {
        
    }
};

export default axiosGet;