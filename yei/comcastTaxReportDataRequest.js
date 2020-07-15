db.item_orders.aggregate(
[{$match: {
company_id:ObjectId("59d5437feab5671294506781"), 
created_at: { 
  $gte: ISODate("2020-06-10T00:00:00.000Z"),
  $lt:  ISODate("2020-06-16T23:59:59.999Z")
},
status: {$in: [
  "delivered", 
  "paid",
]},
categories:"gift cards"
}}, {$lookup: {
  from: 'users',
  localField: 'user_id',
  foreignField: '_id',
  as: 'users'
}}, {$project: {
  _id:0,
  order_id:"$_id",
  employee_id: { $ifNull: [{$arrayElemAt :["$users.reference",0]},"null"]},
  order_date:{ $ifNull: [{'$dateToString': {'format': '%G-%m-%d', 'date': '$created_at'}},"null"]},
  order_time:{ $ifNull: [{'$dateToString': {'format': '%H:%M:%S', 'date': '$created_at'}},"null"]},
  last_name:{ $ifNull: [{$arrayElemAt :["$users.last_name",0]},"null"]},
  first_name:{ $ifNull: [{$arrayElemAt :["$users.first_name",0]},"null"]},
  login_email:{ $ifNull: [{$arrayElemAt :["$users.login_email",0]},"null"]},
  user_status:"active", 
  points_redeemed:{ $ifNull: ["$properties.points","null"]},
  tax_free_points:{ $ifNull: ["$properties.tax_free_points","null"]},
  taxable_points:{ $ifNull: [{$subtract:["$properties.points","$properties.tax_free_points"]},"null"]},
  cost_to_company:{ $ifNull: ["$properties.cost","null"]},
  transaction_fee:"zero",  
  point_pool:"Individual", 
  item_name:{ $ifNull: ["$properties.item_name","null"]},
  order_status:{ $ifNull: ["$status","null"]},
  category:{ $ifNull: [{$arrayElemAt :["$categories",0]}, "gift cards"]},
  earnings_code:"null", 
  deduction_code:"null", 
  updated_date:{ $ifNull: [{'$dateToString': {'format': '%G-%m-%d', 'date': '$updated_at'}},"null"]},
  updated_time:{ $ifNull: [{'$dateToString': {'format': '%H:%M:%S', 'date': '$updated_at'}},"null"]},
  source:"Store", 
  shipping_address:"null", 
  anniversary:"anniversaryGroup", 
  work_location:"workLocationGroup",
  department:"departmentGroup",
  business_unit:"businessUnitGroup",
  test:"null",
  admin_upload:"adminUploadGroup",
  country:"United States",
  fulfiller:"null" 
}}]
).toArray()
