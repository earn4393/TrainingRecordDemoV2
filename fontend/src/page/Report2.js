import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import axios from '../api/axios';
import MyCustomFont from '../fonts/Sarabun-Regular.ttf';
import MyCustomFontBold from '../fonts/Sarabun-Bold.ttf';

const URL_COURSE = '/get-course' // api เรียกดูหลักสูตร
const URL_TRAINEE = '/get-candidate' // api สำหรับเรียกผู้อบรมในหลักสูตร 
const URL_FORM = '/get-form'  //api เรียกดู division ของฟอร์ม



Font.register({
    family: 'Sarabun',
    fonts: [
        {
            src: MyCustomFont
        },
        {
            src: MyCustomFontBold,
            fontWeight: 'bold'
        }
    ]
});




const PDFFile2 = () => {
    const id = 'I24-CM-006'
    const [candidates, setCandidates] = useState(null)
    const [course, setCourse] = useState(null);
    const [form, setForm] = useState(null);

    const fetchData = async () => {

        await axios.post(URL_TRAINEE, { id: id }).then((res) => {
            if (res.data.data != null) {
                let data = res.data.data
                data.map((item) => {
                    if (item.pos !== null) {
                        item.pos = item.pos.slice(item.pos.indexOf('(') + 1, item.pos.length - 1)
                    }
                })
                setCandidates(data)
                console.log(data)
            }
        })
        await axios.post(URL_COURSE, { id: id }).then((res) => {
            if (res.data.data != null) {
                setCourse(res.data.data)
                // console.log(res.data.data)
            }
        })
        await axios.post(URL_FORM, { id: 'FO-ADX-002' }).then((res) => {
            if (res.data != null) {
                setForm(res.data)
            }
        })
    };

    const Table = () => (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <Text style={styles.columnHeader}>ลําดับที่</Text>
                <Text style={styles.columnHeader1}>วัน/เดือน/ปี</Text>
                <Text style={styles.columnHeader2}>รหัส (CODE)</Text>
                <Text style={styles.columnHeader3}>ชื่อ-นามสกุล (Name-Surname)</Text>
                <Text style={styles.columnHeader4}>แผนก (Section)</Text>
            </View>
            {candidates && candidates.map((row, index) => (
                <View style={styles.tableRow} key={index}>
                    <Text style={styles.column}>{index + 1}</Text>อ
                    <Text style={styles.column1}>{row.date}</Text>
                    <Text style={styles.column2}>{row.name}</Text>
                    <Text style={styles.column3}>{row.hr}</Text>
                    <Text style={styles.column4}>{row.place}</Text>
                </View>
            ))}
        </View>
    );


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header} fixed>
                    <Text render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} />
                    <Text >FO-ADX-002</Text>
                    <View style={styles.refNo}>
                        <Text style={styles.refNoLabel}>Ref No. :</Text>
                        <View style={styles.lineDash} />
                    </View>
                </View>
                <View style={styles.section_header}>
                    <Text style={styles.text_header}>บันทึกการฝึกอบรม</Text>
                    <Text style={styles.text_header}>Training record</Text>
                    {course ? (
                        <View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header1, styles.row_header]}>
                                    <Text style={styles.label1}>เรื่องที่อบรม (Training item):</Text>
                                    <Text style={styles.line1}>{course.name}</Text>
                                </View>
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header2, styles.row_header]}>
                                    <Text style={styles.label2}>Check Box </Text>
                                </View>
                                <View style={[styles.row_header2, styles.row_header]}>
                                    <Text style={styles.label2}>Check Box </Text>
                                </View>
                                <View style={[styles.row_header2, styles.row_header]}>
                                    <Text style={styles.label2}>Check Box </Text>
                                </View>
                                <View style={[styles.row_header2, styles.row_header]}>
                                    <Text style={styles.label2}>Check Box </Text>
                                </View>
                                <View style={[styles.row_header2, styles.row_header]}>
                                    <Text style={styles.label2}>Check Box </Text>
                                </View>
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header3, styles.row_header]}>
                                    <Text style={styles.label3}>จุดมุ่งหมาย (Training purpose):</Text>
                                    <Text style={styles.line3}>{course.aim}</Text>
                                </View>
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header4, styles.row_header]}>
                                    <Text style={styles.label4}>ผู้ฝึกอบรม (Trainer) :</Text>
                                </View>
                                <View style={[styles.row_header5, styles.row_header]}>
                                    <Text style={styles.label5}>Check Box</Text>
                                </View>
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header6, styles.row_header]}>
                                    <Text style={styles.label6}>ชื่อผู้ฝึกอบรม (Name):</Text>
                                    <Text style={styles.line6}>{course.trainer}</Text>
                                </View>
                                {/* <View style={[styles.row_header7, styles.row_header]}>
                                    <Text style={styles.label7}>แผนก (Section) :</Text>
                                    <Text style={styles.line7}>{course.aim}</Text>
                                </View> */}
                                {/* <View style={[styles.row_header8, styles.row_header]}>
                                    <Text style={styles.label8}>ฝ่าย (Department) :</Text>
                                    <Text style={styles.line8}>{course.aim}</Text>
                                </View>
                                <View style={[styles.row_header9, styles.row_header]}>
                                    <Text style={styles.label9}>ตำแหน่ง (Position) :</Text>
                                    <Text style={styles.line9}>{course.aim}</Text>
                                </View>
                                <View style={[styles.row_header10, styles.row_header]}>
                                    <Text style={styles.label10}>ลำดับขั้น (Qualification) :</Text>
                                    <Text style={styles.line10}>{course.aim}</Text>
                                </View> */}
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header11, styles.row_header]}>
                                    <Text style={styles.label11}>รายละเอียดการฝึกอบรม (Training description) :</Text>
                                    <Text style={styles.line11}>{course.des != null ? course.des : '-'}</Text>
                                </View>
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header12, styles.row_header]}>
                                    <Text style={styles.label12}>วิธีที่ใช้ในการประเมิน (Method To Appraisal)</Text>
                                </View>
                                <View style={[styles.row_header13, styles.row_header]}>
                                    <Text style={styles.label13}>Check Box</Text>
                                </View>
                                <View style={[styles.row_header14, styles.row_header]}>
                                    <Text style={styles.label14}>OTHER</Text>
                                    <Text style={styles.line14}>{course.aim}</Text>
                                </View>
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header15, styles.row_header]}>
                                    <Text style={styles.label15}>วันที่ฝึกอบรม (Training date) :</Text>
                                    <Text style={styles.line15}>{course.start} - {course.end}</Text>
                                </View>
                                <View style={[styles.row_header16, styles.row_header]}>
                                    <Text style={styles.label16}>ผู้ฝึกอบรมใช้เวลาในการฝึกอบรม (Period of time training):</Text>
                                    <Text style={styles.line16}>{course.hr}</Text>
                                    <Text style={styles.label17}>ชั่วโมง (Hr)</Text>
                                </View>
                            </View>
                        </View>
                    ) : null}
                </View>
                <View style={styles.section_table}>
                    <Text style={styles.text_header2}>ผู้รับการฝึกอบรม (Trainee)</Text>
                    <Table />
                </View>
                <View style={styles.footer} fixed>
                    <Text>{form}</Text>
                </View>
            </Page >
        </Document >
    )
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
        fontFamily: 'Sarabun',
        fontSize: 8,
    },
    section_header: {
        padding: '10px',
        textAlign: 'center',
        borderWidth: '2px',
        marginBottom: '5px',
    },
    header: {
        marginBottom: 10,
        textAlign: 'right',
        fontSize: '6px',
    },
    text_header: {
        fontWeight: 'bold',
        fontSize: '10px'
    },
    text_header2: {
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
    },
    row_header: {
        display: 'flex',
        flexDirection: 'row',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderRight: '1px solid black',
        borderLeft: '1px solid black',
        borderBottom: '1px solid black',
        // paddingTop: 8,
        textAlign: 'center',
    },
    line_table: {
        borderTop: '1px solid black',
    },
    header_context: {
        borderTop: 'none',
        textAlign: 'left',
    },
    label1: {
        width: '20%',
        fontWeight: 'bold',
    },
    line1: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '80%',
    },
    label2: {
        width: '45%',
        fontWeight: 'bold',
    },
    line2: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '55%',
    },
    label3: {
        width: '22%',
        fontWeight: 'bold',
    },
    line3: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '78%',
    },
    label4: {
        width: '35%',
        fontWeight: 'bold',
    },
    label5: {
        width: '40%',
        fontWeight: 'bold',
    },
    line5: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '60%',
    },
    label6: {
        width: '38%',
        fontWeight: 'bold',
    },
    line6: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '62%',
    },
    label7: {
        width: '20%',
        fontWeight: 'bold',
    },
    line7: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '80%',
    },
    label8: {
        width: '10%',
        fontWeight: 'bold',
    },
    line8: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '90%',
    },
    label9: {
        width: '30%',
        fontWeight: 'bold',
    },
    line9: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '70%',
    },
    label10: {
        width: '20%',
        fontWeight: 'bold',
    },
    line10: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '80%',
    },
    label11: {
        width: '32%',
        fontWeight: 'bold',
    },
    line11: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '68%',
    },

    label15: {
        width: '50%',
        fontWeight: 'bold',
    },
    line15: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '50%',
    },
    label16: {
        width: '65%',
        fontWeight: 'bold',
    },
    line16: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '10%',
    },
    label17: {
        width: '20%',
        fontWeight: 'bold',
    },

    row1: {
        width: '5%',
        borderRight: '1px solid black',
    },
    row2: {
        width: '15%',
        borderRight: '1px solid black',
    },
    row3: {
        width: '55%',
        borderRight: '1px solid black',
    },
    row3_context: {
        width: '55%',
        textAlign: 'left',
        borderRight: '1px solid black',
        paddingLeft: '2px',
    },
    row4: {
        width: '10%',
        borderRight: '1px solid black',
    },
    row5: {
        width: '15%',
    },
    row_header1: {
        width: '100%',

    },
    row_header2: {
        width: '100%',
    },
    row_header3: {
        width: '100%',
    },
    row_header4: {
        width: '45%',
    },
    row_header5: {
        width: '55%',
    },
    row_header6: {
        width: '40%',
    },
    row_header7: {
        width: '60%',

    },
    row_header8: {
        width: '35%',
    },
    row_header9: {
        width: '25%',
    },
    row_header11: {
        width: '100%',
    },
    row_header12: {
        width: '30%'
    },
    row_header13: {
        width: '30%'
    },
    row_header15: {
        width: '40%'
    },
    row_header16: {
        width: '60%',
    },

    footer: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 10,
        textAlign: 'right',
        fontSize: '6px',
    }, table: {
        flexDirection: 'column',
        border: 1,
        borderColor: '#000',
        borderWidth: 1,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
    },
    columnHeader: {
        width: '10%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    columnHeader1: {
        width: '15%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    columnHeader2: {
        width: '50%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    columnHeader3: {
        width: '10%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    columnHeader4: {
        width: '15%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    column: {
        width: '10%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    column1: {
        width: '15%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    column2: {
        width: '50%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    column3: {
        width: '10%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    column4: {
        width: '15%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
});

export default PDFFile2;