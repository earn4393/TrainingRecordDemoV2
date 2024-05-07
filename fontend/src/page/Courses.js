import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Container, Table, Button } from 'react-bootstrap';
import fileEarmarkExcelFill from '@iconify/icons-bi/file-earmark-excel-fill';
import * as XLSX from 'xlsx'
import ScrollToTop from '../component/ScrollToTop'
import { Icon } from '@iconify/react';
import printIcon from '@iconify/icons-material-symbols/print';
import axios from '../api/axios';
import '../styles/Styles.css'

const URL_CANDIDATES = '/get-candidate'  // api สำหรับเรียกผู้อบรมในหลักสูตร
const URL_COUSES = '/get-all-courses-by-search'  //api ค้นหาหลักสูตร
const URL_COURSE = '/get-course' // api สำหรับเรียกดูหลักสูตรตาม id

// ตรวจสอบประวัติการฝึกอบรมของพนักงาน 
const Courses = () => {
    const [courses, setCouses] = useState([])  //หลักสูตรทั้งหมด
    const [course, setCourse] = useState(null) //หลักสูตรที่ต้องการบันทึก
    const [candidates, setCandidates] = useState(null) // ผู้อบรมที่บันทึกใน course 
    const [isShow, setIsShow] = useState(false) // แสดงข้อมูล course ไหม?


    // โหลดข้อมูลหลักสูตร
    const listCouses = async () => {
        await axios.post(URL_COUSES).then((res) => {
            setCouses(res.data.data)
        })
    }

    // โหลดผู้ที่บันทึกอบรมในหลักสูตร
    const listCandidate = async (id) => {
        await axios.post(URL_CANDIDATES, { id: id }).then((res) => {
            setCandidates(res.data.data)
        })

        await axios.post(URL_COURSE, { id: id }).then((res) => {
            if (res.data.data != null) {
                setCourse(res.data.data)
            }
        })
    }

    //เลือกหลักสูตรที่ต้องการ
    const handleOnSelect = (item) => {
        setCourse(item)
        listCandidate(item.id)
        setIsShow(true)
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
            XLSX.writeFile(wb, `${course.id}_Emp.xlsx`)
        }
    }


    // เริ่มต้นโหลดข้อมูลหลักสูตร
    useEffect(() => {
        listCouses()
    }, [])

    return (
        <div >
            <ScrollToTop />
            <div className="wrapp-header">
                <h1 className="head-title">Detail Courses</h1>
                <div className='wrapp-search'>
                    {/* ค้นหาหลักสูตร */}
                    <ReactSearchAutocomplete
                        items={courses}
                        fuseOptions={{ keys: ["id"] }}
                        onSelect={handleOnSelect}
                        autoFocus
                        placeholder="Plases Fill Course No"
                        resultStringKeyName="id"
                        styling={
                            {
                                backgroundColor: "#D8DBE2",
                            }
                        }
                    />
                </div>
            </div>
            {isShow ?
                // ถ้าเจอข้อมูลพนักงานให้แสดง
                <Container>
                    <br></br>
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
                                to={`/report-course/${course.id}`}
                                target='_blank'
                                style={{ textDecoration: 'none' }}
                            >
                                <Button className='bin'>
                                    <Icon icon={printIcon} width="30" height="30" />
                                    &nbsp;Print Review
                                </Button>
                            </Link>
                        </div>
                        <div style={{ color: '#6289b5' }}>
                            {/* จำนวนผู้บันทึกประวัติ */}
                            all candidates : {candidates !== null ? candidates.length : 0}
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
                :
                <Container className='content-notfound-emp'>
                    Not Found.
                </Container>
            }
        </div>
    );
}

export default Courses;