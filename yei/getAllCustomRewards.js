db.items.aggregate(
	[{
		$match: {
			is_custom: true,
			pooling: false,
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
			"companies.status": "active"
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
            _id:0,
			name: 1,
			description: 1,
			image: 1,
			points: 1,
			quantity: 1,
			fulfiller_email: "$fulfiller.notification_email",
			subdomain: "$companies.subdomain",
			groups: "$groups.name"
		}
	}]
).toArray()
