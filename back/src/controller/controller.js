const {emailSignMail, pwdChangeMail} = require('../mail/mailer');
const bcrypt = require('bcrypt');
const User = require('../db/user');
const Plan = require('../db/plan');
const Calendar = require('../db/calendar');
const Details = require('../db/details');
const Starting = require('../db/starting');
const Lodging = require('../db/lodging');

//유저 패스워드 변경 함수
const userPasswordChange = async (_id, password) => {
    await User.updateOne({
        _id
    }, {
        password
    });
}


module.exports = {
    //로그인 체크
    loginCk: async (req, res) => {
        const {loginBool} = req.session;

        if(loginBool){
            res.json({result: true}).end();
        }else{
            res.json({result: false}).end();
        }
    },
    //회원 이메일 체크 and 이메일 인증 체크
    joinEmailCk: async (req, res) => {
        const {email} = req.body;
        const user = await User.exists({email});

        if(user === null){
            res.json({result: true}).end();
        }else{
            res.json({result: false}).end();
        }
    },
    //이메일 인증 적용 및 확인
    emailCerti: async (req, res) => {
        try {
            const {email} = req.body;

            const user = await User.findOneAndUpdate({
                email, 
                emailCk:false
            },{
                emailCk: true
            });

            if(user === null){
                res.json({result:false}).end();
            }else {
                res.json({result: true}).end();
            }
        } catch (error) {
            res.json({result:false}).end();
        }
    },
    //비밀번호 찾기 이메일 보내기
    sendPwd: async (req, res) => {
        const {email} = req.body;

        try {
            const user = await User.findOne({email});

            if(user === null){
                res.json({result:false, error: '이메일을 정확히 입력 후 눌러주세요!!'}).end();
            }else {
                pwdChangeMail(user._id, user.password, email)
                res.json({result:true}).end();
            }
        } catch (error) {
            res.json({result:false, error: '이메일을 정확히 입력 후 눌러주세요!!'}).end();
        }
    },
    //이메일 인증 유저 비밀번호 변경
    pwdChange: async (req, res) => {
        const {id, hash, password} = req.body;
        
        try {
            const user = await User.findById({_id:id});

            if(user !== null && hash === user.password){
                await userPasswordChange(id, password);

                res.json({result:true}).end();
            }else{
                res.json({result:false}).end();
            }
        } catch (error) {
            res.json({result:false}).end();
        }
    },
    //유저 비밀번호 변경
    userPwdChange: async (req, res) => {
        const {loginID} = req.session;
        const {hash, password} = req.body;

        try {

            const user = await User.findById({_id: loginID});
            const bool = await bcrypt.compare(hash, user.password);

            if(bool){
                await userPasswordChange(user._id, password);

                res.json({result:true}).end();
            }else{
                res.json({result:false}).end();
            }
        } catch {
            res.json({result:false}).end();
        }

    },
    //로그인
    login: async (req, res) => {
        const {email, password} = req.body;

        const user = await User.findOne({
            email
        });

        if(user !== null){
            const PwdCheck = await bcrypt.compare(password, user.password);
            if(!PwdCheck){
                res.json({result: false}).end();
            }else {
                if(user.emailCk){
                    req.session.loginBool = true;
                    req.session.loginID = user._id;
                    res.json({result: true}).end();
                }else{
                    res.json({result: true, error:'emailCerti', email}).end();
                }
            }
        }else {
            res.json({result: false, error: '존재하지 않는 이메일 입니다!!'}).end();
        }

    },
    //회원가입
    join: async (req, res) => {
        const {email, name, password} = req.body;
        const timeOut = 1000 * 60 * 60;

        await User.create({
            email,
            name,
            password
        });
        
        //1시간 후 인증되어 있지 않다면 삭제
        setTimeout(async () => {
            try{
                const user = await User.findOne({email});
                if(!(user.emailCk)){
                    await User.deleteOne({email:user.email});
                }
            }catch{

            }
            
        }, timeOut);
        
        //이메일 전송
        emailSignMail(email);

        res.json({result: true, error:'emailCerti', email}).end();
    },
    //로그아웃
    logout: async (req, res) => {
        req.session.destroy();
        res.json({result: true}).end();
    },
    //계획표 작성
    //출발지 및 숙소 설정
    setPlan: async (req, res) => {
        const { title, start, end } = req.body.SetPlan;
        const { address, time, transportation, memo } = req.body.Start;
        const { lodging } = req.body;

        const { loginID } = req.session;


        const plan = await Plan.create({
            _user: loginID,
            title,
            start,
            end
        });


        const startting = await Starting.create({
            _plan: plan._id,
            addr: address,
            time: new Date(`${start} ${time}:00`),
            trans: transportation,
            memo
        });

        plan.starting = startting;

        for (let { address, check_in, check_out, price, reservation, memo } of lodging) {
            const lodging = await Lodging.create({
                _plan: plan._id,
                addr: address,
                reser: reservation,
                check_in,
                check_out,
                price,
                memo
            })

            plan.lodging.push(lodging);
        }

        plan.save();

        res.json({
            reulst: true,
            plan,
        }).end();
    },
    //일자 별로 계획 설정
    setDayPlan: async (req, res) => {
        const {id} = req.params;
        // const {loginID} = req.session;
        const {dayPlan, day, point, distance, duration} = req.body;

        const calender = await Calendar.create({
            _id : {
                day,
                plan: id
            },
            point,
            distance,
            duration
        });

        let count = 0;
        for(let {address, location, reservation, price, time, memo, lastLocation, lastAddress} of dayPlan){
            const dayplan = await Details.create({
                _plan: id,
                day,
                addr: address,
                location,
                reser: reservation,
                price,
                time,
                memo,
                count: count++,
                last : {
                    addr : lastAddress,
                    location : lastLocation
                }
            });
            calender.details.push(dayplan);
        }

        calender.save();

        res.json({result: true}).end();

    },
    //내정보 계획표 목록 보기
    myPlan: async (req, res) => {
        const {loginID} = req.session;

        const plans = await Plan.find({
            _user: loginID
        }).sort({'created_at' : -1});
        
        res.json({result : true, plans}).end();
    },
    //작성한 계획표 일자별 보기
    viewPlanDay: async (req, res) => {
        const {id} = req.params;
        const {day} = req.query;

        const dayPlan = await Calendar.find({
            '_id.day' : day,
            '_id.plan' : id
        }).populate({
            path: 'details',
            options: {
                sort : {
                    'count' : 1
                }
            }
        });

        res.json({result: true, dayPlan}).end();
    },
    //일자별 계획 수정
    editDayPlan: async (req, res) => {
        const { id } = req.params;
        const planId = id;
        const { dayPlan, day, point, distance, duration } = req.body;

        await Calendar.updateOne({
            '_id.day' : day,
            '_id.plan' : planId
        }, {
            point,
            distance,
            duration
        })

        let count = 0, updateDays = [], createDays = [];
        for (let { id, address, location, reservation, price, time, memo, lastLocation, lastAddress } of dayPlan) {
            if (!id) {
                const dayPlans = await Details.create({
                    _plan: planId,
                    day, 
                    addr: address,
                    location,
                    reser: reservation,
                    price,
                    time,
                    memo,
                    count: count++,
                    last: {
                        addr: lastAddress,
                        location: lastLocation
                    }
                });
                createDays.push(dayPlans._id);
            } else {
                await Details.updateOne({
                    _id: id
                }, {
                    addr: address,
                    location,
                    reser: reservation,
                    price,
                    time,
                    memo,
                    count: count++,
                    last: {
                        addr: lastAddress,
                        location: lastLocation
                    }
                });
                updateDays.push(id);
            }
        }
        const daysArray = updateDays.concat(createDays);

        await Details.deleteMany({
            day, 
            _id: {
                $nin: daysArray
            },
        });

        await Calendar.updateOne({
            '_id.day' : day,
            '_id.plan' : planId
        }, {
            $pull: {
                details: {
                    $nin : daysArray
                }
            }
        })

        await Calendar.updateOne({
            '_id.day' : day,
            '_id.plan' : planId
        }, {
            $push: {
                details: {
                    $each : createDays
                }
            }
        }) 
        res.json({result: true}).end();
    },
    //타이틀 플랜 수정
    editPlan: async (req, res) => {
        const { title, start, end } = req.body.SetPlan;
        const { id, address, time, transportation, memo } = req.body.Start;
        const { lodging, PlanId } = req.body;

        const { loginID } = req.session;

        //base 수정
        await Plan.updateOne({
            _user: loginID,
            _id: PlanId,
        }, {
            title,
            start,
            end
        });

        //start 수정
        await Starting.updateOne({
            _id: id,
        }, {
            addr: address,
            time: new Date(`${start} ${time}:00`),
            trans: transportation,
            memo
        });

        //lodging 수정
        let updateLog = [], createLog = [];
        for (let { id, address, check_in, check_out, price, reservation, memo } of lodging) {

            if (!id) {
                const lodgings = await Lodging.create({
                    addr: address,
                    reser: reservation,
                    check_in,
                    check_out,
                    price,
                    memo
                });

                createLog.push(lodgings._id);

            } else {
                const lodgingUp = await Lodging.updateOne({
                    _id: id
                }, {
                    addr: address,
                    reser: reservation,
                    check_in,
                    check_out,
                    price,
                    memo
                })

                updateLog.push(id);
            }
        }

        const lodgings = updateLog.concat(createLog);

        const deleteLodging = await Lodging.deleteMany({
            _id: {
                $nin: lodgings,
            },
        })

        await Plan.updateOne({
            _id: PlanId,
            _user: loginID
        }, {
            $pull: {
                lodging: {
                    $nin: lodgings
                }
            },
        })

        await Plan.updateOne({
            _id: PlanId,
            _user: loginID
        }, {
            $push: {
                lodging: {
                    $each: createLog,
                }
            }
        });

        const plan = await Plan.findOne({
            _user: loginID,
            _id: PlanId,
        }).populate(['starting', 'lodging']);

        res.json({ result: true, plan }).end();

    },
    //플랜 삭제
    deletePlan : async (req, res) => {
        const {loginID} = req.session;
        const {PlanId} = req.body;
        
        await Plan.deleteOne({
            _id: PlanId,
            _user: loginID
        });

        await Starting.deleteOne({
            _plan : PlanId
        })

        await Lodging.deleteMany({
            _plan : PlanId
        })

        await Calendar.deleteMany({
            '_id.plan': PlanId
        })
        
        await Details.deleteMany({
            _plan : PlanId
        })

        res.json({result: true}).end();
    },
    //유저 삭제
    deleteUser : async (req, res) => {
        const {loginID} = req.session;

        const plans = await Plan.find({
            _user : loginID
        })

        for(let {_id} of plans){
            await Starting.deleteOne({
                _plan : _id
            })
    
            await Lodging.deleteMany({
                _plan : _id
            })
    
            await Calendar.deleteMany({
                '_id.plan' : _id
            })
            
            await Details.deleteMany({
                _plan : _id
            })
        }

        await Plan.deleteMany({
            _user : loginID
        })

        await User.deleteOne({
            _id: loginID
        })

        req.session.destroy();

        res.json({result: true}).end();

    },
    //계획한 계획표 전체적으로 보기
    //플랜 아이디 필요 (planID)
    overallPlan : async (req, res) => {

        const {loginID} = req.session;
        const {id} = req.params;

        const plan = await Plan.findOne({
            _id: id,
            _user: loginID
        }).populate(['starting', {
            path: 'lodging',
            options: {
                sort : {
                    'check_in' : 1
                }
            }
        }]);

        const days = await Calendar.find({
            '_id.plan' : id
        }).populate({
            path: 'details',
            options: {
                sort : {
                    'count' : 1
                }
            }
        })
        res.json({result: true, plan, days}).end();    

    },

    
}