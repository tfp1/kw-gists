db.items.aggregate(
[{
$match: {
        is_custom: true,
        pooling: true,
        give_back: false,
        visible: true,
        deleted_at:null
}
}, 
{$lookup: {     from: 'users',          localField: 'fulfiller_id',             foreignField: '_id',        as: 'fulfiller'}}, 
{$lookup: {     from: 'companies',      localField: 'company_id',               foreignField: '_id',        as: 'companies'}}, 
{
$match: {
        "companies.status": "active",
        "companies.subdomain": {$ne:'followmefancy'}
}
}, 
{$lookup: {     from: 'groups',         localField: 'group_ids',                foreignField: '_id',        as: 'groups'}}, 
{$lookup: {     from: 'group_types',    localField: 'groups.group_type_id',     foreignField: '_id',        as: 'group_types'}}, 
{
$project: {
        _id:1,
        name: { $ifNull: [ "$name", "" ] },
        description: { $ifNull: [ "$description", "" ] },
        image: { $ifNull: [ "$image", "" ] },
        image: { $concat: [ "https://yei-production-images.s3.amazonaws.com/uploads/item/image/","oid/","$image" ] },
        points: { $ifNull: [ "$points", "" ] },
        fulfiller_email: { $ifNull: [{$arrayElemAt :["$fulfiller.notification_email",0]}, "" ] },
        subdomain: { $ifNull: [{$arrayElemAt :["$companies.subdomain",0]}, "" ] },
        groups: { $ifNull: [ "$groups.name", "" ] },
        pooling_minimum_contribution: { $ifNull: [ "$pooling_minimum_contribution", "" ] },
        pooling_points_cum: { $ifNull: [ "$pooling_points_cum", "" ] },
        group_id: { $ifNull: [ "$groups._id", "" ] },
        group_type_id: { $ifNull: [ "$group_types._id", "" ] },
        group_type_name: { $ifNull: [ "$group_types.name", "" ] },
        pool_end: { $ifNull: [ "$pooling_end_time", "" ] },
}
}]
).toArray()
