var $hgid = "" //Insert the hgid of the _Survey_ here. Related query is in the comments
db.getCollection('Recurrence').find({EntityId : $hgid, Status: {$ne:'Archived'}, MethodName: 'SendPulseSurveyReminder'})
