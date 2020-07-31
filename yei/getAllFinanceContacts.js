db.companies.aggregate({$match:{status: {$in:["active","prelaunch"]}}},{$project:{
    finance_email_1:{ $ifNull: [{$arrayElemAt :["$finance_emails",0]},""]},
    finance_email_2:{ $ifNull: [{$arrayElemAt :["$finance_emails",1]},""]},
    finance_email_3:{ $ifNull: [{$arrayElemAt :["$finance_emails",2]},""]},
    name: { $ifNull: ["$finance_contact_name",""]},
    subdomain:1,
    status:1,
    _id:0
    }}).toArray()
