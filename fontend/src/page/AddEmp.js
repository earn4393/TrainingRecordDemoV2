import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Container, Table, Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import ScrollToTop from '../component/ScrollToTop'
import addIcon from '@iconify/icons-gridicons/add';
import axios from "../api/axios";
import '../styles/Styles.css'

const URL_COUSES = '/get-all-courses-by-search'  //api สำหรับค้นหาหลักสูตร
const URL_CANDIDATES = '/get-candidate' // api สำหรับเรียกผู้อบรมในหลักสูตร
const URL_EMP = '/get-employee' // api เรียกดูชื่อพนักงาน
const URL_ADD_EMP = '/add-employee' // api เพิ่มผู้อบรมลงหลักสูตร





// บันทึกประวัติการเข้าอบรม ฉบับผู้ใช้ทั่วไป
const AddEmp = () => {
    const userRef = useRef()
    const [courses, setCouses] = useState([])  //หลักสูตรทั้งหมด
    const [course, setCourse] = useState(null) //หลักสูตรที่ต้องการบันทึกประวัติการเข้าอบรม
    const [candidates, setCandidates] = useState(null) // ผู้อบรมที่บันทึกประวัติใน course แล้ว
    const [isShow, setIsShow] = useState(false) // สถานะว่าจะให้แสดงรายละเอียดหลักสูตรไหม
    const [isPop, setIsPop] = useState(false) // สถานะว่าจะให้โมเดลแสดงไหม
    const [empID, setEmpID] = useState('') // รหัสพนักงาน
    const [name, setName] = useState('') // ชื่อพนักงาน
    const [select, setSelect] = useState('มาก') // สถานะความเข้าใจของผู้อบรม
    const [disabled, setDisabled] = useState(false) // สถานะให้กรอกรหัสพนักงานได้หรือไม่
    const [validated, setValidated] = useState(false); // สถานะการตรวจสอบว่าผู้อบรมกรอกข้อมูลในโมเดลครบไหม
    const [invalid, setInValid] = useState(null); // สถานะกรอกข้อมูลในโมเดลไม่ครบ

    // โหลดข้อมูลหลักสูตรทั้งหมด
    const listCouses = async () => {
        const res = await axios.post(URL_COUSES)
        if (res.data.data !== null) {
            setCouses(res.data.data)
        }
    }
    // โหลดข้อมูลผู้ที่อบรมในหลักสูตรที่เลือกไว้
    const listCandidate = async (id) => {
        const res = await axios.post(URL_CANDIDATES, { id: id })
        setCandidates(res.data.data)
    }
    // แสดงชื่อตามรหัสพนักงาน
    const showName = async (emp_id) => {
        setEmpID(emp_id)
        const res = await axios.post(URL_EMP, { id: emp_id })
        if (emp_id.length === 6) {
            if (res.data.data !== null) {
                setName(`${res.data.data.th_name}/ ${res.data.data.eng_name}`)
                setDisabled(true)
                setInValid(false)
            } else {
                setInValid(true)
            }
        }
    }

    // reset parameters
    const clearData = () => {
        setEmpID('')
        setSelect('มาก')
        setName('')
        setInValid(null)
        setValidated(false)
        setDisabled(false)
    }

    // alert when input save employee
    const Alert = (icon, title) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top",
            grow: 'row',
            showConfirmButton: false,
            timer: 1500,
        });

        return (
            Toast.fire({
                icon: icon,
                title: title,
            }).then(() => {
                clearData()
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
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
            const resAddNewEmp = await axios.post(URL_ADD_EMP, data)
            if (resAddNewEmp.data.code === 200) {
                Alert('success', 'บันทึกการเข้าฝึกอบรมสำเร็จ')
                listCandidate(course.id)
            } else {
                Alert('error', 'ไม่สามารถบันทึกการเข้าฝึกอบรมได้')
            }
        } else {
            Alert('warning', 'ท่านบันทึกการอบรมเรียบร้อยแล้ว')
        }
    }

    // ป๊อปอัพสำหรับบันทึกประวัติผู้เข้าฝึกอบรม
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
                <Modal.Header>
                    <Modal.Title>Add New Trainee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group className="mb-3" as={Col} xs='auto'>
                                <Form.Label >รหัสพนักงาน*:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    value={empID}
                                    onChange={e => showName(e.target.value)}
                                    minLength="6"
                                    maxLength="6"
                                    ref={userRef}
                                    autoFocus
                                    required
                                    disabled={disabled}
                                    isInvalid={invalid}
                                />
                                <Form.Control.Feedback type="invalid">
                                    รหัสพนักงานไม่ถูกต้อง
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col} xs='8'>
                                <Form.Label>ชื่อ:</Form.Label>
                                <Form.Text style={{ fontSize: '14px' }}>{name ? name : ''}</Form.Text>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label style={{ marginRight: '10px' }}>ระดับความเข้าใจ (ประเมินตนเอง) :</Form.Label>
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
                    <Button variant="secondary" onClick={() => {
                        setIsPop(false)
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    // the item selected
    const handleOnSelect = (item) => {
        setCourse(item)
        listCandidate(item.id)
        setIsShow(true)
    }
    // ตรวจสอบว่าข้อมูลในการบันทึกประวัติผู้อบรมกรอกครบตามที่กำหนดหรือไม่ ถ้าครบบันทึก
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if ((form.checkValidity() === true) && (name !== '')) {
            addNewEmp()
        }
        setValidated(true);
    };

    // โหลดข้อมูลหลักสูตร
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
                        fuseOptions={{ keys: ["id", "name"] }}
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
                    // เมื่อเลือกหลักสูตรได้แล้ว จะแสดงข้อมูลและรายชื่อผู้อบรมที่บันทึกประวัติในหลักสูตรที่เลือกไว้แล้ว
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
                            all candidates : {candidates !== null ? candidates.length : null}
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