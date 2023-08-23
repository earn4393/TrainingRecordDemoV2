import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import printIcon from '@iconify/icons-material-symbols/print';
import { useReactToPrint } from 'react-to-print';
import axios from '../api/axios';
import '../styles/ReportCourse.css'
import '../styles/Styles.css'

const URL_COURSE = '/get-course'
const URL_TRAINEE = '/get-candidate'
const URL_TRAINER = '/get-employee'

const ReportCourse = () => {
    const { id } = useParams()
    const [course, setCourse] = useState([])
    const [candidates, setCandidates] = useState([])
    const [trainer, setTrainer] = useState([])
    const componentRef = useRef()


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'report-course',
    })


    const dataCourse = async () => {
        const resTrainee = await axios.post(URL_TRAINEE, { id: id })
        const resCourse = await axios.post(URL_COURSE, { id: id })

        if (resTrainee.data.data != null) {
            let data = resTrainee.data.data
            data.map((item) => {
                item.pos = item.pos.slice(item.pos.indexOf('(') + 1, item.pos.length - 1)
            })
            setCandidates(data)
        }
        if (resCourse.data.data != null) {
            const trainer_id = resCourse.data.data.trainer_id
            setCourse(resCourse.data.data)
            dataTrainer(trainer_id)
        }
    }

    const dataTrainer = async (id) => {
        const resTrainer = await axios.post(URL_TRAINER, { id: id })
        if (resTrainer.data.data != null) {
            const data = resTrainer.data.data
            setTrainer(data)
        }
    }


    useEffect(() => {
        dataCourse()
    }, [])


    return (
        <div>
            <div className="wrapp-print-bin">
                <h5 style={{ color: 'red' }}>**กรุณาติ๊กเครื่องหมายถูกใน checkbox ก่อนปริ้น</h5>
                <Button className='bin' onClick={handlePrint}>
                    <Icon icon={printIcon} width="30" height="30" />
                    &nbsp;Print
                </Button>
            </div>

            <Container fluid='xl' className="warapp-report-course" ref={componentRef}>
                <div>
                    <h6 className="header-train">
                        บันทึกการฝึกอบรม <br /> Training
                        record
                    </h6>
                    <div className="refNo">
                        <div>Ref No. :</div>
                        <div className='line-dash'></div>
                    </div>
                </div>
                {course ?
                    <Container fluid='xxl'>
                        <Form.Group className="md-5" as={Row}>
                            <Form.Label className='text-bold' as={Col} xs='auto'>เรื่องที่อบรม (Training item)</Form.Label>
                            <Form.Text className='line-dash' as={Col}>{course.name}</Form.Text>
                        </Form.Group>
                        <Form.Group id="text-checkboxes" className="md-5" as={Row}>
                            <Form.Check
                                inline
                                label="ISO 9001 (Concern with)"
                                name="group1"
                                type="checkbox"
                            />
                            <Form.Check
                                inline
                                label="เกี่ยวข้องกับ IATF 16949 (Concern with)"
                                name="group1"
                                type="checkbox"
                            />
                            <Form.Check
                                inline
                                label="เกี่ยวข้องกับ ISO 14001 (Concern with)"
                                name="group1"
                                type="checkbox"
                            />
                            <Form.Check
                                inline
                                label="เกี่ยวข้องกับ ISO 45001 (Concern with)"
                                name="group1"
                                type="checkbox"
                            />
                            <Form.Check
                                inline
                                label="อื่นๆ (Other)"
                                name="group1"
                                type="checkbox"
                            />
                            <Form.Text className='line-dash' as={Col} xs='2'></Form.Text>
                        </Form.Group>
                        <Form.Group className="md-5" as={Row}>
                            <Form.Label className='text-bold' as={Col} xs='auto'>จุดมุ่งหมาย (Training purpose)</Form.Label>
                            <Form.Text className='line-dash' as={Col}>{course.aim}</Form.Text>
                        </Form.Group>
                        <Form.Group className="md-5" as={Row}>
                            <Form.Label className='text-bold' as={Col} xs='auto'>ผู้ฝึกอบรม (Trainer) :</Form.Label>
                            <Form.Check
                                inline
                                label="Internal Trainer (ผู้สอนภายใน)"
                                name="group2"
                                type="checkbox"
                            />
                            <Form.Check
                                inline
                                label="External Trainer (ผู้สอนจากภานนอก)"
                                name="group2"
                                type="checkbox"
                            />
                        </Form.Group>
                        <Form.Group className="md-5" as={Row}>
                            <Form.Label className='text-bold' as={Col} xs='auto'>ชื่อผู้ฝึกอบรม (Name) :</Form.Label>
                            <Form.Text className='line-dash' as={Col} xs='2'>{course.trainer}</Form.Text>

                            <Form.Label className='text-bold' as={Col} xs='auto'>แผนก (Section) :</Form.Label>
                            <Form.Text className='line-dash' style={{ fontSize: '10px' }} as={Col}>{trainer.dep != null ? trainer.dep : '-'}</Form.Text>

                            <Form.Label className='text-bold' as={Col} xs='auto'>ฝ่าย (Department) :</Form.Label>
                            <Form.Text className='line-dash' style={{ fontSize: '10px' }} as={Col}>{trainer.div != null ? trainer.div : '-'}</Form.Text>
                        </Form.Group>
                        <Form.Group className="md-5" as={Row}>
                            <Col xs='4' />
                            <Form.Label className='text-bold' as={Col} xs='auto'>ตำแหน่ง (Position) :</Form.Label>
                            <Form.Text className='line-dash' style={{ fontSize: '10px' }} as={Col}>{trainer.pos != null ? trainer.pos : '-'}</Form.Text>

                            <Form.Label className='text-bold' as={Col} xs='auto'>ลำดับขั้น (Qualification) :</Form.Label>
                            <Form.Text className='line-dash' style={{ fontSize: '10px' }} as={Col}>{trainer.cate != null ? trainer.cate : '-'}</Form.Text>
                        </Form.Group>
                        <Form.Group className="md-5" as={Row}>
                            <Form.Label className='text-bold' as={Col} xs='auto'>รายละเอียดการฝึกอบรม (Training description) :</Form.Label>
                            <Form.Text className='line-dash' style={{ fontSize: '10px' }} as={Col}>{course.des != null ? course.des : '-'}</Form.Text>
                        </Form.Group>
                        <Form.Group className="md-5" as={Row}>
                            <Form.Label className='text-bold' as={Col} xs='auto'>ผู้ฝึกอบรม (Trainer) :</Form.Label>
                            <Form.Group as={Col} xs='auto'>
                                <Form.Check
                                    label=" ผลงาน/การปฎิบัติงาน (performance)"
                                    name="group3"
                                    type="checkbox"
                                />
                                <Form.Check
                                    label="External Trainer (ผู้สอนจากภานนอก)"
                                    name="group3"
                                    type="checkbox"
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Group as={Row}>
                                    <Form.Label className='text-bold' as={Col} xs='auto'>(กรณี OJT) </Form.Label>
                                    <Form.Text className='line-dash' as={Col}></Form.Text>
                                </Form.Group>
                                <div style={{ margin: '10px' }} />
                                <Form.Group as={Row}>
                                    <Form.Label className='text-bold' as={Col} xs='auto'>(กรณีอื่นๆ หรือ OJT) </Form.Label>
                                    <Form.Text className='line-dash' as={Col}></Form.Text>
                                </Form.Group>
                            </Form.Group>
                        </Form.Group>
                        <Form.Group className="md-5" as={Row}>
                            <Form.Label className='text-bold' as={Col} xs='auto'>วันที่ฝึกอบรม (Training date) :</Form.Label>
                            <Form.Text className='line-dash' as={Col}>{course.start} - {course.end}</Form.Text>

                            <Form.Label className='text-bold' as={Col} xs='auto'>ผู้ฝึกอบรมใช้เวลาในการฝึกอบรม (Period of time training) </Form.Label>

                            <Form.Text className='line-dash' as={Col} xs='auto'>-</Form.Text>
                            <Form.Label className='text-bold' as={Col} xs='auto'>วัน (day) </Form.Label>

                            <Form.Text className='line-dash' as={Col} xs='auto'>{course.hr}</Form.Text>
                            <Form.Label className='text-bold' as={Col} xs='auto'>ชั่วโมง (Hr)</Form.Label>

                        </Form.Group>
                        <Form.Group className="md-5" as={Row}>

                            <Col xs='9' />

                            <Form.Text className='line-dash' as={Col} xs='auto'>-</Form.Text>
                            <Form.Label className='text-bold' as={Col} xs='auto'>นาที (min)</Form.Label>
                        </Form.Group>
                    </Container>
                    : null}
                <div>
                    <div>ผู้รับการฝึกอบรม (Trainee)</div>
                </div>
                <div className="wrapp-table">
                    <Table bordered size='sm'>
                        <thead>
                            <tr>
                                <th rowSpan="2">ลำดับที่ No</th>
                                <th rowSpan="2">รหัส (CODE)</th>
                                <th rowSpan="2">ชื่อ-นามสกุล (Name-Surname)</th>
                                <th rowSpan="2">แผนก (Section)</th>
                                <th rowSpan="2">ตำแหน่ง (Position)</th>
                                <th rowSpan="2">ลายเซ็นต์ (Sign)</th>
                                <th colSpan="3">ระดับความเข้าใจ (ประเมินตนเอง)</th>
                                <th colSpan="2">ผลการประเมินโดยผู้สอน</th>
                                <th rowSpan="2">หมายเหตุ (Remark)</th>
                            </tr>
                            <tr>
                                <th>ไม่เข้าใจ</th>
                                <th>เข้าใจปานกลาง</th>
                                <th>เข้าใจ</th>
                                <th>ระดับความเข้าใจ (Grade)</th>
                                <th>คะแนนที่ได้ (Score)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates && candidates.map((item, index) => {
                                let sign = item.th_name.split(' ')
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.id}</td>
                                        <td className="col-left">{item.th_name}</td>
                                        <td style={{ width: '100px', fontSize: '8px' }}>{item.dep}</td>
                                        <td>{item.pos}</td>
                                        <td>{sign[0]}</td>
                                        {item.trainee === 'น้อย' ? <td> &#10004;</td> : <td></td>}
                                        {item.trainee === 'กลาง' ? <td> &#10004;</td> : <td></td>}
                                        {item.trainee === 'มาก' ? <td> &#10004;</td> : <td> &#10004;</td>}
                                        <td>{item.trainer}</td>
                                        <td></td>
                                        <td>{item.remark}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </Table>
                </div>
                <div className='break-page'>
                    <div className="wrapp-rate">
                        <p>*หมายเหตุ : </p>
                        <div>
                            <p>ระดับความเข้าใจ (ประเมินตนเอง) :</p>
                            <p>
                                เข้าใจ = มีความเข้าใจในสิ่งที่ผู้สอนอบรม <br />
                                เข้าใจปานกลาง = มีความเข้าใจบ้างในสิ่งที่ผู้สอนอบรม <br />
                                ไม่เข้าใจ = ไม่มีความเข้าใจเลยในสิ่งที่ผู้สอนอบรม
                            </p>
                        </div>
                        <div>
                            <p>ผลการประเมินระดับความเข้าใจโดยผู้สอน</p>
                            <Table bordered size='sm'>
                                <thead>
                                    <tr>
                                        <th>A</th>
                                        <th>B</th>
                                        <th>C</th>
                                        <th>D</th>
                                        <th>F</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>100%-96%</td>
                                        <td>95%-91%</td>
                                        <td>85%-80%</td>
                                        <td>90%-86%</td>
                                        <td>&lt; 80%</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6">หมายเหตุ : กรณีได้คะแนน &lt; 80% ต้องทำการ Re-Training ใหม่ อีกครั้ง</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="wrapp-sign">
                        <div className="sign">
                            <div className="line"></div>
                            <div>Trainer sign</div>
                            <div >..................../..................../....................</div>
                        </div>
                        <div className="sign">
                            <div className="line"></div>
                            <div>DM./DDM./SM.</div>
                            <div >..................../..................../....................</div>
                        </div>
                    </div>
                </div>
            </Container>
        </div >

    )

}

export default ReportCourse;