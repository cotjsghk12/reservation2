document.addEventListener('DOMContentLoaded', function() {
    const fetchReservations = async () => {
        try {
            const response = await fetch('https://reservation2-bpa6kbykm-cotjsghk12s-projects.vercel.app/api/reservations');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const form = document.querySelector('form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const studentName = document.querySelector('#studentName').value;
        const classNumber = document.querySelector('#classNumber').value;

        try {
            const response = await fetch('https://reservation2-bpa6kbykm-cotjsghk12s-projects.vercel.app/api/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ studentName, classNumber })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error submitting reservation:', error);
        }
    });

    fetchReservations();
});


function resevation() {
    const mystyle = document.getElementById("reservationForm");
    if (mystyle.style.display === 'none') {
        mystyle.style.display = 'block';
    }

    else {
        mystyle.style.display = 'none';
    }
}