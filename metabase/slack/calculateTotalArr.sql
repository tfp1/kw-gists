select sum(`ARR`) from (
select
`cdc_prod.sf_account`.`arr__c` as `ARR`
from
`cdc_prod.RR_posts`
join `cdc_prod.RR_companies` on `cdc_prod.RR_posts`.`company_id` = `cdc_prod.RR_companies`.`_id`
join `cdc_prod.sf_account` on  `cdc_prod.sf_account`.`YEI_Domain__c` = `cdc_prod.RR_companies`.`subdomain`
where `cdc_prod.RR_posts`.`created_at` > {{Date}}
GROUP by `cdc_prod.sf_account`.`Id`,1
having count(CASE when `cdc_prod.RR_posts`.`source` = "slack" then 1 else null end) > 0)
