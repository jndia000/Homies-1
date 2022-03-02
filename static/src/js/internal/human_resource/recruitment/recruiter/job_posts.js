"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
 */
const jobPostID = getPathnamePart(1);


/**
 * ==============================================================================
 * SUBMIT JOB POST
 * ==============================================================================
 */

/** Load Primary Input */
ifSelectorExist('#createJobPostForm', () => {
    
    // Get Job Categories
    GET_ajax(`${ ROUTE.API.R }job-categories`, {
        success: result => {
            if(result) {
                const jobCategory = $('#jobCategory');
                jobCategory.empty();
                jobCategory.append(`<option></option>`);
                
                result.length > 0
                    ? result.forEach(c => jobCategory.append(`<option value="${ c.job_category_id }">${ c.name }</option>`))
                    : jobCategory.append(`<option disabled>No data</option>`)

                /** Employment Type For Add Select2 */
                $('#jobCategory').select2({
                    placeholder: "Please select a category",
                    minimumResultsForSearch: -1,
                });
            }
        }
    });

    /** Job Description For Add Summernote */
    $('#jobDescription').summernote({
        height: 750,
        placeholder: "Write the description of job here",
        toolbar: SUMMERNOTE_TOOLBAR
    });

    // Get the requisition ID from the URL
    const manpowerRequestID = window.location.pathname.split('/')[3];

    /** Get Manpower Request Information */
    GET_ajax(`${ ROUTE.API.R }manpower-requests/${ manpowerRequestID }`, {
        success: result => {
            const minSalary = result.min_monthly_salary, maxSalary = result.max_monthly_salary;

            /** MANPOWER REQUEST SUMMARY */

            // Set Value for Requisition ID
            setValue('#manpowerRequestID', result.manpower_request_id);

            // Set Content
            setContent('#vacantPositionForSummary', result.vacant_position.name);

            // Set Staffs Needed
            setContent('#staffsNeededForSummary', () => {
                const staffsNeeded = result.staffs_needed;
                return `${ staffsNeeded } new staff${ staffsNeeded > 1 ? 's' : '' }`
            });

            // Set Employment Type
            setContent('#employmentTypeForSummary', result.employment_type.name);

            // Set Salary Range
            setContent('#salaryRangeForSummary', () => {
                if(isEmptyOrNull(minSalary) && isEmptyOrNull(maxSalary)) {
                    hideElement('#salaryRangeField');
                    return TEMPLATE.UNSET('No salary has been set');
                } else {
                    return `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary)}`;
                }
            });

            // Set Deadline
            setContent('#deadlineForSummary', () => {
                const deadline = result.deadline;

                return isEmptyOrNull(deadline)
                    ? TEMPLATE.UNSET('No deadline')
                    : `
                        <div>${ formatDateTime(deadline, "Full Date") }</div>
                        <div>${ formatDateTime(deadline, "Time") }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(deadline)) }
                    `
            });


            /** SET MANPOWER REQUEST CONTENTS */

            const requestedBy = result.manpower_request_requested_by;

            // Set Requisition ID
            setValue('#manpowerRequestID', result.manpower_request_id)

            // Set Requisition No
            setContent('#requisitionNo', result.requisition_no);
            
            // Set Requestor Name
            setContent('#requestorName', formatName("F M. L, S", {
                firstName  : requestedBy.first_name,
                middleName : requestedBy.middle_name,
                lastName   : requestedBy.last_name,
                suffixName : requestedBy.extension_name
            }));
            
            // Set Requestor Department
            setContent('#requestorDepartment', `${ requestedBy.position.name }, ${ requestedBy.position.sub_department.name }`);
            
            // Set Date Requested
            setContent('#dateRequested', formatDateTime(result.created_at, "DateTime"));
            
            // Set Deadline
            setContent('#deadline', () => {
                const deadline = result.deadline;
                return isEmptyOrNull(deadline)
                    ? TEMPLATE.UNSET('No deadline')
                    : formatDateTime(result.deadline, "DateTime")
            });

            // Set Requested Position
            setContent('#requestedPosition', result.vacant_position.name);
            
            // Set No. of Staffs Needed
            setContent('#noOfStaffsNeeded', () => {
                const staffsNeeded = result.staffs_needed;
                return `${ staffsNeeded } new staff${ staffsNeeded > 1 ? "s" : "" }`
            });

            // Set Employment Type
            setContent('#employmentType', result.employment_type.name);

            // Set Request Nature
            setContent('#requestNature', result.request_nature);

            // Set Suggested Salary
            setContent('#suggestedSalary', () => {
                const minMonthlySalary = result.min_monthly_salary;
                const maxMonthlySalary = result.max_monthly_salary;
                return isEmptyOrNull(minMonthlySalary) && isEmptyOrNull(maxMonthlySalary) 
                    ? TEMPLATE.UNSET('No salary has been set')
                    : `${ formatCurrency(minMonthlySalary) } - ${ formatCurrency(maxMonthlySalary) }/month`;
            });

            // Set Request Description
            setContent('#requestDescription', result.content);

            // Set Approved By
            setContent('#approvedBy', () => {
                const approvedBy = result.manpower_request_reviewed_by;
                return isEmptyOrNull(approvedBy)
                    ? TEMPLATE.UNSET('Not yet approved')
                    : () => {
                        if(result.request_status === "Rejected") {
                            return `<div class="text-danger">This request has been rejected</div>`
                        } else {
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

            // Set Signed By
            setContent('#signedBy', () => {
                const signedBy = result.manpower_request_signed_by;
                
                if(result.request_status === "Rejected for signing")
                    return `<div class="text-danger">This request has been rejected for signing</div>`
                else if(isEmptyOrNull(signedBy))
                    return TEMPLATE.UNSET('Not signed yet')
                else {
                    const signedByFullName = formatName("L, F M., S", {
                        firstName  : signedBy.first_name,
                        middleName : signedBy.middle_name,
                        lastName   : signedBy.last_name,
                        suffixName : signedBy.suffix_name
                    });
                    return `
                        <div>${ signedByFullName }</div>
                        ${ TEMPLATE.SUBTEXT(signedBy.position.name + ', ' + signedBy.position.sub_department.name) }
                    `
                }
            });

            // Set Signed At
            setContent('#signedAt', () => {
                const signedAt = result.signed_at;
                return isEmptyOrNull(signedAt) 
                    ? TEMPLATE.UNSET('No status') 
                    : TEMPLATE.NOWRAP([
                        formatDateTime(signedAt, "Date"),
                        formatDateTime(signedAt, "Time")
                    ])
            });

            // Set Approved At
            setContent('#approvedAt', () => {
                const approvedAt = result.reviewed_at;
                return (isEmptyOrNull(approvedAt) || result.request_status === 'Rejected') 
                    ? TEMPLATE.UNSET('No status')
                    : formatDateTime(approvedAt, "DateTime")
            });

            // Set Approved At
            setContent('#completedAt', () => {
                const completedAt = result.completed_at;
                return isEmptyOrNull(completedAt) 
                    ? TEMPLATE.UNSET('No status')
                    : formatDateTime(completedAt, "Date")
            });
        },
        error: () => toastr.error('There was an error in getting requisition details')
    });
    
    /** Validate Summernote */
    $('#jobDescription').summernote().on('summernote.change', () => {
        if($('#jobDescription').summernote('isEmpty')) {
            $('#jobDescription').next().addClass('border-danger');
            showElement('#jobDescriptionInvalidFeedback');
            disableElement('#postBtn');
        } else {
            $('#jobDescription').next().removeClass('border-danger');
            hideElement('#jobDescriptionInvalidFeedback');
            enableElement('#postBtn');
        }
    });
});

/** Set Expriration Date On Change */
$('#expirationDate').on('change', () => isChecked('#expirationDate') ? showElement('#openUntilField') : hideElement('#openUntilField'));

/** Validate Add Job Post Form */
validateForm('#createJobPostForm', {
    rules: {
        manpowerRequestID: { required: true },
        jobCategory: { required: true },
        jobDescription: { required: true, },
        openUntil: {
            required: true,
            afterToday: true
        }
    },
    messages:{
        manpowerRequestID: { required: 'This field must have value' },
        jobCategory: { required: 'Please select a category for this job' },
        jobDescription: { required: 'Job Description is required', },
        openUntil: {
            required: 'Please select a date',
            afterToday: 'The date and time must be in the future'
        }
    },
    submitHandler:() => {
        showModal('#confirmPostNewJobModal');
        return false;
    }
});

/** Submit Job Post */
onClick('#confirmPostNewJobPostBtn', () => {

    // Set buttons to loading state
    btnToLoadingState('#confirmPostNewJobPostBtn');
    disableElement('#cancelPostNewJobPostBtn');

    const formData = generateFormData('#createJobPostForm');
    const get = (name) => { return formData.get(name) }

    const expirationDate = isChecked('#expirationDate') 
        ? formatDateTime(get('openUntil')) 
        : null

    const data = {
        manpower_request_id: get('manpowerRequestID'),
        is_salary_visible: isChecked('#salaryRangeIsVisible'),
        job_category_id: get('jobCategory'),
        content: get('jobDescription'),
        expiration_date: expirationDate,
    }

    const ifError = () => {
        hideModal('#confirmPostNewJobModal');
        
        // Set buttons to unload state
        btnToUnloadState('#confirmPostNewJobPostBtn', TEMPLATE.LABEL_ICON('Yes, post it', 'check'));
        enableElement('#cancelPostNewJobPostBtn');
        
        toastr.error('There was an error in posting new job')
    } 

    POST_ajax(`${ ROUTE.API.R }job-posts`, data, {
        success: result => {
            if(result) setSessionedAlertAndRedirect({
                theme: 'success',
                message: 'A new available job is successfully posted',
                redirectURL: `${ ROUTE.WEB.R }job-posts`
            });
            else ifError()
        },
        error: () => ifError()
    });
});


/**
 * ==============================================================================
 * VIEW ALL JOB POSTS
 * ==============================================================================
 */

/** Initialize Job Posts DataTable */
initDataTable('#jobPostsDT', {
    // debugMode: true,
    url: `${ ROUTE.API.R }job-posts`,
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
                const vacant_position = data.manpower_request.vacant_position.name;
                const job_category = data.job_category.name;

                return `
                    <div>${ vacant_position }</div>
                    ${ TEMPLATE.SUBTEXT(job_category) }
                `
            }
        },

        // Applicants
        {
            data: null,
            render: data => {
                const applicants = data.applicants.length;
                return applicants == 0 
                    ? TEMPLATE.UNSET('No applicants yet')
                    : `${ applicants } applicant${ applicants > 1 ? 's' : '' }`
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
                        <div class="dropdown-divider"></div>
                        <a 
                            class="dropdown-item d-flex"
                            href="${ ROUTE.WEB.R }job-posts/${ data.job_post_id }/applicants"
                        >
                            <div style="width: 2rem"><i class="fas fa-users mr-1"></i></div>
                            <div>
                                <div>View Applicants</div>
                                <div class="small">Manage applicants for this job</div>
                            </div>
                        </a>
                    `
                    : '';

                const endJobPost = () => {
                    return isEmptyOrNull(data.expiration_date)
                        ? `
                            <div class="dropdown-divider"></div>
                            <div
                                class="dropdown-item d-flex"
                                role="button"
                                onclick="endRecruiting('${ jobPostID }')"
                            >
                                <div style="width: 2rem"><i class="fas fa-hand-paper mr-1"></i></div>
                                <div>
                                    <div>End Recruiting</div>
                                    <div class="small">End accepting candidates for this job</div>
                                </div>
                            </div>
                        `
                        : ''
                }

                return TEMPLATE.DT.OPTIONS(`
                    <a 
                        class="dropdown-item d-flex"
                        href="${ ROUTE.WEB.R }job-posts/${ jobPostID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>
                            <div>View Job Post</div>
                            <div class="small">See the details of vacant job</div>
                        </div>
                    </a>
                    <div 
                        class="dropdown-item d-flex"
                        role="button"
                        onclick="editJobPost('${ jobPostID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-edit mr-1"></i></div>
                        <div>Edit Job Post</div>
                    </div>
                    ${ applicants }
                    <div class="dropdown-divider"></div>
                    <a
                        class="dropdown-item d-flex"
                        href="${ ROUTE.WEB.R }manpower-requests/${ manpowerRequestID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-file-alt mr-1"></i></div>
                        <div>
                            <div>View Manpower Request</div>
                            <div class="small">See the details of requisition</div>
                        </div>
                    </a>
                    ${ endJobPost() }
                `)
            }
        }
    ]
});


/**
 * ==============================================================================
 * JOB POSTS ANALYTICS
 * ==============================================================================
 */

// Job Post Analytics
const jobPostsAnalytics = () => GET_ajax(`${ ROUTE.API.R }job-posts/analytics`, {
    success: result => {
        setContent({
            '#totalJobPostsCount': formatNumber(result.total),
            '#ongoingJobPostsCount': formatNumber(result.on_going),
            '#endedJobPostsCount': formatNumber(result.ended)
        });
    },
    error: () => toastr.error('There was an error while getting job post analytics')
});

ifSelectorExist('#jobPostsAnalytics', () => jobPostsAnalytics())


/**
 * ==============================================================================
 * VIEW JOB POST DETAILS
 * ==============================================================================
*/

/** Get Job Post Details */
const getJobPostDetails = () => GET_ajax(`${ ROUTE.API.R }job-posts/${ jobPostID }`, {
    success: result => {
        
        /** JOB POST DETAILS */
        setJobPostDetails(result);
        
        /** Job Post Options */
        setContent('#jobPostOptions', () => {
            const endRecruiting = `
                <button class="btn btn-sm btn-danger btn-block" onclick="endRecruiting('${ jobPostID }')">
                    ${ TEMPLATE.ICON_LABEL('hand-paper', 'End Recruiting') }
                </button>
            `
        
            return `
                <a class="btn btn-sm btn-secondary btn-block" target="_blank" href="${ BASE_URL_WEB }careers/${ jobPostID }">
                    ${ TEMPLATE.ICON_LABEL('eye', 'View post in public portal') }
                </a>
                <a class="btn btn-sm btn-secondary btn-block" href="${ ROUTE.WEB.R }job-posts/${ jobPostID }/applicants">
                    ${ TEMPLATE.ICON_LABEL('users', 'View applicants') }
                </a>
                <div class="dropdown-divider"></div>
                <a class="btn btn-sm btn-info btn-block" href="${ ROUTE.WEB.R }edit-job-post/${ jobPostID }">
                    ${ TEMPLATE.ICON_LABEL('edit', 'Edit this post') }
                </a>

                ${ isEmptyOrNull(result.expiration_date) ? endRecruiting : ''}
            `
        });

        /** MANPOWER REQUEST SUMMARY */

        const manpowerRequest = result.manpower_request;

        // Set Vacant Position
        setContent('#vacantPositionForSummary', manpowerRequest.vacant_position.name);

        // Set Staffs Needed
        setContent('#staffsNeededForSummary', () => {
            const staffsNeeded = manpowerRequest.staffs_needed;
            return `${ staffsNeeded } new ${ pluralize('staff', staffsNeeded)}`;
        });

        // Set Employment Type
        const employmentType = manpowerRequest.employment_type.name
        setContent('#employmentTypeForSummary', employmentType);
        setContent('#employmentTypeForJobPost', employmentType);

        // Set Salary Range
        const minSalary = manpowerRequest.min_monthly_salary, maxSalary = manpowerRequest.max_monthly_salary;
        setContent('#salaryRangeForSummary', () => {
            if(isEmptyOrNull(minSalary) && isEmptyOrNull(minSalary)) {
                hideElement('#salaryRangeField');
                return TEMPLATE.UNSET('Unset')
            } else return `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary)}`;
        });

        // Set Deadline
        setContent('#deadlineForSummary', () => {
            const deadline = manpowerRequest.deadline;
            return isEmptyOrNull(deadline) 
                ? TEMPLATE.UNSET('No deadline')
                : `
                    <div>${ formatDateTime(deadline, "Full Date") }</div>
                    <div>${ formatDateTime(deadline, "Time") }</div>
                    ${ TEMPLATE.SUBTEXT(fromNow(deadline)) }
                `
        });
        
        /** FOR JOB POST TIMELINE */
        setJobPostTimeline('#jobPostTimeline', result);

        /** SET MANPOWER REQUEST CONTENTS */

        const requestedBy = manpowerRequest.manpower_request_requested_by;

        // Set Manpower Request ID
        setValue('#manpowerRequestID', manpowerRequest.manpower_request_id);
        
        // Set Requisition No
        setContent('#requisitionNo', manpowerRequest.requisition_no);
        
        // Set Requestor Name
        setContent('#requestorName', formatName("F M. L, S", {
            firstName: requestedBy.first_name,
            middleName: requestedBy.middle_name,
            lastName: requestedBy.last_name,
            suffixName: requestedBy.suffix_name
        }));
        
        // Set Requestor Department
        setContent('#requestorDepartment', `${ requestedBy.position.name }, ${ requestedBy.position.sub_department.name }`);
        
        // Set Date Requested
        setContent('#dateRequested', formatDateTime(manpowerRequest.created_at, "DateTime"));
        
        // Set Deadline
        setContent('#deadline', () => {
            const deadline = manpowerRequest.deadline;
            if(isEmptyOrNull(deadline)) return TEMPLATE.UNSET('No deadline')
            else return formatDateTime(manpowerRequest.deadline, "DateTime")
        });

        // Set Requested Position
        setContent('#requestedPosition', manpowerRequest.vacant_position.name);
        
        // Set No. of Staffs Needed
        setContent('#noOfStaffsNeeded', () => {
            const staffsNeeded = manpowerRequest.staffs_needed;
            return `${ staffsNeeded } new staff${ staffsNeeded > 1 ? "s" : "" }`
        });

        // Set Employment Type
        setContent('#employmentType', manpowerRequest.employment_type.name);

        // Set Request Nature
        setContent('#requestNature', manpowerRequest.request_nature);

        // Set Suggested Salary
        setContent('#suggestedSalary', () => {
            const minMonthlySalary = manpowerRequest.min_monthly_salary;
            const maxMonthlySalary = manpowerRequest.max_monthly_salary;
            return isEmptyOrNull(minMonthlySalary) && isEmptyOrNull(maxMonthlySalary) 
                ? TEMPLATE.UNSET('Unset')
                : `${ formatCurrency(minMonthlySalary) } - ${ formatCurrency(maxMonthlySalary) }/month`;
        });

        // Set Request Description
        setContent('#requestDescription', manpowerRequest.content);

        // Set Approved By
        setContent('#approvedBy', () => {
            const approvedBy = manpowerRequest.manpower_request_reviewed_by;
            return isEmptyOrNull(approvedBy)
                ? TEMPLATE.UNSET('Not yet approved')
                : () => {
                    if(manpowerRequest.request_status === "Rejected") {
                        return `<div class="text-danger">This request has been rejected</div>`
                    } else {
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

        // Set Signed By
        setContent('#signedBy', () => {
            const signedBy = manpowerRequest.manpower_request_signed_by;
            
            if(manpowerRequest.request_status === "Rejected for signing")
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
                    ${ TEMPLATE.SUBTEXT(signedBy.position.name + ', ' + signedBy.position.sub_department.name) }
                `
            }
        });

        // Set Signed At
        setContent('#signedAt', () => {
            const signedAt = manpowerRequest.signed_at;
            return isEmptyOrNull(signedAt) 
                ? TEMPLATE.UNSET('No status')
                : TEMPLATE.NOWRAP([
                    formatDateTime(signedAt, "Date"),
                    formatDateTime(signedAt, "Time")
                ])
        });

        // Set Approved At
        setContent('#approvedAt', () => {
            const approvedAt = manpowerRequest.reviewed_at;
            return (isEmptyOrNull(approvedAt) || manpowerRequest.request_status === 'Rejected') 
                ? TEMPLATE.UNSET('No status')
                : formatDateTime(approvedAt, "DateTime")
        });

        // Set Approved At
        setContent('#completedAt', () => {
            const completedAt = manpowerRequest.completed_at;
            return isEmptyOrNull(completedAt) 
                ? TEMPLATE.UNSET('No status')
                : formatDateTime(completedAt, "Date")
        });

        /** Remove Preloaders */
        $('#jobPostDetailsLoader').remove();
        showElement('#jobPostDetailsContainer');

        $('#optionsLoader').remove();
        showElement('#optionsContainer');
    },
    error: () => toastr.error('There was a problem in getting job post details')
});

/** View Job Post */
ifSelectorExist('#jobPostDetails', () => getJobPostDetails());


/**
 * ==============================================================================
 * EDIT JOB POST
 * ==============================================================================
*/

/** Edit Job Post */
const editJobPost = (jobPostID) => location.assign(`${ ROUTE.WEB.R }edit-job-post/${ jobPostID }`)

/** If Edit Job Post Form Exists */
ifSelectorExist('#editJobPostForm', () => {

    // Get Job Categories
    GET_ajax(`${ ROUTE.API.R }job-categories`, {
        success: result => {
            if(result) {
                const jobCategory = $('#jobCategory');
                jobCategory.empty();
                jobCategory.append(`<option></option>`);
                
                result.length > 0
                    ? result.forEach(c => jobCategory.append(`<option value="${ c.job_category_id }">${ c.name }</option>`))
                    : jobCategory.append(`<option disabled>No data</option>`)

                /** Employment Type For Add Select2 */
                $('#jobCategory').select2({
                    placeholder: "Please select a category",
                    minimumResultsForSearch: -1,
                });
            }
        }
    });
    
    /** Job Description For Add Summernote */
    $('#jobDescription').summernote({
        height: 750,
        placeholder: "Write the description of job here",
        toolbar: SUMMERNOTE_TOOLBAR
    });

    /** Get Job Post ID from the URL */
    const jobPostID = window.location.pathname.split("/")[3];

    /** Get Job Post Information */
    GET_ajax(`${ ROUTE.API.R }job-posts/${ jobPostID }`, {
        success: result => {

            /** SET JOB POST CONTENT */

            const manpowerRequest = result.manpower_request;
            const minSalary = manpowerRequest.min_monthly_salary;
            const maxSalary = manpowerRequest.max_monthly_salary;

            // Set Job Post ID for form submission
            setValue('#jobPostID', result.job_post_id);

            /** FOR MANPOWER REQUEST SUMMARY */

            // Set Vacant Position
            setContent('#vacantPositionForSummary', manpowerRequest.vacant_position.name);

            // Set Staffs Needed
            setContent('#staffsNeededForSummary', () => {
                const staffsNeeded = manpowerRequest.staffs_needed;
                return `${ staffsNeeded } new staff${ staffsNeeded > 1 ? 's' : '' }`;
            });

            // Set Employment Type
            setContent('#employmentTypeForSummary', manpowerRequest.employment_type.name);

            // Set Salary Range
            setContent('#salaryRangeForSummary', () => {
                if(isEmptyOrNull(minSalary) && isEmptyOrNull(minSalary)) {
                    hideElement('#salaryRangeField');
                    return TEMPLATE.UNSET('No status')
                } else return `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary)}`;
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


            /** FOR MANPOWER REQUEST MODAL */

            const requestedBy = manpowerRequest.manpower_request_requested_by;

            // Set Requestor Name
            setContent('#requestorName', formatName('F M. L, S', {
                firstName  : requestedBy.first_name,
                middleName : requestedBy.middle_name,
                lastName   : requestedBy.last_name,
                suffixName : requestedBy.extension_name
            }));

            // Set Requestor Department
            setContent('#requestorDepartment', requestedBy.position.name);

            // Set Date Requested
            setContent('#dateRequested', formatDateTime(manpowerRequest, "DateTime"));

            // Set Deadline
            setContent('#deadline', () => {
                const deadline = manpowerRequest.deadline;
                return isEmptyOrNull(deadline) ? 'Unset' : formatDateTime(deadline, "DateTime");
            });

            // Set Requested Position
            setContent('#requestedPosition', manpowerRequest.vacant_position.name);

            // Set Staffs Needed
            setContent('#noOfStaffsNeeded', () => {
                const staffsNeeded = manpowerRequest.staffs_needed;
                return `${ staffsNeeded } new staff${ staffsNeeded > 1 ? 's' : '' }`;
            });

            // Set Employment Type
            setContent('#employmentType', manpowerRequest.employment_type.name);

            // Set Request Nature
            setContent('#requestNature', manpowerRequest.request_nature);

            // Set Suggested Salary
            setContent('#suggestedSalary', () => {
                return isEmptyOrNull(minSalary) && isEmptyOrNull(minSalary)
                    ? TEMPLATE.UNSET('No salary has been set')
                    : `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary)}`;
            });

            // Set Request Description
            setContent('#requestDescription', manpowerRequest.content);

            
            // Set Signed By
            setContent('#signedBy', () => {
                const signedBy = manpowerRequest.manpower_request_signed_by;
                
                if(manpowerRequest.request_status === "Rejected for signing")
                    return `<div class="text-danger">This request has been rejected for signing</div>`
                else if(isEmptyOrNull(signedBy))
                    return TEMPLATE.UNSET('Not yet signed')
                else {
                    const signedByFullName = formatName("L, F M., S", {
                        firstName  : signedBy.first_name,
                        middleName : signedBy.middle_name,
                        lastName   : signedBy.last_name,
                        suffixName : signedBy.extension_name
                    });
                    return `
                        <div>${ signedByFullName }</div>
                        ${ TEMPLATE.SUBTEXT(signedBy.position.name + ', ' + signedBy.position.sub_department.name) }
                    `
                }
            });

            // Set Signed At
            setContent('#signedAt', () => {
                const signedAt = manpowerRequest.signed_at;
                return isEmptyOrNull(signedAt) 
                    ? TEMPLATE.UNSET('No status') 
                    : TEMPLATE.NOWRAP([
                        formatDateTime(signedAt, "Date"),
                        formatDateTime(signedAt, "Time")
                    ])
            });

            // Set Approved By
            setContent('#approvedBy', () => {
                const approvedBy = manpowerRequest.manpower_request_reviewed_by;
                return isEmptyOrNull(approvedBy)
                    ? TEMPLATE.UNSET('Not yet approved')
                    : () => {
                        if(result.request_status === "Rejected") {
                            return `<div class="text-danger">This request has been rejected</div>`
                        } else {
                            const approvedByFullName = formatName("L, F M., S", {
                                firstName  : approvedBy.first_name,
                                middleName : approvedBy.middle_name,
                                lastName   : approvedBy.last_name,
                                suffixName : approvedBy.extension_name
                            });
                            return `
                                <div>${ approvedByFullName }</div>
                                ${ TEMPLATE.SUBTEXT(approvedBy.position.name + ', ' + approvedBy.position.sub_department.name) }
                            `
                        }
                    }
            });

            // Set Approved At
            setContent('#approvedAt', formatDateTime(manpowerRequest.reviewed_at, "DateTime"));

            // Set Completed At
            setContent('#completedAt', () => {
                const completedAt = manpowerRequest.completed_at;
                return isEmptyOrNull(completedAt) 
                    ? TEMPLATE.UNSET('No status')
                    : formatDateTime(completedAt, "Date");
            });


            /** FOR JOB POST TIMELINE */
            setJobPostTimeline('#jobPostTimeline', result);


            /** SET INPUTS */

            /** Set Vacant Position */
            $('#jobCategory').val(result.job_category.job_category_id).trigger('change');
            
            // Set Job Description
            $('#jobDescription').summernote('code', result.content);

            if(result.is_salary_visible) checkElement('#salaryRangeIsVisible');

            // Set Expiration Date
            if(!isEmptyOrNull(result.expiration_date)) {
                checkElement('#expirationDate');
                showElement('#openUntilField');
                setValue('#openUntil', result.expiration_date);
            }

            /** Remove Loaders */
            $('#editJobPostFormLoader').remove();
            showElement('#editJobPostFormContainer');
        },
        error: () => toastr.error('There was an error in getting job post details')
    });
    
    /** Validate Summernote */
    $('#jobDescription').summernote().on('summernote.change', () => {
        if($('#jobDescription').summernote('isEmpty')) {
            $('#jobDescription').next().addClass('border-danger');
            showElement('#jobDescriptionInvalidFeedback');
            disableElement('#saveBtn');
        } else {
            $('#jobDescription').next().removeClass('border-danger');
            hideElement('#jobDescriptionInvalidFeedback');
            enableElement('#saveBtn');
        }
    });
});

/** Validate Edit Job Post */
validateForm('#editJobPostForm', {
    rules: {
        jobPostID: {
            required: true
        },
        jobCategory: {
            required: true
        },
        jobDescription: {
            required: true
        },
        openUntil: {
            required: true,
            afterToday: true
        }
    },
    messages: {
        jobPostID: {
            required: "This must have a hidden value"
        },
        jobCategory: {
            required: "This is a required field"
        },
        jobDescription: {
            required: "Job Description is required"
        },
        openUntil: {
            required: "Please select a date",
            afterToday: "Date and Time must be in the future"
        }
    },
    submitHandler: () => {
        showModal('#confirmUpdateJobPostModal');
        return false;
    }
});

/** Update Job Post */
onClick('#confirmUpdateJobPostBtn', () => {

    // Set buttons to loading state
    btnToLoadingState('#confirmUpdateJobPostBtn');
    disableElement('#cancelUpdateJobPostBtn');

    // Generate form Data
    const formData = generateFormData('#editJobPostForm');

    // Get expiration date
    const expirationDate = isChecked('#expirationDate') ? formatDateTime(formData.get('openUntil')) : null;

    // Set Data
    const data = {
        job_category_id: formData.get('jobCategory'),
        content: formData.get('jobDescription'),
        is_salary_visible: isChecked('#salaryRangeIsVisible'),
        expiration_date: expirationDate
    }

    // Call if error
    const ifError = () => {
        hideModal('#confirmUpdateJobPostModal');
        toastr.error('There was an error in updating a job post');
    }

    // Update Job Post
    PUT_ajax(`${ ROUTE.API.R }job-posts/${ formData.get('jobPostID') }`, data, {
        success: result => {
            if(result) {
                setSessionedAlertAndRedirect({
                    theme: 'info',
                    message: 'A posted job is successfully updated',
                    redirectURL: `${ ROUTE.WEB.R }job-posts`
                });
            } else ifError()
        },
        error: () => ifError()
    });
});


/**
 * ==============================================================================
 * END RECRUITING
 * ==============================================================================
*/


/** End Recruiting */
const endRecruiting = (jobPostID) => {
    setValue('#jobPostID', jobPostID);
    showModal('#endRecruitingModal');
}

/** Validate Form */
validateForm('#endRecruitingForm', {
    submitHandler: () => {

        // Set Buttons to loading state
        btnToLoadingState('#confirmEndRecruitingBtn');
        disableElement('#cancelEndRecruitingBtn');

        const jobPostID = generateFormData('#endRecruitingForm').get('jobPostID');

        PUT_ajax(`${ ROUTE.API.R }job-posts/${ jobPostID }/end-recruiting`, {}, {
            success: result => {
                if(result) {

                    // Hide Modal
                    hideModal('#endRecruitingModal');

                    // Reload DataTable
                    ifSelectorExist('#jobPostsDT', () => reloadDataTable('#jobPostsDT'));

                    // Reload Job Post Details
                    ifSelectorExist('#jobPostDetails', () => getJobPostDetails());

                    // Reload Job Post Analytics
                    jobPostsAnalytics();

                    // Set Buttons to loading state
                    btnToUnloadState('#confirmEndRecruitingBtn', TEMPLATE.LABEL_ICON('Yes, end it!', 'check'));
                    enableElement('#cancelEndRecruitingBtn');

                    // Show Alert
                    toastr.info('A job post has been ended its recruiment');
                }
            },
            error: () => toastr.error('There was an error in ')
        });
        return false;
    }
});

onHideModal('#endRecruitingModal', () => resetForm('#endRecruitingForm'));
