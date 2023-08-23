import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Table, Row, Col } from 'react-bootstrap';
import axios from '../api/axios';
import '../styles/ReportEmp.css'
import '../styles/Styles.css'

const URL_EMP = '/get-employee'
const URL_COURSE = '/get-all-my-course'

const ReportEmp = () => {
    const { id } = useParams()
    const [emp, setEmp] = useState(null)
    const [myTrain, setMyTrain] = useState(null)

    const dataEmp = async () => {
        const resEmp = await axios.post(URL_EMP, { id: id })
        const resCourse = await axios.post(URL_COURSE, { id: id })
        if (resEmp.data.data != null) {
            setEmp(resEmp.data.data)
        }
        if (resCourse.data.data != null) {
            setMyTrain(resCourse.data.data)
        }
    }

    useEffect(() => {
        dataEmp()
    })

    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 500)
    }, [])


    return (
        <div className='wrapp-form003'>
            <div className='header-form003'>FO-ADX-003</div>
            <div className='section-head'>
                <h5 className="text-head">บริษัท เอเชียน สแตนเลย์ อินเตอร์เนชั่นแนล จำกัด <br />
                    แบบฟอร์มบันทึกประวัติการฝึกอบรมของพนักงาน<br />
                    TRAINING EXPERIENCE RECORD FOR EMPLOYEE
                </h5>
                <br />
                {emp ?
                    <Container fluid='xl' >
                        <Form.Group as={Row}>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>ชื่อ - สกุล</Form.Label>
                            </Col>
                            <Col xs='4'>
                                <Form.Text className='line-dash'>{emp.eng_name}</Form.Text>
                            </Col>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>วัน/เดือน/ปีเกิด</Form.Label>
                            </Col>
                            <Col xs='3'>
                                <Form.Text className='line-dash'>{emp.birth}</Form.Text>
                            </Col>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>อายุ</Form.Label>
                            </Col>
                            <Col xs='1'>
                                <Form.Text className='line-dash'>{emp.year}</Form.Text>
                            </Col>
                            <Col xs='auto'>
                                <Form.Text className='text-bold'>ปี</Form.Text>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>ระดับการศึกษา</Form.Label>
                            </Col>
                            <Col xs='4'>
                                <Form.Text className='line-dash'>{emp.degree}</Form.Text>
                            </Col>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>วันที่เริ่มงาน</Form.Label>
                            </Col>
                            <Col xs='2'>
                                <Form.Text className='line-dash'>{emp.join}</Form.Text>
                            </Col>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>รหัสพนักงาน</Form.Label>
                            </Col>
                            <Col xs='2'>
                                <Form.Text className='line-dash'>{emp.id}</Form.Text>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>แผนก</Form.Label>
                            </Col>
                            <Col xs='4'>
                                <Form.Text className='line-dash'>{emp.dep}</Form.Text>
                            </Col>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>ฝ่าย</Form.Label>
                            </Col>
                            <Col xs='2'>
                                <Form.Text className='line-dash'>{emp.div}</Form.Text>
                            </Col>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>ลำดับชั้น</Form.Label>
                            </Col>
                            <Col xs='2'>
                                <Form.Text className='line-dash'>{emp.cate}</Form.Text>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col xs='auto'>
                                <Form.Label className='text-bold'>ตำแหน่ง</Form.Label>
                            </Col>
                            <Col xs='3'>
                                <Form.Text className='line-dash'>{emp.pos}</Form.Text>
                            </Col>
                        </Form.Group>
                    </Container>
                    : null}
            </div>
            <h5  >
                ประวัติการฝึกอบรมภายในและภายนอกบริษัทฯ
            </h5>
            <Table bordered size='sm' className='table-report-emp'>
                <thead>
                    <tr >
                        <th rowSpan="2" >ลำดับ</th>
                        <th rowSpan="2" >วัน/เดือน/ปี</th>
                        <th rowSpan="2" >หัวข้อ/เรื่องหลักสูตร</th>
                        <th colSpan="2" >ระยะเวลา</th>
                        <th rowSpan="2" >สถานที่จัดฝึกอบรม</th>
                    </tr>
                    <tr>
                        <th >วัน</th>
                        <th >ชั่วโมง</th>
                    </tr>
                </thead>
                <tbody>
                    {myTrain && myTrain.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td >{index + 1}</td>
                                <td >{item.date}</td>
                                <td className='col-left' >{item.name}</td>
                                <td >-</td>
                                <td >{item.hr}</td>
                                <td >{item.place}</td>
                            </tr>
                        )
                    })
                    }
                </tbody>
            </Table >
            <div className='footer-text'>
                A-3:ASI.08.07.28
            </div>
        </div >
    )
}

export default ReportEmp;