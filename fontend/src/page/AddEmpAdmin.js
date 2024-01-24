import React, { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2'
import axios from "../api/axios";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Container, Table, Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import ScrollToTop from '../component/ScrollToTop'
import addIcon from '@iconify/icons-gridicons/add';
import deleteIcon from '@iconify/icons-material-symbols/delete';
import checkOne from '@iconify/icons-icon-park-solid/check-one';
import '../styles/Styles.css'

const URL_COUSES = '/get-all-courses-by-search' //api ค้นหาหลักสูตร
const URL_CANDIDATES = '/get-candidate' // api ผู้อบรมในหลักสูตร
const URL_ALL_EMP = '/get-all-employee' // api รหัสและชื่อพนักงานทั้งหมด
const URL_ADD_EMP = '/add-employee' // api เพิ่มผู้อบรมลงหลักสูตร
const URL_DEL_CADIDATE = '/delete-cadidate' // api ลบผู้ฝึกอบรม
const URL_UPATE_CAIDATE = '/update-cadidate' // api ประเมินผู้อบรม
const URL_DEL_TST = '/delete-transaction-by-course' // api ลบพนักงานอยู่ในหลักสูตรทั้งหมด

// บันทึกประวัติการเข้าอบรม ฉบับแอดมิน
const AddEmpAdmin = () => {
    const userRef = useRef()
    const [courses, setCouses] = useState([]) //หลักสูตรทั้งหมด
    const [employees, setEmployees] = useState([])
    const [course, setCourse] = useState(null) //หลักสูตรที่ต้องการบันทึกประวัติการเข้าอบรม
    const [candidates, setCandidates] = useState(null) // ผู้อบรมที่บันทึกประวัติใน course แล้ว
    const [isShow, setIsShow] = useState(false) // สถานะว่าจะให้แสดงรายละเอียดหลักสูตรไหม
    const [isPopNew, setIsPopNew] = useState(false) // สถานะว่าจะให้โมเดลบันทึกผู้อบรมแสดงไหม
    const [isPopEditAll, setIsPopEditAll] = useState(false) // สถานะว่าจะให้โมเดลประเมินผู้อบรมแสดงไหม
    const [empID, setEmpID] = useState('') // รหัสพนักงาน
    const [name, setName] = useState('') // ชื่อพนักงาน
    const [select1, setSelect1] = useState('มาก') // สถานะความเข้าใจของผู้อบรม
    const [select2, setSelect2] = useState('') // สถานะความเข้าใจของผู้สอน
    const [remark, setRemark] = useState('') // หมายเหตุ


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
        setName('')
        setSelect1('มาก')
        setSelect2('')
        setRemark('')
    }

    // component แจ้งเตือนเมื่อ save
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
            trainee: select1,
            trainer: select2,
            remark: remark
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
    // ประเมินผู้เข้าอบรม
    const editAllEmp = async () => {
        const data = {
            emp_id: empID,
            course_id: course.id,
            trainer: select2,
            remark: remark
        }

        const index = candidates != null ? candidates.findIndex((item) => item.id === empID) : -1

        if (index !== -1) {
            await axios.post(URL_UPATE_CAIDATE, data).then((res) => {
                if (res.data.code === 200) {
                    Alert('success', 'ประเมินการเข้าฝึกอบรมโดยผู้สอนเรียบร้อยแล้ว', '#2eb82e')
                    listCandidate(course.id)
                } else {
                    Alert('error', 'ประเมินกาไม่สามารถประเมินการเข้าฝึกอบรมโดยผู้สอนได้รเข้าฝึกอบรมโดยผู้สอนเรียบร้อยแล้ว', '#cc0000')
                }
            })
        } else {
            Alert('warning', 'พนักงานยังไม่ได้ลงทะเบียน', '#ff8c1a')
        }
    }
    // ลบผู้เข้าอบรม
    const delCadidate = async (emp_id) => {
        const data = { emp_id: emp_id, course_id: course.id }
        await axios.post(URL_DEL_CADIDATE, data).then((res) => {
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: "ลบการเข้าฝึกอบรม",
                    showConfirmButton: false,
                    timer: 1000
                })
                listCandidate(course.id)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "ไม่สามารถลบการเข้าฝึกอบรมได้",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        })
    }
    // ยืนยันลบผู้อบรม
    const showConfirmButton = (emp_id) => {
        Swal.fire({
            icon: 'question',
            title: `ต้องการลบผู้อบรม ${emp_id} หรือไม่`,
            showConfirmButton: true,
            showCancelButton: true,
        }).then((reusult) => {
            if (reusult.isConfirmed) {
                delCadidate(emp_id)
            }
        })
    }
    // ลบผู้อบรมทั้งหมด
    const delAllCadidate = async () => {
        await axios.post(URL_DEL_TST, { id: course.id }).then((res) => {
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: "ลบผู้อบรมทั้งหมดเรียบร้อยแล้ว",
                    showConfirmButton: false,
                    timer: 1000
                })
                listCandidate(course.id)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "ไม่สามารถลบผู้อบรมทั้งหมดได้",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        })
    }
    // ยืนยันลบผู้อบรมทั้งหมด
    const showConfirmButton2 = () => {
        Swal.fire({
            icon: 'question',
            title: "ต้องการลบผู้อบรมทั้งหมดหรือไม่",
            showConfirmButton: true,
            showCancelButton: true,
        }).then((reusult) => {
            if (reusult.isConfirmed) {
                delAllCadidate()
            }
        })
    }

    // โมเดลบันทึกประวัติผู้เข้าอบรม
    const ModelNewEmp = () => {
        return (
            <Modal
                show={isPopNew}
                onHide={() => setIsPopNew(false)}
                size="lg"
                fullscreen='sm-down'
                scrollable={true}
                centered={true}
            >
                <Container>
                    <Modal.Header >
                        <Modal.Title>Add New Trainee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Form.Group className="mb-3" as={Col} >
                                    <Form.Label >รหัสพนักงาน<span className="red-text">*</span>:</Form.Label>
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
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} xs={9}>
                                    <Form.Label>ชื่อ:</Form.Label>
                                    <Form.Text style={{ fontSize: '14px' }}>{name}</Form.Text>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col}>
                                    <Form.Label style={{ marginRight: '10px' }}>ระดับความเข้าใจ (ประเมินตนเอง)<span className="red-text">*</span>:</Form.Label>
                                    <Form.Check
                                        inline
                                        label="มาก"
                                        name="group1"
                                        type="radio"
                                        defaultChecked='true'
                                        required
                                        onClick={() => {
                                            setSelect1('มาก')
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
                                            setSelect1('กลาง')
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
                                            setSelect1('น้อย')
                                        }}
                                        className="check-bin"
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col}>
                                    <Form.Label style={{ marginRight: '10px' }}>ผลการประเมินโดยผู้สอน :</Form.Label>
                                    <Form.Check
                                        inline
                                        label="A"
                                        name="group2"
                                        type="radio"
                                        onClick={() => {
                                            setSelect2('A')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="B"
                                        name="group2"
                                        type="radio"
                                        onClick={() => {
                                            setSelect2('B')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="C"
                                        name="group2"
                                        type="radio"
                                        onClick={() => {
                                            setSelect2('C')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="D"
                                        name="group2"
                                        type="radio"
                                        onClick={() => {
                                            setSelect2('D')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="E"
                                        name="group2"
                                        type="radio"
                                        onClick={() => {
                                            setSelect2('E')
                                        }}
                                        className="check-bin"
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} >
                                    <Form.Label >หมายเหตุ :</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="XXXXXX"
                                        size="sm"
                                        value={remark}
                                        onChange={e => setRemark(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Modal.Body >
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setIsPopNew(false)
                            clearData()
                        }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Container>
            </Modal >
        )
    }
    // โมเดลประเมินผู้อบรมโดยผู้สอน
    const ModelEditAllEmp = () => {
        return (
            <Modal
                show={isPopEditAll}
                onHide={() => setIsPopEditAll(false)}
                size="lg"
                fullscreen='sm-down'
                scrollable={true}
                centered={true}
            >
                <Container>
                    <Modal.Header>
                        <Modal.Title>Edit Trainees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit2}>
                            <Row>
                                <Form.Group className="mb-3" as={Col} >
                                    <Form.Label >รหัสพนักงาน<span className="red-text">*</span>:</Form.Label>
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
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} xs={9}>
                                    <Form.Label>ชื่อ:</Form.Label>
                                    <Form.Text style={{ fontSize: '14px' }}>{name}</Form.Text>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col}>
                                    <Form.Label style={{ marginRight: '10px' }}>ผลการประเมินโดยผู้สอน<span className="red-text">*</span>:</Form.Label>
                                    <Form.Check
                                        inline
                                        label="A"
                                        name="group2"
                                        type="radio"
                                        required
                                        defaultChecked='true'
                                        onClick={() => {
                                            setSelect2('A')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="B"
                                        name="group2"
                                        type="radio"
                                        required
                                        onClick={() => {
                                            setSelect2('B')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="C"
                                        name="group2"
                                        type="radio"
                                        required
                                        onClick={() => {
                                            setSelect2('C')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="D"
                                        name="group2"
                                        type="radio"
                                        required
                                        onClick={() => {
                                            setSelect2('D')
                                        }}
                                        className="check-bin"
                                    />
                                    <Form.Check
                                        inline
                                        label="E"
                                        name="group2"
                                        type="radio"
                                        required
                                        onClick={() => {
                                            setSelect2('E')
                                        }}
                                        className="check-bin"
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} >
                                    <Form.Label >หมายเหตุ :</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="XXXXXX"
                                        size="sm"
                                        value={remark}
                                        onChange={e => setRemark(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Modal.Body >
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setIsPopEditAll(false)
                            clearData()
                        }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Container>
            </Modal >
        )
    }

    //เลือกหลักสูตรที่ต้องการ
    const handleOnSelect = (item) => {
        setCourse(item)
        listCandidate(item.id)
        setIsShow(true)
    }
    // ตรวจสอบความครบถ้วนแล้ว save ของบันทึกผู้อบรม
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if ((form.checkValidity() === true) & (name !== '')) {
            addNewEmp()
        } else {
            Alert('warning', 'รหัสผ่านไม่ถูกต้อง', '#ff8c1a')
        }
    };
    // ตรวจสอบความครบถ้วนแล้ว save ของประเมินผู้อบรม
    const handleSubmit2 = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true & name !== '') {
            editAllEmp()
        } else {
            Alert('warning', 'รหัสผ่านไม่ถูกต้อง', '#ff8c1a')
        }
    };

    // เริ่มต้นโหลดข้อมูล
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
                    // แสดงข้อมูลหลักสูตรและผู้บันทึกอบรมไปแล้ว
                    <div >
                        <div className='wrapp-descript' style={{ marginBottom: '20px' }}>
                            <div ><label>รหัสหลักสูตร : &nbsp;<b style={{ color: '#6289b5' }}>{course && course.id}</b></label></div>
                            <div className="margin-between-detail" />
                            <div ><label>ชื่อหลักสูตร : &nbsp;<b style={{ color: '#6289b5' }}>{course && course.name}</b></label></div>
                        </div>
                        <div className='content-bin-addEmp'>
                            {/* ปุ่มบันทึกประวัติผู้อบรม */}
                            <Button className='bin' onClick={() => { setIsPopNew(true) }}>
                                <Icon icon={addIcon} width="30" height="30" />
                                &nbsp;Add New Trainee
                            </Button>
                            <div style={{ margin: '10px' }} />
                            {/* ประเมินผู้อบรม */}
                            <Button className='bin' onClick={() => { setIsPopEditAll(true) }}>
                                <Icon icon={checkOne} width="30" height="30" />
                                &nbsp;Evaluate Trainee
                            </Button>
                        </div>
                        <div className="model">
                            {/* แสดงโมเดล */}
                            {ModelNewEmp()}
                            {ModelEditAllEmp()}
                        </div>
                        <div style={{ color: '#6289b5' }}>
                            {/* แสดงจำนวนผู้อบรมทั้งหมด */}
                            all candidates : {candidates != null ? candidates.length : 0}
                        </div>
                        {/* ตารางแสดงผู้อบรมที่บันทึกแล้ว */}
                        <Table striped bordered hover responsive size='sm'>
                            <thead className='header-table'>
                                <tr>
                                    <th rowSpan="2">ลำดับ</th>
                                    <th rowSpan="2">รหัสพนักงาน</th>
                                    <th rowSpan="2" >ชื่อ-สกุล</th>
                                    <th colSpan="2">ประเมิน</th>
                                    <th rowSpan="2">วันที่</th>
                                    <th rowSpan="2">หมายเหตุ</th>
                                    <th rowSpan="2">
                                        <Icon icon={deleteIcon} color="#495867" width="25" height="25" onClick={showConfirmButton2} />
                                    </th>
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
                                            <td>
                                                <Icon icon={deleteIcon} color="#495867" width="25" height="25" onClick={() => showConfirmButton(item.id)} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                    : null}
            </Container>
        </div>
    )
}

export default AddEmpAdmin;