const { createTransport } = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

const templateInfo = require('../email-templates');
const { ErrorHandler, errorMessages: { WRONG_EMAIL_TEMPLATE } } = require('../errors');
const {
    responseCodes,
    mailKeywords: { GMAIL, FROM },
    config: { MAIL_PASS, MAIL_USER }
} = require('../constants');

const transporter = createTransport({
    service: GMAIL,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
});

const htmlParser = new Email({
    views: { root: path.join(process.cwd(), 'email-templates') }
});

module.exports = {
    sendMessage: async (to, action, locals = {}) => {
        const templateObject = templateInfo[action];

        if (!templateObject) {
            throw new ErrorHandler(
                responseCodes.NOT_FOUND,
                WRONG_EMAIL_TEMPLATE.message,
                WRONG_EMAIL_TEMPLATE.code
            );
        }

        const { template, subject } = templateObject;

        const html = await htmlParser.render(template, { ...locals, title: subject });

        await transporter.sendMail({
            from: FROM, to, subject, html
        });
    }
};
