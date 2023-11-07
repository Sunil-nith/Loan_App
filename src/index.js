const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
app.use(express.json());
const ingestDatarouter = require("./routes/ingestDataRoutes");
const registerCustomerRouter = require("./routes/registerRoutes");
const checkEligibilityRouter = require("./routes/checkEligibilityRouter");
const createLoanRouter=require('./routes/createLoanRoutes');
const viewLoanRouter=require('./routes/viewLoanRoutes');
const makePaymentRouter=require('./routes/makePaymetRoutes');
const viewStatementRouter=require('./routes/viewStatementRoutes');


app.use("/ingest-data", ingestDatarouter);
app.use("/register", registerCustomerRouter);
app.use("/check-eligibility", checkEligibilityRouter);
app.use("/create-loan",createLoanRouter);
app.use("/view-loan",viewLoanRouter);
app.use("/make-payment",makePaymentRouter);
app.use("/view-statement",viewStatementRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});