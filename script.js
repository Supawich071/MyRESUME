/* =========================================
   1. GLOBAL FUNCTIONS (เรียกใช้จาก HTML ได้ทันที)
   ========================================= */

// เปิด/ปิด Stats Accordion
function toggleStat(element) {
    element.classList.toggle('open');
}

// เปิด/ปิด Contact Modal
function toggleContact() {
    const overlay = document.getElementById('contact-overlay');
    overlay.classList.toggle('active');
}

// เปลี่ยนภาษา + Glitch Effect
function switchLanguage(lang) {
    // 1. เริ่ม Glitch: ใส่ class ใส่ body
    document.body.classList.add('glitch-active'); // แก้ชื่อ class ให้ตรงกับ CSS ที่ให้ไป (glitch-active)

    // 2. ตั้งเวลา 0.5 วินาที แล้วเอา Glitch ออก
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
    }, 500);

    // 3. เปลี่ยนปุ่ม Active
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const btn = document.getElementById('btn-' + lang);
    if(btn) btn.classList.add('active');

    // 4. สลับภาษา
    if (lang === 'en') {
        document.querySelectorAll('.lang-th').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'inline-block'); 
    } else {
        document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.lang-th').forEach(el => el.style.display = 'inline-block');
    }
}

/* =========================================
   2. DOM LOADED (ทำงานเมื่อเว็บโหลดเสร็จ)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    // --- A. LOADER LOGIC ---
    const loader = document.getElementById('intro-loader');
    if (loader) {
        // รอ window load จริงๆ เพื่อให้รูป/วิดีโอมาครบก่อน
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loaded-finish');
                
                // เมื่อ Animation จบ (0.8s) ให้ซ่อน div
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.style.overflowY = 'auto'; // ปลดล็อค Scroll
                    
                    // แถม: Glitch ทักทาย
                    document.body.classList.add('glitch-active');
                    setTimeout(() => document.body.classList.remove('glitch-active'), 400);
                }, 800);
                
            }, 1500); // โชว์โลโก้ Phantom นาน 1.5 วิ
        });
    }

    // --- B. SCROLL PARALLAX ---
    const progressBar = document.querySelector('.scroll-progress-bar');
    const scrollText = document.querySelector('.scroll-text');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.body.style.setProperty('--scroll-y', scrolled);

        // Sidebar Progress
        if(progressBar && scrollText) {
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrolled / docHeight) * 100;
            progressBar.style.height = `${scrollPercent}%`;

            // เปลี่ยนข้อความเมื่อเลื่อนสุด
            if (scrollPercent > 95) {
                scrollText.innerText = "MISSION COMPLETE";
                scrollText.style.color = "#fff";
            } else {
                scrollText.innerText = "SCROLL DISTANCE";
                scrollText.style.color = "var(--p-red)";
            }
        }
    });

    // --- C. REVEAL ANIMATION (Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-trigger').forEach(el => observer.observe(el));

    // --- D. TEXT SPLITTER (Persona Text) ---
    // หมายเหตุ: ห้ามใช้ class นี้กับ Element ที่มีภาษาซ่อนอยู่ข้างใน เพราะมันจะล้าง Tag html ทิ้ง
    const p5Texts = document.querySelectorAll('.p5-animate-text');
    p5Texts.forEach(text => {
        const rawText = text.innerText;
        text.innerHTML = ''; // ล้างข้อความเดิม
        
        rawText.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.innerText = char;
            span.className = 'p5-char';
            span.style.animationDelay = `${index * 0.05}s`; 
            
            const randomRot = Math.floor(Math.random() * 10) - 5;
            span.style.transform = `rotate(${randomRot}deg)`;
            
            text.appendChild(span);
            
            if(char === ' ') {
                span.style.width = '0.5em';
                span.style.display = 'inline-block';
            }
        });
    });

    // --- E. MOUSE FOLLOWER ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');

    // ตรวจสอบว่ามี Cursor Element อยู่จริงไหม (กัน Error ในมือถือที่อาจซ่อนไว้)
    if (cursorDot && cursorCircle) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            
            // ใช้ Animation API หรือแค่เปลี่ยน style ก็ได้ (อันนี้ใช้แบบเดิมที่คุณเขียน)
            cursorCircle.animate({
                left: e.clientX + 'px',
                top: e.clientY + 'px'
            }, { duration: 500, fill: "forwards" });
        });

        // Effect ตอน Hover
        document.querySelectorAll('a, button, .stat-card, .video-inner').forEach(el => {
            el.addEventListener('mouseenter', () => cursorCircle.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorCircle.classList.remove('cursor-hover'));
        });
    }

    // --- F. CLICK BURST EFFECT ---
    document.addEventListener('click', (e) => {
        const burst = document.createElement('div');
        burst.classList.add('click-burst');
        burst.style.left = e.clientX + 'px';
        burst.style.top = e.clientY + 'px';
        
        if(Math.random() > 0.5) burst.style.background = 'var(--p-red)';
        
        document.body.appendChild(burst);

        setTimeout(() => {
            burst.remove();
        }, 400);
    });

});

/* =========================================
   ADD-ON: JS LOGIC (วางต่อท้ายไฟล์เดิม)
   ========================================= */

// --- 5. REAL-TIME HUD DATE (อัปเดตวันที่จริง) ---
function updateHUD() {
    const now = new Date();
    const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // เลือก Element (ถ้ามี)
    const elMonth = document.querySelector('.hud-month');
    const elDay = document.querySelector('.hud-day');
    const elDayText = document.querySelector('.hud-day-text');
    const elTime = document.querySelector('.hud-time-of-day');

    if(elMonth && elDay && elDayText) {
        elMonth.innerText = months[now.getMonth()];
        elDay.innerText = now.getDate();
        elDayText.innerText = days[now.getDay()];
        
        // เปลี่ยนช่วงเวลาตามเวลาจริง
        const hour = now.getHours();
        if(elTime) {
            if(hour >= 6 && hour < 12) elTime.innerText = "MORNING";
            else if(hour >= 12 && hour < 17) elTime.innerText = "AFTER SCHOOL";
            else if(hour >= 17 && hour < 20) elTime.innerText = "EVENING";
            else elTime.innerText = "LATE NIGHT";
        }
    }
}

// เรียกใช้ครั้งแรกและตั้งเวลาอัปเดต
updateHUD();
setInterval(updateHUD, 60000); // อัปเดตทุก 1 นาที

/* =========================================
   LANGUAGE SWITCHER LOGIC (FIXED GLITCH)
   ========================================= */
function switchLanguage(lang) {
    // 1. --- เริ่ม GLITCH EFFECT (ส่วนที่หายไป) ---
    // สั่งให้ Body มี class นี้เพื่อให้ CSS ทำงาน
    document.body.classList.add('glitch-active');

    // ตั้งเวลา 0.5 วินาที (500ms) แล้วเอา Glitch ออก
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
    }, 500);
    // ----------------------------------------

    // 2. --- ส่วนสลับภาษา ---
    const enElements = document.querySelectorAll('.lang-en');
    const thElements = document.querySelectorAll('.lang-th');
    const btnEn = document.getElementById('btn-en');
    const btnTh = document.getElementById('btn-th');

    // จัดการปุ่ม Active
    if (lang === 'th') {
        btnEn.classList.remove('active');
        btnTh.classList.add('active');
    } else {
        btnTh.classList.remove('active');
        btnEn.classList.add('active');
    }

    // จัดการซ่อน/แสดงเนื้อหา
    if (lang === 'th') {
        // ซ่อนอังกฤษ โชว์ไทย
        enElements.forEach(el => el.style.display = 'none');
        thElements.forEach(el => {
            // เช็คว่าเป็น tag span หรือ div เพื่อการแสดงผลที่ถูกต้อง
            if(el.tagName === 'SPAN') {
                el.style.display = 'inline-block';
            } else {
                el.style.display = 'block';
            }
        });
        
    } else {
        // ซ่อนไทย โชว์อังกฤษ
        thElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => {
            if(el.tagName === 'SPAN') {
                el.style.display = 'inline-block';
            } else {
                el.style.display = 'block';
            }
        });
    }
}


/* =========================================
   SCROLL IMAGE SEQUENCE (HEAD TURN) - UPDATED
   ========================================= */

const avatarConfig = {
    path: 'assets/headseq/head_', // โฟลเดอร์และชื่อส่วนหน้า
    extension: '.png',            // นามสกุลไฟล์ (ตามรูปของคุณ)
    count: 9                      // จำนวนรูปที่คุณมี (01-09)
};

const avatarImages = [];

// 1. Preload รูป (แก้ให้รองรับเลข 0 นำหน้า เช่น 01, 02)
function preloadAvatarImages() {
    for (let i = 1; i <= avatarConfig.count; i++) {
        const img = new Image();
        // เติมเลข 0 ถ้าค่าน้อยกว่า 10 (เช่น 1 -> 01)
        const formattedIndex = i < 10 ? '0' + i : i;
        img.src = `${avatarConfig.path}${formattedIndex}${avatarConfig.extension}`;
        avatarImages.push(img);
    }
}

// 2. คำนวณและเปลี่ยนรูปตอนเลื่อน
function updateAvatarOnScroll() {
    const avatarEl = document.getElementById('scroll-avatar');
    if (!avatarEl) return;

    // หาค่า % การ Scroll (0.0 ถึง 1.0)
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    let scrollPercent = scrollTop / docHeight;

    // กันค่าเกิน
    if (scrollPercent < 0) scrollPercent = 0;
    if (scrollPercent > 1) scrollPercent = 1;

    // คำนวณเฟรม: เรามี 9 รูป (Index 0-8 ใน array)
    // ใช้ Math.floor เพื่อปัดเศษ
    const totalFrames = avatarConfig.count;
    let frameIndex = Math.floor(scrollPercent * (totalFrames - 1));

    // เปลี่ยนรูป
    requestAnimationFrame(() => {
        if (avatarImages[frameIndex]) {
            avatarEl.src = avatarImages[frameIndex].src;
        }
    });
}

// เริ่มทำงาน
document.addEventListener('DOMContentLoaded', () => {
    preloadAvatarImages();
    window.addEventListener('scroll', updateAvatarOnScroll);
});