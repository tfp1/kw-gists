select
`cdc_prod.RR_companies`.`subdomain`,
count(CASE when `cdc_prod.RR_posts`.`source` = "slack" then 1 else null end) as `slack_posts`,
count(CASE when `cdc_prod.RR_posts`.`source` != "slack" then 1 else null end) as `all_other_posts`,
(count(CASE when `cdc_prod.RR_posts`.`source` = "slack" then 1 else null end) / count(`cdc_prod.RR_posts`.`_id`)) as `percent_slack_posts`,
`cdc_prod.sf_account`.`arr__c` as `ARR`
from
`cdc_prod.RR_posts`
join `cdc_prod.RR_companies` on `cdc_prod.RR_posts`.`company_id` = `cdc_prod.RR_companies`.`_id`
join `cdc_prod.sf_account` on  `cdc_prod.sf_account`.`YEI_Domain__c` = `cdc_prod.RR_companies`.`subdomain`
where
`cdc_prod.RR_posts`.`created_at` > {{Date}}
group by 1,5
having `slack_posts` > 0
order by 4 desc, 5 desc, 2 desc
