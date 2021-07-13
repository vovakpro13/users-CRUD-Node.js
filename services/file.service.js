const { v4: uuidv4 } = require('uuid');

const { staticDirNames: { FOLDER_NAME_TYPE_FILE, FOLDER_NAMES } } = require('../constants');

module.exports = {
    buildFileDir: async (fileName, itemId, itemsName = FOLDER_NAMES.USERS, itemsType = FOLDER_NAME_TYPE_FILE.IMAGES) => {
        const fileExtension = fileName.split('.').pop();
        const file = `${uuidv4()}.${fileExtension}`;

        const uploadUrl = `${itemsName}/${itemId}/${itemsType}/${file}`;

        return { uploadUrl };
    }
};
