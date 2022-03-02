"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
 */
const jobPostID = getPathnamePart(1);


/**
 * ==============================================================================
 * JOB POST ANALYTICS
 * ==============================================================================
 */

/** Job Post Analytics */
ifSelectorExist('#jobPostsAnalytics', () => {
    GET_ajax(`${ ROUTE.API.H }job-posts/analytics`, {
        success: result => {
            if(result) {
                setContent({
                    '#totalJobPostsCount': result.total,
                    '#ongoingJobPostsCount': result.on_going,
                    '#endedJobPostsCount': result.ended
                });
            } else toastr.error('There was an error in getting job posts analytics')
        },
        error: () => toastr.error('There was an error in getting job posts analytics')
    })
});


/**
 * ==============================================================================
 * VIEW ALL JOB POSTS
 * ==============================================================================
 */

/** Initialize Job Posts DataTable */
initDataTable('#jobPostsDT', {
    url: `${ ROUTE.API.H }job-posts`,
    enableButtons: true,
    columns: [

        // Created At (For Default Sorting)
        { data: 'created_at', visible: false },

        // View Manpower Request
        { data: 'manpower_request.requisition_no', class: 'text-nowrap' },

        // Vacant Position
        { 
            data: null,
            render: data => {
                return `
                    <div>${ data.manpower_request.vacant_position.name }</div>
                `
            }
        },

        // Applicants
        {
            data: null,
            render: data => {
                const applicants = data.applicants;
                let applicantsCounter = 0;
                applicants.forEach(a => {
                    if(!(a.status == "For evaluation" || a.status == "Rejected from evaluation")) applicantsCounter++;
                });
                return applicantsCounter === 0 
                    ? TEMPLATE.UNSET('No applicants yet')
                    : applicantsCounter + pluralize(' applicant', applicantsCounter)
            }
        },

        // Application Status
        {
            data: null,
            render: data => {
                const expirationDate = data.expiration_date;
                if(isAfterToday(expirationDate) || isEmptyOrNull(expirationDate))
                    return TEMPLATE.DT.BADGE('info', 'On Going');
                else if(isBeforeToday(expirationDate))
                    return TEMPLATE.DT.BADGE('danger', 'Ended');
                else
                    return TEMPLATE.DT.BADGE('warning', 'Last day today');
            }
        },

        // Open until
        {
            data: null,
            class: 'text-nowrap',
            render: data => {
                const expirationDate = data.expiration_date;
                return isEmptyOrNull(expirationDate)
                    ? TEMPLATE.UNSET('No expiration')
                    : `
                        <div>${ formatDateTime(expirationDate, "MMM. D, YYYY") }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(expirationDate)) }
                    `
            }
        },

        // Actions
        {
            data: null,
            render: data => {
                const jobPostID = data.job_post_id;
                const manpowerRequestID = data.manpower_request.manpower_request_id;
                const applicants = data.applicants.length > 0
                    ? `
                        <a 
                            class="dropdown-item d-flex"
                            href="${ ROUTE.WEB.H }job-posts/${ data.job_post_id }/applicants"
                        >
                            <div style="width: 2rem"><i class="fas fa-users mr-1"></i></div>
                            <div>
                                <div>View Applicants</div>
                                <div class="small">Manage applicants for this job</div>
                            </div>
                        </a>
                    `
                    : '';

                return TEMPLATE.DT.OPTIONS(`
                    <a 
                        class="dropdown-item d-flex"
                        href="${ ROUTE.WEB.H }job-posts/${ jobPostID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>
                            <div>View Job Post</div>
                            <div class="small">See the details of this job</div>
                        </div>
                    </a>
                    ${ applicants }
                    <div class="dropdown-divider"></div>
                    <a 
                        class="dropdown-item d-flex"
                        href="${ ROUTE.WEB.H }manpower-requests/${ manpowerRequestID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-file-alt mr-1"></i></div>
                        <div>
                            <div>View Manpower Request</div>
                            <div class="small">See the requisition details</div>
                        </div>
                    </a>
                `)
            }
        }
    ]
});


/**
 * ==============================================================================
 * VIEW JOB POST DETAILS
 * ==============================================================================
 */

/** View Job Post Details */
ifSelectorExist('#jobPostDetails', () => {
    GET_ajax(`${ ROUTE.API.H }job-posts/${ jobPostID }`, {
        success: result => {
            const manpowerRequest = result.manpower_request;

            /** JOB POST DETAILS */
            setJobPostDetails(result);

            /** MANPOWER REQUEST SUMMARY */

            // Set Vacant Position
            setContent('#vacantPositionForSummary', manpowerRequest.vacant_position.name);

            // Set Staffs Needed
            setContent('#staffsNeededForSummary', () => {
                const staffsNeeded = manpowerRequest.staffs_needed;
                return `${ staffsNeeded } new ${ pluralize('staff', staffsNeeded) }`;
            });

            // Set Employment Type
            setContent('#employmentTypeForSummary', manpowerRequest.employment_type);

            // Set Salary Range
            const minSalary = manpowerRequest.min_monthly_salary, maxSalary = manpowerRequest.max_monthly_salary;
            setContent('#salaryRangeForSummary', () => {
                if(isEmptyOrNull(minSalary) && isEmptyOrNull(minSalary)) {
                    hideElement('#salaryRangeField');
                    return TEMPLATE.UNSET('Mo salary has been set')
                } else `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary)}`;
            });

            // Set Deadline
            setContent('#deadlineForSummary', () => {
                const deadline = manpowerRequest.deadline;
                return isEmptyOrNull(deadline) 
                    ? TEMPLATE.UNSET('No deadline has been set') 
                    : `
                        <div>${ formatDateTime(deadline, "Full Date") }</div>
                        <div>${ formatDateTime(deadline, "Time") }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(deadline)) }
                    `
            });

            setContent('#manpowerRequestSummaryBtnContainer', `
                <a 
                    class="btn btn-sm btn-secondary btn-block"
                    href="${ ROUTE.WEB.H }manpower-requests/${ manpowerRequest.manpower_request_id }"
                >View Full Details</button>
            `)

            /** JOB POST TIMELINE */
            setJobPostTimeline('#jobPostTimeline', result);

            /** Remove Loaders */
            $('#jobPostDetailsLoader').remove();
            showElement('#jobPostDetailsContainer');
        },
        error: () => toastr.error('There was an error in getting job post details')
    });
});