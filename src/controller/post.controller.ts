import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Post, PostDocument } from "../model/post.model";
import { saveNotification } from "./notification.controller";

var activity = "Post"

/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Post.
 */
export let getAllPost = async (req, res, next) => {
    try {
        const data = await Post.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Post', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Post', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create Post.
 */
export let savePost = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            let date = new Date();
            postDetails.date = date?.getDate();
            postDetails.month = date?.getMonth() + 1;
            postDetails.year = date?.getFullYear()
            const createData = new Post(postDetails);
            let insertData = await createData.save();
            if (postDetails.mention) {
                postDetails.mention.map(id => {
                    const data = { from: { user: postDetails.userId, modelType: 'user' }, to: { user: id, modelType: 'user' }, description: 'Mention your name', title: 'Mention' }
                    saveNotification(data)
                })
            }
            response(req, res, activity, 'Level-2', 'Save-Post', true, 200, insertData, clientError.success.savedSuccessfully);

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Post', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Post', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Post.
 */
export let updatePost = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            let updateData = await Post.findByIdAndUpdate({ _id: postDetails._id }, {
                $set: {
                    video: postDetails.video,
                    content: postDetails.content,
                    title: postDetails.title,
                    hashtag: postDetails.hashtag,
                    mention: postDetails.mention,
                    type: postDetails.type,
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Post', true, 200, updateData, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Post', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Post', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Post.
 */
export let deletePost = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await Post.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        response(req, res, activity, 'Level-2', 'Delete-Post', true, 200, data, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Post', true, 500, {}, errorMessage.internalServer, err.message)
    }
};



/**
 * @author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single Post.
 */
export let getSinglePost = async (req, res, next) => {
    try {
        const data = await Post.findById({ _id: req.query._id }).populate('comment.user', { name: 1, profileImage: 1 }).populate('userId', { profileImage: 1 })
        response(req, res, activity, 'Level-1', 'Get-SinglePost', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SinglePost', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
@author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter Post.
 */
export let getFilterPost = async (req, res, next) => {
    try {

        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.doctorId) {
            andList.push({ doctorId: req.body.doctorId })
        }
        if(req.body.title){
            andList.push({ title: req.body.title })
        }
        if(req.body.content){
            andList.push({ content: req.body.content })
        }
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const postList = await Post.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('doctorId',{doctorName:1});
        const postCount = await Post.find(findQuery).count()
        response(req, res, activity, 'Level-2', 'Filter-Post', true, 200, {postList,postCount}, clientError.success.fetchedSuccessfully);
 }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Filter-Post', false, 500, {}, errorMessage.internalServer, err.message);
    }
} 

/**
@author Santhosh Khan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter Post.
 */
 export let getFilterPostByUser = async (req, res, next) => {
    try {
         var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const postList = await Post.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('userId', { name: 1, profileImage: 1, }).populate('comment.user', { name: 1, profileImage: 1, }).populate('likes.user', { name: 1, profileImage: 1, }).populate('doctorId', { doctorName: 1, profileImage: 1, });
        const postCount = await Post.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPostForWeb', true, 200, { postList, postCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPostForWeb', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 @author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to create Likes.
 */
export let savePostLikes = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            const postLikeDetails = await Post.findOne({ $and: [{ 'likes.user': postDetails.likes.user }, { _id: postDetails._id }] })
            if (postLikeDetails) {
                const deleteLikes = await Post.findByIdAndUpdate({ _id: postDetails._id },
                    {
                        $pull: { likes: postDetails.likes },
                        $inc: { likeCount: -1 }
                    }
                )
                response(req, res, activity, 'Level-2', 'Save-PostLikes', true, 200, deleteLikes, clientError.success.deleteSuccess);
            } else {
                const updateLikes = await Post.findByIdAndUpdate({ _id: postDetails._id },
                    {
                        $push: { likes: postDetails.likes },
                        $inc: { likeCount: 1 }
                    },
                )
                if (updateLikes && updateLikes.userId) {
                    if (updateLikes.userId.valueOf() !== postDetails.likes.user) {
                        var data
                        if (postDetails.likes.modelType === 'User') {
                            data = { from: { user: postDetails.likes.user, modelType: 'User' }, to: { user: updateLikes.userId, modelType: 'Master' }, description: 'Like your post', title: 'Like' }
                        }
                        if (postDetails.likes.modelType === 'Master') {
                            data = { from: { user: postDetails.likes.user, modelType: 'Master' }, to: { user: updateLikes.userId, modelType: 'Master' }, description: 'Like your post', title: 'Like' }
                        }
                        saveNotification(data)
                    }
                }
                response(req, res, activity, 'Level-2', 'Save-PostLikes', true, 200, updateLikes, clientError.success.savedSuccessfully);
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-PostLikes', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-PostLikes', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**  
@author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save post comments.
 **/
export let createPostComments = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            req.body.comment.createdOn = new Date()
            const postDetails: PostDocument = req.body;
            let updateData = await Post.findByIdAndUpdate({ _id: req.body._id }, {
                $inc: { commentCount: 1 },
                $addToSet: {
                    comment: req.body.comment,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            })

            if (updateData && updateData.userId) {
                if (updateData.userId.valueOf() !== req.body.comment.user) {
                    var data
                    if (req.body.comment.modelType === 'User') {
                        data = { from: { user: req.body.comment.user, modelType: 'User' }, to: { user: updateData.userId, modelType: 'Master' }, description: 'Comment your post', title: 'Comment' }
                    }
                    if (req.body.comment.modelType === 'Master') {
                        data = { from: { user: req.body.comment.user, modelType: 'Master' }, to: { user: updateData.userId, modelType: 'Master' }, description: 'Comment your post', title: 'Comment' }
                    }
                    saveNotification(data)
                }
            }
            response(req, res, activity, 'Level-2', 'Save-PostComments', true, 200, updateData, clientError.success.savedSuccessfully)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-PostComments', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Save-PostComments', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update block Users.
 */
export let updatePostBlockUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            let updateData = await Post.findByIdAndUpdate({ _id: req.body._id }, {
                $addToSet: {
                    block: postDetails.block,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            })
            response(req, res, activity, 'Level-2', 'Update-BlockUser', true, 200, updateData, 'Hide successfully')
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-BlockUser', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-BlockUser', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save post report.
 */
export let updatePostReport = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            req.body.report.createdOn = new Date();
            const postDetails: PostDocument = req.body;
            let postReport = await Post.findByIdAndUpdate({ _id: postDetails._id }, {
                $push: {
                    report: postDetails.report,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            })
            response(req, res, activity, 'Level-2', 'update-PostReport', true, 200, postReport, clientError.success.savedSuccessfully)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'update-PostReport', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'update-PostReport', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Santhosh Khan K
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to share post
 */

export let sharePost = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            const {_id}=postDetails._id;
            const  originalPost =await Post.findById(_id)
            const sharePost =await Post.create({originalPost:originalPost,userId:postDetails.userId,createdOn:new Date()})
            response(req, res, activity, 'Level-2', 'Share-Post', true, 200, sharePost, clientError.success.savedSuccessfully)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Share-Post', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
}