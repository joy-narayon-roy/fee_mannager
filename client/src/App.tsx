import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import { Dashboard, Students, StudentCreate, StudentUpdate, StudentInfo, ScheduleCreate, ScheduleInfo, ScheduleUpdate, Summary, FeePage, PaymentPage, FeeCreate, FeeInfo, FeeBulkCreate, PaymentPayPage, } from "./pages";
import { MainContextProvider } from "./contexts/MainContext";
import SchedulePage from "./pages/SchedulePage";
import StudentSchedule from "./pages/studentPage/StudentSchedule";
import StudentFee from "./pages/studentPage/StudentFee";
import StudentPayment from "./pages/studentPage/StudentPayment";


export default function App() {
  return (
    <>
      <MainContextProvider >
        <Routes>
          <Route element={<MainLayout />}>
            <Route index path="/" element={<Dashboard />} />
            <Route path="/student" element={<Students />} />
            <Route path="/student/create" element={<StudentCreate />} />
            <Route path="/student/:id" element={<StudentInfo />}>
              <Route index element={<StudentSchedule />} />
              <Route path="fee" element={<StudentFee />} />
              <Route path="payment" element={<StudentPayment />} />
            </Route>
            <Route path="/student/update/:id" element={<StudentUpdate />} />

            <Route path="/schedule" element={<><Outlet /></>}>
              <Route index element={<SchedulePage />} />
              <Route path="create" element={<ScheduleCreate />} />
              <Route path=":id" element={<ScheduleInfo />} />
              <Route path="update/:id" element={<ScheduleUpdate />} />
            </Route>

            <Route path="/fee" element={<><Outlet /></>}>
              <Route index element={<FeePage />} />
              <Route path='create' element={<FeeCreate />} />
              <Route path='bulkcreate' element={<FeeBulkCreate />} />
              <Route path=':id' element={<FeeInfo />} />
            </Route>

            <Route path="/payment" element={<><Outlet /></>}>
              <Route index element={<PaymentPage />} />
              <Route path="pay" element={<PaymentPayPage />} />
            </Route>

            <Route path="/summary" element={<Summary />} />
            <Route path="*" element={<h1>Not found</h1>} />
          </Route>
        </Routes>
      </MainContextProvider>
    </>
  )
}