import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import axios from '../api/axios';
import MyCustomFont from '../fonts/Sarabun-Regular.ttf';
import MyCustomFontBold from '../fonts/Sarabun-Bold.ttf';

const URL_EMP = '/get-employee'; // API endpoint to fetch employee data
const URL_COURSE = '/get-all-my-course'; // API endpoint to fetch employee's courses
const URL_FORM = '/get-form'; // API endpoint to fetch form data



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


const PDFFile = () => {
    const id = '002525'
    const [employee, setEmployee] = useState(null);
    const [courses, setCourses] = useState(null);
    const [form, setForm] = useState(null);

    const fetchData = async () => {

        await axios.post(URL_EMP, { id }).then((res) => {
            if (res.data.data != null) {
                setEmployee(res.data.data);
            }
        });

        await axios.post(URL_COURSE, { id }).then((res) => {
            if (res.data.data != null) {
                setCourses(res.data.data);
            }
        });
        await axios.post(URL_FORM, { id: 'FO-ADX-003' }).then((res) => {
            if (res.data != null) {
                setForm(res.data);
            }
        }
        );


    };

    const tableData = [
        { id: 1, name: 'John Doe', age: 30, city: 'New York' },
        { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
        { id: 3, name: 'Alice Johnson', age: 35, city: 'Chicago' },
        // Add more data as needed
    ];

    const Table = () => (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <Text style={styles.columnHeader}>ID</Text>
                <Text style={styles.columnHeader}>Name</Text>
                <Text style={styles.columnHeader}>Age</Text>
                <Text style={styles.columnHeader}>City</Text>
            </View>
            {tableData.map((row) => (
                <View style={styles.tableRow} key={row.id}>
                    <Text style={styles.column}>{row.id}</Text>
                    <Text style={styles.column}>{row.name}</Text>
                    <Text style={styles.column}>{row.age}</Text>
                    <Text style={styles.column}>{row.city}</Text>
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
                    <Text >FO-ADX-003</Text>
                </View>

                <View style={styles.section_header}>
                    <Text style={styles.text_header}>บริษัท เอเชียน สแตนเลย์ อินเตอร์เนชั่นแนล จำกัด </Text>
                    <Text style={styles.text_header}>แบบฟอร์มบันทึกประวัติการฝึกอบรมของพนักงาน</Text>
                    <Text style={styles.text_header}>TRAINING EXPERIENCE RECORD FOR EMPLOYEE</Text>
                    <View style={{ marginBottom: '10px' }} />
                    {employee && (
                        <View >
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header1, styles.row_header]}>
                                    <Text style={styles.label1}>ชื่อ - สกุล:</Text>
                                    <Text style={styles.line1}>{employee.eng_name}</Text>
                                </View>
                                <View style={[styles.row_header2, styles.row_header]}>
                                    <Text style={styles.label2}>วัน/เดือน/ปีเกิด: </Text>
                                    <Text style={styles.line2}>{employee.birth}</Text>
                                </View>
                                <View style={[styles.row_header3, styles.row_header]}>
                                    <Text style={styles.label3}>อายุ: </Text>
                                    <Text style={styles.line3}>{employee.year} </Text>
                                    <Text>ปี</Text>
                                </View>
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header4, styles.row_header]}>
                                    <Text style={styles.label4}>ระดับการศึกษา:</Text>
                                    <Text style={styles.line4}> {employee.degree}</Text>
                                </View>
                                <View style={[styles.row_header5, styles.row_header]}>
                                    <Text style={styles.label5}>วันที่เริ่มงาน:</Text>
                                    <Text style={styles.line5}> {employee.join}</Text>
                                </View>
                                <View style={[styles.row_header6, styles.row_header]}>
                                    <Text style={styles.label6}>รหัสพนักงาน:</Text>
                                    <Text style={styles.line6}> {employee.id}</Text>
                                </View>
                            </View>

                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header7, styles.row_header]}>
                                    <Text style={styles.label7}>แผนก:</Text>
                                    <Text style={styles.line7}> {employee.dep}</Text>
                                </View>
                                <View style={[styles.row_header8, styles.row_header]}>
                                    <Text style={styles.label8}>ฝ่าย:</Text>
                                    <Text style={styles.line8}> {employee.div}</Text>
                                </View>
                                <View style={[styles.row_header9, styles.row_header]}>
                                    <Text style={styles.label9}>ลำดับชั้น:</Text>
                                    <Text style={styles.line9}> {employee.cate}</Text>
                                </View>
                            </View>
                            <View style={[styles.row_header, styles.header_context]}>
                                <View style={[styles.row_header7, styles.row_header]}>
                                    <Text style={styles.label10}>ตำแหน่ง:</Text>
                                    <Text style={styles.line10}> {employee.pos}</Text>
                                </View>
                            </View>

                        </View>
                    )}
                </View>
                <View style={styles.section_table}>
                    <Text style={styles.text_header2}>ประวัติการฝึกอบรมภายในและภายนอกบริษัทฯ</Text>
                    <View style={styles.table}>
                        <View style={[styles.row, styles.line_table]} fixed>
                            <Text style={styles.row1} >ลำดับ </Text>
                            <Text style={styles.row2} >วัน/เดือน/ปี</Text>
                            <Text style={styles.row3} >หัวข้อ/เรื่องหลักสูตร</Text>
                            <Text style={styles.row4} >
                                <Text style={styles.text}>ระยะเวลา </Text>
                                <Text style={styles.text}>(ชม.)</Text>
                            </Text>
                            <Text style={styles.row5} >สถานที่จัด</Text>
                        </View>
                        {courses && courses.map((emp, i) => (
                            <View key={i} style={styles.row} wrap={false}>
                                <Text style={styles.row1}>{i}</Text>
                                <Text style={styles.row2}>{emp.date}</Text>
                                <Text style={styles.row3_context}>{emp.name}</Text>
                                <Text style={styles.row4}>{emp.hr}</Text>
                                <Text style={styles.row5}>{emp.place}</Text>
                            </View>
                        ))}
                    </View>
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
        width: '25%',
        fontWeight: 'bold',
    },
    line3: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '45%',
    },
    label4: {
        width: '25%',
        fontWeight: 'bold',
    },
    line4: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '75%',
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
        width: '40%',
        fontWeight: 'bold',
    },
    line6: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '60%',
    },
    label7: {
        width: '15%',
        fontWeight: 'bold',
    },
    line7: {
        borderBottomStyle: 'dashed',
        borderBottomWidth: '1px',
        width: '85%',
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
        width: '50%',

    },
    row_header2: {
        width: '30%',
    },
    row_header3: {
        width: '20%',
    },
    row_header4: {
        width: '50%',
    },
    row_header5: {
        width: '25%',
    },
    row_header6: {
        width: '25%',
    },
    row_header7: {
        width: '40%',
    },
    row_header8: {
        width: '35%',
    },
    row_header9: {
        width: '25%',
    },
    footer: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 10,
        textAlign: 'right',
        fontSize: '6px',
    },
    table: {
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
        width: '25%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
    column: {
        width: '25%',
        textAlign: 'center',
        borderRightColor: '#000',
        borderRightWidth: 1,
        padding: 5,
    },
});

export default PDFFile;