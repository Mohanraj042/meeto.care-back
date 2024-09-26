import { Router } from "express";
const router: Router = Router();
import { checkQuery, checkRequestBodyParams } from "../middleware/Validators";
import { basicAuthUser } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";
import { deleteInvoice, getAllInvoice, getFilterInvoice,generateInvoiceCopy ,getInvoiceNumber} from "../controller/invoice.controller";


router.get('/getInvoiceNumber',
    basicAuthUser,
    checkSession,
    getInvoiceNumber
);

router.get("/", 
    basicAuthUser,
    checkSession,
    getAllInvoice
);

router.put('/generateInvoiceCopy', // generate invoice copy
    basicAuthUser,
    checkSession,
    generateInvoiceCopy
);

router.delete("/",
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteInvoice);


router.put("/getFilterInvoice", 
    basicAuthUser,
    checkSession,
    getFilterInvoice
);

export default router