const { errors, responseCodes } = require("../constants");
const {
    ROUTE_NOT_FOUND,
    WRONG_EMAIL_OR_PASSWORD,
    EMAIL_IS_NOT_ACTIVATED,
    UNAUTHORIZED,
    PERMISSION_DENIED,
    RESET_TOKEN_IS_NOT_EXIST
} = require("./error-messages");

class ErrorHandler extends Error {
    constructor(status, message, customCode) {
        super(message);
        this.status = status;
        this.message = message;
        this.code = customCode;

        Error.captureStackTrace(this, this.constructor);
    }

    static throwRouteNotFound(req, res, next) {
        next(
            new ErrorHandler(
                responseCodes.NOT_FOUND,
                ROUTE_NOT_FOUND.message,
                ROUTE_NOT_FOUND.code)
        );
    }

    static handleErrors(err, req, res, next) {
        res
            .status(err.status || responseCodes.BAD_REQUEST)
            .json({
                message: err.message || errors.UNKNOWN_ERROR,
                customCode: err.code || 0
            });
    }

    static throwWrongAuthError() {
        throw new ErrorHandler(
            responseCodes.UNAUTHORIZED,
            UNAUTHORIZED.message,
            UNAUTHORIZED.code);
    }

    static throwUnauthorized() {
        throw new ErrorHandler(
            responseCodes.BAD_REQUEST,
            WRONG_EMAIL_OR_PASSWORD.message,
            WRONG_EMAIL_OR_PASSWORD.code
        );
    }

    static throwPermissionDenied() {
        throw new ErrorHandler(
            responseCodes.BAD_REQUEST,
            PERMISSION_DENIED.message,
            PERMISSION_DENIED.code
        );
    }

    static throwNotValidRequestBody(message) {
        throw new ErrorHandler(
            responseCodes.BAD_REQUEST,
            message,
            responseCodes.BAD_REQUEST
        );
    }

    static throwNotActivatedEmail() {
        throw new ErrorHandler(
            responseCodes.BAD_REQUEST,
            EMAIL_IS_NOT_ACTIVATED.message,
            EMAIL_IS_NOT_ACTIVATED.code
        );
    }

    static throwResetTokenIsNotExist() {
        throw new ErrorHandler(
            responseCodes.BAD_REQUEST,
            RESET_TOKEN_IS_NOT_EXIST.message,
            RESET_TOKEN_IS_NOT_EXIST.code
        );
    }
}

module.exports = ErrorHandler;
