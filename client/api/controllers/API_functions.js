const FabricCAServices = require('fabric-ca-client'); //Fabric client from Node-SDK
const {
  Gateway,
  Wallets
} = require('fabric-network'); // get Gateway & Wallet
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt_content = fs.readFileSync('bcrypt-content.json'); //read secret
const access = JSON.parse(bcrypt_content);

module.exports.invoke = function(user_id, channel_name, chaincode_name, function_name, nextFunction, ...func_args) {
  invokeMain(user_id, channel_name, chaincode_name, function_name, nextFunction, ...func_args);
}

module.exports.query = function(user_id, channel_name, chaincode_name, function_name, nextFunction, ...func_args) {
  queryMain(user_id, channel_name, chaincode_name, function_name, nextFunction, ...func_args);
}

module.exports.registerUser = function(username, role, admin_id, nextFunction) {
  registerUserMain(username, role, admin_id, nextFunction);
}

module.exports.setAuthToken = async function(username, role, res) {
  const accessToken = jwt.sign({
    username: username,
    role: role
  }, access.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h'
  });
  let result = {};
  result.token = accessToken;
  result.role = role
  console.log("result: ", result);
  res.status(200).json(result);
}

module.exports.authenticateToken = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, access.ACCESS_TOKEN_SECRET, (err, res_object) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user_id = res_object.username;
    req.role = res_object.role;
    next(req, res);
  })
}


/*
 * The query function use to evaluate transaction from blockchain
 * This function take 5 mandatory parameters & other n optional parameters
 * user_id will be the used to get wallet identity of user
 * channel_name will the name of channel from where particular chaincode is deployed
 * chaincode_name will be the name of chaincode
 * function_name will be the Smart Contract function to evaluate transaction
 * nextFunction will be the callback function that will use to call after the execution of this function
 * ...func_args will be the n number of arguments that will required by the Smart Contract function
 */
async function queryMain(user_id, channel_name, chaincode_name, function_name, nextFunction, ...func_args) {
  var return_args = {};
  try {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if the user is enrolled.
    const identity = await wallet.get(user_id);
    if (!identity) {
      console.log('An identity for the user "' + user_id + '" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');

      return_args.message = 'An identity for the user "' + user_id + '" does not exist.';
      return_args.status = 404;
      //callback function to return execution response
      nextFunction(return_args);
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: user_id,
      discovery: {
        enabled: true,
        asLocalhost: true
      }
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channel_name);

    // Get the contract from the network.
    const contract = network.getContract(chaincode_name);

    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction(function_name, ...func_args);

    return_args.data = result;
    return_args.status = 200;
    //callback function to return execution response
    nextFunction(return_args);
    //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    return;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    return_args.message = error.message;
    return_args.status = 400;
    //callback function to return execution response
    nextFunction(return_args)
    return;
  }
}

/*
 * The invoke function use to submit transaction to blockchain
 * This function take 5 mandatory parameters & other n optional parameters
 * user_id will be the used to get wallet identity of user
 * channel_name will the name of channel from where particular chaincode is deployed
 * chaincode_name will be the name of chaincode
 * function_name will be the Smart Contract function to submit transaction
 * nextFunction will be the callback function that will use to call after the execution of this function
 * ...func_args will be the n number of arguments that will required by the Smart Contract function
 */
async function invokeMain(user_id, channel_name, chaincode_name, function_name, nextFunction, ...func_args) {
  var return_args = {};

  try {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log(user_id)
    // Check to see if the user is enrolled.
    const identity = await wallet.get(user_id);
    if (!identity) {
      console.log('An identity for the user "' + user_id + '" does not exist in the wallet');
      console.log('Register User First');
      return_args.message = 'An identity for the user "' + user_id + '" does not exist.';
      return_args.status = 404;
      //callback function to return execution response
      nextFunction(return_args);
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: user_id,
      discovery: {
        enabled: true,
        asLocalhost: true
      }
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channel_name);

    // Get the contract from the network.
    const contract = network.getContract(chaincode_name);
    // Submit the specified transaction.
    console.log(function_name)
    console.log(...func_args)
    await contract.submitTransaction(function_name, ...func_args);
    console.log('Transaction has been submitted');
    return_args.data = 'success';
    return_args.status = 200;
    if (nextFunction == "return") {
      return
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
    //callback function to return execution response
    nextFunction(return_args);
    return;

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return_args.message = error;
    console.log(error.message);
    if (error.responses != undefined) {
      return_args.message = error.responses[0].response.message;
    } else if (error.message != undefined) {
      return_args.message = error.message;
    }
    return_args.status = 400;
    if (nextFunction != "return") {
      //callback function to return execution response
      nextFunction(return_args);
    }
    return
  }
}

/*
 * The register user function use to add user identity in blockchain wallet
 * This function take 3 parameters
 * user_id will be the used to add identity of user in wallet
 * admin_id will be the id of admin who is responsible to register the user
 * nextFunction will be the callback function that will use to call after the execution of this function
 */
async function registerUserMain(user_id, role, admin_id, nextFunction) {

  console.log("nextFunction: ", nextFunction);
  var return_args = {};
  try {

    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet paths: ${wallet}`);


    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(user_id);
    if (userIdentity) {
      console.log('An identity for the user "' + user_id + '" already exists in the wallet');
      return_args.message = 'An identity for the user "' + user_id + '" already exists.';
      return_args.status = 200;
      //callback function to return execution response
      nextFunction(return_args);
      return;
    }
    // Check to see if the admin user is enrolled or not.
    const adminIdentity = await wallet.get(admin_id);
    if (!adminIdentity) {
      console.log('An identity for the admin user "' + admin_id + '" does not exist in the wallet');
      return_args.message = 'An identity for the admin user "' + admin_id + '" does not exist.';
      return_args.status = 404;
      //callback function to return execution response
      nextFunction(return_args);
      return;
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, admin_id);

    // Register the user, enroll the user, and put the new identity into the wallet.
    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: user_id,
      role: 'client',
      attrs: [{
        name: 'ROLE',
        value: role,
        ecert: true
      }]
    }, adminUser);
    const enrollment = await ca.enroll({
      enrollmentID: user_id,
      enrollmentSecret: secret
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };
    await wallet.put(user_id, x509Identity);
    console.log('Successfully registered and enrolled user "' + user_id + '" and imported it into the wallet');
    return_args.data = 'Successfully registered and enrolled user "' + user_id + '."';
    return_args.status = 200;
    //callback function to return execution response
    nextFunction(return_args);
    return;
  } catch (error) {
    console.error(`Failed to register user "` + user_id + `": ${error}`);
    return_args.message = error;
    return_args.status = 400;
    //callback function to return execution response
    nextFunction(return_args);
    return;
  }
}
