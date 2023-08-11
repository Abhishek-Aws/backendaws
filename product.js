const Product = require("../models/product");
const _ = require("lodash");
const formidable = require("formidable"); // Import the formidable module
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

// exports.createProduct = (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;

//   form.parse(req, (err, fields, file) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Problem with image",
//       });
//     }

//     //destructure the fields
//     const { name, description, price, category, stock, code, taxrate } = fields;
//     if (
//       !name ||
//       !description ||
//       !price ||
//       !category ||
//       !stock ||
//       !code ||
//       !taxrate

//     ) {
//       return res.status(400).json({
//         error: "Please include all the fields",
//       });
//     }

//     let product = new Product(fields);

//     //handle file here

//     if (file.photo) {
//       if (file.photo.size > 3000000) {
//         return res.status(400).json({
//           error: "Files size is too big!!!",
//         });
//       }
//       product.photo.data = fs.readFileSync(file.photo.path);
//       product.photo.contentType = file.photo.type;
//     }
//     console.log(product);
//     //save to the DB
//     product.save((err, product) => {
//       if (err) {
//         res.status(400).json({
//           error: "Saving product in DB failed",
//         });
//       }
//       res.json(product);
//     });
//   });
// };

exports.createProduct = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //   console.log("File object:", file);

    //destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    // Handle file here

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // console.log(product);

    try {
      const savedProduct = await product.save();
      res.json(savedProduct);
    } catch (error) {
      res.status(400).json({
        error: "Saving product in DB failed",
      });
    }
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    res.json({
      message: "Deletetion product success",
      deletedProduct
    });
  });
};

exports.updateProduct = (req, res) => {
  
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //   console.log("File object:", file);

    //updation code
    let product = req.product;
    product = _.extend(product, fields)

    // Handle file here

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // console.log(product);

    try {
      const savedProduct = await product.save();
      res.json(savedProduct);
    } catch (error) {
      res.status(400).json({
        error: "Updation of product failed"
      });
    }
  });
};


// exports.getAllProducts = (req, res) =>{
//     let limit = req.query.limit ? parseInt(req.query.limit) : 8
//     let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

//     Product.find()
//     .select("-photo")
//     .populate("category")
//     .sort([[sortBy, "asc"]])
//     .limit(limit)
//     .exec((err, products) =>{
//       if(err){
//         return res.status(400).json({
//           error: "NO product found"
//         })
//       }
//       res.json(products)
//     })
// }

exports.getAllProducts = async (req, res) => {
  try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 8;
      let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

      const products = await Product.find()
          .select("-photo")
          .populate("category")
          .sort([[sortBy, "asc"]])
          .limit(limit)
          .exec();

      if (products.length === 0) {
          return res.status(404).json({
              error: "No products found"
          });
      }

      res.json(products);
  } catch (err) {
      res.status(500).json({
          error: "Internal server error"
      });
  }
};


exports.getAllUniqueCategories = (req, res)=>{
    Product.distinct("category", {}, (err, category) => {
      if(err){
        return res.status(400).json({
          error: "No category found"
        })
      }
      res.json(category)
    })

}

exports.updateStock = (req, res, next) =>{
  let myOperations = req.body.order.products.map(prod => {
    return {
        updateOne: {
        filter: { _id: prod._id },
        update: { $inc: {stock: -prod.count, sold: +prod.count}}
      }
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) =>{
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      });
    }
    next();
  });
};


