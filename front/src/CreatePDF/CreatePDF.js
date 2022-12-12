import { forwardRef, useEffect, useRef, useState } from "react";
import {toPng} from 'html-to-image';
// import jsPDF from 'jspdf';
import  SetMap from "../naver/ViewPlanNaver";
import styled from './CreatePDF.module.scss';

const CreateDiv = forwardRef(({Plan, DayPlan}, ref) => {

    const mapRef = useRef([]);

    const getDate = (day) => {
        const weeks = ['일', '월', '화', '수', '목', '금', '토']
        const days = new Date(day);
        return `${days.getFullYear()}-${days.getMonth() + 1}-${days.getDate()} (${weeks[days.getDay()]})`
    }

    const getTimes = (day) => {
        const days = new Date(day);
        
        return `${days.getHours()} 시 ${days.getMinutes()} 분`;
    }

    const daysDetail = (days, idx) => {
        let startDate = new Date(days);

        startDate.setDate(startDate.getDate() + idx);

        return getDate(startDate);
         
    }

    const CreateMaps = (count) => {
        SetMap(mapRef.current, count)
    }
    
    
    return (
        <div ref={ref} className={styled.pdfMain}>
            <div className={styled.titleMain}>
                <p> {Plan.title} </p>
                <p> {getDate(Plan.start)} ~ {getDate(Plan.end)}</p>
                <p></p>
            </div>
            <div className={styled.loadingMain}>
                {
                    Plan.lodging?.map(({addr, check_in, check_out, reser, price, memo}, idx) => {
                        
                        return (
                            <div key={idx} className={styled.loadingDiv}>
                                <div ref={
                                        (element) => 
                                            mapRef.current[idx] = element
                                        
                                    }>
                                        
                                    <SetMap addr={addr} isSearch={true} ref={mapRef.current} count={idx}/>
                                </div>
                                <div className={styled.loadingContent}>
                                    <p>숙소 정보</p>
                                    <p>주소 : {addr}</p>
                                    <p>체크인 : {getDate(check_in)}</p>
                                    <p>체크아웃 : {getDate(check_out)}</p>
                                    <p>예약 유무 : {(reser)? 'YES' : 'NO'}</p>
                                    <p>가격 : {(!!price)? price : '확인불가'}</p>
                                    <p>메모 : {(!!memo)? memo : '없음'}</p>  
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className={styled.lastDetiles}>
                <p className={styled.detailsTitle}>일정표</p>
                {
                    DayPlan.map(({details, distance, duration, point}, idx) => {
                        return (
                            <div key={idx} className={styled.daysMain}>
                                <div className={styled.daysTitle}>
                                    {daysDetail(Plan.start, idx)}
                                </div>
                                <div className={styled.daysMap} ref={
                                        (element) => {
                                            mapRef.current[(idx + Plan.lodging.length)] = element
                                        }
                                    }>
                                        
                                        {/* {SetMap(idx, true, '', mapRef.current, point)} */}
                                    <SetMap ref={mapRef.current} path={point} isSearch={false} count={(idx + Plan.lodging.length)}/>

                                    <div className={styled.distanceDiv}>
                                        <span>이동 거리 : {Math.round(distance / 1000)}km</span>
                                        {(((duration / 60000) / 60) >= 1) ? (
                                            <span>이동 시간 : {Math.floor((duration / 60000) / 60)}시간 {Math.ceil((duration / 60000) % 60)}분</span>
                                        ) : (
                                            <span>이동 시간 : {Math.floor((duration / 60000))}분</span>
                                        )}
                                    </div>
                                </div>
                                <div className={styled.daysDiv}>
                                    {
                                        details.map(({addr, location, price, reser, time, memo, last}, idx) => {

                                            return (
                                                <div className={styled.detailsDiv} key={idx}>
                                                    {
                                                    (!!last.addr)? 
                                                    <>
                                                        <p className={styled.detailsCount}> 마지막 도착지 </p>
                                                        <div className={styled.information}>
                                                            <div>
                                                                <p> 이름 : </p>
                                                                <p> {last.location} </p>
                                                            </div>
                                                            <div>
                                                                <p> 주소 : </p>
                                                                <p> {last.addr} </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                    <p className={styled.detailsCount}> {idx + 1} 번째 일정 </p>
                                                    <div className={styled.information}>
                                                        <div>
                                                            <p> 이름 : </p>
                                                            <p> {location} </p>
                                                        </div>
                                                        <div>
                                                            <p> 주소 : </p>
                                                            <p> {addr} </p>
                                                        </div>
                                                        <div>
                                                            <p> 가격 : </p>
                                                            <p> {price} 원 </p>
                                                        </div>
                                                        <div>
                                                            <p> 예약 : </p>
                                                            <p> {(reser)? 'YES' : 'NO'} </p>
                                                        </div>
                                                        <div>
                                                            <p> {(location === '출발지')? '출발시간' : '활동'} : </p>
                                                            <p> {(location === '출발지')? getTimes(Plan.starting.time) : `${time} 분`}  </p>
                                                        </div>
                                                        <div>
                                                            <p> 메모 : </p>
                                                            <p> {(memo)? memo : '없음'} </p>
                                                        </div>
                                                    </div>
                                                    </>
                                                    }
                                                </div>
                                            );
                                            
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
})

const ViewPlans = () => {
 

    const DivCapture = async (DivRef) => {
        
        const naverDiv = DivRef.current;

        const pngData = await toPng(naverDiv);

        return pngData;
    };

    const toPdf = (img, title) => {
        const doc = "";//new jsPDF('p', 'mm', 'a4');

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        const imgSize = doc.getImageProperties(img);

        const imgHeight = imgSize.height;
        const size = 900;

        const maxHeight = Math.ceil((imgHeight / size))

        let count = 1, moveHeight = imgHeight;

        doc.addImage(img, 'JPEG', 0, 0, pageWidth, size);
        moveHeight -= pageHeight;

        while(count < maxHeight + 1){
            const position = moveHeight - imgHeight
            doc.addPage();
            doc.addImage(img, 'JPEG', 0, position, pageWidth, size);
            moveHeight -= pageHeight;
            count++;
        }

        doc.save(`${title}.pdf`);

        window.open(doc.output('bloburi'));

        const pdf = new File([doc.output('blob')], `${title}.pdf`, {
            type: 'application/pdf'
        })
    }

    
    return {
        douwnloadPDF : async (DivRef, title) => {
            // await getPlans(DivRef)
            const pdfPhoto = await DivCapture(DivRef);

            toPdf(pdfPhoto, title);

        },
        MainDiv : (DivRef, Plan, dayPlan) => {
            return <CreateDiv Plan={Plan} DayPlan={dayPlan}  ref={DivRef}/>
        }
    }
    
    
}

export default ViewPlans;