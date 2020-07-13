db.getCollection('group_types').aggregate(
[{
    $match: {
        $or:[
                {name: "Country"},
                {name: "Countries"},
                {name: "Region"},
                {name: /ountr/},
        ]}
}, {
    $lookup: {
        from: 'companies',
        localField: 'company_id',
        foreignField: '_id',
        as: 'companies'
    }
}, {
    $match: {
        "companies.status": "active"
    }
}, {
    $lookup: {
        from: 'groups',
        localField: '_id',
        foreignField: 'group_type_id',
        as: 'groups'
    }
}, {
    $project: {
        _id: 1,
        group_type_name: "$name",
        status: {$arrayElemAt: ["$companies.status", 0]},
        company_name: {$arrayElemAt: ["$companies.name", 0]},
        subdomain: {$arrayElemAt: ["$companies.subdomain", 0]},
        count_of_countries: {$size: "$groups"}
    }
}]
).toArray()
