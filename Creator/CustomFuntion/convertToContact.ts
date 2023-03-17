void CRM.convertToContact(int leadID, String accountName, String accountEmail, bool companyNameCheck)
{
	// This function is to convert leadsB2C to AccountsB2C and ContactsB2C in CRM
	// create AccountB2C and ContactsB2C in Creator
	// Created Date : Mar 17,2023
	//Created By : Lakshmi 
	//get LeadDetails From CRM -> Create Account and Contact in CRM -> Create Account and Contact in Creator -> Update Creator id in crm ->Update CRM id in creator
	//if Lead Company Name same as Account Name checked -> disable account name -> update only email id while creating account in CRM and Creator
	try 
	{
		leadDetails = Leads_B2C[ID == leadID];
		//info leadDetails;
		if(companyNameCheck == true)
		{
			leadCompanyName = leadDetails.Company;
		}
		else
		{
			leadCompanyName = accountName;
		}
		//Create Record in AccountsB2C and ContactB2C module in Creator
		// 		info leadCompanyName;
		// 		info accountEmail;
		creatorAccountResponse = insert into Accounts_B2C
		[
			Added_User=zoho.loginuser
			Name=leadCompanyName
			Company=leadCompanyName
			Industry=leadDetails.Industry
			Email=accountEmail
			Mobile=leadDetails.Mobile
			Phone_Number=leadDetails.Phone_Number
			Fax=leadDetails.Fax
			Address.address_line_1=leadDetails.Street
			Address.district_city=leadDetails.City
			Address.state_province=leadDetails.State
			Address.country=leadDetails.Country
			Address.postal_Code=leadDetails.Postal_Code
		];
		//info creatorAccountResponse;
		creatorContactResponse = insert into Contacts_B2C
		[
			Added_User=zoho.loginuser
			First_Name=leadDetails.First_Name
			Last_Name=leadDetails.Last_Name
			Email=leadDetails.Email
			Phone_Number=leadDetails.Phone_Number
			Mobile=leadDetails.Mobile
			Fax=leadDetails.Fax
			B2C_Accounts=creatorAccountResponse
		];
		//info creatorContactResponse;
		//update Convert to contact field to true in LeadsB2C CRM Module
		updateConvertToContactMap = Map();
		updateConvertToContactMap.put("Converted_to_Contact",true);
		updateConvertToContactMap.put("Converted_Date",zoho.currentdate);
		updateConvertToContactResponse = zoho.crm.updateRecord("Leads_B2C",leadDetails.B2C_CRM_Lead_ID.tolong(),updateConvertToContactMap);
		//info updateConvertToContactResponse;
		//Create Record in AccountsB2C and ContactB2C module in CRM
		creatorAccountID = Accounts_B2C[ID == creatorAccountResponse].ID;
		creatorContactID = Contacts_B2C[ID == creatorContactResponse].ID;
		//info creatorAccountID;
		accountDetails = Map();
		accountDetails.put("Company",ifnull(leadDetails.Company,""));
		accountDetails.put("Industry",ifnull(leadDetails.Industry,""));
		accountDetails.put("Name",ifnull(leadDetails.First_Name,""));
		accountDetails.put("Email",ifnull(leadDetails.Email,""));
		accountDetails.put("Fax",ifnull(leadDetails.Fax,""));
		accountDetails.put("Mobile",ifnull(leadDetails.Mobile,""));
		accountDetails.put("Phone",ifnull(leadDetails.Phone_Number,""));
		accountDetails.put("Postal_Code",ifnull(leadDetails.Postal_Code,""));
		accountDetails.put("Province_State",ifnull(leadDetails.State,""));
		accountDetails.put("Country",ifnull(leadDetails.Country,""));
		accountDetails.put("City",ifnull(leadDetails.City,""));
		accountDetails.put("Website",ifnull(leadDetails.Website,""));
		accountDetails.put("Address_Line_1",ifnull(leadDetails.Street,""));
		accountDetails.put("Creator_Account_ID",creatorAccountID.toString());
		createAccountInCRMResponse = zoho.crm.createRecord("Accounts_B2C",accountDetails);
		//info createAccountInCRMResponse;
		if(createAccountInCRMResponse.get("id") != "")
		{
			crmAccountID = createAccountInCRMResponse.get("id");
			//info crmAccountID;
			updateCRMAccountsID = Accounts_B2C[ID == creatorAccountID];
			updateCRMAccountsID.Zoho_CRM_ID=crmAccountID;
			contactDetails = Map();
			contactDetails.put("Company",ifnull(leadDetails.Company,""));
			contactDetails.put("Industry",ifnull(leadDetails.Industry,""));
			contactDetails.put("Name",ifnull(leadDetails.First_Name,""));
			contactDetails.put("Last_Name",ifnull(leadDetails.Last_Name,""));
			contactDetails.put("Email",ifnull(leadDetails.Email,""));
			contactDetails.put("Fax",ifnull(leadDetails.Fax,""));
			contactDetails.put("Mobile",ifnull(leadDetails.Mobile,""));
			contactDetails.put("Phone",ifnull(leadDetails.Phone_Number,""));
			contactDetails.put("Postal_Code",ifnull(leadDetails.Postal_Code,""));
			contactDetails.put("Province_State",ifnull(leadDetails.State,""));
			contactDetails.put("Country",ifnull(leadDetails.Country,""));
			contactDetails.put("City",ifnull(leadDetails.City,""));
			contactDetails.put("Website",ifnull(leadDetails.Website,""));
			contactDetails.put("Address_Line_1",ifnull(leadDetails.Street,""));
			contactDetails.put("Creator_Contact_ID",creatorContactID.toString());
			contactDetails.put("Account_ID",crmAccountID);
			createContactInCRMResponse = zoho.crm.createRecord("Contacts_B2C",contactDetails);
			//info createContactInCRMResponse;
			crmContactID = createContactInCRMResponse.get("id");
			updateCRMContactId = Contacts_B2C[ID == creatorContactID];
			updateCRMContactId.ContactsB2C_Crm_ID=crmContactID;
		}
		//Redirect page to Contacts Module in CRM
		openUrl("https://crm.zoho.com/crm/org805223710/tab/CustomModule6/" + crmContactID.toLong(),"new window");
	}
	catch (e)
	{
		errorMessage = insert into Developer_Log
		[
			Added_User=zoho.loginuser
			Out_Response=e
			In_Data="Error occurred"
			Process_Description="Convert LeadsB2C to AccountsB2C & ContactsB2C"
			Module="B2C_Map_to_Account"
		];
	}
}