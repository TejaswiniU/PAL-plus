/**
This function is to merge lead with Contact based on the merge condition
Author : Lakshmi - Mar 21st
**/
try 
{
	if(input.Merge_Combination != null || input.Merge_Combination != "")
	{
		mergeValue = input.Merge_Combination;
		getContactDetails = Contacts_B2C[ID == input.Contacts_B2C];
		getLeadDetails = Leads_B2C[ID == input.Zoho_CRM_ID.tolong()];
		// 		info getLeadDetails.B2C_CRM_Lead_ID;
		// 		info getContactDetails.Email;
		if(mergeValue == "Update in Contact")
		{
			//Update selected values in contact Module in CRM and Creator
			updateCRMContactMap = Map();
			if(input.Email_Update != "" && input.Email_Update == "Lead Email")
			{
				getContactDetails.Email=getLeadDetails.Email;
				updateCRMContactMap.put("Email",getLeadDetails.Email);
			}
			if(input.Phone_Update != "" && input.Phone_Update == "Lead Phone")
			{
				getContactDetails.Phone_Number=getLeadDetails.Phone_Number;
				updateCRMContactMap.put("Phone",getLeadDetails.Phone_Number);
			}
			updateCRMContactResponse = zoho.crm.updateRecord("Contacts_B2C",getContactDetails.ContactsB2C_Crm_ID.tolong(),updateCRMContactMap);
			//info updateCRMContactResponse;
		}
		else
		{
			// Update selected values in Lead Module in CRM and Creator
			updateCRMLeadMap = Map();
			if(input.Email_Update != "" && input.Email_Update == "Contact Email")
			{
				getLeadDetails.Email=getContactDetails.Email;
				updateCRMLeadMap.put("Email",getContactDetails.Email);
			}
			if(input.Phone_Update != "" && input.Phone_Update == "Contact Phone")
			{
				getLeadDetails.Phone_Number=getContactDetails.Phone_Number;
				updateCRMLeadMap.put("Phone",getContactDetails.Phone_Number);
			}
			updateCRMLeadResponse = zoho.crm.updateRecord("Leads_B2C",getLeadDetails.B2C_CRM_Lead_ID.toLong(),updateCRMLeadMap);
		}
		if(updateCRMContactResponse.get("id") != "" || updateCRMLeadResponse.get("id") != "")
		{
			//update Convert to contact field to true in LeadsB2C CRM Module
			updateConvertToContactMap = Map();
			updateConvertToContactMap.put("Converted_to_Contact",true);
			updateConvertToContactMap.put("Converted_Date",zoho.currentdate);
			updateConvertToContactResponse = zoho.crm.updateRecord("Leads_B2C",getLeadDetails.B2C_CRM_Lead_ID.toLong(),updateConvertToContactMap);
			//info updateConvertToContactResponse;
		}
	}
}
catch (e)
{
	errorMessage = insert into Developer_Log
	[
		Added_User=zoho.loginuser
		Out_Response=e
		In_Data="Error occurred while merging lead with contact"
		Process_Description="Error occurred while merging lead with contact"
		Module="Merge Contact"
	];
}
