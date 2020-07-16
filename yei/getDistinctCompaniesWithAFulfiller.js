db.runCommand({ 
distinct: "users", //the collection the data is coming from
key:"company_id", //the field you want distinct values of
query:{ //a standard $match query
    "_roles.fulfiller":true,
    "_roles.superadmin":false,
    "_roles.admin":false,
    active:true}
})
