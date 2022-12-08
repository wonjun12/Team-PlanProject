const { emailSignMail, pwdChangeMail } = require('../mail/mailer');
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
        const { loginBool } = req.session;

        if (loginBool) {
            res.json({ result: true }).end();
        } else {
            res.json({ result: false }).end();
        }
    },
    //회원 이메일 체크 and 이메일 인증 체크
    joinEmailCk: async (req, res) => {
        const { email } = req.body;
        const user = await User.exists({ email });

        if (user === null) {
            res.json({ result: true }).end();
        } else {
            res.json({ result: false }).end();
        }
    },
    //이메일 인증 적용 및 확인
    emailCerti: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await User.findOneAndUpdate({
                email,
                emailCk: false
            }, {
                emailCk: true
            });

            if (user === null) {
                res.json({ result: false }).end();
            } else {
                res.json({ result: true }).end();
            }
        } catch (error) {
            res.json({ result: false }).end();
        }

    },
    //비밀번호 찾기 이메일 보내기
    sendPwd: async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (user === null) {
                res.json({ result: false, error: '이메일을 정확히 입력 후 눌러주세요!!' }).end();
            } else {
                pwdChangeMail(user._id, user.password, email)
                res.json({ result: true }).end();
            }
        } catch (error) {
            res.json({ result: false, error: '이메일을 정확히 입력 후 눌러주세요!!' }).end();
        }
    },
    //이메일 인증 유저 비밀번호 변경
    pwdChange: async (req, res) => {
        const { id, hash, password } = req.body;

        try {
            const user = await User.findById({ _id: id });

            if (user !== null && hash === user.password) {
                await userPasswordChange(id, password);

                res.json({ result: true }).end();
            } else {
                res.json({ result: false }).end();
            }
        } catch (error) {
            res.json({ result: false }).end();
        }
    },
    //유저 비밀번호 변경
    userPwdChange: async (req, res) => {
        const { loginID } = req.session;
        const { hash, password } = req.body;


        try {

            const user = await User.findById({ _id: loginID });
            const bool = await bcrypt.compare(hash, user.password);

            if (bool) {
                await userPasswordChange(user._id, password);

                res.json({ result: true }).end();
            } else {
                res.json({ result: false }).end();
            }
        } catch {
            res.json({ result: false }).end();
        }

    },
    //로그인
    login: async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({
            email
        });

        if (user !== null) {
            const PwdCheck = await bcrypt.compare(password, user.password);
            if (!PwdCheck) {
                res.json({ result: false }).end();
            } else {
                if (user.emailCk) {
                    req.session.loginBool = true;
                    req.session.loginID = user._id;
                    res.json({ result: true }).end();
                } else {
                    res.json({ result: true, error: 'emailCerti', email }).end();
                }
            }
        } else {
            res.json({ result: false, error: '존재하지 않는 이메일 입니다!!' }).end();
        }

    },
    //회원가입
    join: async (req, res) => {
        const { email, name, password } = req.body;
        const timeOut = 1000 * 60 * 60;

        await User.create({
            email,
            name,
            password
        });

        //1시간 후 인증되어 있지 않다면 삭제
        setTimeout(async () => {
            const user = await User.findOne({ email });
            if (!(user.emailCk)) {
                await User.deleteOne({ email: user.email });
            }
        }, timeOut);

        //이메일 전송
        emailSignMail(email);

        res.json({ result: true, error: 'emailCerti', email }).end();
    },
    //로그아웃
    logout: async (req, res) => {
        req.session.destroy();
        res.json({ result: true }).end();
    },
    //계획표 작성
    //출발지 및 숙소 설정
    setPlan: async (req, res) => {
        const { title, start, end } = req.body.SetPlan;
        const { address, time, transportation, memo } = req.body.Start;
        const { Logding } = req.body;

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

        for (let { address, check_in, check_out, price, reservation, memo } of Logding) {
            const logding = await Lodging.create({
                _plan: plan._id,
                addr: address,
                reser: reservation,
                check_in,
                check_out,
                price,
                memo
            })

            plan.lodging.push(logding);
        }

        plan.save();

        res.json({ reulst: true, PID: plan._id }).end();
    },
    //일자 별로 계획 설정
    setDayPlan: async (req, res) => {
        const { id } = req.params;
        // const {loginID} = req.session;
        const { dayPlan, day, point, distance, duration } = req.body;

        const calender = await Calendar.create({
            _id: {
                day,
                plan: id
            },
            point,
            distance,
            duration
        });

        let count = 0;
        for (let { address, location, reservation, price, time, order, memo, lastLocation, lastAddress } of dayPlan) {
            const dayplan = await Details.create({
                _plan: id,
                addr: address,
                location,
                reser: reservation,
                price,
                time,
                memo,
                count: count++,
                order,
                last: {
                    addr: lastAddress,
                    location: lastLocation
                }
            });

            calender.details.push(dayplan);
        }

        calender.save();

        res.json({ result: true }).end();

    },
    //내정보 계획표 목록 보기
    myPlan: async (req, res) => {
        //소진 수정
        const { loginID } = req.session;
        const plans = await Plan.find({
            _user: loginID,
        }).populate(['starting', 'lodging']).sort({ 'created_at': -1 });

        res.json({ result: true, plans }).end();
    },
    //작성한 계획표 일자별 보기
    viewPlanDay: async (req, res) => {
        const { id } = req.params;
        const { day } = req.query;
        const dayPlan = await Calendar.find({
            '_id.day': day,
            '_id.plan': id
        }).populate([{
            path: 'details',
            options: {
                sort: {
                    'count': 1
                }
            }
        }]);

        res.json({ result: true, dayPlan }).end();
    },
    //일자별 계획 수정
    //플랜아이디 필요함
    editDayPlan: async (req, res) => {
        const { id } = req.params;
        const { dayPlan } = req.body;

        await Calendar.updateOne({
            _id: {
                day,
                plan: id
            }
        }, {

        })


        let count = 0, updateDays = [];
        for (let { id, address, location, reservation, price, time, order, memo, lastLocation, lastAddress } of dayPlan) {
            if (!!id) {
                const dayplan = await Details.create({
                    _plan: id,
                    addr: address,
                    location,
                    reser: reservation,
                    price,
                    time,
                    memo,
                    count: count++,
                    order,
                    last: {
                        addr: lastAddress,
                        location: lastLocation
                    }
                });

                //플랜아이디 필요
                await Calendar.updateOne({
                    _id: {
                        day,
                        plan: id
                    }
                }, {
                    $push: {
                        details: dayplan
                    }
                })
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
                    order,
                    last: {
                        addr: lastAddress,
                        location: lastLocation
                    }
                });
                updateDays.push(id);
            }
        }

        const deleteDetails = await Details.deleteMany({
            _id: {
                $nin: updateDays
            }
        })

        await Calendar.updateOne({
            _id: {
                day,
                plan: id
            }
        }, {
            $pullAll: {
                details: deleteDetails
            }
        })
    },
    //타이틀 플랜 수정
    editPlan: async (req, res) => {
        const { title, start, end } = req.body.SetPlan;
        const { id, address, time, transportation, memo } = req.body.Start;
        const { Logding, PlanId } = req.body;

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
            time,
            trans: transportation,
            memo
        });

        //logding 수정
        
        let updateLog = [];
        for (let { id, address, check_in, check_out, price, reservation, memo } of Logding) {
            if (!id) {
                const lodging = await Lodging.create({
                    addr: address,
                    reser: reservation,
                    check_in,
                    check_out,
                    price,
                    memo
                });

                //플랜 아이디 필요
                await Plan.updateOne({
                    _id: PlanId,
                    _user: loginID
                }, {
                    $push: {
                        lodging
                    }
                })

            } else {
                await Lodging.updateOne({
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

        const deleteLodging = await Lodging.deleteMany({
            _id: {
                $nin: updateLog
            }
        })

        await Plan.updateOne({
            _id: PlanId,
            _user: loginID
        }, {
            $pullAll: {
                lodging: deleteLodging
            }
        })


        res.json({ result: true, plan }).end();

    },
    //출발지 설정
    editStartting: async (req, res) => {
        const { id, address, time, transportation, memo } = req.body;

        await Starting.updateOne({
            _id: id
        }, {
            addr: address,
            time,
            trans: transportation,
            memo
        });

        res.json({ result: true }).end();
    },
    //숙소 설정
    //플랜 아이디 필요
    editLodging: async (req, res) => {
        const { loginID } = req.session;
        const { Logding } = req.body;


        let updateLog = [];

        for (let { id, address, check_in, check_out, price, reservation, memo } of Logding) {
            if (!!id) {
                const lodging = await Lodging.create({
                    addr: address,
                    reser: reservation,
                    check_in,
                    check_out,
                    price,
                    memo
                });

                //플랜 아이디 필요
                await Plan.updateOne({
                    _id: 'planid',
                    _user: loginID
                }, {
                    $push: {
                        lodging
                    }
                })

            } else {
                await Lodging.updateOne({
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

        const deleteLodging = await Lodging.deleteMany({
            _id: {
                $nin: updateLog
            }
        })

        await Plan.updateOne({
            _id: 'planid',
            _user: loginID
        }, {
            $pullAll: {
                lodging: deleteLodging
            }
        })


        res.json({ result: true }).end();


    },
    //플랜 삭제
    //플랜 아이디 필요
    deletePlan: async (req, res) => {
        const { loginID } = req.session;
        //플랜 아이디를 준다고 가장한다.
        //ex -> planID

        await Plan.deleteOne({
            _id: planID,
            _user: loginID
        });

        await Starting.deleteOne({
            _plan: planID
        })

        await Lodging.deleteMany({
            _plan: planID
        })

        await Calendar.deleteMany({
            _id: {
                plan: planID
            }
        })

        await Details.deleteMany({
            _plan: planID

        })

        res.json({ result: true }).end();


    },
    //유저 삭제
    deleteUser: async (req, res) => {
        const { loginID } = req.session;

        const plans = await Plan.deleteMany({
            _user: loginID
        })

        await plans.forEach(async ({ _id }) => {
            await Starting.deleteOne({
                _plan: _id
            })

            await Lodging.deleteMany({
                _plan: _id
            })

            await Calendar.deleteMany({
                _id: {
                    plan: _id
                }
            })

            await Details.deleteMany({
                _plan: _id

            })
        });

        await User.deleteOne({
            _id: loginID
        })

        res.json({ result: true }).end();

    },
    //계획한 계획표 전체적으로 보기
    //플랜 아이디 필요 (planID)
    overallPlan: async (req, res) => {
        const { loginID } = req.session;

        const plan = await Plan.findOne({
            _id: planID,
            _user: loginID
        }).populate(['starting', {
            path: 'lodging',
            options: {
                sort: {
                    'check_in': 1
                }
            }
        }]);

        const days = await Calendar.find({
            _id: {
                plan: plan._id
            }
        }).populate({
            path: 'details',
            options: {
                sort: {
                    'count': 1
                }
            }
        })
        res.json({ result: true, plan, days }).end();

    },


}