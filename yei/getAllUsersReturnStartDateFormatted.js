db.users.aggregate([
  {'$match': {'company_id': new ObjectId('59641c0df117c328aa42a553')}}, //Turner Broadcasting
{'$project': 
{   
    _id:0,
    'start': {'$dateToString': {'format': '%G-%m-%d', 'date': '$start_date'}}, //`'$start_date'` is the field in the db. We're casting it to the preferred format of yyyy-mm-dd
    'confirmed': {'$dateToString': {'format': '%G-%m-%d', 'date': '$confirmed_at'}}, 
    'created': {'$dateToString': {'format': '%G-%m-%d', 'date': '$created_at'}}
}}])
.toArray() //Gets us all of the results into a single object that can easily be converted to CSV
