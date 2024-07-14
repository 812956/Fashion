const asyncHandler = require('express-async-handler')
const {OK} = require('../../utils/statuscodes')
const productCLTN = require('../../modles/admin/productModal')
const categoriesCLTN = require('../../modles/admin/categoryModal')
const productVariantCLTN = require("../../modles/admin/productsVariantsMd");

// rendering Landing page
exports.viewLandingPage = asyncHandler(async (req,res)=>{
          

      const [men,women] = await Promise.all([
            categoriesCLTN.find({is_delete:false,parent:'662f6a062691f6da78d9d0c3'}).populate('parent'),
            categoriesCLTN.find({is_delete:false,parent:'662f82ed1c7bf5cc845b4ad1'}).populate('parent')
      ])

      const latestProducts = await productCLTN.find({is_deleted:false}).sort({createdDate:-1}).limit(8).populate('offer')


      for(let product of latestProducts) {
            const variantPrice = await productVariantCLTN.findOne({productId:product._id},{_id:0,prices:1})
     
            product.originalPrice = variantPrice.prices[0]
      }
     
       res.status(OK).render('index/partials/landingPage',{men,women,latestProducts})  
})

