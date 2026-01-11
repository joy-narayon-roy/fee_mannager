import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import { Dashboard, Students, StudentCreate, StudentUpdate, StudentInfo, ScheduleCreate, ScheduleInfo, ScheduleUpdate, Summary, } from "./pages";
import { MainContextProvider } from "./contexts/MainContext";
import SchedulePage from "./pages/SchedulePage";


export default function App() {
  return (
    <>
      <MainContextProvider >
        <Routes>
          <Route element={<MainLayout />}>
            <Route index path="/" element={<Dashboard />} />
            <Route path="/student" element={<Students />} />
            <Route path="/student/create" element={<StudentCreate />} />
            <Route path="/student/:id" element={<StudentInfo />} />
            <Route path="/student/update/:id" element={<StudentUpdate />} />

            <Route path="/schedule" element={<><Outlet /></>}>
              <Route index element={<SchedulePage />} />
              <Route path="create" element={<ScheduleCreate />} />
              <Route path=":id" element={<ScheduleInfo />} />
              <Route path="update/:id" element={<ScheduleUpdate />} />
            </Route>

            <Route path="/summary" element={<Summary />} />
            <Route path="*" element={<h1>Not found</h1>} />
          </Route>
        </Routes>
      </MainContextProvider>
    </>
  )
}