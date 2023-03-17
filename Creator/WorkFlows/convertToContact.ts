//leadID = input.Leads_B2C;
selectedActionValue = input.Action_field;
if(selectedActionValue == "Convert to Contact")
{
	// 	if(input.Lead_Company_Name_same_as_Account_Name == true){
	// 	}
	thisapp.CRM.convertToContact(input.Leads_B2C,input.Account_Name,input.Email,input.Lead_Company_Name_same_as_Account_Name);
}
else if(selectedActionValue == "Map to Account")
{
	if(input.Accounts != null && input.Leads_B2C != null)
	{
		thisapp.CRM.createContact(input.Accounts,input.Leads_B2C);
	}
}
