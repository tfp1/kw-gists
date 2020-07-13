db.getCollection('item_orders').aggregate(
{$match: {
    company_id:ObjectId("59d5437feab5671294506781"), //comcast
    created_at: { //all times on the report are UTC
      $gte: ISODate("2020-06-10T00:00:00.000Z"),
      $lt:  ISODate("2020-06-16T00:00:00.000Z")
      },
    status: {$in: [
      "delivered", //640
      "paid",
      //"pending", //14
      //"ordered", //1
      //"approved", //6
      //"canceled" //2
      ]},
    categories:"gift cards"
}},{
$lookup:{
from: 'users',
localField: 'user_id',
foreignField: '_id',
as: 'users'
}},{
$project:
{
    _id:0,
    order_id:"$_id",
    employee_id: {$arrayElemAt :["$users.reference",0]},
    order_date:{'$dateToString': {'format': '%G-%m-%d', 'date': '$created_at'}},
    order_time:{'$dateToString': {'format': '%H:%M:%S', 'date': '$created_at'}},
    last_name:{$arrayElemAt :["$users.last_name",0]},
    first_name:{$arrayElemAt :["$users.first_name",0]},
    login_email:{$arrayElemAt :["$users.login_email",0]},
    user_status:"active", //Always active
    points_redeemed:"$properties.points",
    tax_free_points:"$properties.tax_free_points",
    taxable_points:{$subtract:["$properties.points","$properties.tax_free_points"]},
    cost_to_company:"$properties.cost",
    transaction_fee:"zero",  //They're all zero, so just setting to 0
    point_pool:"Individual", //skipping because they're all Individual
    item_name:"$properties.item_name",
    order_status:"$status",
    category:{$arrayElemAt :["$categories",0]}, //This only takes the first categories, but in the original data, they're all _only_ gift cards so that's fine
    earnings_code:"null", //They're all null
    deduction_code:"null", //They're all null
    updated_date:{'$dateToString': {'format': '%G-%m-%d', 'date': '$updated_at'}},
    updated_time:{'$dateToString': {'format': '%H:%M:%S', 'date': '$updated_at'}},
    source:"Store", //They're all store
    shipping_address:"null", //They're all null
    anniversary:"anniversaryGroup", //{"$anniversary.name"}
    work_location:"workLocationGroup",
    department:"departmentGroup",
    business_unit:"businessUnitGroup",
    test:"null",//They're all null
    admin_upload:"adminUploadGroup",
    country:"United States",
    fulfiller:"null" //They're all null
}}
)
