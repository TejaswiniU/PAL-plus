if(input.Merge_Combination != "" || input.Merge_Combination == "Update in Contact")
{
	//validate if contact exists with same email in CRM and creator
	getLead = Leads_B2C[ID == input.Creator_Lead_ID.tolong()];
	searchContacts = zoho.crm.searchRecords("Contacts_B2C","(Email:equals:" + getLead.Email + ")");
	if(searchContacts.size() >= 1 && searchContacts.get(0).get("id") != input.Contacts_B2C.ContactsB2C_Crm_ID)
	{
		alert "This Email id is already exists in another Contact";
		cancel submit;
	}
}
else
{
	//validate if lead exists with same email in CRM and Creator
	getContact = Contacts_B2C[ID == input.Contacts_B2C.tolong()];
	searchLeads = zoho.crm.searchRecords("Leads_B2C","(Email:equals:" + getContact.Email + ")");
	if(searchLeads.size() >= 1 && searchLeads.get(0).get("id") != input.Creator_Lead_ID)
	{
		alert "This Email id is already exists in another Lead";
		cancel submit;
	}
}
