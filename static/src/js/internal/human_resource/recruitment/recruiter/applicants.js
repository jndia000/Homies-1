"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
*/

/** Job Post ID from the URL */
const jobPostID = getPathnamePart(1);


/**
 * ==============================================================================
 * VIEW ALL APPLICANTS
 * ==============================================================================
*/

/** Initialize Applicants DataTable */
initDataTable('#applicantsDT', {
    // debugMode: true,
    url: `${ ROUTE.API.R }applicants`,
    enableButtons: true,
    columns: [
        
        // Created at (Hidden for default sorting)
        { data: 'created_at', visible: false },

        // Applicant
        {
            data: null,
            class: 'w-100',
            render: data => {
                const applicantFullName = formatName('F M. L, S', {
                    firstName  : data.first_name,
                    middleName : data.middle_name,
                    lastName   : data.last_name,
                    suffixName : data.suffix_name,
                });
                return `
                    <div>${ applicantFullName }</div>
                    ${ TEMPLATE.SUBTEXT(data.email) }
                    ${ TEMPLATE.SUBTEXT(data.contact_number) }
                `
            }
        },

        // Position
        { data: 'applied_job.manpower_request.vacant_position.name' },

        // Employment Type
        { data: 'applied_job.manpower_request.employment_type.name' },

        // Date Applied
        {
            data: null,
            class: 'text-nowrap',
            render: data => {
                const dateApplied = data.created_at;
                return `
                    <div>${ formatDateTime(dateApplied, "MMM. D, YYYY") }</div>
                    ${ TEMPLATE.SUBTEXT(fromNow(dateApplied)) }
                `;
            }
        },

        // Status
        {
            data: null,
            render: data => {
                const status = data.status;
                switch(status) {
                    case "For evaluation":
                        return TEMPLATE.DT.BADGE('warning', TEMPLATE.ICON_LABEL('sync-alt', status))
                    case "For screening":
                        return TEMPLATE.DT.BADGE('secondary', TEMPLATE.ICON_LABEL('search', status))
                    case "For interview":
                        return TEMPLATE.DT.BADGE('info', TEMPLATE.ICON_LABEL('user-friends', status))
                    case "Hired":
                        return TEMPLATE.DT.BADGE('success', TEMPLATE.ICON_LABEL('handshake', status))
                    case "Contract signed":
                        return TEMPLATE.DT.BADGE('primary', TEMPLATE.ICON_LABEL('file-signature', status))
                    case "Rejected from evaluation":
                    case "Rejected from screening":
                    case "Rejected from interview":
                        return TEMPLATE.DT.BADGE('danger', TEMPLATE.ICON_LABEL('times', status))
                    default:
                        return TEMPLATE.DT.BADGE('light', "Invalid data")
                }
            }
        },

        // User Actions
        {
            data: null,
            render: data => {
                return TEMPLATE.DT.OPTIONS(`
                    <div 
                        class="dropdown-item d-flex" 
                        role="button" 
                        onclick="viewApplicantDetails('${ data.applicant_id }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Details</div>
                    </div>
                `);
            }
        }
    ]
});


/**
 * ==============================================================================
 * APPLICANTS ANALYTICS
 * ==============================================================================
*/

// Applicants Analytics
const applicantsAnalytics = () => {
    GET_ajax(`${ ROUTE.API.R }applicants/analytics`, {
        success: result => {
            setContent({
                '#totalApplicantsCount': formatNumber(result.total),
                '#forEvaluationCount': formatNumber(result.for_evaluation),
                '#hiredApplicantsCount': formatNumber(result.evaluated.hired),
                '#forScreeningCount': formatNumber(result.evaluated.for_screening),
                '#forInterviewCount': formatNumber(result.evaluated.for_interview),
                '#rejectedApplicantsCount': formatNumber(result.rejected.total)
            });
        },
        error: () => toastr.error('There was an error in getting applciants analytics')
    });
}

ifSelectorExist('#applicantsAnalytics', () => applicantsAnalytics());


/**
 * ==============================================================================
 * VIEW APPLICANT DETAILS
 * ==============================================================================
*/

/** View Applicant Details */
const viewApplicantDetails = (applicantID) => {
    GET_ajax(`${ ROUTE.API.R }applicants/${ applicantID }`, {
        success: result => {

            /** APPLICANT DETAILS */
            setValue('#applicantID', result.applicant_id)
            setContent({
                '#applicantFullName': formatName('F M. L, S', {
                    firstName  : result.first_name,
                    middleName : result.middle_name,
                    lastName   : result.last_name,
                    suffixName : result.suffixName
                }),
                '#applicantContactNumber': result.contact_number,
                '#applicantEmail': result.email
            })

            // Set Resume Link
            $('#viewResumeBtn').attr('href', `${ URL_RESUME_FILES }${ result.resume }`);


            /** APPLICANT TIMELINE */
            setApplicantTimeline('#applicantTimeline', result);

            // Remove Applicant Timeline Loader
            hideElement('#applicantTimelineLoader');
            showElement('#applicantTimeline');

            /** Show Modal */
            showModal('#applicantDetailsModal');
        },
        error: () => toastr.error('There was an error in getting applicant details')
    });
}

/** On Applicant details modal is going to be hidden  */
onHideModal('#applicantDetailsModal', () => {
    showElement('#applicantTimelineLoader');
    hideElement('#applicantTimeline');
    $('#applicantDetailsTab').tab('show');
});


/**
 * ==============================================================================
 * JOB POST SUMMARY
 * ==============================================================================
*/

/** Set Job Post Summary */
ifSelectorExist('#jobPostSummary', () => {
    const jobPostID = getPathnamePart(2);
    GET_ajax(`${ ROUTE.API.R }job-posts/${ jobPostID }`, {
        success: result => {

            const manpowerRequest = result.manpower_request

            // Set Job Post Position
            setContent('#position', manpowerRequest.vacant_position.name);

            // Set Job Post Status
            setContent('#jobPostStatus', () => {
                const expiresAt = result.expiration_date;
                if(isEmptyOrNull(expiresAt) || isAfterToday(expiresAt))
                    return TEMPLATE.BADGE('info', 'On Going');
                else if(isBeforeToday(expiresAt))
                    return TEMPLATE.BADGE('danger', 'Ended');
                else
                    return TEMPLATE.BADGE('warning', 'Last day today');
            });

            //  Set Job Posted At
            setContent('#jobPostedAt',`Posted ${ formatDateTime(result.created_at, 'Date') }`);

            // Set Staff needed
            setContent('#staffsNeeded', () => {
                const staffsNeeded = manpowerRequest.staffs_needed;
                return `${ staffsNeeded } new ${ pluralize('staff', staffsNeeded) } `;
            });
            
            // Set Employment Type
            setContent('#employmentType', manpowerRequest.employment_type);

            // Set Deadline
            setContent('#deadline', () => {
                const deadline = manpowerRequest.deadline;
                return isEmptyOrNull(deadline) ? 'No deadline' : `Until ${ formatDateTime(deadline, "Date") }`
            });
            
            $('#jobPostSummaryLoader').remove();
            showElement('#jobPostSummary');
        },
        error: () => toastr.error('There was an error in getting job post details')
    });
});


/**
 * ==============================================================================
 * APPLICANTS PER JOB ANALYTICS
 * ==============================================================================
*/

// Applicants Per Job Analytics
const applicantsPerJobAnalytics = () => {
    const jobPostID = getPathnamePart(2);
    GET_ajax(`${ ROUTE.API.R }job-posts/${ jobPostID }/applicants/analytics`, {
        success: result => {

            // Show Count or Hide Element
            const a = (s, c) => { 
                if(c > 0) {
                    setContent(s, formatNumber(c));
                    showElement(s);
                } else hideElement(s)
            }

            // Set Total Applicants
            a('#totalApplicantsCount', result.total);

            // Set For Evaluation Count
            a('#forEvaluationCount', result.for_evaluation);

            // Set Evaluated Applicants Count
            const evaluatedCount = 
                result.for_screening 
                + result.for_interview 
                + result.hired 
                + result.contract_signed 
                + result.rejected.from_screening 
                + result.rejected.from_interview
            ;
            
            a('#evaluatedCount', evaluatedCount);

            // Set Rejected From Evaluation Count
            a('#rejectedCount', result.rejected.from_evaluation);

            // Remove Loader
            $('#menuLoader').remove();
            showElement('#menu');
        },
        error: () => toastr.error('There was an error in getting applciants analytics')
    });
}

ifSelectorExist('#applicantsMenu', () => applicantsPerJobAnalytics());


/**
 * ==============================================================================
 * APPLICANTS PER JOB
 * ==============================================================================
*/

/** Applicants for Evaluation DataTable */
const loadApplicantsForEvaluationDT = () => {
    initDataTable('#applicantsForEvaluationDT', {
        url: `${ ROUTE.API.R }job-posts/${ jobPostID }/applicants/for-evaluation`,
        columns: [
            
            // Created at (Hidden for default sorting)
            { data: 'created_at', visible: false },
    
            // Applicant
            {
                data: null,
                render: data => {
                    const applicantFullName = formatName('F M. L, S', {
                        firstName  : data.first_name,
                        middleName : data.middle_name,
                        lastName   : data.last_name,
                        suffixName : data.suffix_name,
                    });
                    return `
                        <div>${ applicantFullName }</div>
                        ${ TEMPLATE.SUBTEXT(data.email) }
                        ${ TEMPLATE.SUBTEXT(data.contact_number) }
                    `
                }
            },
    
            // Date Applied
            {
                data: null,
                class: 'text-nowrap',
                render: data => {
                    const dateApplied = data.created_at;
                    return `
                        <div>${ formatDateTime(dateApplied, "MMM. D, YYYY") }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(dateApplied)) }                
                    `
                }
            },
    
            // User Actions
            {
                data: null,
                render: data => {
                    return TEMPLATE.DT.OPTIONS(`
                        <div 
                            class="dropdown-item d-flex" 
                            role="button" 
                            onclick="evaluateApplicant('${ data.applicant_id }')"
                        >
                            <div style="width: 2rem"><i class="fas fa-user-cog mr-1"></i></div>
                            <div>Evaluate applicant</div>
                        </div>
                    `);
                }
            }
        ]
    });
    showElement('#applicantsForEvaluationDT');
}


/** Applicants For Evaluation DataTable */
const loadEvaluatedApplicantsDT = () => {
    initDataTable('#evaluatedApplicantsDT', {
        // debugMode: true,
        url: `${ ROUTE.API.R }job-posts/${ jobPostID }/applicants/evaluated`,
        columns: [
            
            // Created at (Hidden for default sorting)
            { data: 'created_at', visible: false },
    
            // Applicant
            {
                data: null,
                render: data => {
                    const applicantFullName = formatName('F M. L, S', {
                        firstName  : data.first_name,
                        middleName : data.middle_name,
                        lastName   : data.last_name,
                        suffixName : data.suffix_name,
                    });
                    return `
                        <div>${ applicantFullName }</div>
                        ${ TEMPLATE.SUBTEXT(data.email) }
                        ${ TEMPLATE.SUBTEXT(data.contact_number) }
                    `
                }
            },
    
            // Date Applied
            {
                data: null,
                class: 'text-nowrap',
                render: data => {
                    const dateApplied = data.created_at;
                    return `
                        <div>${ formatDateTime(dateApplied, "MMM. D, YYYY") }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(dateApplied)) }
                    `
                }
            },
    
            // User Actions
            {
                data: null,
                render: data => {
                    return TEMPLATE.DT.OPTIONS(`
                        <div 
                            class="dropdown-item d-flex" 
                            role="button" 
                            onclick="viewApplicantDetails('${ data.applicant_id }')"
                        >
                            <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                            <div>View Details</div>
                        </div>
                    `)
                }
            }
        ]
    });
    showElement('#evaluatedApplicantsDT');
}


/** Applicants For Evaluation DataTable */
const loadRejectedApplicantsDT = () => {
    initDataTable('#rejectedApplicantsDT', {
        // debugMode: true,
        url: `${ ROUTE.API.R }job-posts/${ jobPostID }/applicants/rejected`,
        columns: [
            
            // Created at (Hidden for default sorting)
            { data: 'created_at', visible: false },
    
            // Applicant
            {
                data: null,
                render: data => {
                    const applicantFullName = formatName('F M. L, S', {
                        firstName  : data.first_name,
                        middleName : data.middle_name,
                        lastName   : data.last_name,
                        suffixName : data.suffix_name,
                    });
                    return `
                        <div>${ applicantFullName }</div>
                        ${ TEMPLATE.SUBTEXT(data.email) }
                        ${ TEMPLATE.SUBTEXT(data.contact_number) }
                    `
                }
            },
    
            // Date Applied
            {
                data: null,
                class: 'text-nowrap',
                render: data => {
                    const dateApplied = data.created_at;
                    return `
                        <div>${ formatDateTime(dateApplied, "MMM. D, YYYY") }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(dateApplied)) }               
                    `
                }
            },
    
            // User Actions
            {
                data: null,
                render: data => {
                    return TEMPLATE.DT.OPTIONS(`
                        <div 
                            class="dropdown-item d-flex" 
                            role="button" 
                            onclick="viewApplicantDetails('${ data.applicant_id }')"
                        >
                            <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                            <div>View Details</div>
                        </div>
                    `)
                }
            }
        ]
    });
    showElement('#rejectedApplicantsDT');
}


ifSelectorExist('#applicantsPerJob', () => {
    const menu = URL_QUERY_PARAMS.get('menu');
    const menus = {
        'for-evaluation': {
            loadDT: () => loadApplicantsForEvaluationDT(),
            activeMenu: '#forEvaluationMenu'
        },
        'evaluated': {
            loadDT: () => loadEvaluatedApplicantsDT(),
            activeMenu: '#evaluatedMenu'
        },
        'rejected': {
            loadDT: () => loadRejectedApplicantsDT(),
            activeMenu: '#rejectedMenu'
        } 
    };

    // Hide all tables
    const hideTables = () => {
        hideElement('#applicantsForEvaluationDT');
        hideElement('#evaluatedApplicantsDT');
        hideElement('#rejectedApplicantsDT');
    }
    
    const destroyDT = () => {
        if(URL_QUERY_PARAMS.get('menu') === 'for-evaluation') {
            $('#applicantsForEvaluationDT').dataTable().fnClearTable();
            $('#applicantsForEvaluationDT').dataTable().fnDestroy();
        }
        if(URL_QUERY_PARAMS.get('menu') === 'evaluated') {
            $('#evaluatedApplicantsDT').dataTable().fnClearTable();
            $('#evaluatedApplicantsDT').dataTable().fnDestroy();
        }
        if(URL_QUERY_PARAMS.get('menu') === 'rejected') {
            $('#rejectedApplicantsDT').dataTable().fnClearTable();
            $('#rejectedApplicantsDT').dataTable().fnDestroy();
        }
    }

    // Load the datatable
    hideTables();
    menus[menu].loadDT();

    // Set menus to unactive
    const setActiveMenu = (selector) => {
        $('#forEvaluationMenu').removeClass('text-primary');
        $('#evaluatedMenu').removeClass('text-primary');
        $('#rejectedMenu').removeClass('text-primary');
        $(selector).addClass('text-primary');
    }

    setActiveMenu(menus[menu].activeMenu);
    
    onClick('#forEvaluationMenu', () => {
        if(URL_QUERY_PARAMS.get('menu') !== 'for-evaluation') {
            destroyDT();
            hideTables();
            loadApplicantsForEvaluationDT();
            setActiveMenu('#forEvaluationMenu');
            URL_QUERY_PARAMS.set('menu', 'for-evaluation');
            history.replaceState(null, null, "?"+URL_QUERY_PARAMS.toString());
        }
    });

    onClick('#evaluatedMenu', () => {
        if(URL_QUERY_PARAMS.get('menu') !== 'evaluated') {
            destroyDT();
            hideTables();
            loadEvaluatedApplicantsDT();
            setActiveMenu('#evaluatedMenu');
            URL_QUERY_PARAMS.set('menu', 'evaluated');
            history.replaceState(null, null, "?"+URL_QUERY_PARAMS.toString());
        }
    });

    onClick('#rejectedMenu', () => {
        if(URL_QUERY_PARAMS.get('menu') !== 'rejected') {
            destroyDT();
            hideTables();
            loadRejectedApplicantsDT();
            setActiveMenu('#rejectedMenu');
            URL_QUERY_PARAMS.set('menu', 'rejected');
            history.replaceState(null, null, "?"+URL_QUERY_PARAMS.toString());
        }
    });
});


/**
 * ==============================================================================
 * APPLICANT EVALUATION
 * ==============================================================================
*/

/** View Applicant Details */
const evaluateApplicant = (applicantID) => {
    GET_ajax(`${ ROUTE.API.R }applicants/${ applicantID }`, {
        success: result => {

            /** APPLICANT DETAILS */
            setValue('#applicantIDForEval', result.applicant_id)
            setContent({
                '#applicantFullNameForEval': formatName('F M. L, S', {
                    firstName  : result.first_name,
                    middleName : result.middle_name,
                    lastName   : result.last_name,
                    suffixName : result.suffixName
                }),
                '#applicantContactNumberForEval': result.contact_number,
                '#applicantEmailForEval': result.email
            })

            // Set Resume Link
            $('#viewResumeBtnForEval').attr('href', `${ URL_RESUME_FILES }${ result.resume }`);


            /** APPLICANT TIMELINE */
            setApplicantTimeline('#applicantTimelineForEval', result);

            // Remove Applicant Timeline Loader
            hideElement('#applicantTimelineLoaderForEval');
            showElement('#applicantTimelineForEval');

            /** Show Modal */
            showModal('#evaluateApplicantModal');
        },
        error: () => toastr.error('There was an error in getting applicant details')
    });
}

/** If user select reject for evaluation */
$("#approveForScreening, #rejectFromEvaluation").on('change', () => {
    const requestStatus = $(`input[name="applicantStatus"]:checked`).val();
    if(requestStatus == "For screening") hideElement("#remarksField");
    if(requestStatus == "Rejected from evaluation") showElement("#remarksField");
    ifSelectorExist('#submitBtn', () => enableElement('#submitBtn'));
});

/** On Applicant details modal is going to be hidden  */
onHideModal('#evaluateApplicantModal', () => {
    resetForm('#applicantEvaluationForm');
    hideElement("#remarksField");
    disableElement('#submitBtn');
    showElement('#applicantTimelineLoaderForEval');
    hideElement('#applicantTimelineForEval');
    $('#applicantDetailsTabForEval').tab('show');
});

/** Validate Applicant Evaluation Form */
validateForm('#applicantEvaluationForm', {
    rules: {
        applicantID: { required: true },
        applicantStatus: { required: true },
        remarks: { required: true }
    },
    messages: {
        applicantID: { required: "This must have a value" },
        applicantStatus: { required: "Please select a status for this applicant" },
        remarks: { required: "You must insert remarks here for rejected this applicant from evaluation" }
    },
    submitHandler: () => saveApplicantEvaluation()
});

/** Evaluate Applicant */
const saveApplicantEvaluation = () => {
    
    // Buttons to loading state
    btnToLoadingState('#submitBtn');
    disableElement('#applicationDetailsCloseModalBtn');

    // Get Form Data
    const formData = generateFormData('#applicantEvaluationForm');
    const get = (name) => { return formData.get(name) }

    // Get Data
    const applicantStatus = get('applicantStatus');
    const data = {
        status: applicantStatus,
        remarks: applicantStatus === 'Rejected from evaluation' ? get('remarks') : null
    }

    // If error
    const ifError = () => {

        // Hide Applicant Details Modal
        hideModal('#applicantDetailsModal');

        // Set modal buttons to unload state
        btnToUnloadState('#submitBtn', TEMPLATE.LABEL_ICON('Submit', 'check'));
        enableElement('#applicationDetailsCloseModalBtn');

        // Show error alert
        toastr.error('There was an error while updating applicant evaluation');
    }

    // Evaluate applicant
    PUT_ajax(`${ ROUTE.API.R }applicants/${ get('applicantID') }`, data, {
        success: result => {
            if(result) {

                // Hide Applicant Details Modal
                hideModal('#evaluateApplicantModal');

                // Set modal buttons to unload state
                btnToUnloadState('#submitBtn', TEMPLATE.LABEL_ICON("Submit", "check"));
                enableElement('#applicationDetailsCloseModalBtn');

                // Reload Applicants Per Job Analytics
                applicantsPerJobAnalytics();

                // Reload DataTable
                reloadDataTable('#applicantsForEvaluationDT');

                // Show Info Alert
                toastr.info('An applicant is successfully evaluated');
            } else ifError()
        },
        error: () => ifError()
    });
}

