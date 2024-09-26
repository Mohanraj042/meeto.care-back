import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Product,ProductDocument } from "../model/product.model";

var activity = "Product";

/**
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to calculate the discounted price
 */


export let saveProduct = async (req, res, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const productDetails: ProductDocument = req.body;
            const { originalPrice, discountPercentage, gstRate, specifications:rawSpecifications } = productDetails;              
            const finalPrice = Number(originalPrice) + Number((Number(originalPrice) * Number(gstRate)) / 100);  // gst will be added
            productDetails.finalPrice =Math.round(Number(finalPrice));
 
            const discountedPrice = Number(finalPrice) - Number(Number(finalPrice) * Number(discountPercentage) / 100); // discount will be added
            productDetails.discountedPrice =Math.round (Number(discountedPrice));
            let specifications :any[]= [];
            if (Array.isArray(rawSpecifications)) {
                specifications = rawSpecifications.map((spec: any) => ({
                    heading: spec.heading,
                    points: spec.points,
                }));
            }
            const createData = new Product(productDetails);
            const insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-Product', true, 200, insertData, clientError.success.savedSuccessfully);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Product', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Product', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Santhosh Khan K
 * @date   26-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to decrease the quantity
 */

export const decreaseProductQuantity = async (req, res, next) => {
    const productId = req.body._id;
    const quantityToPurchase = req.body.quantityToPurchase;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        response(req, res, activity, 'Level-3', 'Decrease-Quantity', false, 404, {}, errorMessage.notFound, 'Product not found');
      }
      const startingQuantity = 1;
      if (product.quantity < quantityToPurchase) {
      }
      const remainingQuantity = product.quantity - quantityToPurchase;
      product.quantity = remainingQuantity >= startingQuantity ? remainingQuantity : startingQuantity;
      await product.save();
      response(req, res, activity, 'Level-2', 'Decrease-Quantity', true, 200, {},remainingQuantity, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Decrease-Quantity', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };
  

/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all products
 */

export let getAllProduct = async (req, res, next) => {
        try {
            const productDetails = await Product.find({isDeleted: false}).sort({ createdAt: -1});
            response(req, res, activity, 'Level-2', 'Get-All-Product', true, 200, productDetails, clientError.success.fetchedSuccessfully);   
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-All-Product', false, 500, {}, errorMessage.internalServer, err.message);
        }
};

/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update product.
 */

export let updateProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const productDetails: ProductDocument = req.body;
            const { specifications:rawSpecifications, benefits:rawBenefits } = productDetails;
            const { originalPrice, discountPercentage, gstRate } = productDetails;
            const finalPrice = Number(originalPrice) + Number((Number(originalPrice) * Number(gstRate)) / 100);  // gst will be added
            productDetails.finalPrice =Math.round(Number(finalPrice));
 
            const discountedPrice = Number(finalPrice) - Number(Number(finalPrice) * Number(discountPercentage) / 100); // discount will be added
            productDetails.discountedPrice =Math.round (Number(discountedPrice));

            let specifications: any[] = [];
            if (Array.isArray(rawSpecifications)) {
                specifications = rawSpecifications.map((spec: any) => ({
                    heading: spec.heading,
                    points: spec.points,
                }));
            }

            let benefits: string[] = [];
            if (Array.isArray(rawBenefits)) {
                benefits = rawBenefits.map((benefit: any) => String(benefit));
            }

            const updateData = await Product.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    productName: productDetails.productName,
                    productDescription: productDetails.productDescription,
                    productGif: productDetails.productGif,
                    quantity: productDetails.quantity,
                    originalPrice: productDetails.originalPrice,
                    categoryName:productDetails.categoryName,
                    gstRate: productDetails.gstRate,
                    finalPrice: productDetails.finalPrice,
                    discountPercentage: productDetails.discountPercentage,
                    discountedPrice: productDetails.discountedPrice,
                    selling: productDetails.selling,
                    topImage: productDetails.topImage,
                    sideImage: productDetails.sideImage,
                    backImage: productDetails.backImage,
                    frontImage: productDetails.frontImage,
                    productImage: productDetails.productImage,
                    modifiedOn: productDetails.modifiedOn,
                    modifiedBy: productDetails.modifiedBy,
                    specifications: specifications,
                    benefits: benefits
                }
            },{
                new: true // Return the updated document
            });
            response(req, res, activity, 'Level-2', 'Update-Product', true, 200, updateData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Product', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Product', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete product
 */

export let deleteProduct = async (req, res, next) => {
    try {
        const productDetails = await Product.findOneAndUpdate({ _id: req.query._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Delete-Product', true, 200, productDetails, clientError.success.deleteSuccess);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Product', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Filtered product
 */

export let getFilteredProduct = async (req, res, next) => {
    try {

        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if(req.body.panelId){
            andList.push({panelId:req.body.panelId})
        }
        if (req.body.productName) {
            andList.push({ productName: { productName: req.body.productName } })
        }
        if (req.body.productPrice) {
            andList.push({ productPrice: req.body.productPrice })
        }
        if (req.body.productDiscount) {
            andList.push({ productDiscount: req.body.productDiscount })
        }
        if (req.body.selling) {
            andList.push({ selling: req.body.selling })
        }
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const productList = await Product.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('panelId',{companyName:1}).populate('companyId',{companyName:1});
        const productCount = await Product.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { productList, productCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Hot Selling product
 */


export let hotSelling = async (req, res, next) => {
    try {
        const productList = await Product.find({$and:[{ selling:"hot"}, {isDeleted: false }]}).sort({ createdOn: -1 });
        response(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { productList }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Single Product
 */

export let getSingleProduct = async (req, res, next) => {
    try {
        const productDetails = await Product.findById({ _id: req.query._id,quantity:req.query.quantity }).sort({ createdOn: -1 }).populate('panelId',{companyName:1}).populate('companyId',{companyName:1});
        response(req, res, activity, 'Level-2', 'Get-Product', true, 200, productDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Product', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save Product For Web
 */


export let saveProductForWeb = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const productDetails: ProductDocument = req.body;
            const createData = new Product(productDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-Product', true, 200, insertData, clientError.success.savedSuccessfully);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Product', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Product ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get All Product For Web
 */

export let getAllProductForWeb = async (req, res, next) => {
    try {
        const productDetails = await Product.find({isDeleted: false}).sort({ createdAt: -1 });
        response(req, res, activity, 'Level-2', 'Get-All-Product', true, 200, productDetails, clientError.success.fetchedSuccessfully);   
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-Product', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to hot selling for web
 */

export let hotSellingForWeb = async (req, res, next) => {
    try {
        const productList = await Product.find({$and:[{ selling:"hot"}, {isDeleted: false }]}).sort({ createdOn: -1 });
        response(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { productList }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Filtered Product For Web
 */

export let getFilteredProductForWeb = async (req, res, next) => {
    try {

        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const productList = await Product.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
        const productCount = await Product.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { productList, productCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save product for company
 */


export let saveProductForCompany = async (req, res, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const productDetails: ProductDocument = req.body;

            const { originalPrice, discountPercentage, gstRate,specifications:rawSpecifications } = productDetails;
              
            const finalPrice = Number(originalPrice) + Number((Number(originalPrice) * Number(gstRate)) / 100);  // gst will be added
            productDetails.finalPrice =Math.round(Number(finalPrice));
 
            const discountedPrice = Number(finalPrice) - Number(Number(finalPrice) * Number(discountPercentage) / 100); // discount will be added
            productDetails.discountedPrice =Math.round (Number(discountedPrice));

            let specifications :any[]= [];
            if (Array.isArray(rawSpecifications)) {
                specifications = rawSpecifications.map((spec: any) => ({
                    heading: spec.heading,
                    points: spec.points,
                }));
            }
            
            const createData = new Product(productDetails);
            const insertData = await createData.save();
            
            response(req, res, activity, 'Level-2', 'Save-Product', true, 200, insertData, clientError.success.savedSuccessfully);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Product', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Product', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to product rating
 */

export let productRating = async (req, res, next: any) => {
    const { _id, rating } = req.body;
    const userId = req.headers['authorization'];
    try{
        const productDetails = await Product.findOneAndUpdate({ _id: _id }, {
            $set: {
                rating: rating,
                title: req.body.title,
                userId: req.body.userId,
                comment: req.body.comment,
                images: req.body.images,
                modifiedOn: new Date(),
                modifiedBy: req.body.modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Product-Rating', true, 200, productDetails, clientError.success.savedSuccessfully);
    }
    catch(err: any){
        response(req, res, activity, 'Level-3', 'Product-Rating', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   10-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update specifications
 */

export let updateSpecifications = async (req, res,next) => {
    try {
        const { specifications } = req.body;
        const product = await Product.findById( req.body._id);
        if (!product) {
            response(req, res, activity, 'Level-3', 'Update-Specifications', false, 404, {}, errorMessage.notFound, 'Product not found');
        }
        if (Array.isArray(specifications)) {
            specifications.forEach((spec) => {
                const { heading, points } = spec;
                product.specifications.push({ heading, points });
            });
            await product.save();
        } else {
            response(req, res, activity, 'Level-3', 'Update-Specifications', false, 400, {}, errorMessage.fieldValidation, 'Specifications must be an array');
        }
        response(req, res, activity, 'Level-2', 'Update-Specifications', true, 200, product, clientError.success.savedSuccessfully);
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Update-Specifications', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Santhosh Khan K
 * @date   08-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Single Product
 */

export let getSingleProductFoeWeb = async (req, res, next) => {
    try {
        const productDetails = await Product.findById({ _id: req.query._id }).sort({ createdOn: -1 }).populate('panelId',{companyName:1}).populate('companyId',{companyName:1});
        response(req, res, activity, 'Level-2', 'Get-Product', true, 200, productDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Product', false, 500, {}, errorMessage.internalServer, err.message);
    }
}