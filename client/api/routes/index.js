/*
* This script is use to add all the controllers & routes files of ERP in this script
*/

const express = require('express');
var router = express.Router();

const user_route = require('./sub-routes/admin/user.js');
const exam_route = require('./sub-routes/examination/exam.js');
const endorse_route = require('./sub-routes/endorser/endorser.js');

user_route.user_apis(router);
exam_route.exam_apis(router);
endorse_route.endorser_apis(router);

module.exports = router;
