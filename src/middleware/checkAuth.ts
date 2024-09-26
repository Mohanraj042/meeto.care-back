/**
 * @author Santhosh Khan K
 * @date  09-10-2023
 * @description Authentication Methods
 */


import * as auth from 'basic-auth';
import { clientError } from '../helper/ErrorMessage';

export let basicAuthUser = function (req, res, next) {
    var credentials = auth(req);
    console.log('credentials',credentials);
    if (!credentials || credentials.name != process.env.basicAuthUser || credentials.pass != process.env.basicAuthKey) {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"')
        return res.status(401).json({
            success: false,
            statusCode: 499,
            message: clientError.token.unauthRoute,
        });
    } else {
        next();
    }
}
