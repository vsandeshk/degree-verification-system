/*
 * This script contains all the web APIs related to student degree
 */

const api_functions = require('../../../controllers/API_functions.js'); //controller contains functions: invoke, query, register user, authentication
const channel_name = "degreechannel"; // user channel name
const chaincode_name = "degree" // user chaincode name
const bcrypt = require('bcrypt');

module.exports.exam_apis = function(router) {


  router
    .route('/examination/degree/create')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let user_id = req.user_id;
        let student_id = req.body.student_id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let degree_title = req.body.degree_title;
        let degree_programme = req.body.degree_programme;
        let degree_class = req.body.degree_class;
        let completion_year = req.body.completion_year

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

        api_functions.invoke(user_id, channel_name, chaincode_name, "CreateDegree", nextFunction, user_id, student_id, first_name, last_name, degree_title, degree_programme, degree_class, completion_year);

      });

    });

  router
    .route('/examination/degree/delete/:student_id')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let user_id = req.user_id;
        let student_id = req.params.student_id;
        console.log(student_id);
        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            res
              .status(return_args.status)
              .json("Data Deleted!");
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.invoke(user_id, channel_name, chaincode_name, "DeleteDegree", nextFunction, student_id, user_id);

      });

    });

  router
    .route('/examination/degree/edit/:student_id')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let user_id = req.user_id;
        let student_id = req.params.student_id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let degree_title = req.body.degree_title;
        let degree_programme = req.body.degree_programme;
        let degree_class = req.body.degree_class;
        let completion_year = req.body.completion_year

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

        api_functions.invoke(user_id, channel_name, chaincode_name, "EditDegree", nextFunction, student_id, user_id, first_name, last_name, degree_title, degree_programme, degree_class, completion_year);

      });

    });

  router
    .route('/examination/degree/get/all')
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
    .route('/examination/degree/get/unapproved')
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
    .route('/examination/degree/get/:student_id')
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

  router
    .route('/degree/get/:student_id')
    .get(function(req, res) {
      let user_id = "verifier";
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

  router
    .route('/degree/endorser/:endorser_id')
    .get(function(req, res) {
      let user_id = "verifier";
      let endorser_id = req.params.endorser_id;



    });

}
