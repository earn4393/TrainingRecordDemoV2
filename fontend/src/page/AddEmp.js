import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Container, Table, Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import addIcon from '@iconify/icons-gridicons/add';
import axios from "../api/axios";
import '../styles/Styles.css'

const URL_COUSES = '/get-all-courses-by-search'
const URL_CANDIDATES = '/get-candidate'
const URL_EMP = '/get-employee'
const URL_ADD_EMP = '/add-employee'

// บันทึกประวัติการเข้าอบรม ฉบับผู้ใช้ทั่วไป
const AddEmp = () => {
    const userRef = useRef()
    const [courses, setCouses] = useState([])
    const [course, setCourse] = useState(null)
    const [candidates, setCandidates] = useState(null)
    const [isShow, setIsShow] = useState(false)
    const [isPop, setIsPop] = useState(false)
    const [empID, setEmpID] = useState('')
    const [name, setName] = useState('')
    const [select, setSelect] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [checkList, setCheckList] = useState([false, false, false])
    const [validated, setValidated] = useState(false);
    const [invalid, setInValid] = useState(null);


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true & name !== '') {
            addNewEmp()
        }
        setValidated(true);
    };

    // โหลดข้อมูลหลักสูตรทั้งหมด
    const listCouses = async () => {
        const resCourses = await axios.post(URL_COUSES)
        if (resCourses.data.data !== null) {
            const lst = resCourses.data.data
            setCouses(lst)
        }
    }

    // โหลดข้อมูลผู้ที่อบรมในหลักสูตรที่เลือกไว้
    const listCandidate = async (id) => {
        const resCandidate = await axios.post(URL_CANDIDATES, { id: id })
        setCandidates(resCandidate.data.data)
    }

    // แสดงชื่อตามรหัสพนักงาน
    const showName = async (emp_id) => {
        setEmpID(emp_id)
        const resEmp = await axios.post(URL_EMP, { id: emp_id })
        if (emp_id.length === 6) {
            if (resEmp.data.data !== null) {
                setEmpID(emp_id)
                setName(`${resEmp.data.data.th_name}/ ${resEmp.data.data.eng_name}`)
                setDisabled(true)
                setInValid(false)
            } else {
                setInValid(true)
            }
        }
    }

    const clearData = () => {
        setEmpID('')
        setSelect('')
        setName('')
        setInValid(null)
        setValidated(false)
        setDisabled(false)
        setCheckList([false, false, false])
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
        let index = candidates !== null ? candidates.findIndex((item) => item.id === empID) : -1


        if (index === -1) {
            const resAddNewEmp = await axios.post(URL_ADD_EMP, data)
            if (resAddNewEmp.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: "บันทึกการเข้าฝึกอบรมสำเร็จ",
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    setTimeout(() => {
                        userRef.current && userRef.current.focus()
                    }, 300)
                })
                listCandidate(course.id)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "ไม่สามารถบันทึกการเข้าฝึกอบรมได้",
                    showConfirmButton: true,
                }).then(() => {
                    setTimeout(() => {
                        userRef.current && userRef.current.focus()
                    }, 300)
                })
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: "ท่านบันทึกการอบรมเรียบร้อยแล้ว",
                showConfirmButton: true,
            }).then(() => {
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
            })
        }
        clearData()
    }

    // ป๊อปอัพสำหรับบันทึกประวัติผู้เข้าฝึกอบรม
    const modelEmp = () => {
        return (
            <Modal
                show={isPop}
                onHide={() => setIsPop(false)}
                size="lg"
                fullscreen='sm-down'
                scrollable={true}
                centered={true}
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
                                    checked={checkList[0]}
                                    required
                                    onClick={() => {
                                        setCheckList([true, false, false])
                                        setSelect('มาก')
                                    }}
                                    className="check-bin"
                                />
                                <Form.Check
                                    inline
                                    label="กลาง"
                                    name="group1"
                                    type="radio"
                                    checked={checkList[1]}
                                    required
                                    onClick={() => {
                                        setCheckList([false, true, false])
                                        setSelect('กลาง')
                                    }}
                                    className="check-bin"
                                />
                                <Form.Check
                                    inline
                                    label="น้อย"
                                    name="group1"
                                    type="radio"
                                    checked={checkList[2]}
                                    required
                                    onClick={() => {
                                        setCheckList([false, false, true])
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
                        clearData()
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

    // ปิดเมนูบาร์เมื่อเข้ายังหน้านี้และโหลดข้อมูลหลักสูตร
    useEffect(() => {
        listCouses()
    }, [])


    // ให้ curser ชี้ที่ช่องกรอกรหัสพนักงานเมื่อมีการเพิ่มผู้อบรม
    useEffect(() => {
        userRef.current && userRef.current.focus()
    }, [isPop])


    return (
        <div >
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
                    // เมื่อเลือกหลักสูตรได้แล้ว จะแสดงข้อมูลและรายชื่อผู้อบรมที่บันทึกประวัติในหลักสูตรที่เลือกไว้แล้ว
                    <div >
                        <div className='description-box'>
                            <div><label>รหัสหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.id}</b></label></div>
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
                            {modelEmp()}
                        </div>
                        <div style={{ color: '#6289b5' }}>
                            all candidates : {candidates !== null ? candidates.length : null}
                        </div>
                        <Table striped bordered hover responsive size='sm'>
                            {/* ตารางแสดงหลักสูตร */}
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