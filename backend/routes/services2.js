const app = require('express').Router()
const conn = require('../db/db_train.js')
const cookieParser = require('cookie-parser')
const session = require('express-session')
var sql = require('mssql')

app.use(cookieParser())
app.use(session(
    {
        secret: 'earn@ASI_teain123',
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 86400000
        },
        proxy: true

    }
))


// user auth 
app.post('/auth', (req, res) => {
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `
            SELECT 
                Username AS 'user' ,
                Passwords AS 'pwd' , 
                Permissions AS 'state'  
            FROM 
                tbl_Accounts
            WHERE 
                Username = @username and Passwords = @password`;

        request.input('username', sql.NVarChar, req.body.user);
        request.input('password', sql.NVarChar, req.body.pwd);

        request.query(query, (err, records) => {
            if (err) {
                console.log(`auth query err: ${err}`);
                res.status(500).send({ state: 'error' });
            }

            if (records.rowsAffected[0] > 0) {
                const userState = records.recordset[0].state;
                req.session.username = userState;
                res.send({ state: userState });
            } else {
                res.send({ state: 'user' });
            }
        });
    }).catch((err) => {
        console.log(`auth connect error : ${err}`);
        res.status(500).send({ state: 'error' });
    });
});


// check state user in session
app.get('/read-session', (req, res) => {
    if (req.session.username == 'admin') {
        res.send({ state: 'admin' })
    } else if (req.session.username == 'editor') {
        res.send({ state: 'editor' })
    } else {
        res.send({ state: 'user' })
    }
});

// delete session state user
app.get('/logout', (req, res) => {
    // ลบ session 
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.send(false)
        } else res.send(true)
    });
});


// ข้อมูลพนักงาน
app.post('/get-employee', (req, res) => {
    const id = req.body.id;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `
            SELECT 
                EMPLOYEE_NO AS id, 
                EMPLOYEE_LOCAL_NAME AS th_name, 
                EMPLOYEE_NAME AS eng_name,
                CASE WHEN SEX = 'M' THEN 'ชาย' ELSE 'หญิง' END AS sex,
                FORMAT(BIRTH_DATE, 'dd/MM/yyyy') AS birth,
                FORMAT(DATE_JOINED, 'dd/MM/yyyy') AS join_date,
                COALESCE(QUALIFICATION_DESCRIPTION, '-') AS degree,
                COALESCE(division_description, '-') AS div,
                COALESCE(department_description, '-') AS dep,
                COALESCE(POSITION_DESCRIPTION, '-') AS pos,
                YEAR(GETDATE()) - YEAR(tbl_EMPLOYEE.BIRTH_DATE) AS year,
                COALESCE(CATEGORY_DESCRIPTION, '-') AS cate  
            FROM 
                tbl_EMPLOYEE 
            WHERE 
                EMPLOYEE_NO = @id`;


        request.input('id', sql.NVarChar, id);

        request.query(query, (err, records) => {
            if (err) {
                console.log(`get-employee query err: ${err}`);
                res.status(500).send({ data: null, error: 'Database error' });
            } else {
                const data = { data: null };
                if (records.rowsAffected[0] > 0) {
                    data.data = records.recordset[0];
                }
                res.send(data);
            }
        });
    }).catch((err) => {
        console.log(`get-employee connect error : ${err}`);
        res.status(500).send({ data: null, error: 'Database connection error' });
    });
});

// ข้อมูลหลักสูตรทั้งหมด
app.post('/get-all-my-course', (req, res) => {
    const id = req.body.id;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `
            SELECT  
                tbl_Transaction.CourseID AS id,
                COALESCE(CourseName, '-') AS name,
                COALESCE(FORMAT(CourseStart, 'dd/MM/yyyy'), '-') AS date,
                DurationHour AS hr,
                COALESCE(CourseLoc, '-') AS place,
                COALESCE(TraineeEvaluate, '-') AS trainee,
                COALESCE(TrainerEvaluate, '-') AS trainer 
            FROM 
                tbl_Transaction 
            FULL JOIN 
                tbl_Course 
            ON 
                tbl_Transaction.CourseID = tbl_Course.CourseID                     
            WHERE 
                tbl_Transaction.EMPLOYEE_NO = @id
            ORDER BY 
                EntryDate ASC`;

        request.input('id', sql.NVarChar, id);

        request.query(query, (err, records) => {
            const data = { data: null };
            if (err) {
                console.log(`get-all-my-course query err: ${err}`);
                res.status(500).send({ data: null, error: 'Database error' });
            } else {
                if (records.rowsAffected[0] > 0) {
                    data.data = records.recordset;
                }
                res.send(data);
            }
        });
    }).catch((err) => {
        console.log(`get-all-my-course connect error: ${err}`);
        res.status(500).send({ data: null, error: 'Database connection error' });
    });
});


// ข้อมูลหลักสููตรตาม id
app.post('/get-course', (req, res) => {
    const id = req.body.id;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `
            SELECT 
                CourseID AS id,
                COALESCE(CourseName,'-') AS name,
                COALESCE(CoursePurpose,'-') AS aim,
                COALESCE(CourseDescript,'-') AS des,
                TrainerID AS trainer_id,
                COALESCE(TrainerName,'-') AS trainer,
                DurationHour AS hr,
                COALESCE(CourseLoc,'-') AS place,
                COALESCE(FORMAT(CourseStart, 'dd/MM/yyyy'),'-') AS 'start',
                COALESCE(FORMAT(CourseEnd, 'dd/MM/yyyy'),'-') AS 'end',
                TrainerPosition as pos,
                TrainerQua as qua,
                TrainerSec as sec,
                TrainerDept as dep
            FROM 
                tbl_Course WHERE CourseID =  '${id}'`

        request.input('id', sql.NVarChar, id);

        request.query(query, (err, records) => {
            const data = { data: null };
            if (err) {
                console.log(`get-course query err: ${err}`);
                res.status(500).send({ data: null, error: 'Database error' });
            } else {
                if (records.rowsAffected[0] > 0) {
                    data.data = records.recordset[0];
                }
                res.send(data);
            }
        });
    }).catch((err) => {
        console.log(`get-course connect error : ${err}`);
        res.status(500).send({ data: null, error: 'Database connection error' });
    });
});


// ผู้ที่เข้าอบรมหลักสูตรตาม id
app.post('/get-candidate', (req, res) => {
    const id = req.body.id;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `
            SELECT 
                tbl_Transaction.EMPLOYEE_NO AS id,
                COALESCE(
                    CASE 
                        WHEN EMPLOYEE_TITLE = 'MR' THEN 'นาย'  
                        WHEN EMPLOYEE_TITLE = 'MS' THEN 'น.ส.'  
                        WHEN EMPLOYEE_TITLE = 'MRS' THEN 'นาง'  
                    END,
                    '-'
                ) AS title,
                COALESCE(EMPLOYEE_LOCAL_NAME, '-') AS th_name,
                COALESCE(EMPLOYEE_NAME, '-') AS eng_name,
                COALESCE(NATIONAL_ID2, '-') AS identify,
                COALESCE(TraineeEvaluate, '-') AS trainee,
                COALESCE(TrainerEvaluate, '-') AS trainer,
                COALESCE(FORMAT(EntryDate, 'dd/MM/yyyy'), '-') as date,
                COALESCE(Remark, '') AS remark, 
                department_description AS dep, 
                POSITION_DESCRIPTION AS pos
            FROM 
                tbl_Transaction 
            FULL JOIN 
                tbl_EMPLOYEE 
            ON 
                tbl_Transaction.EMPLOYEE_NO = tbl_EMPLOYEE.EMPLOYEE_NO
            WHERE 
                CourseID = @id 
            ORDER BY 
                EntryDate ASC`;

        request.input('id', sql.NVarChar, id);

        request.query(query, (err, records) => {
            const data = { data: null };
            if (err) {
                console.log(`get-candidate query err: ${err}`);
                res.status(500).send({ data: null, error: 'Database error' });
            } else {
                if (records.rowsAffected[0] > 0) {
                    data.data = records.recordset;
                }
                res.send(data);
            }
        });
    }).catch((err) => {
        console.log(`get-candidate connect error : ${err}`);
        res.status(500).send({ data: null, error: 'Database connection error' });
    });
});


// ข้อมูลหลักสูตรทั้งหมด
app.post('/get-all-courses', (req, res) => {
    conn.connect().then(() => { // นี่คือตัวอย่างของการใช้ .then() โดยไม่ต้องการพารามิเตอร์
        var request = new sql.Request(conn);
        var query = `
        SELECT 
            CourseID AS 'id',
            CourseName AS 'name',
            COALESCE(CoursePurpose,'-') AS 'aim',
            COALESCE(CourseDescript,'-') AS 'des',
            COALESCE(TrainerID,'-') AS 'trainer_id',
            COALESCE(TrainerName,'-') AS 'trainer',
            DurationHour AS 'hr',
            COALESCE(CourseLoc,'-') AS 'site',
            COALESCE(FORMAT(CourseStart, 'yyyy-MM-dd'),'-') AS 'start', 
            COALESCE(FORMAT(CourseEnd, 'yyyy-MM-dd'),'-') AS 'end' ,
            COALESCE(TrainerCom,'-') AS 'div' 
        FROM 
            tbl_Course  
        ORDER BY 
            CourseStart DESC`;

        request.query(query, (err, records) => {
            const data = { data: null };
            if (err) {
                console.log(`get-all-courses query err: ${err}`);
                res.status(500).send({ data: null, error: 'Database error' });
            } else {
                if (records.rowsAffected[0] > 0) {
                    data.data = records.recordset;
                }
                res.send(data);
            }
        });
    }).catch((err) => {
        console.log(`get-all-courses connect error : ${err}`);
        res.status(500).send({ data: null, error: 'Database connection error' });
    });
});

// ข้อมูลพนักงานทั้งหมด
app.post('/get-all-employee', (req, res) => {
    conn.connect().then(() => { // นี่คือตัวอย่างของการใช้ .then() โดยไม่ต้องการพารามิเตอร์
        var request = new sql.Request(conn);
        var query = `
        SELECT 
            EMPLOYEE_NO AS id, 
            EMPLOYEE_NAME AS name_eng,
            (EMPLOYEE_LOCAL_NAME + ' / ' + EMPLOYEE_NAME ) AS 'name' 
        FROM 
            tbl_EMPLOYEE`;

        request.query(query, (err, records) => {
            const data = { data: null };
            if (err) {
                console.log(`get-employee query err: ${err}`);
                res.status(500).send({ data: null, error: 'Database error' });
            } else {
                if (records.rowsAffected[0] > 0) {
                    data.data = records.recordset;
                }
                res.send(data);
            }
        });
    }).catch((err) => {
        console.log(`get-employee connect error : ${err}`);
        res.status(500).send({ data: null, error: 'Database connection error' });
    });
});


// รหัสหลักสูตรสำหรับใช้ค้นหาหลักสูตร
app.post('/get-all-courses-by-search', (req, res) => {
    conn.connect().then(() => { // ใช้ .then() โดยไม่ระบุพารามิเตอร์
        var request = new sql.Request(conn);
        var query = `
            SELECT 
                CourseID AS 'id',
                CourseName AS 'name'
            FROM 
                tbl_Course  
            ORDER BY 
                CourseStart DESC , CourseID DESC`;

        request.query(query, (err, records) => {
            const data = { data: null };
            if (err) {
                console.log(`get-all-courses-by-search query err: ${err}`);
                res.status(500).send({ data: null, error: 'Database error' });
            } else {
                if (records.rowsAffected[0] > 0) {
                    data.data = records.recordset;
                }
                res.send(data);
            }
        });
    }).catch((err) => {
        console.log(`get-all-courses-by-search connect error : ${err}`);
        res.status(500).send({ data: null, error: 'Database connection error' });
    });
});


// เพิ่มหลักสูตร
app.post('/add-course', (req, res) => {
    const course = req.body;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `
        INSERT INTO 
            tbl_Course (
                CourseID, 
                CourseName, 
                CoursePurpose, 
                CourseDescript, 
                CourseStart, 
                CourseEnd, 
                DurationHour, 
                CourseLoc, 
                TrainerName, 
                TrainerPosition, 
                TrainerQua, 
                TrainerSec, 
                TrainerDept, 
                TrainerCom,
                TrainerID) 
            VALUES (
                @id, 
                @name, 
                @aim, 
                @des,
                @start, 
                @end, 
                @hr, 
                @site, 
                @trainer, 
                @trainer_pos,
                @trainer_qua, 
                @trainer_sec,
                @trainer_div,
                @div, 
                @trainer_id )`;

        request.input('id', sql.NVarChar, course.id);
        request.input('name', sql.NVarChar, course.name);
        request.input('aim', sql.NVarChar, course.aim || null);
        request.input('des', sql.NVarChar, course.des || null);
        request.input('start', sql.NVarChar, course.start || null);
        request.input('end', sql.NVarChar, course.end || null);
        request.input('hr', sql.NVarChar, course.hr || null);
        request.input('site', sql.NVarChar, course.site || null);
        request.input('trainer', sql.NVarChar, course.trainer || null);
        request.input('div', sql.NVarChar, course.div || null);
        request.input('trainer_id', sql.NVarChar, course.trainer_id || null);

        // Check if course.trainer is empty
        if (course.trainer_id) {
            // Assuming trainer table is named tbl_Trainer and contains necessary fields
            var trainerQuery = `
            SELECT 
                POSITION_DESCRIPTION as Position, 
                QUALIFICATION_DESCRIPTION as Qualification, 
                division_description as Division,
                department_description as Department
            FROM 
                tbl_EMPLOYEE
            WHERE 
                EMPLOYEE_NO = @trainerID`;

            request.input('trainerID', sql.NVarChar, course.trainer_id);
            request.query(trainerQuery, (err, result) => {
                if (err) {
                    console.log(`Error fetching trainer details: ${err}`);
                    res.send({ code: 999 });
                } else {
                    // Assuming the query returns a single result
                    var trainerData = result.recordset[0];
                    request.input('trainer_pos', sql.NVarChar, trainerData.Position || null);
                    request.input('trainer_qua', sql.NVarChar, trainerData.Qualification || null);
                    request.input('trainer_sec', sql.NVarChar, trainerData.Division || null);
                    request.input('trainer_div', sql.NVarChar, trainerData.Department || null);

                    // Execute the main query to insert course data
                    request.query(query, (err, result) => {
                        if (err) {
                            console.log(`add-course query error: ${err}`);
                            res.send({ code: 999 });
                        } else {
                            console.log("Course added successfully.");
                            res.send({ code: 200 });
                        }
                    });
                }
            });
        } else {
            // If course.trainer is empty, set TrainerPosition, TrainerQua, and TrainerSec to NULL
            request.input('trainer_pos', sql.NVarChar, null);
            request.input('trainer_qua', sql.NVarChar, null);
            request.input('trainer_sec', sql.NVarChar, null);
            request.input('trainer_div', sql.NVarChar, null);

            // Execute the main query to insert course data
            request.query(query, (err, result) => {
                if (err) {
                    console.log(`add-course query error: ${err}`);
                    res.send({ code: 999 });
                } else {
                    console.log("Course added successfully.");
                    res.send({ code: 200 });
                }
            });
        }
    }).catch((err) => {
        console.log(`add-course connect error : ${err}`);
        res.send({ code: 999 });
    });
});


// ลบหลักสูตร
app.post('/delete-course', (req, res) => {
    const id = req.body.id;
    conn.connect().then(() => { // ใช้ .then() โดยไม่ระบุพารามิเตอร์
        var request = new sql.Request(conn);
        var query = `DELETE FROM tbl_Course WHERE CourseID = @id`;

        request.input('id', sql.NVarChar, id)
        request.query(query, (err, records) => {
            if (err) {
                console.log(`delete-course query err: ${err}`);
                res.status(500).send({ code: 999, error: 'Database error' });
            } else {
                res.send({ code: 200 });
            }
        });
    }).catch((err) => {
        console.log(`delete-course connect error : ${err}`);
        res.status(500).send({ code: 999, error: 'Database connection error' });
    });
});


// ลบทั้งผู้อบรมตามหลักสูตร
app.post('/delete-transaction-by-course', (req, res) => {
    const id = req.body.id;
    conn.connect().then(() => { // ใช้ .then() โดยไม่ระบุพารามิเตอร์
        var request = new sql.Request(conn);
        var query = `DELETE FROM tbl_Transaction WHERE CourseID = @id`;
        request.input('id', sql.NVarChar, id)

        request.query(query, (err, records) => {
            if (err) {
                console.log(`delete-transaction-by-course query err: ${err}`);
                res.status(500).send({ code: 999, error: 'Database error' });
            } else {
                res.send({ code: 200 });
            }
        });
    }).catch((err) => {
        console.log(`delete-transaction-by-course connect error : ${err}`);
        res.status(500).send({ code: 999, error: 'Database connection error' });
    });
});


// แก้ไขหลักสูตร
app.post('/edit-course', (req, res) => {
    const course = req.body;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `
            UPDATE tbl_Course 
            SET 
                CourseName = @name,
                CoursePurpose = @aim,
                CourseDescript = @des,
                CourseStart = @start,
                CourseEnd = @end,
                DurationHour = @hr,
                CourseLoc = @site,
                TrainerID = @trainer_id,
                TrainerName = @trainer,
                TrainerPosition = @trainer_pos, 
                TrainerQua =  @trainer_qua, 
                TrainerSec = @trainer_sec, 
                TrainerDept =  @trainer_div, 
                TrainerCom = @div
            WHERE CourseID = @id`;

        request.input('name', sql.NVarChar, (course.name == '-' || course.name == '') ? null : course.name);
        request.input('aim', sql.NVarChar, (course.aim == '-' || course.aim == '') ? null : course.aim);
        request.input('des', sql.NVarChar, (course.des == '-' || course.des == '') ? null : course.des);
        request.input('start', sql.NVarChar, course.start);
        request.input('end', sql.NVarChar, course.end);
        request.input('hr', sql.Float, course.hr == '' ? 0 : parseFloat(course.hr));
        request.input('site', sql.NVarChar, (course.site == '-' || course.des == '') ? null : course.site);
        request.input('trainer_id', sql.NVarChar, (course.trainer_id == '-' || course.trainer_id == '') ? null : course.trainer_id);
        request.input('trainer', sql.NVarChar, (course.trainer == '-' || course.trainer == '') ? null : course.trainer);
        request.input('div', sql.NVarChar, (course.div == '-' || course.div == '') ? null : course.div);
        request.input('id', sql.NVarChar, course.id);

        // Check if course.trainer is empty
        if (course.trainer_id !== '-') {
            // Assuming trainer table is named tbl_Trainer and contains necessary fields
            var trainerQuery = `
            SELECT 
                POSITION_DESCRIPTION as Position, 
                QUALIFICATION_DESCRIPTION as Qualification, 
                division_description as Division,
                department_description as Department
            FROM 
                tbl_EMPLOYEE
            WHERE 
                EMPLOYEE_NO = @trainerID`;

            request.input('trainerID', sql.NVarChar, course.trainer_id);
            request.query(trainerQuery, (err, result) => {
                if (err) {
                    console.log(`Error fetching trainer details: ${err}`);
                    res.send({ code: 999 });
                } else {
                    // Assuming the query returns a single result
                    var trainerData = result.recordset[0];
                    request.input('trainer_pos', sql.NVarChar, trainerData.Position || null);
                    request.input('trainer_qua', sql.NVarChar, trainerData.Qualification || null);
                    request.input('trainer_sec', sql.NVarChar, trainerData.Division || null);
                    request.input('trainer_div', sql.NVarChar, trainerData.Department || null);

                    // Execute the main query to insert course data
                    request.query(query, (err, result) => {
                        if (err) {
                            console.log(`add-course query error: ${err}`);
                            res.send({ code: 999 });
                        } else {
                            console.log("Course added successfully.");
                            res.send({ code: 200 });
                        }
                    });
                }
            });
        } else {
            // If course.trainer is empty, set TrainerPosition, TrainerQua, and TrainerSec to NULL
            request.input('trainer_pos', sql.NVarChar, null);
            request.input('trainer_qua', sql.NVarChar, null);
            request.input('trainer_sec', sql.NVarChar, null);
            request.input('trainer_div', sql.NVarChar, null);

            // Execute the main query to insert course data
            request.query(query, (err, result) => {
                if (err) {
                    console.log(`add-course query error: ${err}`);
                    res.send({ code: 999 });
                } else {
                    console.log("Course added successfully.");
                    res.send({ code: 200 });
                }
            });
        }
    }).catch((err) => {
        console.log(`edit-course connect error : ${err}`);
        res.status(500).send({ code: 999, error: 'Database connection error' });
    });
});

// บันทึกผู้อบรม
app.post('/add-employee', (req, res) => {
    const emp = req.body;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `
        INSERT INTO 
            tbl_Transaction (CourseID, EMPLOYEE_NO, TraineeEvaluate, TrainerEvaluate, Remark) 
            VALUES(@course_id, @emp_id, @trainee, @trainer, @remark)`;

        request.input('course_id', sql.NVarChar, emp.course_id);
        request.input('emp_id', sql.NVarChar, emp.emp_id);
        request.input('trainee', sql.NVarChar, emp.trainee);

        // Handle trainer and remark inputs
        request.input('trainer', sql.NVarChar, emp.trainer !== '' ? emp.trainer : null);
        request.input('remark', sql.NVarChar, emp.remark !== '' ? emp.remark : null);

        request.query(query, (err, records) => {
            if (err) {
                console.log(`add-employee query err: ${err}`);
                res.status(500).send({ code: 999, error: 'Database error' });
            } else {
                res.send({ code: 200 });
            }
        });
    }).catch((err) => {
        console.log(`add-employee connect error : ${err}`);
        res.status(500).send({ code: 999, error: 'Database connection error' });
    });
});


// ลบผู้อบรม
app.post('/delete-cadidate', (req, res) => {
    const emp_id = req.body.emp_id
    const course_id = req.body.course_id
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        var query = `
            DELETE FROM 
                tbl_Transaction 
            WHERE 
                EMPLOYEE_NO = @emp_id and CourseID = @course_id`
        request.input('emp_id', sql.NVarChar, emp_id)
        request.input('course_id', sql.NVarChar, course_id)

        request.query(query, (err, records) => {
            if (err) {
                console.log(`delete-cadidate query err: ${err}`)
                res.status(500).send({ code: 999, error: 'Database error' });
            } else res.send({ code: 200 })
        })
    }).catch((err) => {
        console.log(`delete-cadidate connect error : ${err}`);
        res.status(500).send({ code: 999, error: 'Database connection error' });
    })
})

// ประเมินผู้อบรม
app.post('/update-cadidate', (req, res) => {
    const emp = req.body
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        var query = `
            UPDATE 
                tbl_Transaction 
            SET 
                TrainerEvaluate = @trainer, 
                Remark = @remark 
            WHERE 
                EMPLOYEE_NO = @emp_id and CourseID = @course_id`

        request.input('trainer', sql.NVarChar, emp.trainer)
        request.input('remark', sql.NVarChar, emp.remark)
        request.input('emp_id', sql.NVarChar, emp.emp_id)
        request.input('course_id', sql.NVarChar, emp.course_id)
        request.query(query, (err, records) => {
            if (err) {
                console.log(`update-cadidate query err: ${err}`)
                res.status(500).send({ code: 999, error: 'Database error' });
            } else res.send({ code: 200 })
        })
    }).catch((err) => {
        console.log(`update-cadidate connect error : ${err}`)
        res.status(500).send({ code: 999, error: 'Database connection error' });
    })
})

// นับจำนวนหลักสูตร
app.post('/count-courses', (req, res) => {
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        var query = `SELECT COUNT(CourseID) AS count FROM tbl_Course`;

        request.query(query).then((records) => {
            let data = { count: null };
            if (records.rowsAffected[0] > 0) {
                data = records.recordset[0];
            }
            res.send(data);
        }).catch((err) => {
            console.log(`count-courses query err: ${err}`);
            res.status(500).send({ count: null, error: 'Database error' });
        });
    }).catch((err) => {
        console.log(`count-courses connect error : ${err}`);
        res.status(500).send({ count: null, error: 'Database connection error' });
    });
});


// paging courses per page
app.post('/get-all-courses-per-page', (req, res) => {
    const start = req.body.start;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.input('start', sql.Int, start);

        var query = `
            SELECT 
                CourseID AS 'id',
                CourseName AS 'name',
                COALESCE(CoursePurpose, '-') AS 'aim',
                COALESCE(CourseDescript, '-') AS 'des',
                COALESCE(TrainerID, '-') AS 'trainer_id',
                COALESCE(TrainerName, '-') AS 'trainer',
                DurationHour AS 'hr',
                COALESCE(CourseLoc, '-') AS 'site',
                COALESCE(FORMAT(CourseStart, 'yyyy-MM-dd'), '-') AS 'start',
                COALESCE(FORMAT(CourseEnd, 'yyyy-MM-dd'), '-') AS 'end',
                COALESCE(TrainerCom, '-') AS 'div' 
            FROM 
                tbl_Course  
            ORDER BY 
                CourseStart DESC, CourseID DESC
            OFFSET @start ROWS FETCH NEXT 50 ROWS ONLY`;

        request.query(query, (err, records) => {
            const data = { data: null };
            if (err) {
                console.log(`get-all-courses query err: ${err}`);
            } else if (records.rowsAffected[0] > 0) {
                data.data = records.recordset;
            }
            res.send(data);
        });
    }).catch((err) => {
        console.log(`get-all-courses connect error : ${err}`);
    });
});


// แสดง id หลักสูตร
app.post('/get-form', (req, res) => {
    const id = req.body.id;
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.input('id', sql.NVarChar, id); // เพิ่มการระบุพารามิเตอร์ id

        var query = `SELECT Division as div FROM [TrainDB].[dbo].[Form] 
                    WHERE Form_ID = @id`; // ใช้ @id ในคำสั่ง SQL

        request.query(query, (err, records) => {
            let div = null;
            if (err) {
                console.log(`get-form query err: ${err}`);
            } else if (records.rowsAffected[0] > 0) {
                div = records.recordset[0].div;
            }
            res.send(div);

        });
    }).catch((err) => {
        console.log(`get-form connect error : ${err}`);
    });
});





module.exports = app;
