import { MongoClient } from 'mongodb';
import express from 'express'

 
const app = express()
 
app.use(express.json())
var database
 
app.get('/', (req, resp) => {
    resp.send('Welcome Onkar')
})
app.get('/api/products',(req, resp) => {
    database.collection('products').find({}).toArray((err, result) => {
        if(err) throw err
        resp.send(result)
    })
})
app.get('/api/products/:id',(req, resp) => {
    database.collection('products').find({product: (req.params.id)}).toArray((err, result) => {
        if(err) throw err
        resp.send(result)
    })
})
app.post('/api/products/addProducts', (req, resp)=>{
    let res = database.collection('products').find({}).sort({id: -1}).limit(1)
    res.forEach(obj =>{
        if(obj){
            let product ={
                product: req.body.product ,
                price: req.body.price
            }
            database.collection('products').insertOne(product, (err, result) =>{
                if(err) resp.status(500).send(err)
                resp.send("Added Successfully")
            })
        }
    })
})
app.put('/api/products/:id',(req, resp) => {
   let product = {
        product: (req.params.id),
        price: req.body.price
    }
    database.collection('products').updateOne(
        {product: (req.params.id)}, 
        {$set: product}, (err, result) =>{
        if(err) throw err
        resp.send(product)
    })
})
 
app.delete('/api/products/:id', (req, resp) => {
    database.collection('products').deleteOne({product: (req.params.id)}, (err, result) =>{
        if(err) throw err
        resp.send('product is deleted')
    })
})
 
app.listen(8080, () => {
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true}, (error, result) =>{
        if(error) throw error
        database = result.db('Store')
        console.log('Connection sucessful!')
    })
})