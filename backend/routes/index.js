const express = require('express');
const router = express.Router();
const Product = require('../models/product');
require('../models/db');


//get
router.get('/',async(req,res)=>{
  try{
    const products = await Product.find();
    res.json(products);
  }catch(err){
    res.status(500).send('server error')
  }
});

//search
router.get('/search', async (req,res)=>{
  try{
    const query = req.query.q;
    const products = await Product.find({
      $or:[
        {name:{$regex : query,$options:'i'}},
        {description:{$regex : query,$options:'i'}}
      ]
    });
    res.json(products);
  }catch(err){
    res.status(500).send('server error')
  }
});

//filter
router.get('/category/:category',async(req,res)=>{
  try{
    const products =await Product.find({category: req.params.category});
     res.json(products);
  }catch(err){
    res.status(500).send('server error')
  }
});

//post
router.post('/',async(req,res)=>{
  try{
    const newProduct =new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct)
  }catch(err){
    res.status(500).send('server error')
  }
});

//update
router.put('/:id',async(req,res)=>{
  try{
    const updated = await product.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(updated);
  }catch(err){
    res.status(500).send('server error')
  }
})

//delete
router.delete('/id',async(req,res)=>{
  try{
    await product.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"deleted "});
  }catch(err){
    res.status(500).send('server error')
  }
});

module.exports = router;