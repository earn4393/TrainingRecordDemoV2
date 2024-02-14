import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Container, Table, FormControl, Button, Form } from 'react-bootstrap';
import ScrollToTop from '../component/ScrollToTop'
import { Icon } from '@iconify/react';
import printIcon from '@iconify/icons-material-symbols/print';
import axios from '../api/axios';
import '../styles/Styles.css'

const URL_EMP = '/get-employee'  //api เรียกดูข้อมูลพนักงาน
const URL_COURSE = '/get-all-my-course' //api เรียกดูหลักสูตรที่พนักงานฝึกอบรมทั้งหมด

// ตรวจสอบประวัติการฝึกอบรมของพนักงาน 
const Employee = () => {
    const [emp, setEmp] = useState(null)
    const [allMyCourse, setAllMyCourse] = useState(null)

    // เรียกดูข้อมูลพนักงาน
    const search = (e) => {
        if (e.target.value.length === 6) {
            handleChangeInput(e.target.value)
        }
        else {
            setEmp(null)
            setAllMyCourse(null)
        }
    }
    // หาข้อมูลพนักงานในฐานข้อมูล
    const handleChangeInput = async (emp_no) => {
        const resEmp = await axios.post(URL_EMP, { id: emp_no })
        const resCourse = await axios.post(URL_COURSE, { id: emp_no })

        if (resEmp.data.data != null) {
            setEmp(resEmp.data.data)
        }
        if (resCourse.data.data != null) {
            setAllMyCourse(resCourse.data.data)
        }
    }

    return (
        <div >
            <div>
                <div className='wrapp-header'>
                    <h1 className='head-title'>Profile Employee</h1>
                    <div className='wrapp-search'>
                        {/* ช่องค้นหา */}
                        <Form.Group className="search-container">
                            <Form.Label className="search-icon">
                                <Icon icon="ic:baseline-search" width="35" height="35" style={{ color: "#B4B4B8" }} />
                            </Form.Label>
                            <FormControl
                                placeholder="Plases Fill Employee No"
                                className="search-input"
                                type="search"
                                onChange={search}
                            />
                        </Form.Group>
                    </div>
                </div>
                <ScrollToTop smooth='true' />
                {emp ?
                    // ถ้าเจอข้อมูลพนักงานให้แสดง
                    <Container>
                        <div className='wrapp-descript'>
                            <div className='descript-box'>
                                <label >รหัสพนักงาน : <b style={{ color: '#6289b5' }}>{emp.id}</b></label>
                            </div>
                            <div className='descript-box'>
                                <label >ชื่อ : <b style={{ color: '#6289b5' }}>{emp.th_name}/{emp.eng_name}</b></label>
                            </div>
                            <div className='descript-box'>
                                <label >เพศ : <b style={{ color: '#6289b5' }}>{emp.sex}</b></label>
                            </div>
                            <div className='descript-box'>
                                <label >วันเกิด : <b style={{ color: '#6289b5' }}>{emp.birth}</b></label>
                            </div>
                            <div className='descript-box'>
                                <label >การศึกษา : <b style={{ color: '#6289b5' }}>{emp.degree}</b></label>
                            </div>
                            <div className='descript-box'>
                                <label >แผนก : <b style={{ color: '#6289b5' }}>{emp.dep}</b></label>
                            </div>
                            <div className='descript-box'>
                                <label >ฝ่าย : <b style={{ color: '#6289b5' }}>{emp.div}</b></label>
                            </div>
                            <div className='descript-box'>
                                <label >ตำแหน่ง : <b style={{ color: '#6289b5' }}>{emp.pos}</b></label>
                            </div>
                        </div>
                        <div className='content-bin'>
                            {/* ปริ้นเป็น PDF */}
                            <Link
                                to={`/report-emp/${emp.id}`}
                                target='_blank'
                                style={{ textDecoration: 'none' }}
                            >
                                <Button className='bin'>
                                    <Icon icon={printIcon} width="30" height="30" />
                                    &nbsp;Print
                                </Button>
                            </Link>
                        </div>
                        <Table striped bordered hover responsive size='sm'>
                            <thead className='header-table'>
                                <tr>
                                    <th rowSpan="2">ลำดับ</th>
                                    <th rowSpan="2">รหัสหลักสูตร</th>
                                    <th rowSpan="2">ชื่อหลักสูตร</th>
                                    <th colSpan="2">ประเมิน</th>
                                    <th rowSpan="2">วันที่</th>
                                    <th rowSpan="2">หมายเหตุ</th>
                                </tr>
                                <tr>
                                    <th >ตนเอง</th>
                                    <th >ผู้สอน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allMyCourse ?
                                    // ใส่ข้อมูลหลักสูตรที่พนักงานอบรมในตาราง
                                    allMyCourse.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td >{index + 1}</td>
                                                <td className='len-id'>
                                                    <Link
                                                        to={`/detail-course/${item.id}`}
                                                        target='_blank'
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        {item.id}
                                                    </Link>
                                                </td>
                                                <td className="col-left" >{item.name}</td>
                                                <td >{item.trainee}</td>
                                                <td >{item.trainer}</td>
                                                <td >{item.date}</td>
                                                <td >{item.remark}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr key='1'>
                                        <td >1</td>
                                        <td >
                                            N/A
                                        </td>
                                        <td className="col-left" >N/A</td>
                                        <td >N/A</td>
                                        <td >N/A</td>
                                        <td >N/A</td>
                                        <td >N/A</td>
                                    </tr>
                                }
                            </tbody>
                        </Table>
                    </Container>
                    :
                    <Container className='content-notfound-emp'>
                        Not Found.
                    </Container>
                }
            </div>
        </div >
    );
}

export default Employee;