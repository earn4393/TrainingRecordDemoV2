import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
// import Manual from './page/Manual'
import { AuthProvider } from './context/AuthProvider';
import MenuBer from './component/MenuBer';




function App() {
  return (
    <AuthProvider>
      <Routes >
        {/* Lock Page */}
        <Route path='/' element={<MenuBer />}>
          <Route path='employee' element={<ReqRequireAuth><Employee /></ReqRequireAuth>} />
          <Route path='add-emp-admin' element={<ReqRequireAuth><AddEmpAdmin /></ReqRequireAuth>} />
          <Route path='add-course' element={<ReqRequireAuth><AddCourse /></ReqRequireAuth>} />

          {/* don't Locck Page */}
          <Route path='/' element={<Home />} />
          <Route path='add-employee' element={<AddEmp />} />

        </Route>
        <Route path='login' element={<Login />} />
        <Route path='report-emp/:id' element={<ReportEmp />} />
        <Route path='detail-course/:id' element={<DetailCourse />} />
        <Route path='report-course/:id' element={<ReportCourse />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
