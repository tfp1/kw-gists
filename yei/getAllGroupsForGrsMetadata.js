db.companies.aggregate(
[
{$match: {status: {$in: ["active", "prelaunch"]}}}, 
{
    $project: {
        subdomain: 1,
        name: 1
    }
}, {
    $lookup: {from: 'group_types',localField: '_id',foreignField: 'company_id',as: 'group_types'}}, 
    {$unwind: {path: "$group_types",}},
{$match: {
        $or: [
          {"group_types.deleted_at": null},
          {"group_types.deleted_at": {$exists: false}}
        ]
    }
}, 
  {$lookup: {from: 'groups',localField: 'group_types._id',foreignField: 'group_type_id',as: 'groups'}}, 
  {$unwind: {path: "$groups",}
}, {
    $match: {
        $or: [
            {"groups.deleted_at": null},
            {"groups.deleted_at": {$exists: false}}
        ]
    }
}, {
    $project: {
        _id: 0,
        company_name: "$name",
        subdomain: 1,
        group_type_id: "$group_types._id",
        group_type_name: "$group_types.name",
        group_type_locked_as: {$ifNull: ["$group_types.locked_as", ""]},
        group_id: "$groups._id",
        group_name: "$groups.name",
    }
}]
).toArray()
