select 
    sum(`ARR` * `percent_slack_posts`)/date_diff(date(CURRENT_DATE()),date({{Date}}),DAY)*365
from (
select
(count(CASE when `cdc_prod.RR_posts`.`source` = "slack" then 1 else null end) / count(`cdc_prod.RR_posts`.`_id`)) as `percent_slack_posts`,
`cdc_prod.sf_account`.`arr__c` as `ARR`
from
`cdc_prod.RR_posts`
join `cdc_prod.RR_companies` on `cdc_prod.RR_posts`.`company_id` = `cdc_prod.RR_companies`.`_id`
join `cdc_prod.sf_account` on  `cdc_prod.sf_account`.`YEI_Domain__c` = `cdc_prod.RR_companies`.`subdomain`
where `cdc_prod.RR_posts`.`created_at` > {{Date}}
GROUP by 2
having count(CASE when `cdc_prod.RR_posts`.`source` = "slack" then 1 else null end) > 0)
