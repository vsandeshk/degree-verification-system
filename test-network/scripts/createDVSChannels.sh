
# this script is use to create channel using channel name
# create one channel at a time by uncomment the particular line
# this script use another createChannel.sh script to start channel lifecycle

export PATH=${PWD}/../../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}/../configtx

cd ..
scripts/createChannel.sh userchannel
scripts/createChannel.sh degreechannel
