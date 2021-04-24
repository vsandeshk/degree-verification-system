/*
 * This script will use to submit any transaction in blockchain ledger
 * This will take channel & chaincode name.
 * Also, the smartcontract name & its arguments
*/

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
var uuid = require('uuid-random');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('userdefault');
        if (!identity) {
            console.log('An identity for the user "userdefault" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'userdefault', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('gboerpchannel');

        // Get the contract from the network.
        const contract = network.getContract('erp_transaction');

        // Submit the specified transaction.
  //      var data_str = '[{"referral_id":"userdefault-referral1","user_id":"userdefault","amount":600}]';

  var data = {
    "ID": uuid(),
    "User ID": 'userdefault',
    "Category": "Asset",
    "Sub category": "Furniture",
    "Description": "Purchased asset",
    "Debit": 100,
    "Credit": 0
  }

        await contract.submitTransaction('AddTransaction', 'General', JSON.stringify(data));
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
