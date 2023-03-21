if(convertToContact == "true")
{
	returnStatus = "Already Merged to Contact";
}
else
{
	if(leadID != "" && leadID != null)
	{
		if(creatorID != null && creatorID != "")
		{
			openUrl("https://creatorapp.zoho.com/palplus/pal-plus/#Form:Merge_Contact?Zoho_CRM_ID=" + leadID.toLong() + "&Creator_Lead_ID=" + creatorID.toLong(),"new window");
		}
		else
		{
			returnStatus = "Data Not Available in Creator.Please contact Application Owner..!";
		}
	}
	else
	{
		returnStatus = "Please Contact Administrator";
	}
}
return returnStatus;