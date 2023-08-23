import React, { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2'
import axios from "../api/axios";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Container, Table, Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import addIcon from '@iconify/icons-gridicons/add';
import deleteIcon from '@iconify/icons-material-symbols/delete';
import checkOne from '@iconify/icons-icon-park-solid/check-one';
import '../styles/Styles.css'

const URL_COUSES = '/get-all-courses-by-search'
const URL_CANDIDATES = '/get-candidate'
const URL_EMP = '/get-employee'
const URL_ADD_EMP = '/add-employee'
const URL_DEL_CADIDATE = '/delete-cadidate'
const URL_UPATE_CAIDATE = '/update-cadidate'
const URL_DEL_TST = '/delete-transaction-by-course'

// // บันทึกประวัติการเข้าอบรม ฉบับแอดมิน
const AddEmpAdmin = () => {
    const userRef = useRef()
    const [courses, setCouses] = useState([])
    const [course, setCourse] = useState(null)
    const [candidates, setCandidates] = useState(null)
    const [isShow, setIsShow] = useState(false)
    const [isPopNew, setIsPopNew] = useState(false)
    const [isPopEditAll, setIsPopEditAll] = useState(false)
    const [empID, setEmpID] = useState('')
    const [name, setName] = useState('')
    const [select1, setSelect1] = useState('')
    const [select2, setSelect2] = useState('')
    const [remark, setRemark] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [checkList1, setCheckList1] = useState([false, false, false])
    const [checkList2, setCheckList2] = useState([false, false, false, false, false])
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

    const handleSubmit2 = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true & name !== '') {
            editAllEmp()
        }
        setValidated(true);
    };


    // โหลดข้อมูลหลักสูตรทั้งหมด
    const listCouses = async () => {
        const resCourses = await axios.post(URL_COUSES)
        if (resCourses.data.data != null) {
            setCouses(resCourses.data.data)
        }
    }

    // โหลดข้อมูลผู้ที่อบรมในหลักสูตรที่เลือกไว้
    const listCandidate = async (id) => {
        const resCandidate = await axios.post(URL_CANDIDATES, { id: id })
        setCandidates(resCandidate.data.data)
    }

    // แสดงชื่อตามรหัสพนักงาน
    const showName = async (emp_id) => {
        setName('')
        setEmpID(emp_id)
        if (emp_id.length === 6) {
            const resEmp = await axios.post(URL_EMP, { id: emp_id })
            if (resEmp.data.data != null) {
                setName(`${resEmp.data.data.th_name}/ ${resEmp.data.data.eng_name}`)
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
        setName('')
        setSelect1('')
        setSelect2('')
        setRemark('')
        setRemark('')
        setDisabled(false)
        setValidated(false)
        setInValid(null)
        setCheckList1([false, false, false])
        setCheckList2([false, false, false, false, false])
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
        let index = candidates != null ? candidates.findIndex((item) => item.id === empID) : -1

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
                setIsPopNew(false)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "ไม่สามารถบันทึกการเข้าฝึกอบรมได้",
                    showConfirmButton: false,
                    timer: 1000
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
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
            })
        }
        clearData()
    }

    // แก้ไขรายชื่อผู้เข้าอบรม
    const editAllEmp = async () => {
        const data = {
            emp_id: empID,
            course_id: course.id,
            trainer: select2,
            remark: remark
        }

        let index = candidates != null ? candidates.findIndex((item) => item.id === empID) : -1

        if (index !== -1) {
            const resDelCD = await axios.post(URL_UPATE_CAIDATE, data)
            if (resDelCD.data !== null) {
                if (resDelCD.data.code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: "ประเมินการเข้าฝึกอบรมโดยผู้สอนเรียบร้อยแล้ว",
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
                        title: "ไม่สามารถประเมินการเข้าฝึกอบรมโดยผู้สอนได้",
                        showConfirmButton: false,
                        timer: 1000
                    }).then(() => {
                        setTimeout(() => {
                            userRef.current && userRef.current.focus()
                        }, 300)
                    })
                }
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: "พนักงานยังไม่ได้ลงทะเบียน",
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
            })
        }
        clearData()
    }

    // ลบรายชื่อผู้เข้าอบรม
    const delCadidate = async (emp_id) => {
        const data = { emp_id: emp_id, course_id: course.id }
        const resDelCD = await axios.post(URL_DEL_CADIDATE, data)
        if (resDelCD.data != null) {
            if (resDelCD.data.code === 200) {
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

        }
    }

    const delAllCadidate = async () => {
        const resDelTst = await axios.post(URL_DEL_TST, { id: course.id })
        if (resDelTst.data.code === 200) {
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

    }

    // ยืนยันลบผู้อบรมหรือไม่
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



    // ป๊อปอัพสำหรับบันทึกประวัติผู้เข้าอบรม
    const PopUpNewEmp = () => {
        return (
            <Modal
                show={isPopNew}
                onHide={() => setIsPopNew(false)}
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
                            <Form.Group className="mb-3" as={Col} >
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
                            <Form.Group className="mb-3" as={Col} xs={9}>
                                <Form.Label>ชื่อ:</Form.Label>
                                <Form.Text style={{ fontSize: '14px' }}>{name}</Form.Text>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label style={{ marginRight: '10px' }}>ระดับความเข้าใจ (ประเมินตนเอง)*:</Form.Label>
                                <Form.Check
                                    inline
                                    label="มาก"
                                    name="group1"
                                    type="radio"
                                    checked={checkList1[0]}
                                    required
                                    onClick={() => {
                                        setCheckList1([true, false, false])
                                        setSelect1('มาก')
                                    }}
                                    className="check-bin"
                                />
                                <Form.Check
                                    inline
                                    label="กลาง"
                                    name="group1"
                                    type="radio"
                                    checked={checkList1[1]}
                                    required
                                    onClick={() => {
                                        setCheckList1([false, true, false])
                                        setSelect1('กลาง')
                                    }}
                                    className="check-bin"
                                />
                                <Form.Check
                                    inline
                                    label="น้อย"
                                    name="group1"
                                    type="radio"
                                    checked={checkList1[2]}
                                    required
                                    onClick={() => {
                                        setCheckList1([false, false, true])
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
                                    checked={checkList2[0]}
                                    onClick={() => {
                                        setCheckList2([true, false, false, false, false])
                                        setSelect2('A')
                                    }}
                                    className="check-bin"
                                />
                                <Form.Check
                                    inline
                                    label="B"
                                    name="group2"
                                    type="radio"
                                    checked={checkList2[1]}
                                    onClick={() => {
                                        setCheckList2([false, true, false, false, false])
                                        setSelect2('B')
                                    }}
                                    className="check-bin"
                                />
                                <Form.Check
                                    inline
                                    label="C"
                                    name="group2"
                                    type="radio"
                                    checked={checkList2[2]}
                                    onClick={() => {
                                        setCheckList2([false, false, true, false, false])
                                        setSelect2('C')
                                    }}
                                    className="check-bin"
                                />
                                <Form.Check
                                    inline
                                    label="D"
                                    name="group2"
                                    type="radio"
                                    checked={checkList2[3]}
                                    onClick={() => {
                                        setCheckList2([false, false, false, true, false])
                                        setSelect2('D')
                                    }}
                                    className="check-bin"
                                />
                                <Form.Check
                                    inline
                                    label="E"
                                    name="group2"
                                    type="radio"
                                    checked={checkList2[4]}
                                    onClick={() => {
                                        setCheckList2([false, false, false, false, true])
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setIsPopNew(false)
                        clearData()
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const PopUpEditAllEmp = () => {
        return (
            <Modal
                show={isPopEditAll}
                onHide={() => setIsPopEditAll(false)}
                size="lg"
                fullscreen='sm-down'
                scrollable={true}
                centered={true}
            >
                <Modal.Header>
                    <Modal.Title>Edit Trainees</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit2}>
                        <Row>
                            <Form.Group className="mb-3" as={Col} >
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
                            <Form.Group className="mb-3" as={Col} xs={9}>
                                <Form.Label>ชื่อ:</Form.Label>
                                <Form.Text style={{ fontSize: '14px' }}>{name}</Form.Text>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label style={{ marginRight: '10px' }}>ผลการประเมินโดยผู้สอน*:</Form.Label>
                                <Form.Check
                                    inline
                                    label="A"
                                    name="group2"
                                    type="radio"
                                    required
                                    checked={checkList2[0]}
                                    onClick={() => {
                                        setCheckList2([true, false, false, false, false])
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
                                    checked={checkList2[1]}
                                    onClick={() => {
                                        setCheckList2([false, true, false, false, false])
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
                                    checked={checkList2[2]}
                                    onClick={() => {
                                        setCheckList2([false, false, true, false, false])
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
                                    checked={checkList2[3]}
                                    onClick={() => {
                                        setCheckList2([false, false, false, true, false])
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
                                    checked={checkList2[4]}
                                    onClick={() => {
                                        setCheckList2([false, false, false, false, true])
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setIsPopEditAll(false)
                        clearData()
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal >
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

    useEffect(() => {
        userRef.current && userRef.current.focus()
    }, [isPopNew, isPopEditAll])



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
                    <div >
                        <div className='description-box' style={{ marginBottom: '20px' }}>
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
                            <Button className='bin' onClick={() => { setIsPopEditAll(true) }}>
                                <Icon icon={checkOne} width="30" height="30" />
                                &nbsp;Evaluate Trainee
                            </Button>
                        </div>
                        <div className="model">
                            {/* แสดงป๊อปอัพ */}
                            {PopUpNewEmp()}
                            {PopUpEditAllEmp()}
                        </div>
                        <div style={{ color: '#6289b5' }}>
                            all candidates : {candidates != null ? candidates.length : null}
                        </div>
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