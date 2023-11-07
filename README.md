# Loan_App

Laon_App is a Node.js Express API that provides various endpoints for managing loans and customer data. 
It includes features for data ingestion, customer registration, loan eligibility checks, loan creation, viewing loan details, making loan payments, 
and viewing loan statements.

### Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime for server-side development
- [Express.js](https://expressjs.com/) - Web application framework for Node.js
- [MySQL](https://www.mysql.com/) - Open-source relational database management system
- [xlsx](https://www.npmjs.com/package/xlsx) - Library for reading Excel files


## Features


1. **User Registration:** Allow users to register and create accounts.

2. **Data Ingestion:** Ingest customer and loan data from Excel files, making it easy to onboard new customers and loans.

3. **Eligibility Checking:** Determine the eligibility of a customer for a loan based on credit score, income, and other criteria.

4. **Loan Creation:** Create new loans for eligible customers with details such as loan amount, interest rate, and tenure.

5. **Loan Details Viewing:** View loan details, including customer information, loan amount, interest rate, monthly installments, and tenure.

6. **EMI Payments:** Allow customers to make monthly payments towards their EMIs, with the option to pay more or less than the monthly installment.

7. **EMI Recalculation:** Automatically recalculate the EMI amount if the customer pays more or less than the expected installment.

8. **Loan Statement:** Provide a statement of a particular loan, showing details such as principal amount, interest rate, amount paid, monthly installment, and remaining EMIs.

9. **Credit Score Calculation:** Automatically calculate the customer's credit score based on their payment history and loan activity.

10. **Database Integration:** Store customer and loan data in a MySQL database for easy retrieval and management.

11. **Error Handling:** Implement proper error handling with appropriate status codes and error messages for robust application behavior.

12. **Express.js Backend:** Utilize Express.js as the backend framework for routing and handling HTTP requests.

13. **RESTful API:** Design and implement a RESTful API for interacting with the application.



## Prerequisites
Before running the application, make sure you have the following prerequisites installed on your system:

* Node.js (version 10 or higher)
* NPM (Node Package Manager)
* MySQL installed and configured.



### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Sunil-nith/Loan_App.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Replace .env file credentials with your.
   

## Usage

* To run the Server, follow these steps:
1. Navigate to the project directory:
```sh
   cd Loan_App
   ```

2. Run the Srever:
```sh
   npm start
   ```

## API Endpoints
#### Base URL: http://localhost:3000
You can interact with this API by sending HTTP requests to the defined endpoints. Make sure to replace http://localhost:3000 with the actual URL where your API is hosted.

##### The API offers the following endpoints:

##### 1. Ingest Data: Upload customer and loan data from Excel files.
POST `/ingest-data`

##### 2. Register Customer: Register a new customer.

POST `/register`

##### 3. Check Loan Eligibility: Check if a customer is eligible for a loan.

POST `/check-eligibility`

##### 4. Create Loan: Process a new loan based on eligibility.

POST `/create-loan`

##### 5. View Loan Details: View loan details and customer information.

GET `/view-loan/:loan_id`

##### 6. Make Payment: Make a payment towards an EMI.

POST `/make-payment/:customer_id/:loan_id`

##### 7. View Loan Statement: View a statement of a particular loan.

GET `/view-statement/:customer_id/:loan_id`

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvement, please create an issue or submit a pull request

## Contact

If you have any questions or need further assistance, please feel free to contact me at skjnv2009@gmail.com.


