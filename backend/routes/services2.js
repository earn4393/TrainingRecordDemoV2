const app = require('express').Router();
const conn = require('../db/db_train.js');
var sql = require('mssql');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/auth', (req, res) => {
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        var query = `SELECT Username AS 'user' ,Passwords AS 'pwd' FROM tbl_Accounts`
        request.query(query, (err, records) => {
            const data = { data: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data.data = records.recordset[0]
            } else {
                console.log(`auth query err: ${err}`)
            }
            // console.log(data)
            res.send(data)
        })
    }).catch((err) => {
        console.log(`auth connect error : ${err}`)
    })
});

app.post('/get-employee', (req, res) => {
    const id = req.body.id
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        var query = `SELECT EMPLOYEE_NO AS id, EMPLOYEE_LOCAL_NAME AS 'th_name', 
        EMPLOYEE_NAME AS 'eng_name' ,CASE WHEN SEX = 'M' THEN 'ชาย' ELSE 'หญิง' END AS sex,
        FORMAT(BIRTH_DATE, 'dd/MM/yyyy')as birth,FORMAT(DATE_JOINED, 'dd/MM/yyyy') AS 'join',
        COALESCE(QUALIFICATION_DESCRIPTION,'-') AS degree ,COALESCE(division_description,'-') AS div,
		COALESCE(department_description,'-') AS dep,COALESCE(POSITION_DESCRIPTION,'-') AS pos ,
		YEAR(GETDATE()) - YEAR(tbl_EMPLOYEE.BIRTH_DATE) as 'year' ,
        COALESCE(CATEGORY_DESCRIPTION,'-') AS cate  FROM tbl_EMPLOYEE WHERE EMPLOYEE_NO = '${id}'`

        request.query(query, (err, records) => {
            const data = { data: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data.data = records.recordset[0]
            } else {
                console.log(`get-employee query err: ${err}`)
            }
            // console.log(data)
            res.send(data)

        })
    }).catch((err) => {
        console.log(`get-employee connect error : ${err}`)
    })

});


app.post('/get-all-my-course', (req, res) => {
    const id = req.body.id
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        var query = `SELECT  tbl_Transaction.CourseID AS id,COALESCE(CourseName,'-') AS 'name',
        COALESCE(FORMAT(CourseStart, 'dd/MM/yyyy'),'-') AS 'date',
		DurationHour AS 'hr',COALESCE(CourseLoc,'-') AS 'place',
        COALESCE(TraineeEvaluate,'-') AS 'trainee',COALESCE(TrainerEvaluate,'-') AS 'trainer' 
		FROM tbl_Transaction FULL JOIN tbl_Course on tbl_Transaction.CourseID = tbl_Course.CourseID 
		where tbl_Transaction.EMPLOYEE_NO =  '${id}' ORDER BY EntryDate ASC`

        request.query(query, (err, records) => {
            const data = { data: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data.data = records.recordset
            } else {
                console.log(`get-all-my-course query err: ${err}`)
            }
            // console.log(data)
            res.send(data)
        })
    }).catch((err) => {
        console.log(`get-all-mycourse connect error : ${err}`)
    })
});


app.post('/get-course', (req, res) => {
    const id = req.body.id
    conn.connect().then((err, records) => {

        var request = new sql.Request(conn)
        var query = `SELECT CourseID AS 'id',COALESCE(CourseName,'-') AS 'name',
        COALESCE(CoursePurpose,'-') AS 'aim',COALESCE(CourseDescript,'-') AS 'des',
        TrainerID AS 'trainer_id' ,COALESCE(TrainerName,'-') AS 'trainer',DurationHour AS 'hr',
		COALESCE(CourseLoc,'-') AS 'place',COALESCE(FORMAT(CourseStart, 'dd/MM/yyyy'),'-') AS 'start',
		COALESCE(FORMAT(CourseEnd, 'dd/MM/yyyy'),'-') AS 'end' FROM tbl_Course WHERE CourseID =  '${id}'`

        request.query(query, (err, records) => {
            const data = { data: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data.data = records.recordset[0]
            } else {
                console.log(`get-course query err: ${err}`)
            }
            res.send(data)
        })
    }).catch((err) => {
        console.log(`get-course connect error : ${err}`)
    })
})


app.post('/get-candidate', (req, res) => {
    const id = req.body.id
    conn.connect().then((err, records) => {

        var request = new sql.Request(conn)
        var query = `SELECT tbl_Transaction.EMPLOYEE_NO AS id,COALESCE(
            CASE 
            WHEN EMPLOYEE_TITLE = 'MR' THEN 'นาย'  
            WHEN EMPLOYEE_TITLE = 'MS' THEN 'น.ส.'  
            WHEN EMPLOYEE_TITLE = 'MRS' THEN 'นาง'  
            END,'-') AS title,
            COALESCE(EMPLOYEE_LOCAL_NAME,'-') AS 'th_name',COALESCE(EMPLOYEE_NAME,'-') AS 'eng_name',
            COALESCE(NATIONAL_ID2,'-') AS identify,COALESCE(TraineeEvaluate,'-') AS trainee,
            COALESCE(TrainerEvaluate,'-') AS trainer,COALESCE(FORMAT(EntryDate, 'dd/MM/yyyy'),'-') as date,
            COALESCE(Remark,'') AS remark , department_description AS dep , POSITION_DESCRIPTION AS pos
            FROM tbl_Transaction FULL JOIN tbl_EMPLOYEE 
            ON tbl_Transaction.EMPLOYEE_NO  = tbl_EMPLOYEE.EMPLOYEE_NO
            where CourseID = '${id}' ORDER BY EntryDate DESC`

        request.query(query, (err, records) => {
            const data = { data: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data.data = records.recordset
            } else {
                console.log(`get-candidate query err: ${err}`)
            }
            // console.log(data)
            res.send(data)
        })
    }).catch((err) => {
        console.log(`get-candidate connect error : ${err}`)
    })
})


app.post('/get-all-courses', (req, res) => {
    conn.connect().then((err, records) => {

        var request = new sql.Request(conn)
        var query = `SELECT CourseID AS 'id',CourseName AS 'name',
        COALESCE(CoursePurpose,'-') AS 'aim',COALESCE(CourseDescript,'-') AS 'des',
        COALESCE(TrainerID,'-') AS 'trainer_id',COALESCE(TrainerName,'-') AS 'trainer',
        DurationHour AS 'hr',COALESCE(CourseLoc,'-') AS 'site',
        COALESCE(FORMAT(CourseStart, 'yyyy-MM-dd'),'-') AS 'start', 
        COALESCE(FORMAT(CourseEnd, 'yyyy-MM-dd'),'-') AS 'end' ,
        COALESCE(TrainerCom,'-') AS 'div' FROM tbl_Course  ORDER BY CourseStart DESC`

        request.query(query, (err, records) => {
            const data = { data: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data.data = records.recordset
            } else {
                console.log(`get-all-courses query err: ${err}`)
            }
            // console.log(data)
            res.send(data)
        })
    }).catch((err) => {
        console.log(`get-all-courses connect error : ${err}`)
    })
})


app.post('/get-all-courses-by-search', (req, res) => {
    conn.connect().then((err, records) => {

        var request = new sql.Request(conn)
        var query = `SELECT CourseID AS 'id',CourseName AS 'name'
        FROM tbl_Course  ORDER BY CourseStart DESC`

        request.query(query, (err, records) => {
            const data = { data: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data.data = records.recordset
            } else {
                console.log(`get-all-courses-by-search query err: ${err}`)
            }
            // console.log(data)
            res.send(data)
        })
    }).catch((err) => {
        console.log(`get-all-courses-by-search connect error : ${err}`)
    })
})


app.post('/add-course', (req, res) => {
    const course = req.body
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        var query = `INSERT INTO tbl_Course VALUES ('${course.id}','${course.name}',`

        query += course.aim == '' ? 'NULL,' : `'${course.aim}',`
        query += course.des == '' ? 'NULL,' : `'${course.des}',`
        query += course.start == '' ? 'NULL,' : `'${course.start}',`
        query += course.end == '' ? 'NULL,' : `'${course.end}',`
        query += 'NULL,'
        query += course.hr == '' ? 'NULL,' : `'${course.hr}',`
        query += course.site == '' ? 'NULL,' : `'${course.site}',`
        query += course.trainer == '' ? 'NULL,' : `'${course.trainer}',`
        query += 'NULL,'
        query += 'NULL,'
        query += 'NULL,'
        query += 'NULL,'
        query += course.div == '' ? 'NULL,' : `'${course.div}',`
        query += course.trainer_id == '' ? 'NULL)' : `'${course.trainer_id}')`
        console.log(query)

        request.query(query, (err, records) => {
            if (err == null) {
                res.send({ code: 200 })
            } else {
                console.log(`add-course query err: ${err}`)
                res.send({ code: 999 })
            }
        })

    }).catch((err) => {
        console.log(`add-course connect error : ${err}`)
    })
})


app.post('/delete-course', (req, res) => {
    const id = req.body.id
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        var query = `DELETE FROM tbl_Course WHERE CourseID = '${id}'`

        request.query(query, (err, records) => {
            if (err == null) {
                res.send({ code: 200 })
            } else {
                console.log(`delete-course query err: ${err}`)
                res.send({ code: 999 })
            }
        })
    }).catch((err) => {
        console.log(`delete-course connect error : ${err}`)
    })
})

app.post('/delete-transaction-by-course', (req, res) => {
    const id = req.body.id
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        var query = `DELETE FROM tbl_Transaction WHERE CourseID = '${id}'`

        request.query(query, (err, records) => {
            if (err == null) {
                res.send({ code: 200 })
            } else {
                console.log(`delete-transaction-by-course query err: ${err}`)
                res.send({ code: 999 })
            }
        })
    }).catch((err) => {
        console.log(`delete-transaction-by-course connect error : ${err}`)
    })
})

app.post('/edit-course', (req, res) => {
    const course = req.body
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        var query = `UPDATE tbl_Course SET CourseName = `

        query += (course.name == '-' ? 'NULL' : `'${course.name}'`) + ',CoursePurpose = '
        query += (course.aim == '-' ? 'NULL' : `'${course.aim}'`) + ',CourseDescript = '
        query += (course.des == '-' ? 'NULL' : `'${course.des}'`) + ',CourseStart = '
        query += (course.start == '-' ? 'NULL' : `'${course.start}'`) + ',CourseEnd = '
        query += (course.end == '-' ? 'NULL' : `'${course.end}'`) + ',DurationHour = '
        query += (course.hr == ' ' ? '0' : `'${course.hr}'`) + ',CourseLoc = '
        query += (course.site == '-' ? 'NULL' : `'${course.site}'`) + ',TrainerID = '
        query += (course.trainer_id == '-' ? 'NULL' : `'${course.trainer_id}'`) + ',TrainerName = '
        query += (course.trainer == '-' ? 'NULL' : `'${course.trainer}'`) + ',TrainerCom = '
        query += (course.div == '-' ? 'NULL' : `'${course.div}'`) + ` WHERE CourseID = '${course.id}'`

        request.query(query, (err, records) => {
            if (err == null) {
                res.send({ code: 200 })
            } else {
                console.log(`edit-course query err: ${err}`)
                res.send({ code: 999 })
            }
        })
    }).catch((err) => {
        console.log(`edit-course connect error : ${err}`)
    })
})


app.post('/add-employee', (req, res) => {
    const emp = req.body
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        const trainer = emp.trainer != '' ? `'${emp.trainer}'` : 'NULL'
        const remark = emp.remark != '' ? `'${emp.remark}'` : 'NULL'
        var query = `INSERT INTO tbl_Transaction (CourseID,EMPLOYEE_NO,TraineeEvaluate,
            TrainerEvaluate,Remark) 
            VALUES('${emp.course_id}','${emp.emp_id}','${emp.trainee}',${trainer},${remark})`
        request.query(query, (err, records) => {
            if (err == null) {
                res.send({ code: 200 })
            } else {
                console.log(`add-employee query err: ${err}`)
                res.send({ code: 999 })
            }
        })
    }).catch((err) => {
        console.log(`add-employee connect error : ${err}`)
    })
})


app.post('/delete-cadidate', (req, res) => {
    const emp_id = req.body.emp_id
    const course_id = req.body.course_id
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        var query = `DELETE FROM tbl_Transaction WHERE EMPLOYEE_NO = '${emp_id}' and CourseID = '${course_id}'`

        request.query(query, (err, records) => {
            if (err == null) {
                res.send({ code: 200 })
            } else {
                console.log(`delete-cadidate query err: ${err}`)
                res.send({ code: 999 })
            }
        })
    }).catch((err) => {
        console.log(`delete-cadidate connect error : ${err}`)
    })
})


app.post('/update-cadidate', (req, res) => {
    const emp = req.body
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        var query = `UPDATE tbl_Transaction SET TrainerEvaluate = '${emp.trainer}', Remark = '${emp.remark}' WHERE EMPLOYEE_NO = '${emp.emp_id}' and CourseID = '${emp.course_id}'`
        request.query(query, (err, records) => {
            if (err == null) {
                res.send({ code: 200 })
            } else {
                console.log(`update-cadidate query err: ${err}`)
                res.send({ code: 999 })
            }
        })
    }).catch((err) => {
        console.log(`update-cadidate connect error : ${err}`)
    })
})


app.post('/count-courses', (req, res) => {
    const emp = req.body
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        var query = `SELECT COUNT(CourseID) AS count FROM tbl_Course`
        request.query(query, (err, records) => {
            let data = { count: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data = records.recordset[0]
            } else {
                console.log(`count-courses query err: ${err}`)
            }
            // console.log(data)
            res.send(data)

        })
    }).catch((err) => {
        console.log(`count-courses connect error : ${err}`)
    })
})

app.post('/get-all-courses-per-page', (req, res) => {
    const start = req.body.start
    conn.connect().then((err, records) => {
        var request = new sql.Request(conn)
        var query = `SELECT CourseID AS 'id',CourseName AS 'name',
        COALESCE(CoursePurpose,'-') AS 'aim',COALESCE(CourseDescript,'-') AS 'des',
        COALESCE(TrainerID,'-') AS 'trainer_id',COALESCE(TrainerName,'-') AS 'trainer',
        DurationHour AS 'hr',COALESCE(CourseLoc,'-') AS 'site',
        COALESCE(FORMAT(CourseStart, 'yyyy-MM-dd'),'-') AS 'start', 
        COALESCE(FORMAT(CourseEnd, 'yyyy-MM-dd'),'-') AS 'end' ,
        COALESCE(TrainerCom,'-') AS 'div' FROM tbl_Course  ORDER BY CourseStart DESC 
        OFFSET ${start} ROWS FETCH NEXT 50 ROWS ONLY`


        request.query(query, (err, records) => {
            const data = { data: null }
            if (err == null && records.rowsAffected[0] > 0) {
                data.data = records.recordset
            } else {
                console.log(`get-all-courses query err: ${err}`)
            }
            // console.log(data)
            res.send(data)
        })
    }).catch((err) => {
        console.log(`get-all-courses connect error : ${err}`)
    })
})

app.post('/get-form', (req, res) => {
    const id = req.body.id
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        var query = `SELECT Division as div  FROM [TrainDB].[dbo].[Form] 
                    where Form_ID = '${id}'`

        request.query(query, (err, records) => {
            let div = null
            if (err == null && records.rowsAffected[0] > 0) {
                div = records.recordset[0].div
            } else {
                console.log(`get-form query err: ${err}`)
            }
            // console.log(data)
            res.send(div)

        })
    }).catch((err) => {
        console.log(`get-form connect error : ${err}`)
    })

});




module.exports = app;
