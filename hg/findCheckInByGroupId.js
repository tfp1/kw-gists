db.FeedbackSession.find({ //These are the actual answers for a Check-In. The Card and Cycle are created elsewhere
    "GroupId" : {$in: [
        "b7efbfb0-4107-11e9-8690-8df773ae662d", //Transportation Technology Center, Inc Demo
        "e7803720-c302-11e7-8a06-a5a3cce03d34" //Allen & Overy
        ]},
    "CycleType" : "SelfEvaluation", //This is the Check-In Type
    //"Status" : {$in: ["ManagerAnswer", "Overdue"]}
    },
     {GroupId:1,
      CreatedDate:1})
.sort({_id:-1})
