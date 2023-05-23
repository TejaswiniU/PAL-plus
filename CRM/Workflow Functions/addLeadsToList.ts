/**
This function is to add leads to list in Marketing automation based on the selected Type of Entity
Auther : LAkshmi - Mar 23
**/
try 
{
	//construct listkey based on the type of Entity
	if(typeOfEntity == "Verso abonnés/Verso subscribers")
	{
		listKey = "3z1e4db2ac2deffd7bda349493683afd00a18330172834ec70bc286808d4d22323";
	}
	else if(typeOfEntity == "OMG abonnées/OMG subscribers")
	{
		listKey = "3z1e4db2ac2deffd7bda349493683afd00710fd9910d5493c901e10022cd72869f";
	}
	else if(typeOfEntity == "EM abonnés/EM subscribers")
	{
		listKey = "3z1e4db2ac2deffd7bda349493683afd008411590443aa70e3e4656de39804696c";
	}
	else if(typeOfEntity == "B4S abonnés/B4S subscribers")
	{
		listKey = "3z1e4db2ac2deffd7bda349493683afd0042b2daad73f8312db6937a1e7bb1aeb7";
	}
	else if(typeOfEntity == "Koz abonnés/Koz subscribers")
	{
		listKey = "3z1e4db2ac2deffd7bda349493683afd00aea4daea1d0d441807ad3bbfc8e144a7";
	}
	else
	{
		//Espace 4 saisons - abonnés/Espace 4 saisons - subscribers
		listKey = "3z1e4db2ac2deffd7bda349493683afd00f9acba006c860b4079c7034b231389ca";
	}
	//info listKey;
	urlValue = "https://marketingautomation.zoho.com/api/v1/addleadsinbulk?listkey=" + listKey + "&resfmt=JSON&emailids=" + emailID;
	info urlValue;
	// 		info parmaterMap.toString();
	addLeadsResponse = invokeurl
	[
		url :urlValue
		type :POST
		connection:"automationconnection"
	];
	info addLeadsResponse;
}
catch (e)
{
	info e;
}