// This function is to convert leadsB2C to AccountsB2C and ContactsB2C
// create AccountB2C and ContactsB2C in Creator
// Created Date : Mar 16,2023
//Created By : Lakshmi - 
try 
{
	// leadId = 5685713000000498031;
	leadDetails = zoho.crm.getRecordById("Leads_B2C",leadID);
	//info leadDetails;
	//info leadDetails.get("Converted_to_Contact");
	// Create AccountMap to create record in AccountsB2C module
	if(leadDetails.get("Converted_to_Contact") == true)
	{
		return "Lead to Account got Converted already!!!";
	}
	else
	{
		accountDetails = Map();
		//Company -> Accounts B2C Name - Name 
		accountDetails.put("Company",ifnull(leadDetails.get("Company"),""));
		accountDetails.put("Industry",ifnull(leadDetails.get("Industry"),""));
		accountDetails.put("Email",leadDetails.get("Email"));
		accountDetails.put("Fax",leadDetails.get("Fax"));
		accountDetails.put("Mobile",leadDetails.get("Mobile"));
		accountDetails.put("Phone",leadDetails.get("Phone"));
		accountDetails.put("Postal_Code",leadDetails.get("Zip_Code"));
		accountDetails.put("Province_State",leadDetails.get("State"));
		accountDetails.put("Country",leadDetails.get("Country"));
		accountDetails.put("City",leadDetails.get("City"));
		accountDetails.put("Website",leadDetails.get("Website"));
		accountDetails.put("Address_Line_1",leadDetails.get("Street"));
		accountDetails.put("Tag",leadDetails.get("Tag"));
		accountDetails.put("Secondary_Email",ifnull(leadDetails.get("Secondary_Email"),""));
		accountName = leadDetails.get("Salutations") + "." + leadDetails.get("Name") + " " + leadDetails.get("Last_Name");
		accountDetails.put("Name",ifnull(leadDetails.get("Company"),""));
		// info accountName;
		//info accountDetails;
		createAccountInCRMResponse = zoho.crm.createRecord("Accounts_B2C",accountDetails);
		//info createAccountInCRMResponse;
		accountIDInCRM = createAccountInCRMResponse.get("id");
		if(accountIDInCRM != "" && accountIDInCRM != null)
		{
			//Convert Lead to Contact in CRM
			contactDetailsMap = Map();
			contactDetailsMap.put("Salutations",leadDetails.get("Salutations"));
			contactDetailsMap.put("Name",leadDetails.get("Name"));
			contactDetailsMap.put("Last_Name",leadDetails.get("Last_Name"));
			contactDetailsMap.put("Email",leadDetails.get("Email"));
			contactDetailsMap.put("Fax",leadDetails.get("Fax"));
			contactDetailsMap.put("Mobile",leadDetails.get("Mobile"));
			contactDetailsMap.put("Phone",leadDetails.get("Phone"));
			contactDetailsMap.put("Postal_Code",leadDetails.get("Zip_Code"));
			contactDetailsMap.put("Province_State",leadDetails.get("State"));
			contactDetailsMap.put("Country",leadDetails.get("Country"));
			contactDetailsMap.put("City",leadDetails.get("City"));
			contactDetailsMap.put("Website",leadDetails.get("Website"));
			contactDetailsMap.put("Address_Line_1",leadDetails.get("Street"));
			contactDetailsMap.put("Tag",leadDetails.get("Tag"));
			contactDetailsMap.put("Secondary_Email",ifnull(leadDetails.get("Secondary_Email"),""));
			contactDetailsMap.put("Account_ID",accountIDInCRM);
			createContactInCRMResponse = zoho.crm.createRecord("Contacts_B2C",contactDetailsMap);
			//info createContactInCRMResponse;
			contactIDInCRM = createContactInCRMResponse.get("id");
			updateConvertToContactMap = Map();
			updateConvertToContactMap.put("Converted_to_Contact",true);
			updateConvertToContact = zoho.crm.updateRecord("Leads_B2C",leadID,updateConvertToContactMap);
		}
		//Create Record in Creator for Accounts Module
		if(createAccountInCRMResponse.get("id") != "")
		{
			creatorAccountDetailsMap = Map();
			creatorAccountDetailsMap.put("Name",if(leadDetails.get("Company") != null,leadDetails.get("Company"),""));
			creatorAccountDetailsMap.put("Company",if(leadDetails.get("Company") != null,leadDetails.get("Company"),""));
			creatorAccountDetailsMap.put("Industry",ifnull(leadDetails.get("Industry"),""));
			accountAddressMap = Map();
			accountAddressMap.put("address_line_1",if(leadDetails.get("Street") != null,leadDetails.get("Street"),""));
			accountAddressMap.put("district_city",if(leadDetails.get("City") != null,leadDetails.get("City"),""));
			accountAddressMap.put("state_province",if(leadDetails.get("State") != null,leadDetails.get("State"),""));
			accountAddressMap.put("postal_Code",if(leadDetails.get("Zip_Code") != null,leadDetails.get("Zip_Code"),""));
			accountAddressMap.put("country",if(leadDetails.get("Country") != null,leadDetails.get("Country"),""));
			creatorAccountDetailsMap.put("Address",accountAddressMap);
			//info creatorAccountDetailsMap; 
			creatorAccountDetailsMap.put("Email",if(leadDetails.get("Email") != null,leadDetails.get("Email"),""));
			creatorAccountDetailsMap.put("Fax",if(leadDetails.get("Fax") != null,leadDetails.get("Fax"),""));
			creatorAccountDetailsMap.put("Mobile",ifnull(leadDetails.get("Mobile"),""));
			creatorAccountDetailsMap.put("Phone_Number",ifnull(leadDetails.get("Phone"),""));
			creatorAccountDetailsMap.put("Zoho_CRM_ID",createAccountInCRMResponse.get("id"));
			creatorAccountDetailsResponse = zoho.creator.createRecord("palplus","pal-plus","Accounts_B2C",creatorAccountDetailsMap,Map(),"syntocreator");
			//info creatorAccountDetailsResponse;
			if(creatorAccountDetailsResponse.get("code") == 3000)
			{
				accountID = creatorAccountDetailsResponse.get("data").get("ID");
				info accountID;
				updateCreatorAccountID = {"Creator_Account_ID":accountID};
				updateCreatorAccountIdResponse = zoho.crm.updateRecord("Accounts_B2C",accountIDInCRM,updateCreatorAccountID);
				info updateCreatorAccountIdResponse;
			}
		}
		//Create record in Contacts Module in Creator
		if(createContactInCRMResponse.get("id") != "")
		{
			crmContactID = createContactInCRMResponse.get("id");
			//info crmContactID;
			creatorContactDetailsMap = Map();
			creatorContactDetailsMap.put("First_Name",leadDetails.get("Name"));
			creatorContactDetailsMap.put("Last_Name",leadDetails.get("Last_Name"));
			creatorContactDetailsMap.put("Name",leadDetails.get("accountName"));
			creatorContactDetailsMap.put("Company",leadDetails.get("Company"));
			creatorContactDetailsMap.put("Industry",ifnull(leadDetails.get("Industry"),""));
			creatorContactDetailsMap.put("Address",accountAddressMap);
			creatorContactDetailsMap.put("Email",leadDetails.get("Email"));
			creatorContactDetailsMap.put("Fax",leadDetails.get("Fax"));
			creatorContactDetailsMap.put("Mobile",leadDetails.get("Mobile"));
			creatorContactDetailsMap.put("Phone_Number",leadDetails.get("Phone"));
			creatorContactDetailsMap.put("ContactsB2C_Crm_ID",crmContactID);
			creatorContactDetailsMap.put("B2C_Accounts",accountID.tolong());
			//info creatorContactDetailsMap;
			creatorContactDetailsReponse = zoho.creator.createRecord("palplus","pal-plus","Contacts_B2C",creatorContactDetailsMap,Map(),"syntocreator");
			//info creatorContactDetailsReponse;
			if(creatorContactDetailsReponse.get("code") == 3000)
			{
				contactId = creatorContactDetailsReponse.get("data").get("ID");
				info contactId;
				updateCreatorContactID = {"ContactsB2C_Creator_ID":contactId};
				updateCreatorAccountIdResponse = zoho.crm.updateRecord("Contacts_B2C",contactIDInCRM,updateCreatorContactID);
				info updateCreatorAccountIdResponse;
			}
		}
		accountCreatedSuccessMap = Map();
		accountCreatedSuccessMap.put("Module","Leads B2C");
		accountCreatedSuccessMap.put("In_Data","Crm Rec ID" + creatorAccountDetailsResponse.get("code"));
		accountCreatedSuccessMap.put("Process_Description","Convert LeadsB2C to AccountsB2C.Create Accounts Record in Creator");
		accountCreatedSuccessMap.put("Out_Response","Account Added Successfuylly");
		updateDeveloperLogSuccess = zoho.creator.createRecord("palplus","pal-plus","Developer_Log",accountCreatedSuccessMap,Map(),"syntocreator");
	}
}
catch (e)
{
	creatorErrorMap = Map();
	creatorErrorMap.put("Module","Leads B2C");
	creatorErrorMap.put("In_Data","Crm Rec ID" + creatorAccountDetailsResponse.get("code"));
	creatorErrorMap.put("Process_Description","Convert LeadsB2C to AccountsB2C.Create Accounts Record in Creator");
	creatorErrorMap.put("Out_Response",e);
	updateDeveloperLogErrorMessage = zoho.creator.createRecord("palplus","pal-plus","Developer_Log",creatorErrorMap,Map(),"syntocreator");
}
return "Lead got converted to Account Successfully";