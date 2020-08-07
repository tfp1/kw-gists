db.items.aggregate(
[{
    $match: {
    is_custom: true,
    pooling: false,
    give_back: false,
    visible: true,
    deleted_at:null
}
}, {
$lookup: {
    from: 'users',
    localField: 'fulfiller_id',
    foreignField: '_id',
    as: 'fulfiller'
}
}, {
$lookup: {
    from: 'companies',
    localField: 'company_id',
    foreignField: '_id',
    as: 'companies'
}
}, 
{
$match: {
    "companies.status": "active",
    "companies.subdomain":{$ne: "followmefancy"}
}
}, {
$lookup: {
    from: 'groups',
    localField: 'group_ids',
    foreignField: '_id',
    as: 'groups'
}
},
{$lookup: {    from: 'categories',    localField: 'category_ids',    foreignField: '_id',    as: 'categories'}},
{
$project: {

    name: 1,
    description: {$ifNull: ["$description","null"]},
    _id:1,
    image: { $ifNull: [{$concat: ["https://yei-production-images.s3.amazonaws.com/uploads/item/image/","oid/","$image"]},"null"]},
    points: 1,
    quantity: 1,
    fulfiller_email: { $ifNull: [{$arrayElemAt :["$fulfiller.notification_email",0]},"null"]},
    subdomain: { $ifNull: [{$arrayElemAt :["$companies.subdomain",0]},"null"]},
    groups: { $ifNull: [{$arrayElemAt :["$groups.name",0]},"null"]},
    group_id: { $ifNull: [{$arrayElemAt :["$groups._id",0]},"null"]},
    categories: { $ifNull: [{$arrayElemAt :["$categories.name",0]},"null"]},
}
}]
).toArray()
