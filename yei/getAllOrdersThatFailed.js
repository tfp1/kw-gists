db.grs_orders.aggregate([{
$match: {created_at: {$gte: ISODate("2020-09-15T18:00:00.000Z"),$lt: ISODate("2020-09-18T20:00:00.000Z")}}},
{$lookup: {from: 'companies',localField: 'company_id',foreignField: '_id',as: 'companies'}},
{$lookup: {from: 'grs_line_items',localField: '_id',foreignField: 'grs_order_id',as: 'grs_line_items'}}, 
{$project: {
        _id: 0,
        member_pin: "$grs_order_pin",
        subdomain: {$arrayElemAt: ["$companies.subdomain", 0]},
        partner_order_number: "$order_number",
        total_point_cost: 1,
        created_at: 1,
        count_of_items: {$size: "$grs_line_items"}
    }
}]).toArray()
