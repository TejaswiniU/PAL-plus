//returnStatus = "";
if(convertToContact == "true")
{
	returnStatus = "Already Converted to Contact";
}
else
{
	if(creatorID != "" && creatorID != null)
	{
		openUrl("https://creatorapp.zoho.com/palplus/pal-plus/#Form:B2C_Map_to_Account?Leads_B2C=" + creatorID.toLong(),"new window");
	}
	else
	{
		returnStatus = "Data Not Available in Creator.Please contact Application Owner..!";
	}
}
return returnStatus;