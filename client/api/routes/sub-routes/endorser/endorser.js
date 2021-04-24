/*
 * This script contains all the web APIs related to users
 */

const api_functions = require('../../../controllers/API_functions.js'); //controller contains functions: invoke, query, register user, authentication
const channel_name = "degreechannel"; // user channel name
const chaincode_name = "degree" // user chaincode name

module.exports.endorser_apis = function(router) {

  router
    .route('/endorser/degree/:student_id/endorse')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let user_id = req.user_id;
        let role = req.role;
        let student_id = req.params.student_id;
        let e_type = req.body.e_type;
        let reason = req.body.reason;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            res
              .status(return_args.status)
              .json("Data has been successfully submitted!");
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.invoke(user_id, channel_name, chaincode_name, "EndorseDegree", nextFunction, student_id, e_type, reason, user_id, role);

      });

    });

  router
    .route('/endorser/degree/get/all')
    .get(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let user_id = req.user_id;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            console.log(return_args);
            let result = JSON.parse(return_args.data);
            res
              .status(return_args.status)
              .json(result);
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.query(user_id, channel_name, chaincode_name, "GetAllDegrees", nextFunction);

      });

    });

  router
    .route('/endorser/degree/get/approved')
    .get(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let user_id = req.user_id;
        let role = req.role;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            console.log(return_args);
            let result = JSON.parse(return_args.data);
            res
              .status(return_args.status)
              .json(result);
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.query(user_id, channel_name, chaincode_name, "GetAllApproved", nextFunction, user_id, role);

      });

    });

  router
    .route('/endorser/degree/get/unapproved')
    .get(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let user_id = req.user_id;
        let role = req.role;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            console.log(return_args);
            let result = JSON.parse(return_args.data);
            res
              .status(return_args.status)
              .json(result);
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.query(user_id, channel_name, chaincode_name, "GetAllUnapproved", nextFunction, role);

      });

    });

  router
    .route('/endorser/degree/get/rejects')
    .get(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let user_id = req.user_id;
        let role = req.role;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            let result = JSON.parse(return_args.data);
            res
              .status(return_args.status)
              .json(result);
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.query(user_id, channel_name, chaincode_name, "GetAllRejects", nextFunction, user_id, role);

      });

    });

  router
    .route('/endorser/degree/get/:student_id')
    .get(function(req, res) {
      api_functions.authenticateToken(req, res, function(req, res) {
        let user_id = req.user_id;
        let student_id = req.params.student_id;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            let result = JSON.parse(return_args.data)
            res
              .status(return_args.status)
              .json(result);
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.query(user_id, channel_name, chaincode_name, "GetDegree", nextFunction, student_id);
      });

    });

}
