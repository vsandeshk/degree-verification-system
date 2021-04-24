package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a wallet
type SmartContract struct {
	contractapi.Contract
}

type Endorsement struct {
	Type   string `json:"type"`
	Reason string `json:"reason"`
	ID     string `json:"endorser_id"`
	Date   string `json:"date"`
}

// Wallet describes basic details of what makes up a wallet
type Degree struct {
	Degree_id        string      `json:"degree_id"`
	User_id          string      `json:"user_id"`
	Student_id       string      `json:"student_id"`
	First_name       string      `json:"first_name"`
	Last_name        string      `json:"last_name"`
	Degree_title     string      `json:"degree_title"`
	Degree_programme string      `json:"degree_programme"`
	Degree_class     string      `json:"degree_class"`
	Completion_year  string      `json:"completion_year"`
	Transaction_date string      `json:"tr_date"`
	Vice_chancellor  Endorsement `json:"vice_chancellor"`
	Pro_chancellor   Endorsement `json:"pro_chancellor"`
	Active_status    bool      `json:"active_status"`
}

// InitLedger adds a base set of wallets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {

	return nil

}

// CreateDegree adds a new degree to the ledger
func (s *SmartContract) CreateDegree(ctx contractapi.TransactionContextInterface, user_id string, student_id string, first_name string, last_name string, degree_title string, degree_programme string, degree_class string, completion_year string) error {

	degree_id := `deg-` + student_id

	check_degree, err := getDegree(ctx, degree_id)

	if err != nil {
		if check_degree.Active_status {
			return fmt.Errorf("Data Already Exists!")
		}
	}

	date := time.Now().Format("2006-01-02 15:04:05")

	degree := Degree{
		Degree_id:        degree_id,
		User_id:          user_id,
		Student_id:       student_id,
		First_name:       first_name,
		Last_name:        last_name,
		Degree_title:     degree_title,
		Degree_programme: degree_programme,
		Degree_class:     degree_class,
		Completion_year:  completion_year,
		Transaction_date: date,
		Active_status:    true,
	}

	degree_as_bytes, _ := json.Marshal(degree)

	return ctx.GetStub().PutState(degree_id, degree_as_bytes)
}

// EndorseDegree add endorsement into degree
func (s *SmartContract) EndorseDegree(ctx contractapi.TransactionContextInterface, student_id string, e_type string, reason string, endorser_id string, role string) error {

	degree_id := `deg-` + student_id

	degree, err := getDegree(ctx, degree_id)

	if err != nil {
		return err
	}

	date := time.Now().Format("2006-01-02 15:04:05")

	var endorsement Endorsement
	endorsement.Type = e_type
	endorsement.ID = endorser_id
	endorsement.Reason = reason
	endorsement.Date = date

	if role == "PC" {
		degree.Pro_chancellor = endorsement
	} else if role == "VC" {
		degree.Vice_chancellor = endorsement
	} else {
		return fmt.Errorf("Forbidden")
	}

	degree_as_bytes, _ := json.Marshal(degree)

	return ctx.GetStub().PutState(degree_id, degree_as_bytes)
}

// DeleteDegree delete the degree info
func (s *SmartContract) DeleteDegree(ctx contractapi.TransactionContextInterface, student_id string, user_id string) error {

	degree_id := `deg-` + student_id

	degree, err := getDegree(ctx, degree_id)

	if err != nil {
		return err
	}

	date := time.Now().Format("2006-01-02 15:04:05")
	var endorsement Endorsement

	degree.Active_status = false
	degree.User_id = user_id
	degree.Transaction_date = date
	degree.Pro_chancellor = endorsement
	degree.Vice_chancellor = endorsement

	degree_as_bytes, _ := json.Marshal(degree)

	return ctx.GetStub().PutState(degree_id, degree_as_bytes)
}

// EditDegree edit the degree info
func (s *SmartContract) EditDegree(ctx contractapi.TransactionContextInterface, student_id string, user_id string, first_name string, last_name string, degree_title string, degree_programme string, degree_class string, completion_year string) error {

	degree_id := `deg-` + student_id

	degree, err := getDegree(ctx, degree_id)

	if err != nil {
		return err
	}

	date := time.Now().Format("2006-01-02 15:04:05")
	var endorsement Endorsement

	degree.First_name = first_name
	degree.Last_name = last_name
	degree.Degree_title = degree_title
	degree.Degree_programme = degree_programme
	degree.Degree_class = degree_class
	degree.Completion_year = completion_year
	degree.User_id = user_id
	degree.Transaction_date = date
	degree.Pro_chancellor = endorsement
	degree.Vice_chancellor = endorsement

	degree_as_bytes, _ := json.Marshal(degree)

	return ctx.GetStub().PutState(degree_id, degree_as_bytes)
}

//DynamicRichQuery return results according to the dynamic query
func (s *SmartContract) DynamicRichQuery(ctx contractapi.TransactionContextInterface, queryString string) ([]Degree, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []Degree{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		degree := new(Degree)
		_ = json.Unmarshal(queryResponse.Value, degree)

		results = append(results, *degree)
	}

	return results, nil
}

//generalQuery return results according to the query
func generalQuery(ctx contractapi.TransactionContextInterface, queryString string) ([]Degree, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []Degree{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		degree := new(Degree)
		_ = json.Unmarshal(queryResponse.Value, degree)

		results = append(results, *degree)
	}

	return results, nil
}

func (s *SmartContract) GetAllDegrees(ctx contractapi.TransactionContextInterface) ([]Degree, error) {
	queryString := `{"selector": {"active_status": true}}`

	return generalQuery(ctx, queryString)
}

func (s *SmartContract) GetAllUnapproved(ctx contractapi.TransactionContextInterface, role string) ([]Degree, error) {

	queryString := `{"selector": {"active_status": true,`

	pc_unapproved := `"pro_chancellor": {"endorser_id": {"$eq": ""}}`
	vc_unapproved := `"vice_chancellor": {"endorser_id": {"$eq": ""}}`
	if role == "PC" {
		queryString += pc_unapproved
	} else if role == "VC" {
		queryString += vc_unapproved
	} else {
		return nil, fmt.Errorf("Forbidden")
	}

	queryString += `}}`

	return generalQuery(ctx, queryString)
}

func (s *SmartContract) GetAllApproved(ctx contractapi.TransactionContextInterface, user_id string, role string) ([]Degree, error) {

	queryString := `{"selector": {"active_status": true,`

	pc_approved := `"pro_chancellor": {"endorser_id": {"$eq": "` + user_id + `"}, "type": "Approved"}`
	vc_approved := `"vice_chancellor": {"endorser_id": {"$eq": "` + user_id + `"}, "type": "Approved"}`
	if role == "PC" {
		queryString += pc_approved
	} else if role == "VC" {
		queryString += vc_approved
	} else {
		return nil, fmt.Errorf("Forbidden")
	}

	queryString += `}}`

	return generalQuery(ctx, queryString)
}

func (s *SmartContract) GetAllRejects(ctx contractapi.TransactionContextInterface, user_id string, role string) ([]Degree, error) {

	queryString := `{"selector": {"active_status": true,`

	pc_rejects := `"pro_chancellor": {"endorser_id": {"$eq": "` + user_id + `"}, "type": "Rejected"}`
	vc_rejects := `"vice_chancellor": {"endorser_id": {"$eq": "` + user_id + `"}, "type": "Rejected"}`
	if role == "PC" {
		queryString += pc_rejects
	} else if role == "VC" {
		queryString += vc_rejects
	} else {
		return nil, fmt.Errorf("Forbidden")
	}

	queryString += `}}`

	return generalQuery(ctx, queryString)
}

func getDegree(ctx contractapi.TransactionContextInterface, degree_id string) (*Degree, error) {
	degree_as_bytes, err := ctx.GetStub().GetState(degree_id)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if degree_as_bytes == nil {
		return nil, fmt.Errorf("Degree not found.")
	}

	degree := new(Degree)
	_ = json.Unmarshal(degree_as_bytes, degree)

	return degree, nil
}

// GetDegree returns the degree stored in the ledger with given id
func (s *SmartContract) GetDegree(ctx contractapi.TransactionContextInterface, student_id string) (*Degree, error) {
	degree_id := `deg-` + student_id
	return getDegree(ctx, degree_id)
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
