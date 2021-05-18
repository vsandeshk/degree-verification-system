# this script is use to deploy chaincode using chaincode name & version
# deploy one chaicode at a time by uncomment the particular line
# this script use another deployCC.sh script to start chaincode lifecycle


export PATH=${PWD}/../../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}/../configtx
cd ..
#scripts/deployCC.sh userchannel user

if [ $? -ne 0 ]; then
  echo "ERROR !!! Deploying user chaincode failed"
  exit 1
fi


scripts/deployCC.sh degreechannel degree 5

if [ $? -ne 0 ]; then
  echo "ERROR !!! Deploying degree chaincode failed"
  exit 1
fi
