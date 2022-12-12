import axios from "axios";
axios.defaults.withCredentials = true;


const HrefChange = (href, time) => {

    if(href !== undefined){
        if(time !== undefined){
            setTimeout(() => {
                window.location.href = href
            }, time)
        }else{
            window.location.href = href
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
            }else if(url === '/user/deleteUser'){
                window.sessionStorage.setItem('loginCk', !result);
            }
            HrefChange(href, time);
            return {result};
        }else {
            return {result, error};
        }
};

export default axiosPost;
