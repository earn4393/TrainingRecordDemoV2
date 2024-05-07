import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './page/Home'
import Employee from './page/Employee';
import ReportEmp from './page/ReportEmp';
import DetailCourse from './page/DetailCourse';
import ReportCourse from './page/ReportCourse';
import AddCourse from './page/AddCourse';
import AddEmp from './page/AddEmp';
import AddEmpAdmin from './page/AddEmpAdmin';
import Login from './page/Login';
import ReqRequireAuth from './context/RequireAuth'
import MenuBer from './component/MenuBer';
import Courses from './page/Courses';
import UploadIMG from './page/UploadIMG';
import Print from './page/Print'




function App() {
  return (
    <BrowserRouter>
      <Routes >
        {/* Lock Page */}
        <Route path='/' element={<MenuBer />}>
          <Route path='employee' element={<ReqRequireAuth><Employee /></ReqRequireAuth>} />
          <Route path='courses' element={<ReqRequireAuth><Courses /></ReqRequireAuth>} />
          <Route path='add-emp-admin' element={<ReqRequireAuth><AddEmpAdmin /></ReqRequireAuth>} />
          <Route path='add-course' element={<ReqRequireAuth><AddCourse /></ReqRequireAuth>} />


          {/* don't Locck Page */}
          <Route path='/' element={<Home />} />
          <Route path='add-employee' element={<AddEmp />} />

        </Route>
        <Route path='login' element={<Login />} />
        <Route path='report-course/:id' element={<ReqRequireAuth><ReportCourse /></ReqRequireAuth>} />
        <Route path='report-emp/:id' element={<ReqRequireAuth><ReportEmp /></ReqRequireAuth>} />
        <Route path='detail-course/:id' element={<ReqRequireAuth><DetailCourse /></ReqRequireAuth>} />
        <Route path='upload' element={<UploadIMG />} />
        <Route path='report' element={<Print />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
