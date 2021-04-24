package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"golang.org/x/crypto/bcrypt"
	"time"
)

// SmartContract provides functions for managing a wallet
type SmartContract struct {
	contractapi.Contract
}

// Wallet describes basic details of what makes up a wallet
type User struct {
	User_id    string `json:"user_id"`
	Password   string `json:password`
	First_name string `json:"first_name"`
	Last_name  string `json:"last_name"`
	User_role  string `json:"role"`
	Date       string `json:"date"`
	Active     bool   `json:"active"`
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func comparePassword(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))

	return err == nil
}

// InitLedger adds a base set of wallets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	user_id := `admin-001`
	password := `a!d@m#i$n%`

	_, err := getUser(ctx, user_id)

	if err != nil {
		hash_password, _ := hashPassword(password)
		date := time.Now().Format("2006-01-02 15:04:05")

		user := User{
			User_id:    user_id,
			Password:   hash_password,
			First_name: "Default",
			Last_name:  "Admin",
			User_role:  "Admin",
			Date:       date,
			Active:     true,
		}

		userAsBytes, _ := json.Marshal(user)

		err = ctx.GetStub().PutState(user_id, userAsBytes)

	}

	return err

}

// CreateUser adds a new user to the ledger
func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, user_id string, password string, first_name string, last_name string, role string) error {

	userAsBytes, _ := ctx.GetStub().GetState(user_id)

	if userAsBytes != nil {
		return fmt.Errorf("User Already Exists")
	}

	hash_password, err := hashPassword(password)

	if err != nil {
		return err
	}

	date := time.Now().Format("2006-01-02 15:04:05")

	user := User{
		User_id:    user_id,
		Password:   hash_password,
		First_name: first_name,
		Last_name:  last_name,
		User_role:  role,
		Date:       date,
		Active:     true,
	}

	userAsBytes, _ = json.Marshal(user)

	return ctx.GetStub().PutState(user_id, userAsBytes)
}

// AuthenticateUser authenticates user credential
func (s *SmartContract) AuthenticateUser(ctx contractapi.TransactionContextInterface, user_id string, password string) (string, error) {

	user, err := getUser(ctx, user_id)

	if err != nil {
		return "", err
	}

	if comparePassword(password, user.Password) {
		return user.User_role, nil
	}

	return "", fmt.Errorf("Authentication Failed.")

}

// EditUser edit the user's info
func (s *SmartContract) EditUser(ctx contractapi.TransactionContextInterface, user_id string, first_name string, last_name string) error {

	user, err := getUser(ctx, user_id)

	if err != nil {
		return err
	}

	date := time.Now().Format("2006-01-02 15:04:05")

	user.First_name = first_name
	user.Last_name = last_name
	user.Date = date

	userAsBytes, _ := json.Marshal(user)

	return ctx.GetStub().PutState(user_id, userAsBytes)
}

// ToggleActivation use to active or deactive user
func (s *SmartContract) ToggleActivation(ctx contractapi.TransactionContextInterface, user_id string) error {

	user, err := getUser(ctx, user_id)

	if err != nil {
		return err
	}

	date := time.Now().Format("2006-01-02 15:04:05")

	user.Active = !user.Active
	user.Date = date

	userAsBytes, _ := json.Marshal(user)

	return ctx.GetStub().PutState(user_id, userAsBytes)
}

// ChangePassword to change the password of user
func (s *SmartContract) ChangePassword(ctx contractapi.TransactionContextInterface, user_id string, old_pass string, new_pass string) error {

	user, err := getUser(ctx, user_id)

	if err != nil {
		return err
	}

	if !(comparePassword(old_pass, user.Password)) {
		return fmt.Errorf("Incorrect current password.")
	}

	date := time.Now().Format("2006-01-02 15:04:05")

	hash_password, err := hashPassword(new_pass)

	if err != nil {
		return err
	}

	user.Password = hash_password
	user.Date = date

	userAsBytes, _ := json.Marshal(user)

	return ctx.GetStub().PutState(user_id, userAsBytes)
}

// SetNewPassword to change the password of user
func (s *SmartContract) SetNewPassword(ctx contractapi.TransactionContextInterface, user_id string, new_pass string) error {

	user, err := getUser(ctx, user_id)

	if err != nil {
		return err
	}

	date := time.Now().Format("2006-01-02 15:04:05")

	hash_password, err := hashPassword(new_pass)

	if err != nil {
		return err
	}

	user.Password = hash_password
	user.Date = date

	userAsBytes, _ := json.Marshal(user)

	return ctx.GetStub().PutState(user_id, userAsBytes)
}

//DynamicRichQuery return results according to the dynamic query
func (s *SmartContract) DynamicRichQuery(ctx contractapi.TransactionContextInterface, queryString string) ([]User, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []User{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		user := new(User)
		_ = json.Unmarshal(queryResponse.Value, user)

		results = append(results, *user)
	}

	return results, nil
}

// GetUser returns the user stored in the ledger with given id
func getUser(ctx contractapi.TransactionContextInterface, user_id string) (*User, error) {
	userAsBytes, err := ctx.GetStub().GetState(user_id)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if userAsBytes == nil {
		return nil, fmt.Errorf("User not found.")
	}

	user := new(User)
	_ = json.Unmarshal(userAsBytes, user)

	return user, nil
}

func (s *SmartContract) GetUser(ctx contractapi.TransactionContextInterface, user_id string) (*User, error) {

	user, err := getUser(ctx, user_id)

	if err != nil {
		return nil, err
	}

	user.Password = ""

	return user, nil
}

//GetAllUser returns all users found in world state
func (s *SmartContract) GetAllUser(ctx contractapi.TransactionContextInterface) ([]User, error) {

	queryString := `{"selector": {"user_id": {"$ne": ""}}}`

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []User{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		user := new(User)
		_ = json.Unmarshal(queryResponse.Value, user)

		user.Password = ""

		results = append(results, *user)
	}

	return results, nil
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}
}
