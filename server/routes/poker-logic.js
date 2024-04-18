const express = require('express');

const router = express.Router();

// EXAMPLES
router.get('/add-product',(req,res,next)=>{
    res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
}); 

router.post('/product',(req,res,next)=>{
    console.log(req.body.title);
    res.redirect('/');
}); 

//tests
router.get('/',(req,res,next)=>{
    res.write('<h1>Hello world</h1>');
}); 



module.exports = router;