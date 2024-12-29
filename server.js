const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');  // CORS 추가

const app = express();
const port = 3000;

// MySQL 연결 설정
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Young0612!',
    database: 'reservation_system'
});

app.use(bodyParser.json());
app.use(cors());  // CORS 사용
app.use(express.static(path.join(__dirname, 'public'))); // 현재 디렉토리를 정적 파일의 기준으로 설정

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
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
