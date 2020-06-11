db.users.find({
   company_id: ObjectId('59d5437feab5671294506781'), // Comcast companies._id 
    active:true, //Only want to get our active users
    reference:{$exists:true} //7 users had no `reference`, which caused my JSON --> CSV conversion to fail
  },
{reference:1, points_to_redeem:1,_id:0}
  ).toArray() //lets us copy-paste into Atom for the JSON --> CSV conversion. I've never gotten .toCSV() to work
