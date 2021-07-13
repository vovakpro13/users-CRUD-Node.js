const { ErrorHandler, errorMessages: { NOT_ALLOWED_FILE_TYPE } } = require('../errors');
const {
    mimetypes: {
        IMAGE,
        AUDIO,
        DOCUMENTS,
        VIDEO
    },
    config: {
        AUDIO_MAX_SIZE,
        IMAGE_MAX_SIZE,
        VIDEO_MAX_SIZE,
        DOCUMENT_MAX_SIZE
    },
    statusCodes,
    errors: { ONLY_ONE_AVATAR, MAX_FILE_COUNT }
} = require('../constants');
const { errorsHelper } = require('../helpers');

module.exports = {
    checkFiles: (req, res, next) => {
        try {
            const files = Object.values(req.files);

            const images = [];
            const audios = [];
            const docs = [];
            const videos = [];

            files.forEach((file) => {
                const { name, size, mimetype } = file;

                if (IMAGE.includes(mimetype)) {
                    if (size > IMAGE_MAX_SIZE) {
                        errorsHelper.throwBigFileSize(name, IMAGE_MAX_SIZE);
                    }

                    images.push(file);
                } else if (AUDIO.includes(mimetype)) {
                    if (size > AUDIO_MAX_SIZE) {
                        errorsHelper.throwBigFileSize(name, AUDIO_MAX_SIZE);
                    }

                    audios.push(file);
                } else if (DOCUMENTS.includes(mimetype)) {
                    if (size > DOCUMENT_MAX_SIZE) {
                        errorsHelper.throwBigFileSize(name, DOCUMENT_MAX_SIZE);
                    }

                    docs.push(file);
                } else if (VIDEO.includes(mimetype)) {
                    if (size > VIDEO_MAX_SIZE) {
                        errorsHelper.throwBigFileSize(name, VIDEO_MAX_SIZE);
                    }

                    videos.push(file);
                } else {
                    throw new ErrorHandler(
                        statusCodes.BAD_REQUEST,
                        NOT_ALLOWED_FILE_TYPE.message,
                        NOT_ALLOWED_FILE_TYPE.code
                    );
                }
            });

            req.images = images;
            req.audios = audios;
            req.docs = docs;
            req.videos = videos;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkAvatarValid: (req, res, next) => {
        try {
            const { images } = req;

            if (images.length > 1) {
                errorsHelper.throwNotValidRequestBody(ONLY_ONE_AVATAR);
            }

            [req.avatar] = images;

            next();
        } catch (e) {
            next(e);
        }
    },

    maxFilesCount: (type, maxCount) => (req, res, next) =>{
        try {
            if (req[type].length > maxCount) {
                errorsHelper.throwNotValidRequestBody(`${MAX_FILE_COUNT} ${maxCount}`);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
