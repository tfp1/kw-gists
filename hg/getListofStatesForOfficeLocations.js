db.getCollection('Team').find(
{GroupId:"d0ea5040-53d0-11e8-922c-e3eb438e8cb9"}, // GroupId goes here
{'hgId':1,'Name':1,'Address.State': 1,_id:0} // Includes `hgId`, `Name`, `State`, excludes `_id` 
)
