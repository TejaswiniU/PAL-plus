selectedActionValue = input.Action_field;
//info selectedActionValue;
if(selectedActionValue == "Convert to Contact")
{
	show Account_Name;
	show Email;
	show Lead_Company_Name_same_as_Account_Name;
	hide Accounts;
	hide Leads_B2C;
}
else if(selectedActionValue == "Map to Account")
{
	hide Account_Name;
	hide Email;
	hide Lead_Company_Name_same_as_Account_Name;
	disable Leads_B2C;
	show Accounts;
	show Leads_B2C;
}
