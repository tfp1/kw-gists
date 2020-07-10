db.items.aggregate(
[{
$match: {
        is_custom: true,
        pooling: true,
        give_back: false,
        visible: true,
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
}, {
$match: {
        "companies.status": "active",
        "companies.subdomain": {$ne:'followmefancy'}
}
}, {
$lookup: {
        from: 'groups',
        localField: 'group_ids',
        foreignField: '_id',
        as: 'groups'
}
}, {
$project: {
        _id:1,
        name: { $ifNull: [ "$name", "null" ] },
        description: { $ifNull: [ "$description", "null" ] },
        image: { $ifNull: [ "$image", "null" ] },
        image: { $concat: [ "https://yei-production-images.s3.amazonaws.com/uploads/item/image/","oid/","$image" ] },
        points: { $ifNull: [ "$points", "null" ] },
        fulfiller_email: { $ifNull: [ "$fulfiller.notification_email", "null" ] },
        subdomain: { $ifNull: [ "$companies.subdomain", "null" ] },
        groups: { $ifNull: [ "$groups.name", "null" ] },
        pooling_minimum_contribution: { $ifNull: [ "$pooling_minimum_contribution", "null" ] },
        pooling_points_cum: { $ifNull: [ "$pooling_points_cum", "null" ] }
}
}]
).toArray()
