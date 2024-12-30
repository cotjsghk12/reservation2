const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS 설정
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '../public')));

// MySQL 연결 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(bodyParser.json());

// 예약 API
app.post('/api/reserve', async (req, res) => {
    const { studentName, classNumber } = req.body;

    if (!studentName || !classNumber || typeof studentName !== 'string' || !/^\d+$/.test(classNumber)) {
        return res.status(400).json({ message: '입력 데이터가 올바르지 않습니다.' });
    }

    try {
        const [countResult] = await db.query('SELECT COUNT(*) AS total FROM Reservations');
        const totalReservations = countResult[0].total;

        if (totalReservations >= 15) {
            return res.json({ message: '예약이 모두 찼습니다. 더 이상 예약할 수 없습니다.' });
        }

        const [rows] = await db.query(
            'SELECT * FROM Reservations WHERE student_name = ? AND class_number = ?',
            [studentName, classNumber]
        );

        if (rows.length > 0) {
            return res.json({ message: '이미 예약되었습니다!' });
        }

        await db.query(
            'INSERT INTO Reservations (student_name, class_number) VALUES (?, ?)',
            [studentName, classNumber]
        );
        res.json({ message: `예약이 완료되었습니다! 학생: ${studentName}, 반 번호: ${classNumber}` });
    } catch (error) {
        console.error('Database error:', error);  // 오류 로그 출력
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/reservations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Reservations');
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);  // 오류 로그 출력
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.listen(port, () => {
    if (process.env.NODE_ENV === 'production') {
        console.log(`서버가 프로덕션 모드에서 실행 중입니다.`);
    } else {
        console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
    }
});

