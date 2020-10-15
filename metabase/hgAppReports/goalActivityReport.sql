SELECT
    `goals`.`cycleid` AS `CycleId`,
    `goals`.`cycletitle` AS `CycleName`,
    `ownerMember`.`EmployeeId` as `GoalOwnerEmployeeId`,
    `ownerMember`.`FullName` as `GoalOwnerName`,
    `ownerMember`.`GroupDepartmentName` as `Department`,
    `ownerMember`.`Position` as `Position`,
    json_extract_scalar(`ownerMember`.`RolesInGroup`,"$[0]") as `Role`,
    json_extract_scalar(`ownerMember`.`Location`,"$.Name") as `Location`,
    `ownerMember`.`CustomField1` as `CustomField1`,
    `ownerMember`.`CustomField2` as `CustomField2`,
    `ownerMember`.`CustomField3` as `CustomField3`,
    `ownerMember`.`CustomField4` as `CustomField4`,
    `ownerMember`.`CustomField5` as `CustomField5`,
    `ownerManagerMember`.`EmployeeId` as `ManagerEmployeeId`,
    json_extract_scalar(`ownerMember`.`MyManagers`,"$[0].FullName") as `Manager`,
    `approverMember`.`EmployeeId` as `ApproverEmployeeId`,
    `approverMember`.`FullName` as `Approver`,
    date(timestamp_millis(cast(`ownerMember`.`createddate`as Int64))) as `OnboardDate`,
    `ownerMember`.`MembershipStatus` as `MemberStatus`,
    `goals`.`hgid` AS `GoalId`,
    `goals`.`name` AS `GoalName`,
    `goals`.`description` AS `GoalDescription`,
    if(`goals`.`status` = "Not Started", "","Give") AS `GoalType`, --This is some wonky bullshit. We _think_ this is right.
    (case
        when json_extract_scalar(`goals`.`Participant`,"$.ParticipantType") = "Member"  then "Individual"
        when json_extract_scalar(`goals`.`Participant`,"$.ParticipantType") = "Team"    then "Deparment"
        when json_extract_scalar(`goals`.`Participant`,"$.ParticipantType") = "Company" then "Company"
        else null end) as `GoalSubType`,
    `goals`.`status` AS `Status`,
    `goals`.`progressstatus` AS `GoalProgressStatus`,
    `goals`.`percentcompletion` AS `GoalProgressCompletionPercent`,
    `goals`.`weight` AS `GoalWeight`,
    date(timestamp_millis(cast(`goals`.`createddate`as Int64))) AS `GoalCreateDate`,
    (case
        when json_extract_scalar(`goals`.`KeyResults`,"$[0].DueDate") is null then null
        when date(timestamp_millis(cast(safe_cast(json_extract_scalar(`goals`.`KeyResults`,"$[0].DueDate") as numeric) as Int64))) = date(timestamp_millis(cast(safe_cast(`cycle`.`ClosePromptDate` as numeric) as Int64))) then null
        else date(timestamp_millis(cast(safe_cast(json_extract_scalar(`goals`.`KeyResults`,"$[0].DueDate") as numeric) as Int64))) end
        )    as `GoalDueDate`, -- John, need to update this to take the max keyresults due date. I'm just getting the first one. Also, this is really hacky and can't be how they're doing it in hgApp
    date(timestamp_millis(cast(`goals`.`modifieddate`as Int64))) AS `LastUpdate`,
    json_extract_scalar(`cycle`.`DeliveryMethods`,"$[0].CheckInFrequency") as `UpdateCadence`, --This just takes the first DeliveryMethods object, but we need to know which one to take based on the goal sub-type
    json_extract_scalar(`goals`.`alignedgoal`,"$.Name") as `AlignedTo`,
    json_extract_scalar(`goals`.`alignedgoal`,"$.ParticipantType") as `AlignedType`,
    string_agg( `GoalCollaborators`.`fullname`,', ') as `GoalCollaborators`,
    if(`goals`.`IsPublic` = true, "Public", "Private") as `Visibility`,
    "" as `GoalCopyActivity`,
    "" as `GoalActivitywithActivity`,
    json_extract_scalar(`goals`.`KeyResults`,"$[0].Name") as `MeasurableResult1`,
    json_extract_scalar(`goals`.`KeyResults`,"$[0].Progress") as `ProgressResult1`,
    json_extract_scalar(`goals`.`KeyResults`,"$[1].Name") as `MeasurableResult2`,
    json_extract_scalar(`goals`.`KeyResults`,"$[1].Progress") as `ProgressResult2`,
    json_extract_scalar(`goals`.`KeyResults`,"$[2].Name") as `MeasurableResult3`,
    json_extract_scalar(`goals`.`KeyResults`,"$[2].Progress") as `ProgressResult4`,
    json_extract_scalar(`goals`.`KeyResults`,"$[3].Name") as `MeasurableResult4`,
    json_extract_scalar(`goals`.`KeyResults`,"$[3].Progress") as `ProgressResult4`,
    json_extract_scalar(`goals`.`KeyResults`,"$[4].Name") as `MeasurableResult5`,
    json_extract_scalar(`goals`.`KeyResults`,"$[4].Progress") as `ProgressResult5`,
    json_extract_scalar(`goals`.`KeyResults`,"$[5].Name") as `MeasurableResult6`,
    json_extract_scalar(`goals`.`KeyResults`,"$[5].Progress") as `ProgressResult6`,
    json_extract_scalar(`goals`.`KeyResults`,"$[6].Name") as `MeasurableResult7`,
    json_extract_scalar(`goals`.`KeyResults`,"$[6].Progress") as `ProgressResult7`,
    json_extract_scalar(`goals`.`KeyResults`,"$[7].Name") as `MeasurableResult8`,
    json_extract_scalar(`goals`.`KeyResults`,"$[7].Progress") as `ProgressResult8`,
    json_extract_scalar(`goals`.`KeyResults`,"$[8].Name") as `MeasurableResult9`,
    json_extract_scalar(`goals`.`KeyResults`,"$[8].Progress") as `ProgressResult9`,
    json_extract_scalar(`goals`.`KeyResults`,"$[9].Name") as `MeasurableResult10`,
    json_extract_scalar(`goals`.`KeyResults`,"$[9].Progress") as `ProgressResult10`,
    json_extract_scalar(`goals`.`KeyResults`,"$[10].Name") as `MeasurableResult11`,
    json_extract_scalar(`goals`.`KeyResults`,"$[10].Progress") as `ProgressResult11`,
    json_extract_scalar(`goals`.`KeyResults`,"$[11].Name") as `MeasurableResult12`,
    json_extract_scalar(`goals`.`KeyResults`,"$[11].Progress") as `ProgressResult12`
FROM `cdc_prod.pm_prod_goal` `goals`
LEFT JOIN `cdc_prod.pm_prod_member` `ownerMember` ON json_extract_scalar(`goals`.`owner`,"$.MemberId") = `ownerMember`.`hgid` 
LEFT JOIN `cdc_prod.pm_prod_member` `ownerManagerMember` ON json_extract_scalar(`ownerMember`.`MyManagers`,"$[0].MemberId") = `ownerManagerMember`.`hgid` 
LEFT JOIN `cdc_prod.pm_prod_member` `approverMember` ON json_extract_scalar(`goals`.`Approver`,"$.MemberId") = `approverMember`.`hgid`
LEFT JOIN `cdc_prod.pm_prod_group` `companies` on `ownerMember`.`GroupId` = `companies`.`hgId`
LEFT JOIN `cdc_prod.pm_prod_goalcycle` `cycle` on `goals`.`cycleid` = `cycle`.`hgId`
LEFT JOIN `cdc_prod.pm_prod_goalcollaborator` `GoalCollaborators` on `goals`.`hgid` = `GoalCollaborators`.`GoalId` and `GoalCollaborators`.`actiontype` not in ("Following") 
WHERE 
    `companies`.`GroupName` = {{CompanyName}}
    and date(timestamp_millis(cast(`goals`.`modifieddate`as Int64))) > date({{StartDate}})
    and date(timestamp_millis(cast(`goals`.`modifieddate`as Int64))) < date({{EndDate}})
group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,36,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62

-- TODO
-- UpdateCadence is not quite right. Probably needs to get the correct update cadence for the goal's sub-type, but we assume most have the same update frequency regardless of sub-type so we just return the first cadence available.
-- Goal Due Date is not quite right. It's overzealous on returning Due Dates, but at least we get some data in there.
-- `GoalCopyActivity` &  `GoalActivitywithActivity` are both null right now. We think the data comes from `Goal.History` then UNIONed with `EntityActivity` but the JOIN is non-obvious.
