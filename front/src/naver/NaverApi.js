import { useEffect, useRef } from "react";
import { toPng } from 'html-to-image';


const { naver } = window;
export const Map = {
    map: null,
    makers: [],
    points: [],
    result: false,
};

export const SetMap = () => {

    const mapElement = useRef(null);

    const createMap = () => {
        const mapOptions = {
            center: new naver.maps.LatLng(36.234185, 127.8913631),
            // minZoom:7,
            // maxZoom:15,
            zoom: 7,
            // zoomControl: true, //줌 컨트롤의 표시 여부
            // scrollWheel: false, //스크롤 사용 여부
        };

        Map.map = new naver.maps.Map(mapElement.current, mapOptions);
    };

    useEffect(() => {
        createMap();
    }, [])


    const style = {
        width: '100%',
        height: '100%'
    }

    return (
        <div style={style} ref={mapElement}>
        </div>
    );
};

export const SearchMap = async (addr, isSearch, num) => {

    if (!!Map.makers[num]) {
        Map.makers[num].setMap(null);
    }

    if (addr !== '' && addr !== undefined) {
        await naver.maps.Service.geocode({
            query: addr
        }, (stat, res) => {

            if (stat !== naver.maps.Service.Status.ERROR && res.v2.meta.totalCount !== 0) {
                Map.result = true;
                const item = res.v2.addresses[0];
                const point = new naver.maps.Point(item.x, item.y);

                const marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(point),
                    map: Map.map
                });
                if (!!Map.makers[num]) {
                    Map.makers[num] = marker;
                    Map.points[num] = point;
                } else {
                    Map.makers.push(marker);
                    Map.points.push(point);
                }

                if (isSearch) {
                    Map.map.setZoom(13);
                    Map.map.setCenter(point);
                }

                return true;
            } else {
                Map.result = false;
            }
        });
    }
    return Map.result;
};

export const CreateLineMap = (searchLine) => {
    const polyLine = new naver.maps.Polyline({
        map: Map.map,
        path: searchLine,
        strokeColor: '#5347AA',
        strokeOpacity: 1,
        strokeWeight: 5
    });
};

export const MapCapture = async (DivRef) => {
    const naverDiv = DivRef.current;

    const pngData = await toPng(naverDiv);

    return pngData;
};