import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Container, Table, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import ScrollToTop from '../component/ScrollToTop'
import fileEarmarkExcelFill from '@iconify/icons-bi/file-earmark-excel-fill';
import printIcon from '@iconify/icons-material-symbols/print';
import * as XLSX from 'xlsx'
import '../styles/Styles.css'

const URL_CANDIDATES = '/get-candidate'  // api สำหรับเรียกผู้อบรมในหลักสูตร
const URL_COURSE = '/get-course' // api สำหรับเรียกดูหลักสูตรตาม id

// แสดงรายละเอียดหลักสูตร
const DetailCourse = () => {
    const course_id = useParams().id  // รหัสหลักสูตร
    const [course, setCourse] = useState(null) // ข้อมูลหลักสูคร
    const [candidates, setCandidates] = useState(null) // รายชื่อผู้บันทึกประวัติอบรม

    // โหลดข้อมูลหลักสูตร
    const listCourse = async () => {
        const resCandidate = await axios.post(URL_CANDIDATES, { id: course_id })
        const resCourse = await axios.post(URL_COURSE, { id: course_id })

        if (resCandidate.data.data != null) {
            setCandidates(resCandidate.data.data)
        }
        if (resCourse.data.data != null) {
            setCourse(resCourse.data.data)
        }
    }
    // ส่งออกรายชื่อผู้อบรมเป็นไฟล์ excel
    const exportExcel = () => {
        const excel = candidates.map((item, index) => {
            const name = item.th_name.split(" ")
            const fname = name[0]
            name.shift()
            const lname = name.length > 2 ? name.join(" ") : name[1]
            return {
                "ลำดับ": index + 1,
                "รหัสประจำตัวประชาชน": item.identify,
                "คำนำหน้า": item.title,
                "ชื่อ": fname,
                "นามสกุล": lname,
            }
        })

        if (excel.length > 0) {
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(excel)

            XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
            XLSX.writeFile(wb, `${course_id}_Emp.xlsx`)
        }
    }
    // เริ่มโหลดข้อมูล
    useEffect(() => {
        listCourse()
    }, [])

    return (
        <div>
            <ScrollToTop />
            <div className='wrapp-header'>
                <h1 className='head-title'>Report Course</h1>
            </div>
            <Container>
                <div className="wrapp-descript">
                    <div className="descript-box">
                        <label>รหัสหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.id}</b></label>
                    </div>
                    <div className="descript-box">
                        <label>ชื่อหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.name}</b></label>
                    </div>
                    <div className="descript-box">
                        <label>วัตถุประสงค์ : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.aim}</b></label>
                    </div>
                    <div className="descript-box">
                        <label>รายละเอียด : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.des}</b></label>
                    </div>
                    <div className="descript-box">
                        <label>ชื่อผู้สอน : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.trainer}</b></label>
                    </div>
                    <div className="descript-box">
                        <label>วันที่เริ่ม : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.start}</b></label>
                    </div>
                    <div className="descript-box">
                        <label>วันสิ้นสุด : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.end}</b></label>
                    </div>
                    <div className="descript-box">
                        <label>จำนวนเวลา : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.hr} ชั่วโมง</b></label>
                    </div>
                    <div className="descript-box">
                        <label>สถานที่ : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.place}</b></label>
                    </div>
                </div>
                <div>
                    <div className="content-bin">
                        {/* ปุ่มส่งออกไฟล์ excel */}
                        <Button className='bin' onClick={exportExcel} >
                            <Icon icon={fileEarmarkExcelFill} width="30" height="30" />
                            &nbsp;Export
                        </Button>
                        <div style={{ margin: '10px' }} />
                        {/* ปริ้นเป็น PDF */}
                        <Link
                            to={`/report-course/${course_id}`}
                            target='_blank'
                            style={{ textDecoration: 'none' }}
                        >
                            <Button className='bin'>
                                <Icon icon={printIcon} width="30" height="30" />
                                &nbsp;Print Review
                            </Button>
                        </Link>
                    </div>
                    <Table striped bordered hover responsive size='sm'>
                        <thead className='header-table'>
                            <tr>
                                <th rowSpan="2">ลำดับ</th>
                                <th rowSpan="2">รหัสพนักงาน</th>
                                <th rowSpan="2">ชื่อพนักงาน</th>
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
                            {/* ใส่ข้อมูลในตารางแสดงผู้อบรมที่บันทึกแล้ว */}
                            {candidates && candidates.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.id}</td>
                                        <td className="col-left">{item.eng_name} ({item.th_name})</td>
                                        <td>{item.trainee}</td>
                                        <td>{item.trainer}</td>
                                        <td>{item.date}</td>
                                        <td>{item.remark}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </Table>
                </div >
            </Container >
        </div >
    )

}

export default DetailCourse;