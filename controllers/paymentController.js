// controllers/paymentController.js
const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const db = require('../db'); // Your mysql2 pool

exports.generatePromptPayQR = async (req, res) => {
    try {
        const { courseId, userId } = req.body;
        
        // 1. Fetch course price from DB
        const [courses] = await db.query('SELECT price FROM courses WHERE id = ?', [courseId]);
        if (courses.length === 0) return res.status(404).json({ error: 'Course not found' });
        
        const amount = parseFloat(courses[0].price);
        const promptPayId = process.env.MERCHANT_PROMPTPAY_ID; // e.g., '0812345678'
        
        // 2. Generate PromptPay Payload
        const payload = generatePayload(promptPayId, { amount });
        
        // 3. Convert payload to QR Code image (Data URI)
        const qrImage = await qrcode.toDataURL(payload);
        
        // 4. Create pending enrollment
        await db.query(
            'INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, ?)',
            [userId, courseId, 'pending_payment']
        );

        res.json({ qrCodeUrl: qrImage, amount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate payment QR' });
    }
};