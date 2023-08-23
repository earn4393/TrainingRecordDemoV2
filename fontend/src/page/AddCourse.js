import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Container, Table, Button, Modal, Form, Col, Row } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import { Icon } from '@iconify/react';
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
const URL_COUNT_ROW = '/count-courses'
const URL_COURSES_PER_PAGE = '/get-all-courses-per-page'

// แสดง เพิ่ม แก้ไข และลบหลักสูตร
const AddCourse = () => {
    const [validated, setValidated] = useState(false);
    const [courses, setCouses] = useState([]) // หลักสูตรทั้งหมด
    const [showCourses, setShowCouses] = useState(null) //หลักสูตรในแต่ละหน้า
    const [isPopEdit, setIsPopEdit] = useState(false) //สถานะป๊อปอัพสำหรับ
    const [isPopNew, setIsPopNew] = useState(false) //
    const [pageCount, setPageCount] = useState(0) //
    const [pageNumber, setPageNumber] = useState(0) //
    const [isFind, setIsFind] = useState(true)
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
    }) //


    const setCourseID = (input) => setData(previousState => { return { ...previousState, id: input.toUpperCase() } })
    const setTrainerID = (input) => setData(previousState => { return { ...previousState, trainer_id: input } })
    const setAppellation = (input) => setData(previousState => { return { ...previousState, name: input } })
    const setPurpose = (input) => setData(previousState => { return { ...previousState, aim: input } })
    const setDesciption = (input) => setData(previousState => { return { ...previousState, des: input } })
    const setDateBegin = (input) => setData(previousState => { return { ...previousState, start: input } })
    const setDateEnd = (input) => setData(previousState => { return { ...previousState, end: input } })
    const setHour = (input) => setData(previousState => { return { ...previousState, hr: input } })
    const setTrainer = (input) => setData(previousState => { return { ...previousState, trainer: input } })
    const setOrganize = (input) => setData(previousState => { return { ...previousState, div: input } })
    const setPlace = (input) => setData(previousState => { return { ...previousState, site: input } })

    // เปลี่ยนหน้า
    const changePage = ({ selected }) => {
        setPageNumber(selected);
        listCourses()
    }

    const countRow = async () => {
        const res = await axios.post(URL_COUNT_ROW)
        if (res.data.count != null) {
            setPageCount(Math.ceil(res.data.count / 50))
            listCourses()
        }
    }

    // โหลดข้อมูลหลักสูตรทั้งหมด
    const listCourses = async () => {
        const res = await axios.post(URL_COURSES_PER_PAGE, { start: pageNumber * 50 })
        if (res.data.data !== null) {
            setShowCouses(res.data.data)
        }
    }

    const searchCourses = async () => {
        const res = await axios.post(URL_COUSES)
        if (res.data.data !== null) {
            setCouses(res.data.data)
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
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            addCourse()
        }
        setValidated(true);
    };

    const handleSubmitEdit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            editCourse()
        }
        setValidated(true);
    };


    // สร้างหลักสูตร
    const addCourse = async () => {
        const resAddC = await axios.post(URL_ADD_COURSE, data)
        if (resAddC.data.code === 200) {
            Swal.fire({
                icon: 'success',
                title: "บันทึกหลักสูตรเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCourses()
            clearData()
        } else {
            Swal.fire({
                icon: 'error',
                title: "ไม่สามารถบันทึกหลักสูตรได้",
                showConfirmButton: false,
                timer: 1000
            })
        }
    }

    // แก้ไขหลักสูตร
    const editCourse = async () => {
        const resEditC = await axios.post(URL_EDIT_COURSE, data)
        if (resEditC.data.code === 200) {
            Swal.fire({
                icon: 'success',
                title: "แก้ไขหลักสูตรเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCourses()
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
        const resDelC = await axios.post(URL_DEL_COURSE, { id: id })
        const resDelTst = await axios.post(URL_DEL_TST, { id: id })
        if (resDelC.data.code === 200 && resDelTst.data.code === 200) {
            Swal.fire({
                icon: 'success',
                title: "ลบหลักสูตรเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCourses()
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
            title: "ต้องการลบหลักสูตรหรือไม่",
            showConfirmButton: true,
            showCancelButton: true,
        }).then((reusult) => {
            if (reusult.isConfirmed) {
                deleteCourse(id)
            }
        })
    }



    // ป๊อปอัพสำหรับแก้ไขหลักสูตร
    const modelEditCourse = () => {
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
            >
                <Modal.Header>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body className="model-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmitEdit}>
                        <Row>
                            <Form.Group className="mb-3" as={Col} >
                                <Form.Label >รหัสหลักสูตร*:</Form.Label>
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
                                <Form.Label>ชื่อหลักสูตร*:</Form.Label>
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
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    value={data.trainer_id}
                                    onChange={(e) => { setTrainerID(e.target.value) }}
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
                                <Form.Label>วันที่เริ่ม*:</Form.Label>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    required
                                    value={start}
                                    onChange={(e) => { setDateBegin(e.target.value) }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>วันที่สิ้นสุด*:</Form.Label>
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
                                <Form.Label>จำนวนเวลา(ชั่วโมง)*:</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    required
                                    value={data.hr}
                                    onChange={(e) => { setHour(e.target.value) }}
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
    const modelCreateCourse = () => {
        return (
            <Modal
                show={isPopNew}
                onHide={() => setIsPopNew(false)}
                size="lg"
                fullscreen='lg-down'
                scrollable={true}
                centered={true}
            >
                <Modal.Header >
                    <Modal.Title>Create New Course</Modal.Title>
                </Modal.Header>
                <Modal.Body className="model-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group className="mb-3" as={Col} >
                                <Form.Label >รหัสหลักสูตร*:</Form.Label>
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
                                <Form.Label>ชื่อหลักสูตร*:</Form.Label>
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
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    onChange={(e) => { setTrainerID(e.target.value) }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col} xs={6}>
                                <Form.Label>ชื่อผู้สอน :</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="XXXXXX"
                                    size="sm"
                                    onChange={(e) => { setTrainer(e.target.value) }}
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
                                <Form.Label>วันที่เริ่ม*:</Form.Label>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    required
                                    onChange={(e) => { setDateBegin(e.target.value) }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>วันที่สิ้นสุด*:</Form.Label>
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
                                <Form.Label>จำนวนเวลา(ชั่วโมง)*:</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    required
                                    onChange={(e) => { setHour(e.target.value) }}
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
        setIsFind(false)
    }



    useEffect(() => {
        countRow()
    }, [])

    useEffect(() => {
        searchCourses()
    }, [])

    return (
        <div className="dashboard-container">
            <div className="wrapp-header">
                <h1 className="head-title">Register Courses</h1>
            </div>
            <Container>
                <div className="wrapp-bin">
                    <div className='content-bin'>
                        <Button className='bin' onClick={() => { setIsPopNew(true) }}>
                            <Icon icon={addIcon} width="30" height="30" />
                            &nbsp;Add New Course
                        </Button>
                    </div>
                    <div className='wrapp-search'>
                        <ReactSearchAutocomplete
                            items={courses}
                            fuseOptions={{ keys: ["id"] }}
                            onSelect={handleOnSelect}
                            onClear={() => {
                                setIsFind(true)
                                countRow()
                            }}
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
                <div className='WrapperEnd'>
                    <div className="model">
                        {modelCreateCourse()}
                        {modelEditCourse()}
                    </div>
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
                                        <td>
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
                                            <Icon icon={editIcon} color="#495867" width="25" height="25" onClick={() => {
                                                setData(item)
                                                setIsPopEdit(true)
                                            }} />
                                        </td>
                                        <td>
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
            </Container>
            {isFind ?
                <div className="wrapp-paging">
                    {/* ตัวแบ่งหน้า */}
                    <ReactPaginate
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
                </div>
                :
                <div style={{ marginTop: '200px' }} />
            }
        </div >
    )
}

export default AddCourse;