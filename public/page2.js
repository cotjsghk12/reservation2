function reservation() {
    const res = document.getElementById("reservationForm");

    if (res.style.display === 'none') {
        res.style.display = 'block';
    }

    else {
        res.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // 예약 데이터 가져오기
    try {
        const response = await fetch('http://localhost:3000/api/reservations');
        const reservations = await response.json();
        console.log(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }

    document.getElementById('reservationForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const studentName = document.getElementById('studentName').value.trim();
        const classNumber = document.getElementById('classNumber').value.trim();

        // 입력 데이터 검증
        if (!studentName || !classNumber) {
            alert("학생 이름과 반 번호를 모두 입력하세요!");
            return;
        }

        if (!/^\d+$/.test(classNumber)) { // 반 번호는 숫자로만 구성되어야 함
            alert("반 번호는 숫자만 입력할 수 있습니다.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, classNumber })
            });

            const result = await response.json();

            // 결과 메시지 알림창 출력
            alert(result.message);
        } catch (error) {
            console.error(error);
            alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    });
});
