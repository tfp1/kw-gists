var $hgid = "" //Insert the hgid of the _Survey_ here. Related query is in the comments
db.Recurrence.find(
  {EntityId : $hgid, 
   Status: {$ne:'Archived'}, 
   MethodName: 'SendPulseSurveyReminder'}
);
//
db.Survey.find(
  {"Template.PulseQuestions.Question": "The senior leaders at Premise Health inspire me."}
)
