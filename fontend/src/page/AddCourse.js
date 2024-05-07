import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Container, Table, Button, Modal, Form, Col, Row, Alert, } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import { Icon } from '@iconify/react';
import ScrollToTop from '../component/ScrollToTop'
import addIcon from '@iconify/icons-gridicons/add';
import editIcon from '@iconify/icons-bxs/edit';
import deleteIcon from '@iconify/icons-material-symbols/delete';
import axios from "../api/axios";
import Swal from 'sweetalert2'
import '../styles/Styles.css'


const URL_COUSES = '/get-all-courses' // ลิงค์สำหรับโหลดหลักสูตรทั้งหมด
const URL_ADD_COURSE = '/add-course' // ลิงค์สำหรับสร้างหลักสูตรใหม่
const URL_DEL_COURSE = '/delete-course' // ลิงค์สำหรับลบหลักสูตร
const URL_EDIT_COURSE = '/edit-course' // ลิงค์สำหรับแก้ไขหลักสูจร
const URL_DEL_TST = '/delete-transaction-by-course' // ลิงค์ลบพนักงานอยู่ในคอร์สนี้
const URL_COURSES_PER_PAGE = '/get-all-courses-per-page' // ลิงค์เรียกคอร์สตามการแบ่งหน้า
const URL_ALL_EMP = '/get-all-employee' // api รหัสและชื่อพนักงานทั้งหมด

// แสดง เพิ่ม แก้ไข และลบหลักสูตร
const AddCourse = () => {
    const [validated, setValidated] = useState(null);
    const [checkName, setCheckName] = useState(false)
    const [courses, setCouses] = useState([]) // หลักสูตรทั้งหมด
    const [employees, setEmployees] = useState([]) //ชื่อและรหัสพนักงานทั้งหมด
    const [showCourses, setShowCouses] = useState(null) //หลักสูตรในแต่ละหน้า
    const [isPopEdit, setIsPopEdit] = useState(false) //สถานะป๊อปอัพแก้ไขหลักสูตรว่าจะให้แสดงหรือไม่
    const [isPopNew, setIsPopNew] = useState(false) // สถานะป๊อปอัพสร้างหลักสูตรว่าจะให้แสดงหรือไม่
    const [pageCount, setPageCount] = useState(0) // หน้าทั้งหมด
    const [count, setCount] = useState(0) // จำนวนหลักสูตรทั้งหมด
    const [pageNumber, setPageNumber] = useState(0) // หน้าปัจจุบันที่อยู่
    const [isFind, setIsFind] = useState(true) // สถานะของการแสดง paging 
    const [login, setLogin] = useState(null)
    const [data, setData] = useState({
        id: '',
        name: '',
        aim: '',
        des: '',
        start: '',
        end: '',
        hr: '',
        trainer: '',
        trainer_id: '',
        div: '',
        site: ''
    }) // เก็บข้อมูลหลักสูตร

    // เก็บค่าข้อมูลของหลักสูตรลง data
    const setCourseID = (input) => setData(previousState => { return { ...previousState, id: input.toUpperCase() } }) //รหัสหลักสูตร
    const setTrainerID = (input) => setData(previousState => { return { ...previousState, trainer_id: input } }) //รหัสพนักงานผู้อบรม
    const setAppellation = (input) => setData(previousState => { return { ...previousState, name: input } }) // ชื่อหลักสูตร
    const setPurpose = (input) => setData(previousState => { return { ...previousState, aim: input } }) // จุดประสงค์ของหลักสูตร
    const setDesciption = (input) => setData(previousState => { return { ...previousState, des: input } }) // คำอธิบายหลักสูตร
    const setDateBegin = (input) => setData(previousState => { return { ...previousState, start: input } }) // วันเริ่มเรียน
    const setDateEnd = (input) => setData(previousState => { return { ...previousState, end: input } }) // วันสิ้นสุดการเรียน
    const setHour = (input) => setData(previousState => { return { ...previousState, hr: input } }) // จำนวนชั่วโมงที่เรียน
    const setTrainer = (input) => setData(previousState => { return { ...previousState, trainer: input } }) // ชื่อผู้ฝึกอบรม
    const setOrganize = (input) => setData(previousState => { return { ...previousState, div: input } }) // สังกัดของผู้อบรม
    const setPlace = (input) => setData(previousState => { return { ...previousState, site: input } }) // สถานที่อบรม

    // เปลี่ยนหน้า
    const changePage = ({ selected }) => {
        setPageNumber(selected);
        listCourses(selected)
    }

    // โหลดข้อมูลหลักสูตรตามหน้า
    const listCourses = async (num) => {
        const res = await axios.post(URL_COURSES_PER_PAGE, { start: num * 50 })
        if (res.data.data !== null) {
            setShowCouses(res.data.data)
        }
        await axios.post(URL_ALL_EMP).then((res) => {
            setEmployees(res.data.data)
        })
    }

    // เตรียมหลักสูตรสำหรับใช้ค้นหา
    const searchCourses = async () => {
        const res = await axios.post(URL_COUSES)
        if (res.data.data !== null) {
            setCouses(res.data.data)
            setCount(res.data.data.length)
            setPageCount(Math.ceil(res.data.data.length / 50))
            listCourses(pageNumber)
        }
    }
    // reset parameters
    const clearData = () => {
        setData({
            id: '',
            name: '',
            aim: '',
            des: '',
            start: '',
            end: '',
            hr: '',
            trainer: '',
            trainer_id: '',
            div: '',
            site: ''
        })
        setIsPopNew(false)
        setIsPopEdit(false)
        setValidated(false);
        setCheckName(false)
    }

    // แสดงชื่อตามรหัสพนักงาน
    const showName = (id) => {
        id = id.trim()
        setTrainerID(id)
        if (/^\d{6}$/.test(id)) {
            const index = employees.find((item) => item.id === id)
            if (index != undefined) {
                setTrainer(index.name_eng)
                setCheckName(true)
            } else {
                setCheckName(false)
                Swal.fire({
                    icon: 'error',
                    title: "รหัสพนักงานไม่ถูกต้อง",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        }
    }

    // ตรวจสอบว่าข้อมูลในการสร้างหลักสูตรกรอกครบตามที่กำหนดหรือไม่ ถ้าครบสร้างหลักสูตร
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            if (data.trainer_id === '') {
                addCourse()
            } else if (data.trainer_id.length === 6 && checkName) {
                addCourse()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "รหัสพนักงานไม่ถูกต้อง",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        }
        setValidated(true);
    };
    // ตรวจสอบว่าข้อมูลในการแก้ไขหลักสูตรกรอกครบตามที่กำหนดหรือไม่ ถ้าครบสร้างหลักสูตร
    const handleSubmitEdit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        console.log(data)
        if (form.checkValidity() === true) {
            if (data.trainer_id === '') {
                editCourse()
            } else if (data.trainer_id.length === 6 && checkName) {
                editCourse()
            }

        }
        setValidated(true);
    };
    // สร้างหลักสูตร
    const addCourse = async () => {
        const index = courses != null ? courses.findIndex((item) => item.id === data.id) : -1
        if (index === -1) {
            const res = await axios.post(URL_ADD_COURSE, data)
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: "บันทึกหลักสูตรเรียบร้อยแล้ว",
                    showConfirmButton: false,
                    timer: 1000
                })
                setCount(count + 1)
                setPageCount(Math.ceil((count + 1) / 50))
                listCourses(pageNumber)
                listCourses(pageNumber)
                setCouses([...courses, data])
                clearData()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "ไม่สามารถบันทึกหลักสูตรได้",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: "รหัสหลักสูตรซ้ำ",
                showConfirmButton: false,
                timer: 1000
            })
        }

    }
    // แก้ไขหลักสูตร
    const editCourse = async () => {
        const res = await axios.post(URL_EDIT_COURSE, data)
        if (res.data.code === 200) {
            Swal.fire({
                icon: 'success',
                title: "แก้ไขหลักสูตรเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCourses(pageNumber)
            searchCourses()
            clearData()
        } else {
            Swal.fire({
                icon: 'error',
                title: "ไม่สามารถแก้ไขหลักสูตรได้",
                showConfirmButton: false,
                timer: 1000
            })
        }
    }
    // ลบหลักสูตร
    const deleteCourse = async (id) => {
        const resDelApp = await axios.post(URL_DEL_COURSE, { id: id })
        const resDelTst = await axios.post(URL_DEL_TST, { id: id })
        if (resDelApp.data.code === 200 && resDelTst.data.code === 200) {
            Swal.fire({
                icon: 'success',
                title: "ลบหลักสูตรเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCourses(pageNumber)
            searchCourses()
        } else {
            Swal.fire({
                icon: 'error',
                title: "ไม่สามารถลบหลักสูตรได้",
                showConfirmButton: false,
                timer: 1000
            })
        }
    }
    // ยืนยันลบหลักสูตรหรือไม่
    const showConfirmButton = (id) => {
        Swal.fire({
            icon: 'question',
            title: `ต้องการลบหลักสูตร ${id} หรือไม่`,
            showConfirmButton: true,
            showCancelButton: true,
        }).then((reusult) => {
            if (reusult.isConfirmed) {
                deleteCourse(id)
            }
        })
    }

    // ป๊อปอัพสำหรับแก้ไขหลักสูตร
    const ModelEditCourse = () => {
        let start = data.start
        let end = data.end
        if (start === '-') {
            start = ''
        }
        if (data.end === '-') {
            end = ''
        }
        return (
            <Modal
                show={isPopEdit}
                onHide={() => setIsPopEdit(false)}
                size="lg"
                fullscreen='lg-down'
                scrollable={true}
                centered={true}
                onExited={clearData}
            >
                <Modal.Header>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body className="model-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmitEdit}>
                        <Row>
                            <Form.Group className="mb-3" as={Col} >
                                <Form.Label >รหัสหลักสูตร<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    value={data.id}
                                    required
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col} xs={8}>
                                <Form.Label>ชื่อหลักสูตร<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    required
                                    value={data.name}
                                    onChange={(e) => { setAppellation(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>วัตถุประสงค์ :</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    value={data.aim}
                                    onChange={(e) => { setPurpose(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>รายละเอียด :</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    value={data.des}
                                    onChange={(e) => { setDesciption(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>รหัสผู้สอน :</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    value={data.trainer_id}
                                    onChange={e => showName(e.target.value)}
                                    min='1'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col} xs={7}>
                                <Form.Label>ชื่อผู้สอน :</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    value={data.trainer}
                                    onChange={(e) => { setTrainer(e.target.value) }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>สังกัดผู้สอน :</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    value={data.div}
                                    onChange={(e) => { setOrganize(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>วันที่เริ่ม<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    required
                                    value={start}
                                    onChange={(e) => { setDateBegin(e.target.value) }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>วันที่สิ้นสุด<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    required
                                    value={end}
                                    onChange={(e) => { setDateEnd(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>จำนวนเวลา(ชั่วโมง)<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="number"
                                    size="sm"
                                    required
                                    value={data.hr}
                                    onChange={(e) => { setHour(e.target.value) }}
                                    min='1'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>สถานที่ :</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    value={data.site}
                                    onChange={(e) => { setPlace(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={clearData}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    // ป๊อปอัพสำหรับสร้างหลักสูตร
    const ModelCreateCourse = () => {
        return (
            <Modal
                show={isPopNew}
                onHide={() => setIsPopNew(false)}
                size="lg"
                fullscreen='lg-down'
                scrollable={true}
                centered={true}
                onExited={clearData}
            >
                <Modal.Header >
                    <Modal.Title>Create New Course</Modal.Title>
                </Modal.Header>
                <Modal.Body className="model-body-course">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group className="mb-3" as={Col} controlId="validationFormik01">
                                <Form.Label >รหัสหลักสูตร<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    onChange={(e) => { setCourseID(e.target.value) }}
                                    value={data.id}
                                    required
                                />

                            </Form.Group>
                            <Form.Group className="mb-3" as={Col} xs={8}>
                                <Form.Label>ชื่อหลักสูตร<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    required
                                    onChange={(e) => { setAppellation(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>วัตถุประสงค์ :</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    onChange={(e) => { setPurpose(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>รายละเอียด :</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    onChange={(e) => { setDesciption(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>รหัสผู้สอน :</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    onChange={e => showName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col} xs={6}>
                                <Form.Label>ชื่อผู้สอน :</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    onChange={(e) => { setTrainer(e.target.value) }}
                                    value={data.trainer}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>สังกัดผู้สอน :</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    onChange={(e) => { setOrganize(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>วันที่เริ่ม<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    required
                                    onChange={(e) => { setDateBegin(e.target.value) }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>วันที่สิ้นสุด<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    required
                                    onChange={(e) => { setDateEnd(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>จำนวนเวลา(ชั่วโมง)<span className="red-text">*</span>:</Form.Label>
                                <Form.Control
                                    type="number"
                                    size="sm"
                                    required
                                    onChange={(e) => { setHour(e.target.value) }}
                                    min='1'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>สถานที่ :</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    onChange={(e) => { setPlace(e.target.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={clearData}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    // the item selected
    const handleOnSelect = (item) => {
        setShowCouses([item])
        setPageNumber(0)
        setIsFind(false)
    }


    // เริ่มเตรียมข้อมูลสำหรับใช้ค้นหา
    useEffect(() => {
        searchCourses()
    }, [])

    useEffect(() => {
        axios.get('/read-session')
            .then(res => {
                setLogin(res.data.state)
            }
            )
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (data.trainer_id === '' && (isPopNew || isPopEdit)) {
            setTrainer('');
        }
    }, [data.trainer_id, isPopNew, isPopEdit]);

    return (
        <div>
            <ScrollToTop />
            <div className="wrapp-header">
                <h1 className="head-title">Course Creation</h1>
            </div>
            <ScrollToTop smooth='true' />
            <Container>
                <div className="wrapp-bin-course">
                    <div className='content-bin'>
                        {/* สร้างหลักสูตร */}
                        {login == 'admin' ?
                            <Button className='bin' onClick={() => { setIsPopNew(true) }}>
                                <Icon icon={addIcon} width="30" height="30" />
                                &nbsp;Add New Course
                            </Button>
                            :
                            null
                        }
                    </div>
                    <div className='wrapp-search'>
                        {/* ค้นหาหลักสูตร */}
                        <ReactSearchAutocomplete
                            items={courses}
                            fuseOptions={{ keys: ["id", 'name'] }}
                            onSelect={handleOnSelect}
                            onClear={() => {
                                setIsFind(true)
                                listCourses(pageNumber)
                            }}
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
                <div >
                    <div className="model">
                        {ModelCreateCourse()}
                        {ModelEditCourse()}
                    </div>
                    {/* ตารางแสดงหลักสูตร */}
                    <Table striped bordered hover responsive size='sm'>
                        <thead className='header-table'>
                            <tr>
                                <th>ลำดับ</th>
                                <th>รหัสหลักสูตร</th>
                                <th>ชื่อหลักสูตร</th>
                                <th>ชื่อผู้สอน</th>
                                <th>วันที่</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* ใส่ข้อมูลในตารางแสดงหลักสูตร */}
                            {showCourses && showCourses.map((item, index) => {
                                let date_start = item.start
                                if (date_start !== '-') {
                                    const obj_start = new Date(item.start);
                                    date_start = obj_start.toLocaleDateString('en-GB', { timeZone: 'UTC' })
                                }
                                return (
                                    <tr key={index}>
                                        <td>
                                            {pageNumber * 50 + index + 1}
                                        </td>
                                        <td className="len-id">
                                            {/* ไป detail-course ของหลักสูตร item.id */}
                                            <Link
                                                to={`/detail-course/${item.id}`}
                                                target='_blank'
                                                style={{ textDecoration: 'none' }}
                                            >
                                                {item.id}
                                            </Link>
                                        </td>
                                        <td className="col-left">{item.name}</td>
                                        <td>{item.trainer}</td>
                                        <td>{date_start}</td>
                                        <td>
                                            {/* ปุ่มแก้ไข */}
                                            <Icon icon={editIcon} color="#495867" width="25" height="25" onClick={() => {
                                                setData(item)
                                                setIsPopEdit(true)
                                                if (item.trainer != '') {
                                                    setCheckName(true)
                                                }
                                            }} />
                                        </td>
                                        <td>
                                            {/* ปุ่มลบ */}
                                            <Icon icon={deleteIcon} color="#495867" width="25" height="25" onClick={() => {
                                                showConfirmButton(item.id)
                                            }} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </Container >
            {
                isFind ?
                    <div className="wrapp-paging">
                        {/* ตัวแบ่งหน้า */}
                        < ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={"paginationBttns"}
                            previousLinkClassName={"previousBttn"}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"paginationDisabled"}
                            activeClassName={"paginationActive"}
                        />
                    </div >
                    :
                    <div style={{ marginTop: '200px' }} />
            }
        </div >
    )
}

export default AddCourse;