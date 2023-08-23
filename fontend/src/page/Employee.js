import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Container, Table, FormControl, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import printIcon from '@iconify/icons-material-symbols/print';
import axios from '../api/axios';
import '../styles/Styles.css'


const URL_EMP = '/get-employee'
const URL_COURSE = '/get-all-my-course'



const Employee = () => {
    const [emp, setEmp] = useState(null)
    const [allMyCourse, setAllMyCourse] = useState(null)

    const search = (e) => {
        if (e.target.value.length === 6) {
            handleChangeInput(e.target.value)
        }
        else {
            setEmp(null)
            setAllMyCourse(null)
        }
    }

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
                        <FormControl
                            placeholder="Plases Fill Employee No"
                            type="search"
                            onChange={search}
                            style={{ borderRadius: '30px' }}
                        />
                    </div>
                </div>
                {emp ?
                    <Container>
                        <div className='description-box'>
                            <div className='show-detail'>
                                <label >รหัสพนักงาน : <b style={{ color: '#6289b5' }}>{emp.id}</b></label>
                            </div>
                            <div className='show-detail'>
                                <label >ชื่อ : <b style={{ color: '#6289b5' }}>{emp.th_name}/{emp.eng_name}</b></label>
                            </div>
                            <div className='show-detail'>
                                <label >เพศ : <b style={{ color: '#6289b5' }}>{emp.sex}</b></label>
                            </div>
                            <div className='show-detail'>
                                <label >วันเกิด : <b style={{ color: '#6289b5' }}>{emp.birth}</b></label>
                            </div>
                            <div className='show-detail'>
                                <label >การศึกษา : <b style={{ color: '#6289b5' }}>{emp.degree}</b></label>
                            </div>
                            <div className='show-detail'>
                                <label >แผนก : <b style={{ color: '#6289b5' }}>{emp.dep}</b></label>
                            </div>
                            <div className='show-detail'>
                                <label >ฝ่าย : <b style={{ color: '#6289b5' }}>{emp.div}</b></label>
                            </div>
                            <div className='show-detail'>
                                <label >ตำแหน่ง : <b style={{ color: '#6289b5' }}>{emp.pos}</b></label>
                            </div>
                        </div>
                        <div className='content-bin'>
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
                                    allMyCourse.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td >{index + 1}</td>
                                                <td >
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