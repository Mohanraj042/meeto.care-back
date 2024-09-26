import { validationResult } from "express-validator";
import { AddToCart, AddToCartDocument } from "../model/addToCart.model";
import { response } from "../helper/commonResponseHandler";
import { errorMessage, clientError } from "../helper/ErrorMessage";
import { Product } from "../model/product.model";

var activity = "Cart";

/**
 * @author BalajiMurahari
 * @date  21-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to manage the cart operations (increase decrease clear cart)
 * */

export let savedAddToCart = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) { 
    try {
      const addToCartData: AddToCartDocument = req.body;
      let userCart = await AddToCart.findOne({ userId: addToCartData.userId });

      if (!userCart) {
        userCart = await AddToCart.create({ userId: addToCartData.userId, items: [], totalAmount: 0, totalQuantity: 0, isDeleted: false, status: 1,} as AddToCartDocument);
      }

      for (const newItem of addToCartData.items) {  // for loop condition false it runs
        const cartItemIndex = userCart.items.findIndex((item: any) => String(item.productId) === String(newItem.productId)); // old product new product check
 
        if (cartItemIndex !== -1) { // checking product -1 or not 
          if (newItem.operation === "decrease") {  //product operation decrease means  true
            userCart.items[cartItemIndex].quantity -= newItem.quantity; // decrease product
            if (userCart.items[cartItemIndex].quantity <= 0) {  // if quantity 0 means goes next line
              userCart.items.splice(cartItemIndex, 1); //index 1 value it brings
            }
          } else {
            userCart.items[cartItemIndex].quantity += newItem.quantity; // increse product
            userCart.items[cartItemIndex].productPrice = newItem.productPrice; // add or decrease product price
          } 
        } else {
          if (newItem.operation !== "decrease") {  // operation not decrease means true 
           const productDetails = await Product.findById(newItem.productId); // Fetch product details based on product ID

            if (!productDetails) { // product not means console error
              console.error(`Error: Product not found for productId ${newItem.productId}`); // Log the error message, but don't modify the item
               continue;
            }

            userCart.items.push({
              productId: newItem.productId,
              panelId: productDetails.panelId,
              companyId: productDetails.companyId,
              quantity: newItem.quantity,
              productPrice: newItem.productPrice,
              productName: productDetails.productName,
              productImage: productDetails.productImage,
              originalPrice: productDetails.originalPrice,
              discountPercentage: productDetails.discountPercentage,
              discountedPrice: productDetails.discountedPrice,
              gstRate: productDetails.gstRate,
              gstAmount: productDetails.gstAmount,
              finalPrice: productDetails.finalPrice,
              selling: "",
            
            }); 
          }
        }
      }

      userCart.totalAmount = Math.max(0, userCart.items.reduce((total, item) => total + item.quantity * item.productPrice, 0));  // calculate total amount & product quantity
      userCart.totalQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0); 

      if (userCart.totalQuantity <= 0) // clearcart this lines
      {
         userCart.totalAmount = 0; userCart.totalQuantity = 0;userCart.items = [];
      }

      if (userCart.items.length > 0 || userCart.totalQuantity > 0 || userCart.totalAmount > 0) { // update the condition and save
        const updatedCart = await userCart.save();

        const populatedItems = await Promise.all(updatedCart.items.map(async (item) => { // Populate the product details and save
         
          return { 
            ...item,
            productName: item.productName, 
            productImage: item.productImage, 
          };
        }));

       
        updatedCart.items = populatedItems;

       
        response(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, updatedCart, clientError.success.fetchedSuccessfully);
      } else {
        await AddToCart.findByIdAndDelete(userCart._id);
       
        response(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, userCart, clientError.success.fetchedSuccessfully);
      }
    } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, errorMessage.internalServer, err.message);
    }
  } else {
    response(req, res, activity, 'Level-3', 'Add-To-Cart', false, 422, {}, errorMessage.fieldValidation, 'Invalid data in the request');
  }
};



/**
 * @author BalajiMurahari
 * @date   24-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to orderplace
 */

export const updateAddToCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()){
    try{
      const addToCartData:AddToCartDocument = req.body;
      let userCart = await AddToCart.findOne({userId:addToCartData.userId});
      if (userCart) {
        addToCartData.items.forEach((purchasedItem) => { // Assuming orderData.items is an array of purchased items
          const existingItem = userCart.items.find((item) => item.productId === purchasedItem.productId);
          if (existingItem) {  // Update product quantity, product price, and total quantity
            existingItem.quantity -= purchasedItem.quantity;
            existingItem.productPrice = purchasedItem.productPrice;
            userCart.totalQuantity -= purchasedItem.quantity; 
           if (existingItem.quantity <= 0) {  //  quantity becomes zero, remove the item in db
             userCart.items = userCart.items.filter((item) => item.productId !== existingItem.productId);
              userCart.totalQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0);  // Recalculate total quantity and total amount
              userCart.totalAmount = userCart.items.reduce((total, item) => total + item.quantity * item.productPrice, 0);
            } else {   // Update total amount with existing item's information
             const itemQuantity = existingItem.quantity || 0;
              const itemPrice = existingItem.productPrice || 0;
              userCart.totalAmount -= itemQuantity * itemPrice;
            }
          }
        });
        await userCart.save();
            
             if (userCart.totalQuantity === 0 && userCart.totalAmount === 0) {  // Check if both total quantity and total amount are zero, then remove the user cart
              await AddToCart.deleteOne({ userId: addToCartData.userId }); // You can also return a message indicating that the cart has been deleted
              
            }
        response(req, res, activity, 'Level-3', 'Add-To-Cart', true, 200, userCart, clientError.success.fetchedSuccessfully);
      } else {
        response(req, res, activity, 'Level-3', 'Add-To-Cart', false, 404, {}, errorMessage.notFound, 'User\'s cart not found');
      }
    }catch(err: any){
      response(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, errorMessage.internalServer, err.message);
    }
      }
      else {
        response(req, res, activity, 'Level-3', 'Add-To-Cart', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
      }
    };



/**
 * @author BalajiMurahari
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all add to cart
 */

export let getAllCartDetails = async (req, res, next) => {
    try {
        const addDetails = await AddToCart.find({userId:req.query.userId});
        response(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, addDetails, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete add to cart
 */

export let deleteAddToCart = async (req, res, next) => {
    try {
        const addDetails = await AddToCart.deleteOne({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, addDetails, clientError.success.deleteSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   17-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get single add to cart
 */

export let getSingleAddToCart = async (req, res, next) => {
    try {
        const addDetails = await AddToCart.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Add-To-Cart', true, 200, addDetails, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Add-To-Cart', false, 500, {}, errorMessage.internalServer, err.message);
    }
}




/**
 * @author BalajiMurahari
 * @date   20-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete a single product from the cart
 */
export const deleteProductFromCart = async (req, res, next) => {
  try {
    const addToCartData: AddToCartDocument = req.body;
    const cart = await AddToCart.findOne({ _id: addToCartData._id });

    if (!cart) {
      response(req, res, activity, 'Level-3', 'Delete-Product-From-Cart', false, 404, {}, 'Cart not found', false);
      
    }

    const productIndex = cart?.items.findIndex(item => item.productId === addToCartData.productId);

    if (productIndex === -1) {
      response(req, res, activity, 'Level-3', 'Delete-Product-From-Cart', false, 404, {}, 'Product not found in the cart', false);
      
    }

    const removedItem = cart?.items[productIndex];
    cart?.items.splice(productIndex, 1);
    cart.totalAmount = Math.round(Math.max(0, cart?.totalAmount - (removedItem.productPrice * removedItem.quantity || 0)));
    cart.totalQuantity = Math.max(0, cart.totalQuantity - removedItem.quantity || 0);

    await cart.save();
 if (cart?.totalQuantity === 0 && cart?.totalAmount === 0) {  
  await AddToCart.deleteOne({ _id: cart._id });
}
    response(req, res, activity, 'Level-3', 'Delete-Product-From-Cart', true, 200, { cart }, 'Product removed from the cart successfully', true);
  } catch (err) {
    console.error(err);
    response(req, res, activity, 'Level-3', 'Delete-Product-From-Cart', false, 500, {}, 'Internal Server Error', false);
  }
};
