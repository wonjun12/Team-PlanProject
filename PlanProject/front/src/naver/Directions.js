import axios from "axios";
import { Map } from './NaverApi';

const setCenter = (start, end) => {
    
    const xPoint = (Math.abs(start.x - end.x)) / 2;
    const yPoint = (Math.abs(start.y - end.y)) / 2;

    const point = {
        x : (start.x > end.x)? end.x + xPoint : start.x + xPoint,
        y : (start.y > end.y)? end.y + yPoint : start.y + yPoint
    }

    return point;
}

const setZoom = (distance) => {
    let zoom;

    if(distance > 500000){
        zoom = 6;
    }else if(distance > 250000) {
        zoom = 7;
    }else if(distance > 100000){
        zoom = 8;
    }else if(distance > 70000) {
        zoom = 9;
    }else if(distance > 30000){
        zoom = 10;
    }else if(distance > 14000){
        zoom = 11;
    }else if(distance > 11000){
        zoom = 12;
    }else if(distance > 5000){
        zoom = 13;
    }else {
        zoom = 14;
    }

    return zoom;
}


const Directions = async (addr) => {

    const location = addr;

    const headers = {
            'X-NCP-APIGW-API-KEY-ID' : 'nubervggvr',
            'X-NCP-APIGW-API-KEY' : '2K1v9doyDIQSwrgdKq7TnCTR9RjOQmrqQUMZlZPO'
    }

    const start = `${location[0].x}, ${location[0].y}`;
    const goal = `${location[location.length - 1].x}, ${location[location.length - 1].y}`

    let waypoints = ``;

    for(let i = 1; i < (location.length - 1) ; i++){
        if(i > 1){
            waypoints +=  ` | ` ;
        }
        waypoints += `${location[i].x},${location[i].y}`;
    }

    const params = {
            start,
            goal,
            waypoints,
            option: 'trafast'
    }

    const url = ((location.length - 2) <= 5)? '/map-direction' : '/map-direction-15'

    const res = await axios.get(`${url}/v1/driving`, {
        params,
        headers
    });

    const point = setCenter(location[0], location[location.length - 1]);
    const zoom = setZoom(res.data.route.trafast[0].summary.distance);

    Map.map.setCenter(point);
    Map.map.setZoom(zoom);
  

    const data = {
        code : res.data.code,
        message : res.data.message,
        path : res.data.route.trafast[0].path,
        distance : res.data.route.trafast[0].summary.distance,
        duration : res.data.route.trafast[0].summary.duration
    }

    return data;
    
}

export default Directions;