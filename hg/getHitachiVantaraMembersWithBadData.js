db.Member.find({
    $or: [
      {LastName:  /([^A-z 0-9\-\.\,'])/},
      {FirstName: /([^A-z 0-9\-\.\,'])/},
      {FullName:  /([^A-z 0-9\-\.\,'])/}
      ],
    GroupId:'c7b576d0-1961-11e7-bd9e-839eb3a17ff0', //Hitachi Vantara
    MembershipStatus: 'Active'
},
{
  _id:0,
//  hgId:1,
  LastName:1,
  FirstName:1, 
  FullName:1
}).toArray()
