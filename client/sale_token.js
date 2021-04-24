/*
 * This script will use deduct all purchased/rewarded tokens from ERP
 * This will get all the transaction (contains user id, amount & other transaction detail)
 * And submit erp transaction (one by one) for each purchased/rewarded transaction of user
 * This script is using recursion to submit transaction one by one
*/

var uuid = require('uuid-random');
const api_functions = require('./api/controllers/API_functions.js');
const channel_name = "gboerpchannel";
const chaincode_name = "erp_transaction"
//var data_file = require('./../data.json')

const wallet_type = "r";

function next_function(return_args) {
//  return_args.status = 200;
//  return_args.data = JSON.stringify(data_file);
  if (return_args.status == 200) {
    var array = JSON.parse(return_args.data);

    add_next = function(i, arr) {
        if (i < arr.length) {
          next_function = function(return_args) {
            add_next(i+1, arr);
          }

          var date = arr[i].updated_at;
          date = date.replace("T", " ");
          date = date.replace("Z", "");

          var inventory_id = "";

          if (wallet_type == "r") {
            inventory_id = "invt_erp_admin-token002"
          } else {
            inventory_id = "invt_erp_admin-token001"
          }

          var data = {
            "id": uuid(),
            "user_id": "userdefault",
            "erp_id": "erp_admin",
            "customer_id": arr[i].user_id,
            "inventory_id": inventory_id,
          //  "warehouse_id": "wh_63b62142-5ba0-4751-a407-917cab905d0b",
            "warehouse_id": "wh_87664c1c-0808-487b-8fb8-f61ea030d46d", //dev
            "quantity": arr[i].amount.toString(),
            "rate": "1",
            "token_type": arr[i].type,
            "amount": arr[i].amount.toString(),
            "date": date,
            "description": arr[i].description
          }
          if (arr[i].amount > 0) {
            api_functions.invoke("userdefault", channel_name, chaincode_name, "AddTransaction", next_function, "Token Sale", JSON.stringify(data));
          } else {
            return_args.status = 200;
            next_function(return_args)
          }

        } else {
          return
        }
    }

    add_next(0, array)

  } else {
    console.log("Error.");
    console.log(return_args.message);
  }
}

api_functions.query("userdefault", 'gboclientchannel', 'transaction', 'GetAllUserTransactionsByWallet', next_function, wallet_type);
