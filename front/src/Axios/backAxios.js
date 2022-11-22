import axios from "axios";
axios.defaults.withCredentials = true;

const hrefChange = (href, time) => {
    if(href !== undefined){
        if(time !== undefined){
            setTimeout(() => {
                window.location.href = href;
            }, time)
        }else{
            window.location.href = href;
        }
    }
}


export const axiosPost = async (url, body, href, time) => {
        const {data} = await axios.post(`/back${url}`, body);
        const {result, error, email} = data;

        if(result){
            if(error === 'emailCerti'){
                href = `/${error}?email=${email}&CheckPoint=false`;
            }else if(url === '/home/login'){
                window.sessionStorage.setItem('loginCk', result);
            }
            hrefChange(href, time);
            return {result};
        }else {
            return {result, error};
        }
};


export const axiosGet = async (url, params) => {
    try {
        const res = await axios.get(`/back${url}`, params);

    } catch {
        
    }
};