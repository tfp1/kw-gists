db.items.aggregate(
[{
    $match: { // Our WHERE clause for objects in the items collection
    is_custom: true,
    pooling: false,
    give_back: false,
    visible: true,
    deleted_at:null
}
}, {
$lookup: { //A JOIN to users so we can get the object for users marked as fulfillers on an item
    from: 'users',
    localField: 'fulfiller_id',
    foreignField: '_id',
    as: 'fulfiller'
}
}, {
$lookup: { //a JOIN to companies so we can get the subdomain
    from: 'companies',
    localField: 'company_id',
    foreignField: '_id',
    as: 'companies'
}
}, 
{
$match: { //a WHERE clause on the companies objects to get only active companies and exclude our test company
    "companies.status": "active",
    "companies.subdomain":{$ne: "followmefancy"}
}
}, {
$lookup: { //a JOIN to groups so we get get the name & ObjectID for the 'who is allowed to see this item?' filter in GRS
    from: 'groups',
    localField: 'group_ids',
    foreignField: '_id',
    as: 'groups'
}
},
{$lookup: {    from: 'categories',    localField: 'category_ids',    foreignField: '_id',    as: 'categories'}}, //a JOIN to Categories to get the string name
{$lookup: {    from: 'group_constraints',    localField: 'category_ids',    foreignField: '_id',    as: 'group_constraints'}},
 {
$project: { // This is where we select the fields that we want returned.
    name: 1, //Name of the item
    description: {$ifNull: ["$description",""]}, //Description of the item, but we pass an empty string to the JSON object if it's NULL so we are still able to convert to CSV
    _id:1, //ObjectId of the item. Normally we'd want to stringify this in the $project pipeline, but Mongo 3.6.x doesn't support that. We resolve this later in a text editor using a RegEx Find & Replace
    image: { $ifNull: [{$concat: ["https://yei-production-images.s3.amazonaws.com/uploads/item/image/","oid/","$image"]},"null"]}, //The URL of item's image. We need to put the ObjectID in the URL, but we can't do that in Mongo 3.6.x, so we get both values separately and then do a regexReplace in excel/sheets
    points: 1, //Cost of the item in points
    quantity: 1, //The quantity on hand. GRS doesn't really care about this but I never removed it from the query
    fulfiller_email: { $ifNull: [{$arrayElemAt :["$fulfiller.notification_email",0]},""]}, //The email address of the FIRST fulfiller. $fulfiller.notification_email returns a list of all fulfillers on this item, but $arrayElemAt selects the 0 indexed item. We didn't want to deal with passing dozens of fulfillers.
    subdomain: { $ifNull: [{$arrayElemAt :["$companies.subdomain",0]},""]}, //Subdomain of the company. We don't really need the $ifNull statement, but I was trying to be defensive
    groups: { $ifNull: ["$groups.name",""]}, //A list of the names of groups who are allowed to access this item
    group_id: { $ifNull: ["$groups._id",""]}, //A list of the IDs of groups who are allowed to access this item
    group_constraints_name:{ $ifNull: ["$group_constraints.name",""]},
    categories: { $ifNull: [{$arrayElemAt :["$categories.name",0]},""]}, //The FIRST category of the item.
}
}]
).toArray()
