// เตรียมไฟล์เสียง: ต้องสร้างไฟล์ชื่อ notification.mp3 หรือเปลี่ยนชื่อไฟล์
const notificationSound = new Audio('notification.mp3');

// ฟังก์ชันสำหรับเล่นเสียง
function playNotificationSound() {
    notificationSound.play();
}

// ใช้ localStorage เพื่อเก็บข้อมูลการบ้านให้ไม่หายเมื่อรีเฟรชหน้า
const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];

const homeworkForm = document.getElementById('homeworkForm');
const homeworkList = document.getElementById('homeworkList');

// ฟังก์ชันสำหรับสุ่มเวลาทำ โดยจะอิงจากความซับซ้อนของงาน
function getAiSuggestedTime() {
    // สุ่มตัวเลขระหว่าง 15-45 นาที
    return Math.floor(Math.random() * (45 - 15 + 1)) + 15;
}

// ฟังก์ชันสำหรับแสดงรายการการบ้านทั้งหมด
function renderHomeworks() {
    homeworkList.innerHTML = '';
    if (homeworks.length === 0) {
        homeworkList.innerHTML = '<p class="text-center text-muted">ไม่มีการบ้านที่ต้องทำ</p>';
        return;
    }

    homeworks.forEach((hw, index) => {
        const homeworkItem = document.createElement('div');
        homeworkItem.classList.add('homework-item');
        if (hw.completed) {
            homeworkItem.classList.add('completed');
        }
        
        // แก้ไขส่วนนี้เพื่อให้แสดงชื่อครูเสมอ
        const teacherName = hw.teacher || '-'; 

        homeworkItem.innerHTML = `
            <div class="task-info">
                <h4>${hw.subject}</h4>
                <p>ครูผู้สอน: ${teacherName}</p>
                <p>${hw.task}</p>
                <small>ส่งวันที่: ${hw.dueDate} เวลา: ${hw.dueTime}</small><br>
                <small>เวลาที่ AI แนะนำ: ${hw.suggestedTime} นาที</small>
            </div>
            <div class="actions">
                <button class="btn btn-sm btn-success complete-btn" data-index="${index}">เสร็จแล้ว</button>
                <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">ลบ</button>
            </div>
        `;

        homeworkList.appendChild(homeworkItem);
    });

    // เพิ่ม Event Listener ให้กับปุ่ม "เสร็จแล้ว" และ "ลบ"
    document.querySelectorAll('.complete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            toggleComplete(index);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            deleteHomework(index);
        });
    });
}

// ฟังก์ชันสำหรับเพิ่มการบ้านใหม่
homeworkForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newHomework = {
        subject: document.getElementById('subject').value,
        teacher: document.getElementById('teacher').value, // เพิ่มข้อมูลชื่อครูผู้สอน
        task: document.getElementById('task').value,
        dueDate: document.getElementById('dueDate').value,
        dueTime: document.getElementById('dueTime').value,
        suggestedTime: getAiSuggestedTime(), // ใช้ฟังก์ชัน AI สุ่มเวลา
        completed: false
    };

    homeworks.push(newHomework);
    localStorage.setItem('homeworks', JSON.stringify(homeworks)); // บันทึกข้อมูลลง localStorage
    homeworkForm.reset();
    renderHomeworks();
    playNotificationSound(); // เล่นเสียงเมื่อเพิ่มการบ้าน
});

// ฟังก์ชันสำหรับสลับสถานะ "เสร็จแล้ว"
function toggleComplete(index) {
    homeworks[index].completed = !homeworks[index].completed;
    localStorage.setItem('homeworks', JSON.stringify(homeworks));
    renderHomeworks();
    playNotificationSound(); // เล่นเสียงเมื่อกดเสร็จ
}

// ฟังก์ชันสำหรับลบการบ้าน
function deleteHomework(index) {
    homeworks.splice(index, 1);
    localStorage.setItem('homeworks', JSON.stringify(homeworks));
    renderHomeworks();
    playNotificationSound(); // เล่นเสียงเมื่อลบการบ้าน
}

// เรียกใช้ฟังก์ชันเมื่อเปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', renderHomeworks);