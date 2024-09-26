import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { createPostComments, deletePost, getAllPost, getFilterPost, getFilterPostByUser, getSinglePost, savePost, savePostLikes, updatePost, updatePostBlockUsers, updatePostReport ,sharePost} from '../controller/post.controller';
const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkSession,
    getAllPost
);

router.post('/',
    basicAuthUser,
    checkSession,
    savePost
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updatePost
);

router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deletePost
)

router.get('/getSinglePost',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSinglePost
)

router.put('/getFilterPost',
    basicAuthUser,
    checkSession,
    getFilterPost
)

router.post('/savePostLikes',
    basicAuthUser,
    checkSession,
    savePostLikes
);

router.post('/createPostComments',
    basicAuthUser,
    checkSession,
    createPostComments
)

router.put('/updatePostBlockUsers',
    basicAuthUser,
    checkSession,
    updatePostBlockUsers
)

router.put('/updatePostReport',
    basicAuthUser,
    checkSession,
    updatePostReport
)

router.put('/getFilterPostByUser',
    basicAuthUser,
    checkSession,
    getFilterPostByUser
);


router.post('/sharePost',
    basicAuthUser,
    checkSession,
    sharePost
);


export default router;