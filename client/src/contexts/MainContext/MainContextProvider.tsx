import { useEffect, useState, type ReactNode } from "react";
import { MainContext, } from "./MainContext";
import { Payment, Profile, Schedule, Student } from "../../models";
import apiRequest from "../../tools/apiRequest";
import type { ScheduleType } from "../../types/schedule";
import type { StudentInterface } from "../../types/student";
import type { FeeType } from "../../types/fee";
import Fee from "../../models/fee";
import type { PaymentType } from "../../types/payment";

interface Props {
    children: ReactNode;
}

export const MainContextProvider = ({ children }: Props) => {
    const [profile, setProfile] = useState(new Profile())
    const [students, setStudents] = useState<{ [key: string]: Student }>({});
    const [schedules, setSchedules] = useState<{ [key: string]: Schedule }>({})
    const [loading, setLoading] = useState(false);

    // Function to add or update a student
    const addStudent = (stu: Student) => {
        if (stu) {
            const newProfile = new Profile(profile)
            newProfile.addStudnets([stu])
            setProfile(newProfile)
            // setStudents((prev) => ({ ...prev, [sid]: stu }));
        }
    };

    const addFee = (fee: Fee) => {
        if (fee) {
            const newProfile = new Profile(profile)
            newProfile.addFees([fee])
            setProfile(newProfile)
        }
    }

    const addFeeBulk = (fees: Fee[]) => {
        const newProfile = new Profile(profile)
        newProfile.addFees(fees)
        setProfile(newProfile)
    }
    const addSchedule = (sch: Schedule) => {
        if (sch.id) {
            setSchedules(pre => ({ ...pre, [sch.id]: sch }))
        }
    }
    const deleteSchedule = (sch: Schedule) => {
        profile.deleteSchedule(sch.id)
        setProfile(new Profile(profile))
    }
    const addPayment = (payment: Payment) => {
        if (payment) {
            const newProfile = new Profile(profile)
            newProfile.addPayments([payment])
            payment.fees.forEach(f => newProfile.updateFeeById(f.fee, f.amount_applied))
            setProfile(newProfile)
        }
    }

    const addStudentToSchedule = async (student_id: string, schedule_id: string): Promise<boolean> => {
        const student = students[student_id]
        if (!student) {
            return false
        }

        const is_done = await student.addSchedule(schedule_id)
        if (is_done) {
            profile.addStudnets([student])
            setProfile(new Profile(profile))
            return true
        }
        return false
    }
    const removeStudentToSchedule = async (student_id: string, schedule_id: string): Promise<boolean> => {
        const student = students[student_id]
        if (!student) {
            return false
        }

        const is_done = await student.removeSchedule(schedule_id)
        if (is_done) {
            profile.addStudnets([student])
            setProfile(new Profile(profile))
        }
        return false
    }


    // Fetch students from API
    useEffect(() => {
        const controller = new AbortController();

        const getInfos = async () => {
            try {
                setLoading(true);
                const { data } = await apiRequest.get("/profile", {
                    signal: controller.signal,
                });
                const {
                    students: apiStudents = [],
                    schedules: apiSchedules = [],
                    fees: apiFees = [],
                    payments: apiPayments = []
                } = data


                const studentList: Student[] = apiStudents.map((s: StudentInterface) => { return new Student(s) })
                const scheduleList = apiSchedules.map((s: ScheduleType) => { return new Schedule(s) })
                const feeList = apiFees.map((f: FeeType) => new Fee(f))
                const paymentList = apiPayments.map((p: PaymentType) => new Payment(p,))
                const profileInfo = new Profile()
                profileInfo.addStudnets(studentList)
                profileInfo.addSchedules(scheduleList)
                profileInfo.addFees(feeList)
                profileInfo.addPayments(paymentList)

                setStudents(studentList.reduce((pre: { [k: string]: Student }, curr: Student) => {
                    pre[curr.id] = curr
                    return pre
                }, {}))
                setSchedules(scheduleList)
                setProfile(profileInfo)


            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Failed to get info.", err.message);
                } else {
                    console.error("Failed to get info.", err);
                }
            } finally {
                setLoading(false);
            }
        };

        getInfos();

        return () => controller.abort(); // Cleanup if component unmounts
    }, []);

    const ctxValue = {
        students,
        schedules,
        profile,
        loading,
        addStudent,
        addSchedule,
        addFee,
        addFeeBulk,
        addPayment,
        deleteSchedule,
        addStudentToSchedule,
        removeStudentToSchedule
    }

    return (
        <MainContext.Provider value={ctxValue}>
            {children}
        </MainContext.Provider>
    );
};
