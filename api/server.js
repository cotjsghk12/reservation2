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
app.use(cors({
    origin: 'https://reservation2-ow2y3k799-cotjsghk12s-projects.vercel.app' // 허용할 도메인
}));

// MySQL 연결 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// 예약 API
app.post('/reserve', async (req, res) => {
    const { studentName, classNumber } = req.body;

    // 입력 데이터 검증
    if (!studentName || !classNumber || typeof studentName !== 'string' || !/^\d+$/.test(classNumber)) {
        return res.status(400).json({ message: '입력 데이터가 올바르지 않습니다.' });
    }

    try {
        // 현재 예약자 수 확인
        const [countResult] = await db.query('SELECT COUNT(*) AS total FROM Reservations');
        const totalReservations = countResult[0].total;

        if (totalReservations >= 15) {
            return res.json({ message: '예약이 모두 찼습니다. 더 이상 예약할 수 없습니다.' });
        }

        // 중복 체크
        const [rows] = await db.query(
            'SELECT * FROM Reservations WHERE student_name = ? AND class_number = ?',
            [studentName, classNumber]
        );

        if (rows.length > 0) {
            return res.json({ message: '이미 예약되었습니다!' });
        }

        // 새로운 예약 저장
        await db.query(
            'INSERT INTO Reservations (student_name, class_number) VALUES (?, ?)',
            [studentName, classNumber]
        );
        res.json({ message: `예약이 완료되었습니다! 학생: ${studentName}, 반 번호: ${classNumber}` });
    } catch (error) {
        console.error(error);
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


