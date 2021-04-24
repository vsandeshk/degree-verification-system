/*
 * This script will use to evaluate any transaction from blockchain ledger
 * This will take channel & chaincode name.
 * Also, the smartcontract name & its arguments
*/

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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
        const network = await gateway.getNetwork('cardchannel');
        // Get the contract from the network.
        const contract = network.getContract('cardholder');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('CreateCard', ['1234']);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        //var result2 = JSON.parse(result);
        //console.log(Object.keys(result2).length);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
