const { parseStringPromise } = require('xml2js');
const CreditReport = require('../models/CreditReport');

// A helper function to safely get nested properties
const getSafe = (fn, defaultValue = null) => {
  try {
    return fn() || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

exports.uploadAndProcessReport = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // 1. Parse the XML file buffer
    const xmlData = req.file.buffer.toString('utf-8');
    const parsedData = await parseStringPromise(xmlData, { explicitArray: false, trim: true });

    const report = parsedData.INProfileResponse;

    // 2. Extract data from the parsed object
    const extractedData = {
      // Basic Details
      name: `${getSafe(() => report.Current_Application.Current_Application_Details.Current_Applicant_Details.First_Name, '')} ${getSafe(() => report.Current_Application.Current_Application_Details.Current_Applicant_Details.Last_Name, '')}`.trim(),
      pan: getSafe(() => report.CAIS_Account.CAIS_Account_DETAILS[0].CAIS_Holder_Details.Income_TAX_PAN),
      mobile: getSafe(() => report.Current_Application.Current_Application_Details.Current_Applicant_Details.MobilePhoneNumber),
      creditScore: parseInt(getSafe(() => report.SCORE.BureauScore, 0), 10),

      // Report Summary
      totalAccounts: parseInt(getSafe(() => report.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountTotal, 0), 10),
      activeAccounts: parseInt(getSafe(() => report.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountActive, 0), 10),
      closedAccounts: parseInt(getSafe(() => report.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountClosed, 0), 10),
      totalCurrentBalance: parseInt(getSafe(() => report.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_All, 0), 10),
      totalSecuredBalance: parseInt(getSafe(() => report.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_Secured, 0), 10),
      totalUnsecuredBalance: parseInt(getSafe(() => report.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_UnSecured, 0), 10),
      enquiriesLast7Days: parseInt(getSafe(() => report.TotalCAPS_Summary.TotalCAPSLast7Days, 0), 10),

      // Credit Accounts Information
      accounts: getSafe(() => report.CAIS_Account.CAIS_Account_DETAILS, []).map(acc => {
        const addressDetails = getSafe(() => acc.CAIS_Holder_Address_Details, {});
        const addressParts = [
          addressDetails.First_Line_Of_Address_non_normalized,
          addressDetails.Second_Line_Of_Address_non_normalized,
          addressDetails.Third_Line_Of_Address_non_normalized,
          addressDetails.City_non_normalized
        ].filter(Boolean); // Filter out any null/undefined parts
        
        let fullAddress = addressParts.join(', ');
        const zip = addressDetails.ZIP_Postal_Code_non_normalized;
        if (zip) {
          fullAddress += ` - ${zip}`;
        }

        // --- CREDIT CARD IDENTIFICATION LOGIC ---
        const accountType = getSafe(() => acc.Account_Type);
        const creditCardTypes = ['10', '51', '52'];
        const isCreditCard = creditCardTypes.includes(accountType);

        return {
          subscriberName: getSafe(() => acc.Subscriber_Name),
          accountNumber: getSafe(() => acc.Account_Number),
          accountType: accountType,
          isCreditCard: isCreditCard, // Set the flag
          openDate: getSafe(() => acc.Open_Date),
          currentBalance: parseInt(getSafe(() => acc.Current_Balance, 0), 10),
          amountOverdue: parseInt(getSafe(() => acc.Amount_Past_Due, 0), 10),
          paymentHistory: getSafe(() => acc.Payment_History_Profile),
          dateReported: getSafe(() => acc.Date_Reported),
          address: fullAddress
        };
      })
    };

    if (!extractedData.pan) {
        return res.status(400).json({ message: 'PAN number not found in the XML file. Cannot process.' });
    }

    // 3. Save to database (Update if exists, otherwise create new)
    const savedReport = await CreditReport.findOneAndUpdate(
        { pan: extractedData.pan }, // Find by PAN
        extractedData,              // Data to update/insert
        { new: true, upsert: true } // Options: return the new doc, and create if it doesn't exist
    );

    res.status(201).json({ message: 'Report processed successfully!', data: savedReport });

  } catch (error) {
    console.error('Processing Error:', error);
    res.status(500).json({ message: 'Error processing XML file.', error: error.message });
  }
};

// @desc    Get all processed reports (basic info)
// @route   GET /api/reports
// @access  Public
exports.getAllReports = async (req, res) => {
  try {
    // We only select the name, pan, and createdAt fields to keep the list lightweight
    const reports = await CreditReport.find({}).select('name pan createdAt');
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error while fetching reports.' });
  }
};

// @desc    Get a single report by PAN
// @route   GET /api/reports/:pan
// @access  Public
exports.getReportByPan = async (req, res) => {
  try {
    const report = await CreditReport.findOne({ pan: req.params.pan });
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    res.status(200).json(report);
  } catch (error)
  {
    console.error('Error fetching report by PAN:', error);
    res.status(500).json({ message: 'Server error while fetching the report.' });
  }
};