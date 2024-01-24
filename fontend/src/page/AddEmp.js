import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Container, Table, Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import ScrollToTop from '../component/ScrollToTop'
import addIcon from '@iconify/icons-gridicons/add';
import axios from "../api/axios";
import '../styles/Styles.css'

const URL_COUSES = '/get-all-courses-by-search'  //api ค้นหาหลักสูตร
const URL_CANDIDATES = '/get-candidate' // api ผู้อบรมในหลักสูตร
const URL_ADD_EMP = '/add-employee' // api เพิ่มผู้อบรมลงหลักสูตร
const URL_ALL_EMP = '/get-all-employee' // api รหัสและชื่อพนักงานทั้งหมด





// บันทึกประวัติการเข้าอบรม ฉบับผู้ใช้ทั่วไป
const AddEmp = () => {
    const userRef = useRef()
    const [courses, setCouses] = useState([])  //หลักสูตรทั้งหมด
    const [employees, setEmployees] = useState([]) //ชื่อและรหัสพนักงานทั้งหมด
    const [course, setCourse] = useState(null) //หลักสูตรที่ต้องการบันทึก
    const [candidates, setCandidates] = useState(null) // ผู้อบรมที่บันทึกใน course 
    const [isShow, setIsShow] = useState(false) // แสดงข้อมูล course ไหม?
    const [isPop, setIsPop] = useState(false) // โมเดลแสดงไหม?
    const [empID, setEmpID] = useState('') // รหัสพนักงาน
    const [name, setName] = useState('') // ชื่อพนักงาน
    const [select, setSelect] = useState('มาก') // สถานะความเข้าใจของผู้อบรม

    // โหลดข้อมูลหลักสูตรและพนักงานทั้งหมด
    const listCouses = async () => {
        await axios.post(URL_COUSES).then((res) => {
            setCouses(res.data.data)
        })
        await axios.post(URL_ALL_EMP).then((res) => {
            setEmployees(res.data.data)
        })
    }
    // โหลดผู้ที่บันทึกอบรมในหลักสูตร
    const listCandidate = async (id) => {
        await axios.post(URL_CANDIDATES, { id: id }).then((res) => {
            setCandidates(res.data.data)
        })
    }
    // แสดงชื่อตามรหัสพนักงาน
    const showName = (id) => {
        id = id.trim()
        setEmpID(id)
        if (/^\d{6}$/.test(id)) {
            const index = employees.find((item) => item.id === id)
            if (index != undefined) {
                setName(index.name)
            }
        }
    }

    // เคลียร์ข้อมูล
    const clearData = () => {
        setEmpID('')
        setSelect('มาก')
        setName('')
    }

    // แจ้งเตือนเมื่อ save
    const Alert = (icon, title, color) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "center",
            grow: 'row',
            showConfirmButton: false,
            timer: 1500,
            color: '#ffffff',
            background: color
        });

        return (
            Toast.fire({
                icon: icon,
                title: title,
            }).then(() => {
                clearData()
                userRef.current && userRef.current.focus()
            })
        )
    }

    // เพิ่มรายชื่อผู้เข้าอบรม
    const addNewEmp = async () => {
        const data = {
            emp_id: empID,
            course_id: course.id,
            trainee: select,
            trainer: '',
            remark: ''
        }

        const index = candidates != null ? candidates.findIndex((item) => item.id === empID) : -1

        if (index === -1) {
            await axios.post(URL_ADD_EMP, data).then((res) => {
                if (res.data.code === 200) {
                    Alert('success', 'บันทึกการเข้าฝึกอบรมสำเร็จ', '#2eb82e')
                    listCandidate(course.id)
                } else {
                    Alert('error', 'ไม่สามารถบันทึกการเข้าฝึกอบรมได้', '#cc0000')
                }
            })
        } else {
            Alert('warning', 'ท่านบันทึกการอบรมเรียบร้อยแล้ว', '#ff8c1a')
        }
    }

    // โมเดลบันทึกประวัติผู้อบรม
    const ModelEmp = () => {
        return (
            <Modal
                show={isPop}
                onHide={() => setIsPop(false)}
                size="lg"
                fullscreen='sm-down'
                scrollable={true}
                centered={true}
                onExited={clearData}
            >
                <Container>
                    <Modal.Header >
                        <Modal.Title>Add New Trainee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Form.Group className="mb-3" as={Col} xs='auto'>
                                    <Form.Label >รหัสพนักงาน<span className="red-text">*</span>:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="XXXXXX"
                                        size="sm"
                                        value={empID}
                                        onChange={e => showName(e.target.value)}
                                        minLength="6"
                                        maxLength="6"
                                        autoFocus
                                        required
                                        ref={userRef}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} xs='8'>
                                    <Form.Label>ชื่อ:</Form.Label>
                                    <Form.Text style={{ fontSize: '14px' }}>{name ? name : ''}</Form.Text>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col}>
                                    <Form.Label style={{ marginRight: '10px' }}>ระดับความเข้าใจ (ประเมินตนเอง)<span className="red-text">*</span> :</Form.Label>
                                    <Form.Check
                                        inline
                                        label="มาก"
                                        name="group1"
                                        type="radio"
                                        defaultChecked='true'
                                        required
                                        onClick={() => {
                                            setSelect('มาก')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="กลาง"
                                        name="group1"
                                        type="radio"
                                        required
                                        onClick={() => {
                                            setSelect('กลาง')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="น้อย"
                                        name="group1"
                                        type="radio"
                                        required
                                        onClick={() => {
                                            setSelect('น้อย')
                                        }}
                                        className="check-bin"
                                    />
                                </Form.Group>
                            </Row>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setIsPop(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Container>
            </Modal>
        )
    }

    //เลือกหลักสูตรที่ต้องการ
    const handleOnSelect = (item) => {
        setCourse(item)
        listCandidate(item.id)
        setIsShow(true)
    }
    // ตรวจสอบความครบถ้วนแล้ว save
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true & name != '') {
            addNewEmp()
        } else {
            Alert('warning', 'รหัสผ่านไม่ถูกต้อง', '#ff8c1a')
        }
    };

    // เริ่มต้นโหลดข้อมูลหลักสูตร
    useEffect(() => {
        listCouses()
    }, [])

    return (
        <div >
            <ScrollToTop />
            <div className="wrapp-header">
                <h1 className="head-title">Register Employees</h1>
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
            <Container>
                {isShow ?
                    // แสดงข้อมูลหลักสูตรและผู้บันทึกอบรมไปแล้ว
                    <div >
                        <div className='wrapp-descript'>
                            <div><label>รหัสหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.id}</b></label></div>
                            <div className="margin-between-detail" />
                            <div><label>ชื่อหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.name}</b></label></div>
                        </div>
                        <div className='content-bin-addEmp'>
                            {/* ปุ่มบันทึกประวัติผู้อบรม */}
                            <Button className='bin' onClick={() => { setIsPop(true) }}>
                                <Icon icon={addIcon} width="30" height="30" />
                                &nbsp;Add New Trainee
                            </Button>
                        </div>
                        <div className="model">
                            {ModelEmp()}
                        </div>
                        <div style={{ color: '#6289b5' }}>
                            {/* จำนวนผู้บันทึกประวัติ */}
                            all candidates : {candidates !== null ? candidates.length : 0}
                        </div>
                        {/* ตารางแสดงผู้อบรมที่บันทึกแล้ว */}
                        <Table striped bordered hover responsive size='sm'>
                            <thead className='header-table'>
                                <tr>
                                    <th rowSpan="2">ลำดับ</th>
                                    <th rowSpan="2">รหัสพนักงาน</th>
                                    <th rowSpan="2">ชื่อ-สกุล</th>
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
                                            <td className="col-left">{item.th_name}</td>
                                            <td>{item.trainee}</td>
                                            <td>{item.trainer}</td>
                                            <td>{item.date}</td>
                                            <td>{item.remark}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                    : null}
            </Container>
        </div >
    )
}

export default AddEmp;