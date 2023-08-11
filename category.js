const Category = require("../models/category")


// exports.getcategoryById = (req, res, next, id) =>{
//     Category.findById(id).exec((err, cate) => {
//         if(err){
//             return res.status(400).json({
//                 error: "Category not found in DB"
//             })
//         }
//         req.category = cate;
//         next();
//     })
    
    
// }

exports.getCategoryById = async (req, res, next, id) => {
    try {
      const category = await Category.findById(id).exec();
      if (!category) {
        return res.status(400).json({
          error: "Category not found in DB",
        });
      }
      req.category = category;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
 
//   exports.createCategory = (req, res) => {
//     const category = new Category(req.body);
//     category.save((err, category) => {
//         if(err){
//             return res.status(400).json({
//                 error: "Not able to save category in DB"
//             });
//         }

//         res.json({ category });
//     });
//   }

exports.createCategory = async (req, res) => {
    try {
      const category = new Category(req.body);
      const savedCategory = await category.save();
  
      res.json({ category: savedCategory });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error: "Not able to save category in DB",
      });
    }
  };
  
//   exports.getCategory = (req, res) => {

//     return res.json(req.category);

//   }


//   exports.getAllCategory = (req, res) =>{

//     Category.find().exec((err, categories) => {
//         if(err) {
//             return res.status(400).json({
//                 error: "No categories found"
//             });
//         }
//         res.json(categories)
//     })

//   }

exports.getCategory = (req, res) => {
    return res.json(req.category);
  };
  
  exports.getAllCategory = async (req, res) => {
    try {
      const categories = await Category.find().exec();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(400).json({

        error: "No categories found",
      });
    }
  };
  

//   exports.updateCategory = (req, res) =>{
//     const category = req.category;
//     category.name = req.body.name;

//     category.save((err, updatedCategory) =>{
//         if(err) {
//             return res.status(400).json({
//                 error: "Failed to update category"
//             });
//         }

//         res.json(updatedCategory)
//     });
//   };

exports.updateCategory = async (req, res) => {
    try {
      const category = req.category;
      category.name = req.body.name;
      const updatedCategory = await category.save();
  
      res.json(updatedCategory);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error: "Failed to update category",
      });
    }
  };

//  exports.removeCategory = (req, res) =>{
//     const category = req.category;

//     category.remove((err, category) => {
//         if(err){
//             return res.status(400).json({
//                 error: "Failed to delete this category"
//             });
//         }
//         res.json({
//             message: "`{category}` succesfully deleted"
//         });
//     });
//  };

  
  exports.removeCategory = async (req, res) => {
    try {
      const category = req.category;
      const deletedCategory = await category.deleteOne();
  
      res.json({
        message: `${deletedCategory.name} successfully deleted`,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error: "Failed to delete this category",
      });
    }
  };
  