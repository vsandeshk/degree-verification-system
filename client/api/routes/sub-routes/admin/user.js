/*
 * This script contains all the web APIs related to users
 */

const api_functions = require('../../../controllers/API_functions.js'); //controller contains functions: invoke, query, register user, authentication
const channel_name = "userchannel"; // user channel name
const chaincode_name = "user" // user chaincode name

module.exports.user_apis = function(router) {


  router
    .route('/user/login')
    .post(function(req, res) {
      let username = req.body.username;
      let password = req.body.password;

      nextFunction = function(return_args) {
        if (return_args.status == 200) {
          let role = return_args.data.toString();
          console.log("role: ", role);
          api_functions.setAuthToken(username, role, res);

        } else {
          res
            .status(return_args.status)
            .json(return_args.message);
        }
      }

      api_functions.query(username, channel_name, chaincode_name, "AuthenticateUser", nextFunction, username, password);

    });

  router
    .route('/admin/user/create')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let admin_id = req.user_id;
        let username = req.body.username;
        let role = req.body.user_role;

        api_functions.registerUser(username, role, "admin", function(return_args) {
          if (return_args.status == 200) {

            nextFunction = function(return_args) {
              if (return_args.status == 200) {
                res
                  .status(return_args.status)
                  .json("User created.");
              } else {
                res
                  .status(return_args.status)
                  .json(return_args.message);
              }
            }

            let password = req.body.password;
            let first_name = req.body.first_name;
            let last_name = req.body.last_name;

            api_functions.invoke(admin_id, channel_name, chaincode_name, "CreateUser", nextFunction, username, password, first_name, last_name, role);
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        });


      });


    });

  router
    .route('/admin/user/get/all')
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

        api_functions.query(user_id, channel_name, chaincode_name, "GetAllUser", nextFunction);

      });

    });


  router
    .route('/user/get/:username')
    .get(function(req, res) {
      api_functions.authenticateToken(req, res, function(req, res) {
        let user_id = req.user_id;
        let username = req.params.username;

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

        api_functions.query(user_id, channel_name, chaincode_name, "GetUser", nextFunction, username);
      });

    });

  router
    .route('/user/get')
    .get(function(req, res) {
      api_functions.authenticateToken(req, res, function(req, res) {
        let user_id = req.user_id;

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

        api_functions.query(user_id, channel_name, chaincode_name, "GetUser", nextFunction, user_id);
      });

    });

  router
    .route('/user/edit')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let username = req.user_id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            res
              .status(return_args.status)
              .json("Edit Successfully!");
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.invoke(username, channel_name, chaincode_name, "EditUser", nextFunction, username, first_name, last_name);

      });

    });

  router
    .route('/user/password/change')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let username = req.user_id;
        let old_pass = req.body.old_password;
        let new_pass = req.body.new_password;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            res
              .status(return_args.status)
              .json("Password changed!");
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.invoke(username, channel_name, chaincode_name, "ChangePassword", nextFunction, username, old_pass, new_pass);

      });

    });

  router
    .route('/user/password/reset')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let username = req.user_id;
        let new_pass = req.body.new_password;

        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            res
              .status(return_args.status)
              .json("Password reset!");
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.invoke(username, channel_name, chaincode_name, "SetNewPassword", nextFunction, username, new_pass);

      });

    });



  router
    .route('/admin/user/active/toggle')
    .post(function(req, res) {

      api_functions.authenticateToken(req, res, function(req, res) {

        let username = req.body.username;
        nextFunction = function(return_args) {
          if (return_args.status == 200) {
            res
              .status(return_args.status)
              .json("Toggle Successfully!");
          } else {
            res
              .status(return_args.status)
              .json(return_args.message);
          }
        }

        api_functions.invoke(req.user_id, channel_name, chaincode_name, "ToggleActivation", nextFunction, username);

      });

    });


}
