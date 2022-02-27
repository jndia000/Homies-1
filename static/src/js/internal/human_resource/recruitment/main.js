"use strict";

/** 
 * ===================================================================================
 * * APP FUNCTIONS
 * ===================================================================================
 */


/** 
 * ===================================================================================
 * TIMELINES
 * ===================================================================================
 */

/** Set Manpower Request Timeline */
const setManpowerRequestTimeline = (selector, data) => {
    let timelineData = [];

    const requestStatus = data.request_status, rejectedAt = data.rejected_at;

    // Created
    const createdAt = data.created_at, createdBy = data.manpower_request_requested_by;
    const createdByFullName = formatName('F M. L, S', {
        firstName  : createdBy.first_name,
        middleName : createdBy.middle_name,
        lastName   : createdBy.last_name,
        suffixName : createdBy.extension_name
    });
    timelineData.push({
        icon: "edit",
        iconTheme: "info",
        dateTime: createdAt,
        timelineTitle: 'Created',
        timelineBody: `
            <div class="small mb-3">
                <div>This request has been created by:</div>
                <div class="ml-3">
                    <div><b>${ createdByFullName }</b></div>
                    <div>${ createdBy.position.name + ', ' + createdBy.position.sub_department.name }</div>
                </div>
            </div>
            ${ TEMPLATE.SUBTEXT(formatDateTime(createdAt, "Full Date")) }
            ${ TEMPLATE.SUBTEXT(formatDateTime(createdAt, "Time")) }
        `
    });

    // Signed
    const signedAt = data.signed_at;
    if(!isEmptyOrNull(signedAt)) {
        const signedBy = data.manpower_request_signed_by;
        const signedByFullName = formatName('F M. L, S', {
            firstName  : signedBy.first_name,
            middleName : signedBy.middle_name,
            lastName   : signedBy.last_name,
            suffixName : signedBy.suffix_name
        })
        timelineData.push({
            icon: "file-signature",
            iconTheme: "primary",
            dateTime: signedAt,
            timelineTitle: 'Signed',
            timelineBody: `
                <div class="small mb-3">
                    <div>This request has been signed by:</div>
                    <div class="ml-3">
                        <div><b>${ signedByFullName }</b></div>
                        <div>${ signedBy.position.name + ', ' + signedBy.position.sub_department.name }</div>
                    </div>
                </div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(signedAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(signedAt, "Time")) }
            `
        });
    } else if(requestStatus === "Rejected for signing") {
        const rejectedBy = data.manpower_request_rejected_by;
        const rejectedByFullName = formatName('F M. L, S', {
            firstName  : rejectedBy.first_name,
            middleName : rejectedBy.middle_name,
            lastName   : rejectedBy.last_name,
            suffixName : rejectedBy.suffix_name
        });
        timelineData.push({
            icon: "times",
            iconTheme: "danger",
            dateTime: rejectedAt,
            timelineTitle: 'Rejected',
            timelineBody: `
                <div class="small mb-3">
                    <div>This request has been rejected for signing by:</div>
                    <div class="ml-3">
                        <div><b>${ rejectedByFullName }</b></div>
                        <div>${ rejectedBy.position.name + ', ' + rejectedBy.position.sub_department.name }</div>
                    </div>
                </div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(rejectedAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(rejectedAt, "Time")) }
            `
        });
    }

    // Reviewed and approved
    const reviewedAt = data.reviewed_at;
    if(!isEmptyOrNull(reviewedAt)) {
        const reviewedBy = data.manpower_request_reviewed_by;
        const reviewedByFullName = formatName('F M. L, S', {
            firstName  : reviewedBy.first_name,
            middleName : reviewedBy.middle_name,
            lastName   : reviewedBy.last_name,
            suffixName : reviewedBy.suffix_name
        });
        timelineData.push({
            icon: "thumbs-up",
            iconTheme: "success",
            dateTime: reviewedAt,
            timelineTitle: 'Approved',
            timelineBody: `
                <div class="small mb-3">
                    <div>This request has been reviewed and approved by:</div>
                    <div class="ml-3">
                        <div><b>${ reviewedByFullName }</b></div>
                        <div>${ reviewedBy.position.name + ', ' + reviewedBy.position.sub_department.name }</div>
                    </div>
                </div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(reviewedAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(reviewedAt, "Time")) }
            `
        });
    } else if(requestStatus === "Rejected for approval") {
        const rejectedBy = data.manpower_request_rejected_by;
        const rejectedByFullName = formatName('F M. L, S', {
            firstName  : rejectedBy.first_name,
            middleName : rejectedBy.middle_name,
            lastName   : rejectedBy.last_name,
            suffixName : rejectedBy.suffix_name
        });

        timelineData.push({
            icon: "times",
            iconTheme: "danger",
            dateTime: rejectedAt,
            timelineTitle: 'Rejected',
            timelineBody: `
                <div class="small mb-3">
                    <div>This request has been rejected for signing by:</div>
                    <div class="ml-3">
                        <div><b>${ rejectedByFullName }</b></div>
                        <div>${ rejectedBy.position.name + ', ' + rejectedBy.position.sub_department.name }</div>
                    </div>
                </div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(rejectedAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(rejectedAt, "Time")) }
            `
        });
    }

    // Completed
    const completedAt = data.completed_at;
    if(!isEmptyOrNull(completedAt)) {
        timelineData.push({
            icon: "check",
            iconTheme: "info",
            dateTime: completedAt,
            timelineTitle: 'Completed',
            timelineBody: `
                <div class="small mb-3">This request had been marked as completed</b></div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(completedAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(completedAt, "Time")) }
            `
        });
    } 

    // Set Manpower Request Timeline
    setTimeline(selector, { title: "Manpower Request Timeline", timelineData: timelineData });
}

/** Set Job Post Timeline */
const setJobPostTimeline = (selector, data) => {
    let timelineData = [];
    
    // Created
    const jobPostedBy = data.job_post_posted_by;
    const jobPostedByFullName = formatName('F M. L, S', {
        firstName  : jobPostedBy.first_name,
        middleName : jobPostedBy.middle_name,
        lastName   : jobPostedBy.last_name,
        suffixName : jobPostedBy.extension_name
    });
    const createdAt = data.created_at;
    timelineData.push({
        icon: "edit",
        iconTheme: "info",
        dateTime: createdAt,
        timelineTitle: 'Created',
        timelineBody: `
            <div class="small mb-3">You, <span class="font-weight-bold">${ jobPostedByFullName }</span>, created this job post</div>
            ${ TEMPLATE.SUBTEXT(formatDateTime(createdAt, "Full Date")) }
            ${ TEMPLATE.SUBTEXT(formatDateTime(createdAt, "Time")) }
        `
    });

    // Last Updated
    const lastUpdated = data.updated_at;
    timelineData.push({
        icon: "edit",
        iconTheme: "info",
        dateTime: lastUpdated,
        timelineTitle: 'Last Updated',
        timelineBody: `
            <div class="small mb-3">You are the last person updated this job post</div>
            ${ TEMPLATE.SUBTEXT(formatDateTime(lastUpdated, "Full Date")) }
            ${ TEMPLATE.SUBTEXT(formatDateTime(lastUpdated, "Time")) }
        `
    });

    // Set Timeline
    setTimeline(selector, {
        title: 'Job Post Timeline',
        timelineData: timelineData
    });
}

/** Set Applicant Timeline */
const setApplicantTimeline = (selector, data) => {
    let timelineData = [];

    // Applied
    const createdAt = data.created_at;
    const applicantFullName = formatName('F M. L, S', {
        firstName  : data.first_name,
        middleName : data.middle_name,
        lastName   : data.last_name,
        suffixName : data.suffix_name,
    });
    timelineData.push({
        icon: "file-export",
        iconTheme: "primary",
        dateTime: createdAt,
        timelineTitle: 'Applied',
        timelineBody: `
            <div class="small mb-3">
                <div>Application was submitted by:</div>
                <div class="ml-3">
                    <div><b>${ applicantFullName }</b></div>
                    <div>Applicant/Candidate</div>
                </div>
            </div>
            ${ TEMPLATE.SUBTEXT(formatDateTime(createdAt, "Full Date")) }
            ${ TEMPLATE.SUBTEXT(formatDateTime(createdAt, "Time")) }
        `
    });

    // Evaluated
    const evaluatedAt = data.evaluated_at, evaluatedBy = data.applicant_evaluated_by;
    if(!isEmptyOrNull(evaluatedAt) && !isEmptyOrNull(evaluatedBy)) {
        const evaluatedByFullName = formatName('F M. L, S', {
            firstName: evaluatedBy.first_name,
            middleName: evaluatedBy.middle_name,
            lastName: evaluatedBy.last_name,
            suffixName: evaluatedBy.extension_name
        });
        timelineData.push({
            icon: "check",
            iconTheme: "success",
            dateTime: evaluatedAt,
            timelineTitle: 'Evaluated',
            timelineBody: `
                <div class="small mb-3">
                    <div>Evaluation was done by:</div>
                    <div class="ml-3">
                        <div><b>${ evaluatedByFullName }</b></div>
                        <div>${ evaluatedBy.position.name }</div>
                        <div>${ evaluatedBy.position.sub_department.name }</div>
                    </div>
                </div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(evaluatedAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(evaluatedAt, "Time")) }
            `
        });
    }

    // Screened
    const screenedAt = data.screened_at, screenedBy = data.applicant_screened_by;
    if(!isEmptyOrNull(screenedAt) && !isEmptyOrNull(screenedBy)) {
        const screenedByFullName = formatName('F M. L, S', {
            firstName  : screenedBy.first_name,
            middleName : screenedBy.middle_name,
            lastName   : screenedBy.last_name,
            suffixName : screenedBy.extension_name
        });
        timelineData.push({
            icon: "check",
            iconTheme: "warning",
            dateTime: screenedAt,
            timelineTitle: 'Screened',
            timelineBody: `
                <div class="small mb-3">
                    <div>Screening was done by:</div>
                    <div class="ml-3">
                        <div><b>${ screenedByFullName }</b></div>
                        <div>${ screenedBy.position.name }</div>
                        <div>${ screenedBy.position.sub_department.name }</div>
                    </div>
                </div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(screenedAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(screenedAt, "Time")) }
            `
        });
    }

    // Hired
    const hiredAt = data.hired_at, hiredBy = data.applicant_hired_by;
    if(!isEmptyOrNull(hiredAt) && !isEmptyOrNull(hiredBy)) {
        const hiredByFullName = formatName('F M. L, S', {
            firstName  : hiredBy.first_name,
            middleName : hiredBy.middle_name,
            lastName   : hiredBy.last_name,
            suffixName : hiredBy.extension_name
        });
        timelineData.push({
            icon: "handshake",
            iconTheme: "success",
            dateTime: hiredAt,
            timelineTitle: 'Hired',
            timelineBody: `
                <div class="small mb-3">
                    <div>Hiring was done by:</div>
                    <div class="ml-3">
                        <div><b>${ hiredByFullName }</b></div>
                        <div>${ hiredBy.position.name }</div>
                        <div>${ hiredBy.position.sub_department.name }</div>
                    </div>
                </div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(hiredAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(hiredAt, "Time")) }
            `
        });
    }

    // Rejected
    const status = data.status;
    if(
        status === "Rejected from evaluation" || 
        status === "Rejected from screening"  || 
        status === "Rejected from interview" 
    ) {
        const rejectedAt = data.rejected_at, rejectedBy = data.applicant_rejected_by;
        if(!isEmptyOrNull(rejectedAt) && !isEmptyOrNull(rejectedBy)) {
            const rejectedByFullName = formatName('F M. L, S', {
                firstName  : rejectedBy.first_name,
                middleName : rejectedBy.middle_name,
                lastName   : rejectedBy.last_name,
                suffixName : rejectedBy.extension_name
            });
            timelineData.push({
                icon: "times",
                iconTheme: "danger",
                dateTime: rejectedAt,
                timelineTitle: status,
                timelineBody: `
                    <div class="small mb-3">
                        <div>Hiring was done by:</div>
                        <div class="ml-3">
                            <div><b>${ rejectedByFullName }</b></div>
                            <div>${ rejectedBy.position.name }</div>
                            <div>${ rejectedBy.position.sub_department.name }</div>
                        </div>
                    </div>
                    <div class="small mb-3">
                        <div>Remarks:</div>
                        <div class="ml-3">
                            <div class="font-weight-bold text-danger">${data.remarks}</div>
                        </div>
                    </div>
                    ${ TEMPLATE.SUBTEXT(formatDateTime(rejectedAt, "Full Date")) }
                    ${ TEMPLATE.SUBTEXT(formatDateTime(rejectedAt, "Time")) }
                `
            });
        }
    }

    // Set Applicant Timeline
    setTimeline(selector, { title: "Applicant Timeline", timelineData: timelineData });
}

/** Set Onboarding Employee Task Timeline */
const setOnboardingEmployeeTaskTimeline = (selector, data) => {
    let timelineData = [];

    // Assigned
    const assignedAt = data.created_at, assignedBy = data.onboarding_employee_task_assigned_by;
    const assignedByFullName = formatName('F M. L, S', {
        firstName  : assignedBy.first_name,
        middleName : assignedBy.middle_name,
        lastName   : assignedBy.last_name,
        suffixName : assignedBy.extension_name
    });
    timelineData.push({
        icon: "clipboard",
        iconTheme: "primary",
        dateTime: assignedAt,
        timelineTitle: 'Assigned',
        timelineBody: `
            <div class="small mb-3">Task was created and assigned by <b>${ assignedByFullName }</b></div>
            ${ TEMPLATE.SUBTEXT(formatDateTime(assignedAt, "Full Date")) }
            ${ TEMPLATE.SUBTEXT(formatDateTime(assignedAt, "Time")) }
        `
    });

    // Completed
    const completedAt = data.completed_at, completedBy = data.onboarding_employee_task_completed_by;
    if(!isEmptyOrNull(completedAt) && !isEmptyOrNull(completedBy)) {
        const completedByFullName = formatName('F M. L, S', {
            firstName  : completedBy.first_name,
            middleName : completedBy.middle_name,
            lastName   : completedBy.last_name,
            suffixName : completedBy.extension_name
        });
        timelineData.push({
            icon: "check",
            iconTheme: "success",
            dateTime: completedAt,
            timelineTitle: 'Completed',
            timelineBody: `
                <div class="small mb-3">Task was completed marked by <b>${ completedByFullName }</b></div>
                ${ TEMPLATE.SUBTEXT(formatDateTime(completedAt, "Full Date")) }
                ${ TEMPLATE.SUBTEXT(formatDateTime(completedAt, "Time")) }
            `
        });
    }

    // Set Onboarding Employee Task Timeline
    setTimeline(selector, {
        title: 'Onboarding Task Timeline',
        timelineData: timelineData
    });
}


/** 
 * ===================================================================================
 * MANPOWER REQUEST
 * ===================================================================================
 */

/** Set Manpower Request Document */
const setManpowerRequestDocument = (data) => {
    const requestedBy = data.manpower_request_requested_by, requestStatus = data.request_status;

    // Set Requisition No
    setContent('#requisitionNo', data.requisition_no);
    
    // Set Requestor Name
    setContent('#requestorName', formatName("L, F M., S", {
        firstName  : requestedBy.first_name,
        middleName : requestedBy.middle_name,
        lastName   : requestedBy.last_name,
        suffixName : requestedBy.extension_name
    }));
    
    // Set Requestor Department
    setContent('#requestorDepartment', requestedBy.position.name + ', ' + requestedBy.position.sub_department.name);
    
    // Set Date Requested
    setContent('#dateRequested', `
        <div>${ formatDateTime(data.created_at, "Date") }</div>
        <div>${ formatDateTime(data.created_at, "Time") }</div>
    `);
    
    // Set Deadline
    setContent('#deadline', () => {
        const deadline = data.deadline;
        return isEmptyOrNull(deadline)
            ? TEMPLATE.UNSET('No deadline has been set')
            : `
                <div>${ formatDateTime(deadline, "Date") }</div>
                <div>${ formatDateTime(deadline, "Time") }</div>
            `
    });

    // Set Requested Position
    setContent('#requestedPosition', data.vacant_position.name);
    
    // Set No. of Staffs Needed
    setContent('#noOfStaffsNeeded', () => {
        const staffsNeeded = data.staffs_needed;
        return `${ staffsNeeded } new ${ pluralize('staff', staffsNeeded) }`
    });

    // Set Employment Type
    setContent('#employmentType', data.employment_type.name);
    
    // Set Request Nature
    setContent('#requestNature', data.request_nature);

    // Set Suggested Salary
    setContent('#suggestedSalary', () => {
        const minSalary = data.min_monthly_salary, maxSalary = data.max_monthly_salary;
        return isEmptyOrNull(minSalary) && isEmptyOrNull(maxSalary) 
            ? TEMPLATE.UNSET('No salary has been set')
            : `${ formatCurrency(minSalary) } - ${ formatCurrency(maxSalary) }/month`;
    });

    // Set Request Description
    setContent('#requestDescription', data.content);

    // Set Signed By
    setContent('#signedBy', () => {
        const signedBy = data.manpower_request_signed_by;
        
        if(data.request_status === "Rejected for signing")
            return `<div class="text-danger">This request has been rejected for signing</div>`
        else if(isEmptyOrNull(signedBy))
            return TEMPLATE.UNSET('Not yet signed')
        else {
            const signedByFullName = formatName("L, F M., S", {
                firstName  : signedBy.first_name,
                middleName : signedBy.middle_name,
                lastName   : signedBy.last_name,
                suffixName : signedBy.suffix_name
            });
            return `
                <div>${ signedByFullName }</div>
                ${ TEMPLATE.SUBTEXT(signedBy.position.name + ', ' + signedBy.position.sub_department.name )}
            `
        }
    });

    // Set Signed At
    setContent('#signedAt', () => {
        const signedAt = data.signed_at;
        return isEmptyOrNull(signedAt) 
            ? TEMPLATE.UNSET('No status')
            : TEMPLATE.NOWRAP([
                formatDateTime(signedAt, "Date"),
                formatDateTime(signedAt, "Time")
            ])
    });

    // Set Approved By
    setContent('#approvedBy', () => {
        const approvedBy = data.manpower_request_reviewed_by;
        return isEmptyOrNull(approvedBy) && !(
                data.request_status === "Rejected for approval" ||
                data.request_status === "Rejected for signing"
            )
            ? TEMPLATE.UNSET('Not yet approved')
            : () => {
                if(data.request_status === "Rejected for signing")
                    return `<div class="text-danger">This request has been rejected</div>`
                else if(data.request_status === "Rejected for approval")
                    return `<div class="text-danger">This request has been rejected for approval</div>`
                else {
                    const approvedByFullName = formatName("L, F M., S", {
                        firstName  : approvedBy.first_name,
                        middleName : approvedBy.middle_name,
                        lastName   : approvedBy.last_name,
                        suffixName : approvedBy.suffix_name
                    });
                    return `
                        <div>${ approvedByFullName }</div>
                        ${ TEMPLATE.SUBTEXT(approvedBy.position.name + ', ' + approvedBy.position.sub_department.name) }
                    `
                }
            }
    });

    // Set Approved At
    setContent('#approvedAt', () => {
        const approvedAt = data.reviewed_at;
        return isEmptyOrNull(approvedAt) 
            ? TEMPLATE.UNSET('No status') 
            : TEMPLATE.NOWRAP([
                formatDateTime(approvedAt, "Date"),
                formatDateTime(approvedAt, "Time")
            ])
    });

    // Set Completed At
    const completedAt = data.completed_at;
    setContent('#completedAt', () => {
        return isEmptyOrNull(completedAt) 
            ? TEMPLATE.UNSET('No status') 
            : TEMPLATE.NOWRAP([
                formatDateTime(completedAt, "Date"),
                formatDateTime(completedAt, "Time")
            ])
    });
    
    /** MANPOWER REQUEST STATUS */
    if(requestStatus == "Completed") {
        const requestorFullName = formatName("F M. L, S", {
            firstName  : requestedBy.first_name,
            middleName : requestedBy.middle_name,
            lastName   : requestedBy.last_name,
            suffixName : requestedBy.suffix_name
        });
        setContent('#manpowerRequestStatus', `
            <div class="alert border-success">
                <h5 class="text-success mb-0">This request has been completed</h5>
                ${ TEMPLATE.SUBTEXT(`Marked by: ${ requestorFullName }, ${ requestedBy.position.name }`)}
                ${ TEMPLATE.SUBTEXT(`${ formatDateTime(completedAt, 'Full DateTime') } (${ fromNow(completedAt) })`)}
            </div>
        `)
    } else if(requestStatus == 'Rejected for signing' || requestStatus == 'Rejected for approval') {
        const rejectedBy = data.manpower_request_rejected_by;
        const rejectedByFullName = formatName("F M. L, S", {
            firstName  : rejectedBy.first_name,
            middleName : rejectedBy.middle_name,
            lastName   : rejectedBy.last_name,
            suffixName : rejectedBy.suffix_name
        });
        const rejectedAt = data.rejected_at;
        setContent('#manpowerRequestStatus', `
            <div class="alert border-danger">
                <h5 class="text-danger mb-0">This request has been ${ data.request_status.toLowerCase() }</h5>
                <div class="small text-secondary">Marked by: ${ rejectedByFullName }, ${ requestedBy.position.name }</div>
                <div class="small text-secondary">${ formatDateTime(rejectedAt, 'Full DateTime') } (${ fromNow(rejectedAt) })</div>
                <div class="mt-3">
                    <div class="font-weight-bold">Details</div>
                    <div class="ml-3 text-justify">${ data.remarks }</div>
                </div>
            </div>
        `)
    } else $('#manpowerRequestStatus').remove();

    // Remove Loaders
    $('#manpowerRequestDocumentLoader').remove();
    showElement('#manpowerRequestDocumentContainer');
}


/** 
 * ===================================================================================
 * JOB POST
 * ===================================================================================
 */

/** SET JOB POST DETAILS */
const setJobPostDetails = (data) => {

    // Set Job Post Status
    const expiresAt = data.expiration_date;
    if(isEmptyOrNull(expiresAt) || isAfterToday(expiresAt))
        setContent('#jobPostStatus', TEMPLATE.BADGE('info', 'On Going'))
    else if(isBeforeToday(expiresAt))
        setContent('#jobPostStatus', TEMPLATE.BADGE('danger', 'Ended'))
    else
        setContent('#jobPostStatus', TEMPLATE.BADGE('warning', 'Last Day Today'))

    // Set Posted At, Vacant Position, Employment Type, Job Category
    const manpowerRequest = data.manpower_request;
    setContent({
        '#postedAt': `Posted ${ formatDateTime(data.created_at, 'Date') }`,
        '#postedAtHumanized': fromNow(data.created_at),
        '#jobPostViews': formatNumber(data.views) + pluralize(' view', data.views),
        '#vacantPosition': manpowerRequest.vacant_position.name,
        '#employmentTypeForJobPost': manpowerRequest.employment_type,
        '#jobCategory': data.job_category.is_removed 
            ? `
                <i class="fas fa-exclamation-triangle text-warning mr-1"></i>
                <span class="font-italic text-secondary">Category is not set or removed</span>
            ` 
            : data.job_category.name,
    });

    // Set Salary Range
    const minSalary = manpowerRequest.min_monthly_salary, maxSalary = manpowerRequest.max_monthly_salary;
    if((isEmptyOrNull(minSalary) && isEmptyOrNull(maxSalary)) || !data.is_salary_visible) {
        hideElement('#salaryRangeDisplay');
        setContent('#salaryRange', '');
    } else {
        showElement('#salaryRangeDisplay');
        setContent('#salaryRange', `${ formatCurrency(minSalary) } - ${ formatCurrency(maxSalary) }`);
    }

    // Set Open Until
    const openUntil = data.expiration_date;
    if(isEmptyOrNull(openUntil)) {
        hideElement('#openUntilDisplay');
        setContent('#openUntil', '');
    } else {
        showElement('#openUntilDisplay');
        setContent('#openUntil', formatDateTime(openUntil, "Full Date"))
    }

    // Set Job Description
    setContent('#jobDescription', data.content);

    /** Job Post Options */
    setContent('#jobPostOptions', `
        <a class="btn btn-sm btn-secondary btn-block" target="_blank" href="${ BASE_URL_WEB }careers/${ jobPostID }">
            ${ TEMPLATE.ICON_LABEL('eye', 'View post in public portal') }
        </a>
        <a class="btn btn-sm btn-secondary btn-block" href="${ ROUTE.WEB.H }job-posts/${ jobPostID }/applicants">
            ${ TEMPLATE.ICON_LABEL('users', 'View applicants') }
        </a>
    `);
}


/** 
 * ===================================================================================
 * ONBOARDING EMPLOYEE STATUS
 * ===================================================================================
 */


/** Get Onboarding Employee Task Status */
const getOnboardingEmployeeTaskStatus = (status, startAt, deadline, completedAt) => {
    switch(status) {
        case "Pending":
            if(isAfterToday(startAt) && isAfterToday(deadline))
                return TEMPLATE.BADGE('secondary', TEMPLATE.ICON_LABEL('stopwatch', 'Soon'))
            else if(isBeforeToday(startAt) && isAfterToday(deadline))
                return TEMPLATE.BADGE('warning', TEMPLATE.ICON_LABEL('exclamation-circle', 'Pending (Must working)'))
            else 
                return TEMPLATE.BADGE('danger', TEMPLATE.ICON_LABEL('exclamation-triangle', 'Pending (Not worked)'))
        case "On Going":
            return isAfterToday(deadline)
                ? TEMPLATE.BADGE('danger', TEMPLATE.ICON_LABEL('sync-alt', 'On Going'))
                : TEMPLATE.BADGE('warning', TEMPLATE.ICON_LABEL('sync-alt', 'On Going (Must be done)'))
        case "Completed":
            return moment(completedAt).isBefore(moment(deadline))
                ? TEMPLATE.BADGE('success', TEMPLATE.ICON_LABEL('check', 'Completed (On Time)'))
                : TEMPLATE.BADGE('success', TEMPLATE.ICON_LABEL('check', 'Completed (Late)'))
        default:
            return TEMPLATE.BADGE('light', 'Invalid data')
    }
}



/** 
 * ===================================================================================
 * APPLICANT SCORESHEET
 * ===================================================================================
 */

/** Applicant Scoresheet */
const setIntervieweeScoreSheet = (selector, scores) => {
    
    // Set ScoreSheet
    setContent(selector, '');
    let sum = 0;

    const interviewQuestionTypeBadge = {
        "General": `<span class="badge border border-primary text-primary">General</span>`,
        "Added": `<span class="badge border border-secondary text-secondary">Added</span>`
    };

    scores.forEach((s, i) => {
        const score = s.score;
        sum+=score;

        $(selector).append(`
            <tr>
                <td class="text-right">${ i+1 }</td>
                <td width="100%">
                    <div>${ s.interview_question.question }</div>
                    <div>${ interviewQuestionTypeBadge[s.interview_question.type] }</div>
                </td>
                <td class="text-right">${ formatNumber(score) }%</td>
            </tr>
        `);
    });

    $(selector).append(`
        <tr>
            <td colspan="2" class="text-right font-weight-bold">Average</td>
            <td class="text-right font-weight-bold">${ formatNumber(sum/scores.length) }%</td>
        </tr>
    `);

}