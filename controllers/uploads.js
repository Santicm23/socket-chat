
const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2;
const { default: axios } = require('axios');

const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");


cloudinary.config(process.env.CLOUDINARY_URL);

const loadFile = async(req, res) => {

    // const name = await uploadFile(req.files.file, ['txt', 'md'], 'txts');
    try {
        const name = await uploadFile(req.files.file, ['txt', 'md']);
    
        res.json({name});
    } catch (msg) {
        res.status(400).json({msg});
    }
}

const updateImg = async(req, res) => {
    const { id, collection } = req.params;

    let dbObject;

    switch (collection) {
        case 'users':
            dbObject = await User.findById(id);
            
            if (!dbObject) {
                return res.status(400).json({
                    msg: `No existe un id de usuario ${id}`
                });
            }

        break;

        case 'products':
            dbObject = await Product.findById(id);
            
            if (!dbObject) {
                return res.status(400).json({
                    msg: `No existe un id de producto ${id}`
                });
            }

        break;
    
        default:
            return res.status(500).json({
                msg: 'La opción no está terminada :('
            });
    }

    if (dbObject.image) {
        const pathImage = path.join(__dirname, '../uploads', collection, dbObject.image);
        if (fs.existsSync(pathImage))
            fs.unlinkSync(pathImage);
    }

    try {
        const name = await uploadFile(req.files.file, ['png', 'jpg', 'jpeg', 'gif'], collection);

        dbObject.image = name;
        
        await dbObject.save();

        res.json(dbObject);

    } catch (msg) {
        res.status(400).json({msg})
    }
}

const getUserImg = async(req, res) => {
    const { id, collection } = req.params;

    let dbObject;

    switch (collection) {
        case 'users':
            dbObject = await User.findById(id);
            
            if (!dbObject) {
                return res.status(400).json({
                    msg: `No existe un id de usuario ${id}`
                });
            }

        break;
        
        case 'products':
            dbObject = await Product.findById(id);
            
            if (!dbObject) {
                return res.status(400).json({
                    msg: `No existe un id de producto ${id}`
                });
            }

        break;
        
        default:
            return res.status(500).json({
                msg: 'La opción no está terminada :('
            });
        }

    if (dbObject.image) {
        const pathImage = path.join(__dirname, '../uploads', collection, dbObject.image);
        if (fs.existsSync(pathImage))
            return res.sendFile(pathImage);
    }

    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}

const getUserImgClodinary = async(req, res) => {
    const { id, collection } = req.params;

    let dbObject;

    switch (collection) {
        case 'users':
            dbObject = await User.findById(id);
            
            if (!dbObject) {
                return res.status(400).json({
                    msg: `No existe un id de usuario ${id}`
                });
            }

        break;
        
        case 'products':
            dbObject = await Product.findById(id);
            
            if (!dbObject) {
                return res.status(400).json({
                    msg: `No existe un id de producto ${id}`
                });
            }

        break;
        
        default:
            return res.status(500).json({
                msg: 'La opción no está terminada :('
            });
        }

    if (dbObject.image) {
        const axios_instance = axios.create({
            baseURL: dbObject.image,
            responseType: 'stream'
        });
        const { data } = await axios_instance.get();

        const imgPath = path.join(__dirname, '../assets/tmp.jpg');

        await data.pipe(
            fs.createWriteStream(imgPath)
        );
        data.on('end', () => {
            res.sendFile(imgPath)
        });

    } else {
        res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
    }
}

const updateImgCloudinary = async(req, res) => {
    const { id, collection } = req.params;

    let dbObject;

    switch (collection) {
        case 'users':
            dbObject = await User.findById(id);
            
            if (!dbObject) {
                return res.status(400).json({
                    msg: `No existe un id de usuario ${id}`
                });
            }

        break;

        case 'products':
            dbObject = await Product.findById(id);
            
            if (!dbObject) {
                return res.status(400).json({
                    msg: `No existe un id de producto ${id}`
                });
            }

        break;
    
        default:
            return res.status(500).json({
                msg: 'La opción no está terminada :('
            });
    }

    if (dbObject.image) {
        const urlSplited = dbObject.image.split('/');
        const [ imageId ] = urlSplited[urlSplited.length - 1].split('.');
        await cloudinary.uploader.destroy(imageId);
    }

    const { secure_url } = await cloudinary.uploader.upload(req.files.file.tempFilePath);
    dbObject.image = secure_url;

    await dbObject.save();

    res.json(dbObject);
}


module.exports = {
    loadFile,
    updateImg,
    getUserImg,
    updateImgCloudinary,
    getUserImgClodinary
}