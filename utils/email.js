// Importing the nodemailer package for email functionality
const nodemailer = require('nodemailer');
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: '../config.env' });

/** Send an email using the nodemailer package.
 * @param {Object} options - Email options including recipient, subject, and message.
 */
const sendEmail = async (options) => {
    // 1. Create a transporter with specified host, port, and authentication
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // Note: For services like Gmail, consider activating "less secure app" option
        // For services like SendGrid or Mailgun, they are better suited for nodemailer
    });

    // 2. Define email options
    const mailOptions = {
        from: 'Alessandro Pecorilla <apecorillalearning@yahoo.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};

// Export the sendEmail function
module.exports = sendEmail;
