SELECT 
    date(timestamp_millis(cast(`member`.`createddate`as Int64))) as `OnboardDate`,
    if (json_extract_scalar(`onboardUserInfo`.`UserContext`,"$.CurrentGroupName") = {{CompanyName}},
        json_extract_scalar(`onboardUserInfo`.`UserPersonal`,"$.FullName"),
        "Kazoo") as `OnboardedBy`,
    `member`.`FirstName` as `FirstName`,
    `member`.`LastName` as `LastName`,
    `member`.`FullName` as `FullName`,
    `employeeUserInfo`.`Username` as `Username`,
    json_extract_scalar(`employeeUserInfo`.`UserPersonal`,"$.PrimaryEmail") as `Email`,
    "" as `Password`,
    date(timestamp_millis(cast(`member`.`StartingDate`as Int64)),"UTC")+1 as `StartDate`,
    date(timestamp_millis(cast(`member`.`BirthDate`as Int64)), "UTC") as `BirthDate`,
    `member`.`EmployeeId` as `EmployeeId`,
    `member`.`GroupDepartmentName` as `Department`,
    json_extract_scalar(`member`.`RolesInGroup`,"$[0]") as `Role`,
    `member`.`Position` as `Position`,
    json_extract_scalar(`employeeUserInfo`.`Preference`,"$.HomeZip") as `HomeZip`,
    json_extract_scalar(`employeeUserInfo`.`Preference`,"$.WorkZip") as `WorkZip`,
    json_extract_scalar(`member`.`MyManagers`,"$[0].FullName") as `Manager`,
    `managerUserInfo`.`Username` as `ManagerUserName`,
    "" as `NewUserName`,
    json_extract_scalar(`employeeUserInfo`.`Preference`,"$.SuppressBirthday") as `SuppressBirthday`,
    json_extract_scalar(`employeeUserInfo`.`Preference`,"$.SuppressAnniversary") as `SuppressAnniversary`,
    json_extract_scalar(`member`.`Location`,"$.Name") as `Location`,
    date(timestamp_millis(cast(safe_cast(json_extract(`employeeUserInfo`.`FirstLogin`,"$[0].LoginTime") as numeric) as Int64)),"America/Chicago")+1 as `FirstLogin`,
    date(timestamp_millis(cast(`member`.`ModifiedDate`as Int64)),"America/Chicago") as `LastModifiedDate`,
    `member`.`MembershipStatus` as `MembershipStatus`,
    ifnull(json_extract_scalar(`modifierUserInfo`.`UserPersonal`,"$.FullName"),"Kazoo") as `LastModifiedBy`,
    concat("https://app.highground.com/public/#/Recognize/User/",`member`.`hgId`) as `Signature`,
    `employeeUserInfo`.`hgId` as `UserId`,
    "" as `Avatar`,
FROM `cdc_prod.pm_prod_member` `member`
LEFT JOIN `cdc_prod.pm_prod_userinfo` `employeeUserInfo` ON `member`.`userid` = `employeeUserInfo`.`hgid`
LEFT JOIN `cdc_prod.pm_prod_userinfo` `managerUserInfo` ON json_extract_scalar(`member`.`MyManagers`,"$[0].UserId") = `managerUserInfo`.`hgid`
LEFT JOIN `cdc_prod.pm_prod_userinfo` `modifierUserInfo` ON `member`.`ModifiedBy` = `modifierUserInfo`.`hgid`
LEFT JOIN `cdc_prod.pm_prod_userinfo` `onboardUserInfo` ON `member`.`createdby` = `onboardUserInfo`.`hgid`
LEFT JOIN `cdc_prod.pm_prod_group` `companies` on `member`.`GroupId` = `companies`.`hgId`
where `companies`.`GroupName` = {{CompanyName}}
