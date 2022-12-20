const express = require('express')
const multer = require('multer')
const dotenv = require('dotenv').config();
const app = express()
const mongoose = require('mongoose')
const Image = require('./image')




const connectDB = async () => {
    const conn = await mongoose
        .connect(process.env.MONGO_DB_URL
        )
        .then(() => console.log("e don connect"))
        .catch((err) => console.log(err));
}

connectDB()





app.set('view engine', 'ejs');
app.use('/files/', express.static('./files'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const uploadStorage = multer({ storage: storage })

app.get('/', async (req, res) => {
    
    res.render('uploadfile')
    
})

app.post('/',uploadStorage.fields([{name:"file1"},{name:"file2"}]), async(req, res) => {
    const image = new Image
    image.image.push(req.files.file1[0].filename)
    image.image.push(req.files.file2[0].filename)
    image.save().then((resp) => {
        res.redirect('/images')
    })
})

app.get('/images', (req, res) => {
    Image.find().then((images) => {
        console.log(images);
        res.render('images', {images})
    })
})


app.listen(3000)