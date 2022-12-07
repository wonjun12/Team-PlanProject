import axios from "axios";
import {useNavigate} from 'react-router-dom'
axios.defaults.withCredentials = true;


const HrefChange = (href, time) => {

    const navigate = useNavigate();

    if(href !== undefined){
        if(time !== undefined){
            setTimeout(() => {
                navigate(href);
            }, time)
        }else{
            navigate(href);
        }
    }
}


const axiosPost = async (url, body, href, time) => {

        
    
        const {data} = await axios.post(`/back${url}`, body);
        const {result, error, email} = data;

        if(result){
            if(error === 'emailCerti'){
                href = `/${error}?email=${email}&CheckPoint=false`;
            }else if(url === '/home/login'){
                window.sessionStorage.setItem('loginCk', result);
            }
            await HrefChange(href, time);
            return {result};
        }else {
            return {result, error};
        }
};

export default axiosPost;
