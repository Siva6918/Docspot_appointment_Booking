const sendEmail = async ({ to, subject, text }) => {
    // Mock Email Service
    // In a real application, you would use nodemailer or a transactional email service here.
    console.log(`
    ====================================================
    [MOCK EMAIL SERVICE]
    To: ${to}
    Subject: ${subject}
    Body:
    ${text}
    ====================================================
    `);
    return true;
};

module.exports = { sendEmail };
