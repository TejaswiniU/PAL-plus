/**
This function to display the contact details - Name, Phone and Email for the selected contact to merge the lead with
Author : Nambi - Mar 21st
**/
if(input.Zoho_CRM_ID != null && input.Contacts_B2C != null)
{
	get_lead = Leads_B2C[ID == input.Creator_Lead_ID.tolong()];
	get_contacts = Contacts_B2C[ID == input.Contacts_B2C];
	input.details = "<!DOCTYPE html><html><style>table, th, td {  border:1px solid black;  border-collapse:collapse;}</style><body><table style='width:100%'>  <tr>    <th style='width:15%'></th>    <th style='width:30%'>Name</th>    <th style='width:30%'>Email</th>    <th style='width:25%'>Phone</th>  </tr>  <tr>    <td><b>Lead</td>    <td>" + get_lead.First_Name + " " + get_lead.Last_Name + "</td>    <td>" + get_lead.Email + "</td>    <td>" + get_lead.Phone_Number + "</td>  </tr>  <tr>    <td><b>Contact</td>    <td>" + get_contacts.First_Name + " " + get_contacts.Last_Name + "</td>    <td>" + get_contacts.Email + "</td><td>" + get_contacts.Phone_Number + "</td>  </tr></table></body></html>";
}
else
{
	input.details = null;
}
