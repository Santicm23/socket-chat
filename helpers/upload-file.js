
const path = require('path');
const { v4: uuidV4 } = require('uuid');


const uploadFile = (file, validExtensions, directory = '') => {

    return new Promise((resolve, reject) => {

        const fileSplited = file.name.split('.');
        const extension = fileSplited[fileSplited.length - 1];
    
        if (!validExtensions.includes(extension))
            return reject(`La extension ${extension} no es válida (${validExtensions})`);

        const newFileName = `${uuidV4()}.${extension}`;
    
        const uploadPath = path.join(__dirname, '../uploads/', directory, newFileName);
    
        file.mv(uploadPath, (err) => {
            if (err)
                return reject(err);
    
            resolve(newFileName);
        });
    })
}

module.exports = {
    uploadFile
}