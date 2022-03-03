"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
*/

// Get Job Post ID from the URL
const jobPostID = getPathnamePart(3);


/**
 * ==============================================================================
 * JOB POST SUMMARY
 * ==============================================================================
*/

/** Set Job Post Summary */
ifSelectorExist('#jobPostSummary', () => {
    GET_ajax(`${ ROUTE.API.H }job-posts/${ jobPostID }`, {
        success: result => {
            const manpowerRequest = result.manpower_request

            // Set Job Post Position
            setContent('#position', manpowerRequest.vacant_position.name);

            // Set Job Post Status
            setContent('#jobPostStatus', () => {
                const expiresAt = result.expiration_date;
                if(isEmptyOrNull(expiresAt) || isAfterToday(expiresAt))
                    return TEMPLATE.DT.BADGE('info', 'On Going');
                else if(isBeforeToday(expiresAt))
                    return TEMPLATE.DT.BADGE('danger', 'Ended');
                else
                    return TEMPLATE.DT.BADGE('warning', 'Last day today');
            });

            //  Set Job Posted At
            setContent('#jobPostedAt',`Posted ${ formatDateTime(result.created_at, 'Date') }`);

            // Set Staff needed
            setContent('#staffsNeeded', () => {
                const staffsNeeded = manpowerRequest.staffs_needed;
                return `${ staffsNeeded } new ${ pluralize('staff', staffsNeeded) }`;
            });
            
            // Set Employment Type
            setContent('#employmentType', manpowerRequest.employment_type.name);

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
 * VIEW ALL APPLICANTS
 * ==============================================================================
*/

/** Initialize Applicants DataTable */
initDataTable('#applicantsDT', {
    // debugMode: true,
    url: `${ ROUTE.API.H }applicants`,
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
                        return TEMPLATE.DT.BADGE('light', 'Invalid data')
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
                `)
            }
        }
    ]
});

/**
 * ==============================================================================
 * VIEW APPLICANT DETAILS
 * ==============================================================================
*/

/** View Applicant Details */
const viewApplicantDetails = (applicantID) => {
    GET_ajax(`${ ROUTE.API.H }applicants/${ applicantID }`, {
        success: result => {

            /** APPLICANT DETAILS */
            setValue('#applicantID', result.applicant_id);
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
    resetForm('#applicantEvaluationForm');
    hideElement("#remarksField");
    showElement('#applicantTimelineLoader');
    hideElement('#applicantTimeline');
    $('#applicantDetailsTab').tab('show');
});


/**
 * ==============================================================================
 * APPLICANTS ANALYTICS
 * ==============================================================================
*/

// Applicants Analytics
const applicantsAnalytics = () => {
    GET_ajax(`${ ROUTE.API.H }applicants/analytics`, {
        success: result => {
            setContent({
                '#totalApplicantsCount': formatNumber(result.total),
                '#forEvaluationCount': formatNumber(result.for_evaluation),
                '#hiredApplicantsCount': formatNumber(result.hired),
                '#forScreeningCount': formatNumber(result.for_screening),
                '#forInterviewCount': formatNumber(result.for_interview),
                '#rejectedApplicantsCount': formatNumber(result.rejected.total)
            });
        },
        error: () => toastr.error('There was an error in getting applciants analytics')
    });
}

ifSelectorExist('#applicantsAnalytics', () => applicantsAnalytics());


/**
 * ==============================================================================
 * APPLICANTS PER JOB ANALYTICS
 * ==============================================================================
*/

// Applicants Per Job Analytics
const applicantsPerJobAnalytics = () => {
    GET_ajax(`${ ROUTE.API.H }job-posts/${ jobPostID }/applicants/analytics`, {
        success: result => {

            // Show Count or Hide Element
            const c = (obj) => Object.keys(obj).forEach(key => {
                if(obj[key] > 0) {
                    setContent(key, formatNumber(obj[key]));
                    showElement(key);
                } else hideElement(key);
            });

            c({
                '#totalApplicantsCount': result.total,
                '#forScreeningCount': result.for_screening,
                '#forInterviewCount': result.for_interview,
                '#interviewedApplicantsCount': result.interviewed,
                '#hiredCount': result.hired,
                '#rejectedCount': formatNumber(
                    result.rejected.from_screening 
                    + result.rejected.from_interview
                )
            });

            // Remove Loader in the menus
            $('#menuLoader').remove();
            showElement('#menu');
        },
        error: () => toastr.error('There was an error in getting applciants analytics')
    });
}

ifSelectorExist('#applicantsMenu', () => applicantsPerJobAnalytics());


/**
 * ==============================================================================
 * VIEW APPLICANT DETAILS
 * ==============================================================================
*/

/** Set Applicant Details */
const setApplicantDetailsAndTimeline = (result) => {

    /** APPLICANT DETAILS */

    // Set Applicant Full Name
    setContent({
        '#applicantFullName': formatName('F M. L, S', {
            firstName  : result.first_name,
            middleName : result.middle_name,
            lastName   : result.last_name,
            suffixName : result.suffix_name
        }),
        "#applicantContactNumber": result.contact_number,
        "#applicantEmail": result.email,
    });

    // Set Resume
    $('#viewResumeBtn').attr('href', `${ URL_RESUME_FILES }${ result.resume }`);


    /** APPLICANT TIMELINE */
    setApplicantTimeline('#applicantTimeline', result);

    // Remove Applicant Timeline Loader
    hideElement('#applicantTimelineLoader');
    showElement('#applicantTimeline');
}

/** View Screening Applicant Details */
const viewScreeningApplicantDetails = (applicantID) => {
    GET_ajax(`${ ROUTE.API.H }applicants/${ applicantID }`, {
        success: result => {

            // Set Applicant ID
            setValue('#applicantID', result.applicant_id)

            // Set Applicants Details and Timeline
            setApplicantDetailsAndTimeline(result);

            // Show Applicants Details Modal
            showModal('#applicantDetailsModal');
        },
        error: () => toastr.error('There was an error in getting applicant details')
    });
}

/** View For Interview Applicant Details */
const viewForInterviewApplicantDetails = (applicantID) => {
    GET_ajax(`${ ROUTE.API.H }applicants/${ applicantID }`, {
        success: result => {

            // Set Applicant ID
            setValue('#applicantID', result.applicant_id);

            // Set Applicant Details and Timeline
            setApplicantDetailsAndTimeline(result);

            // Show Applicants Details Modal
            showModal('#applicantDetailsModal');
        },
        error: () => toastr.error('There was an error in getting applicant details')
    });
}

/** View Interviewed Applicant Details */
const viewInterviewedApplicantDetails = (applicantID) => {
    GET_ajax(`${ ROUTE.API.H }applicants/${ applicantID }/interviewee-info`, {
        success: result => {

            // Set Applicant ID
            setValue('#applicantID', result.applicant_id);

            // Set Applicant Details and Timeline
            setApplicantDetailsAndTimeline(result);

            // Set ScoreSheet
            setContent('#applicantScoresheet', '');
            const scores = result.interviewee_info.interview_scores;
            let sum = 0;

            const interviewQuestionTypeBadge = {
                "General": `<span class="badge border border-primary text-primary">General</span>`,
                "Added": `<span class="badge border border-secondary text-secondary">Added</span>`
            };

            scores.forEach((s, i) => {
                const score = s.score;
                sum+=score;

                $('#applicantScoresheet').append(`
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

            $('#applicantScoresheet').append(`
                <tr>
                    <td colspan="2" class="text-right font-weight-bold">Average</td>
                    <td class="text-right font-weight-bold">${ formatNumber(sum/scores.length) }%</td>
                </tr>
            `);

            showModal('#applicantDetailsModal');
        },
        error: () => toastr.error('There was a problem in getting the applicant details')
    })
}

/** View Hired Applicant Details */
const viewHiredApplicantDetails = (applicantID) => {
    GET_ajax(`${ ROUTE.API.H }applicants/${ applicantID }`, {
        success: result => {
            
            // Set Applicant Details and Timeline
            setApplicantDetailsAndTimeline(result);

            // Show Applicants Details Modal
            showModal('#applicantDetailsModal');
        },
        error: () => toastr.error('There was an error in getting hired applicant details')
    })
}

/** View Rejected Applicant Details */
const viewRejectedApplicantDetails = (applicantID) => {
    GET_ajax(`${ ROUTE.API.H }applicants/${ applicantID }`, {
        success: result => {

            // Set Applicant Details and Timeline
            setApplicantDetailsAndTimeline(result);

            // Show Applicants Details Modal
            showModal('#applicantDetailsModal');
        },
        error: () => toastr.error('There was an error in getting rejected applicants details')
    })
}


/**
 * ==============================================================================
 * FOR SCREENING APPLICANTS
 * ==============================================================================
*/

/** Applicants for Screening DataTable */
initDataTable('#applicantsForScreeningDT', {
    url: `${ ROUTE.API.H }job-posts/${ jobPostID }/applicants/for-screening`,
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
                        onclick="viewScreeningApplicantDetails('${ data.applicant_id }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Details</div>
                    </div>
                `)
            }
        }
    ]
});


/**
 * ==============================================================================
 * SCREEN APPLICANTS
 * ==============================================================================
*/

/** If user select reject for evaluation */
$("#approveForInterview, #rejectFromScreening").on('change', () => {
    const requestStatus = $(`input[name="applicantStatus"]:checked`).val();
    if(requestStatus == "For interview") hideElement("#remarksField");
    if(requestStatus == "Rejected from screening") showElement("#remarksField");
    ifSelectorExist('#submitBtn', () => enableElement('#submitBtn'));
});

/** On Applicant details modal is going to be hidden  */
onHideModal('#applicantDetailsModal', () => {
    resetForm('#applicantScreeningForm');
    hideElement("#remarksField");
    disableElement('#submitBtn');
    $('#applicantDetailsTab').tab('show');
});

/** Validate Applicant Screening Form */
validateForm('#applicantScreeningForm', {
    rules: {
        applicantID: { required: true },
        applicantStatus: { required: true },
        remarks: { required: true }
    },
    messages: {
        applicantID: { required: "This must have a value" },
        applicantStatus: { required: "Please select a status for this applicant" },
        remarks: { required: "You must insert remarks here for rejected this applicant from screening" }
    },
    submitHandler: () => {
        screenApplicant();
        return false;
    }
});

/** Screen Applicant */
const screenApplicant = () => {

    // Set Buttons to loading state
    btnToLoadingState('#submitBtn');
    disableElement('#closeApplicantDetailsModalBtn');

    // Generate form data
    const formData = generateFormData('#applicantScreeningForm');
    const get = (name) => { return formData.get(name) }

    const applicantStatus = get('applicantStatus')

    // Set Data
    const data = {
        status: applicantStatus,
        remarks: applicantStatus === 'Rejected from screening' ? get('remarks') : null
    }

    // If error
    const ifError = () => {
        hideModal('#applicantDetailsModal');
        toastr.error('There was an error while updating applicant evaluation');
    }

    // Update applicant status
    PUT_ajax(`${ ROUTE.API.H }applicants/${ get('applicantID') }/screen`, data, {
        success: result => {
            if(result) {

                // Show Info Alert
                isChecked('#approveForInterview')
                    ? toastr.success('An applicant is screened and approved for interview')
                    : toastr.info('An applicant is rejected from screening')

                // Hide Applicant Details Modal
                hideModal('#applicantDetailsModal');

                // Set buttons to default
                setContent('#submitBtn', TEMPLATE.LABEL_ICON('Submit', 'check'));
                enableElement('#closeApplicantDetailsModalBtn');

                // Reload Applicants Per Job Analytics
                applicantsPerJobAnalytics();

                // Reload DataTable
                reloadDataTable('#applicantsForScreeningDT');
            } else ifError()
        },
        error: () => ifError()
    });
}


/**
 * ==============================================================================
 * FOR INTERVIEW APPLICANTS
 * ==============================================================================
*/

/** Applicants for Interview DataTable */
initDataTable('#applicantsForInterviewDT', {
    // debugMode: true,
    url: `${ ROUTE.API.H }job-posts/${ jobPostID }/applicants/for-interview`,
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

        // Status
        {
            data: null,
            render: data => {
                const intervieweeInfo = data.interviewee_info;
                if(isEmptyOrNull(intervieweeInfo))
                    return TEMPLATE.DT.BADGE('warning', 'No schedule yet')
                else if(intervieweeInfo.interviewee_schedule != [] && isEmptyOrNull(intervieweeInfo.is_interviewed))
                    return TEMPLATE.DT.BADGE('info', 'Schedule is set')
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
                        onclick="viewForInterviewApplicantDetails('${ data.applicant_id }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Details</div>
                    </div>
                `)
            }
        }
    ]
});

/** Get Interview Schedules Per Job Post */
const getInterviewSchedulesPerJobPost = () => {
    GET_ajax(`${ ROUTE.API.H }job-posts/${ jobPostID }/interview-schedules`, {
        success: result => {
            if(result) {

                // Set Schedules
                let schedules = '';
                if(result.length > 0) {
                    
                    // Set number of schedules
                    setContent('#scheduleCountDetails', () => {
                        const c = result.length;
                        return `You already have ${ c } schedule${ c > 1 ? 's' : '' } in total.`
                    });

                    result.forEach(r => {
                        const startSession = moment(`${ r.scheduled_date } ${ r.start_session }`);
                        const endSession = moment(`${ r.scheduled_date } ${ r.end_session }`);
                        
                        const momentDetails = () => {
                            if(moment().isSame(r.scheduled_date, 'date')) {
                                if(isAfterToday(startSession) && isAfterToday(endSession)) {
                                    return `
                                        <div class="badge badge-warning mr-2">Will happen soon</div>
                                        ${ TEMPLATE.SUBTEXT(`Started ${ fromNow(startSession) }`) }
                                    `
                                } else if(isBeforeToday(startSession) && isAfterToday(endSession)) {
                                    return `
                                        <div class="badge badge-info mr-2">On going</div>
                                        ${ TEMPLATE.SUBTEXT(`Started ${ fromNow(startSession) }`) }
                                    `
                                } else {
                                    return `
                                        <div class="badge badge-danger mr-2">Ended today</div>
                                        ${ TEMPLATE.SUBTEXT(fromNow(endSession)) }
                                    `
                                }
                            } else if(isAfterToday(startSession)) {
                                return TEMPLATE.SUBTEXT(fromNow(startSession))
                            } else {
                                return `
                                    <div class="badge badge-danger mr-2">Ended</div>
                                    ${ TEMPLATE.SUBTEXT(fromNow(endSession)) }
                                `
                            }
                        }

                        const intervieweesCount = r.interviewees.length;

                        schedules += `
                            <div class="callout callout-info">
                                <h5 class="mb-0">${ formatDateTime(r.scheduled_date, 'Full Date') }</h5>
                                <h5 class="mb-0">${ formatDateTime(startSession, 'Time') } - ${ formatDateTime(endSession, 'Time') }</h5>
                                <div class="d-flex align-items-center">
                                    ${momentDetails()}
                                </div>
    
                                <div class="row mt-2">
                                    <div class="col">
                                        <div>${ intervieweesCount } applicant${ intervieweesCount > 1 ? 's' : '' } are scheduled</div>
                                    </div>
                                    <div class="col">
                                        <div class="text-right">
                                            <a 
                                                class="btn btn-sm btn-secondary text-white" style="text-decoration: none" 
                                                href="${ ROUTE.WEB.H }interview-schedules/${ r.interview_schedule_id }"
                                            >
                                                ${ TEMPLATE.ICON_LABEL('list', 'View Details') }
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    });
                } else {
                    setContent('#scheduleCountDetails', 'No schedule has been set yet');

                    schedules = `
                        <div class="py-5 text-center">
                            <h3>There are no schedules yet</h3>
                            <p class="text-secondary">You may create by clicking the button above</p>
                        </div>
                    `
                }
                setContent('#interviewSchedules', schedules);
            } else toastr.error('There was an error in getting interview schedules')
        },
        error: () => toastr.error('There was an error in getting interview schedules')
    });
}

/** For Interview Schedules */
ifSelectorExist('#interviewSchedules', () => getInterviewSchedulesPerJobPost());

onClick('#custom-content-below-applicants-tab', () => reloadDataTable('#applicantsForInterviewDT'));
onClick('#custom-content-below-schedules-tab', () => getInterviewSchedulesPerJobPost());


/**
 * ==============================================================================
 * CREATE SCHEDULE
 * ==============================================================================
*/

let selectApplicant = $('#selectApplicant'), selectedApplicants = [];

/** If Create Interview Schedule Form is loaded */
ifSelectorExist('#createInterviewScheduleForm', () => {
    GET_ajax(`${ ROUTE.API.H }job-posts/${ jobPostID }/applicants/for-interview`, {
        success: result => {
            selectApplicant.empty();
            selectApplicant.append(`<option></option>`);

            if(result.length > 0) {
                result.forEach(i => {
                    const intervieweeInfo = i.interviewee_info;

                    if(isEmptyOrNull(intervieweeInfo)) {
                        const applicantName = formatName('F M. L, S', {
                            firstName  : i.first_name,
                            middleName : i.middle_name,
                            lastName   : i.last_name,
                            suffixName : i.suffix_name
                        });
                        selectApplicant.append(`<option value="${ i.applicant_id }">${ applicantName }</option>`);
                    }
                });
            } else selectApplicant.append(`<option disabled>No applicants were found</option>`);
            
            $('#selectApplicant').select2({
                placeholder: "Please select applicant here and add",
            });
        },
        error: () => toastr.error('There was an error in getting applicants')
    });

    selectApplicant.on('change', () => isEmptyOrNull(selectApplicant.val()) ? disableElement('#addApplicantBtn') : enableElement('#addApplicantBtn'));

    $('#addApplicantBtn').on('click', () => {
        btnToLoadingState('#addApplicantBtn');
        disableElement('#selectApplicant');

        const selectedApplicant = selectApplicant.val();

        GET_ajax(`${ ROUTE.API.H }applicants/${ selectedApplicant }/interviewee-info`, {
            success: result => {
                const intervieweeFullName = formatName('F M. L, S', {
                    firstName  : result.first_name,
                    middleName : result.middle_name,
                    lastName   : result.last_name,
                    suffixName : result.suffix_name
                });

                const dtBody = $('#selectedApplicantsDTBody');

                if(selectedApplicants.length == 0) dtBody.empty();

                dtBody.append(`
                    <tr id="interviewee-${ result.applicant_id }">
                        <td class="w-100">
                            <div>${ intervieweeFullName }</div>
                            ${ TEMPLATE.SUBTEXT(result.email) }
                            ${ TEMPLATE.SUBTEXT(result.contact_number) }
                        </td>
                        <td class="text-center">
                            <a 
                                href="${ BASE_URL_WEB }static/app/files/resumes/${ result.resume }" 
                                class="btn btn-sm btn-secondary text-nowrap"
                                target="_blank"
                            >
                                <span class="d-none d-md-inline-block">View Resume</span>
                                <i class="fas fa-file-alt ml-md-1"></i>
                            </a>
                        </td>
                        <td class="text-center">
                            <button 
                                type="button" 
                                class="btn btn-sm btn-danger" 
                                onclick="removeApplicant('${ result.applicant_id }')"
                            >
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `);

                selectedApplicants.push(`${ result.applicant_id }`);

                if(selectedApplicants.length > 0) enableElement('#saveBtn');

                $(`#selectApplicant option[value='${ result.applicant_id }']`).prop('disabled', true).trigger('change');

                selectApplicant.val('').trigger('change');

                setContent('#addApplicantBtn', TEMPLATE.LABEL_ICON('Add', 'plus'));
                enableElement('#selectApplicant');
            },
            error: () => {
                toastr.error('There was na error in getting applicant details');
                btnToUnloadState('#addApplicantBtn', TEMPLATE.LABEL_ICON('Add', 'plus'));
            }
        });
    });
});

/** Remove Applicant */
const removeApplicant = (applicantID) => {
    showModal('#confirmRemoveApplicantModal');
    setValue('#applicantID', applicantID);
}

/** Validate Confirm Remove Applicant Form */
validateForm('#confirmRemoveApplicantForm', {
    rules: {
        applicantID: { required: true }
    },
    messages: {
        applicantID: { required: 'This must have a value' }
    },
    submitHandler: () => {
        const applicantID = generateFormData('#confirmRemoveApplicantForm').get('applicantID');

        selectedApplicants = jQuery.grep(selectedApplicants, value => { return value != applicantID });
        $(`#interviewee-${ applicantID }`).remove();
        $(`#selectApplicant option[value='${ applicantID }']`).prop('disabled', false).trigger('change');

        if(selectedApplicants.length == 0) {
            setContent('#selectedApplicantsDTBody', `
                <tr>
                    <td colspan="3">
                        <div class="py-5 text-center">
                            <h3>No applicants has been added</h3>
                            <div class="text-secondary">Applicants that you are going to add will display here</div>
                        </div>
                    </td>
                </tr>
            `);
            disableElement('#saveBtn');
        }

        hideModal('#confirmRemoveApplicantModal');
        toastr.info('An applicant has been removed from the list');
        return false;
    }
});

/** When Confirm Remove Applicant Modal is hidden */
onHideModal('#confirmRemoveApplicantModal', () => resetForm('#confirmRemoveApplicantForm'));

/** Validate Create Schedule Form */
validateForm('#createInterviewScheduleForm', {
    rules: {
        scheduledDate: {
            required: true,
            afterToday: true
        },
        startSession: {
            required: true,
            beforeTime: '#endSession'
        },
        endSession: {
            required: true,
            afterTime: '#startSession'
        }
    },
    messages: {
        scheduledDate: {
            required: 'Please select the date for your schedule',
            afterToday: 'This must be in the future'
        },
        startSession: {
            required: 'Please select the time where session starts',
            beforeTime: 'Start session must be before the set end session'
        },
        endSession: {
            required: 'Please select the time where session end',
            afterTime: 'End session must be after the set start session'
        }
    },
    submitHandler: () => {
        showModal('#confirmCreateInterviewScheduleModal');
        return false;
    }
});

/** Create Schedule Button */
onClick('#createScheduleBtn', () => {
    btnToLoadingState('#createScheduleBtn');
    disableElement('#cancelConfirmCreateInterviewScheduleBtn');

    const formData = generateFormData('#createInterviewScheduleForm');
    const get = (n) => { return formData.get(n) }

    let interviewees = [];
    selectedApplicants.forEach(a => interviewees.push({applicant_id: a}));

    const data = {
        job_post_id: jobPostID,
        scheduled_date: get('scheduledDate'),
        start_session: get('startSession'),
        end_session: get('endSession'),
        interviewees: interviewees
    }

    POST_ajax(`${ ROUTE.API.H }interview-schedule`, data, {
        success: result => {
            if(result) {
                setSessionedAlertAndRedirect({
                    theme: "success",
                    message: "A new schedule is successfully created",
                    redirectURL: `${ ROUTE.WEB.H }job-posts/${ jobPostID }/applicants/for-interview`
                });
            }
        },
        error: () => {
            hideModal('#confirmCreateInterviewScheduleModal');
            btnToUnloadState('#createScheduleBtn', TEMPLATE.LABEL_ICON('Yes, create it!', 'check'));
            enableElement('#cancelConfirmCreateInterviewScheduleBtn');
            toastr.error('There was an error in creating an interview schedule');
        }
    });
});


/**
 * ==============================================================================
 * INTERVIEWED APPLICANTS
 * ==============================================================================
*/

/** Initalize Interviewed Applicants DataTable */
initDataTable('#interviewedApplicantsDT', {
    // debugMode: true,
    url: `${ ROUTE.API.H }job-posts/${ jobPostID }/applicants/interviewed`,
    columns: [

        // Created At (Hidden for default sorting)
        { data: 'created_at', visible: false},

        // Applicant Name
        {
            data: null,
            class: 'w-100',
            render: data => {
                const applicantFullName = formatName('F M. L, S', {
                    firstName  : data.first_name,
                    middleName : data.middle_name,
                    lastName   : data.last_name,
                    suffixName : data.suffix_name
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
                    <div>${ formatDateTime(dateApplied, 'MMM. D, YYYY') }</div>
                    ${ TEMPLATE.SUBTEXT(fromNow(dateApplied)) }
                `
            }
        },

        // Average Score
        {
            data: null,
            render: data => {
                const scores = data.interviewee_info.interview_scores;
                let sum = 0;
                scores.forEach(score => sum += score.score);
                const ave = sum/scores.length;
                return `<div class="text-right">${ formatNumber(ave) }%</div>`;
            }
        },

        // Actions
        {
            data: null,
            render: data => {
                return TEMPLATE.DT.OPTIONS(`
                    <div 
                        class="dropdown-item d-flex" 
                        role="button" 
                        onclick="viewInterviewedApplicantDetails('${ data.applicant_id }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Details</div>
                    </div>
                `)
            }
        }
    ]
});

/** If reject interview or hide applicant has been selected */
$('#rejectFromInterview, #hiredApplicant').on('change', () => {
    const requestStatus = $(`input[name="applicantStatus"]:checked`).val();
    if(requestStatus == "Hired") hideElement("#remarksField");
    if(requestStatus == "Rejected from interview") showElement("#remarksField");
    ifSelectorExist('#submitBtn', () => enableElement('#submitBtn'));
});

/** On Applicant Details Modal has been hidden */
onHideModal('#applicantDetailsModal', () => {
    resetForm('#applicantHiringForm');
    hideElement('#remarksField');
    disableElement('#submitBtn');
});

/** Validate Appicant Hiring Form */
validateForm('#applicantHiringForm', {
    rules: {
        applicantStatus: { required: true },
        remarks: { required: true }
    },
    messages: {
        applicantStatus: { required: 'Please select a status' },
        remarks: { required: 'Please insert remarks for rejecting this applicant' }
    },
    submitHandler: () => {
        hireOrRejectApplicant();
        return false;
    }
});

/** Hire or reject applicant */
const hireOrRejectApplicant = () => {

    // Set buttons to loading state
    btnToLoadingState('#submitBtn');
    disableElement('#cancelApplicantHiringBtn');

    // Get form data
    const formData = generateFormData('#applicantHiringForm');
    const get = (n) => { return formData.get(n) }

    // Get applicant data
    const applicantStatus = get('applicantStatus');
    const isRejected = applicantStatus === 'Rejected from interview';

    const rejectedAt = isRejected ? formatDateTime(moment()) : null;
    const remarks = isRejected ? get('remarks') : null;

    const data = {
        status: applicantStatus,
        rejected_at: rejectedAt,
        remarks: remarks
    }

    PUT_ajax(`${ ROUTE.API.H }applicants/${ get('applicantID') }/hire`, data, {
        success: result => {
            if(result) {

                //  Hide Applicant Details Modal
                hideModal('#applicantDetailsModal');

                // Reload DataTable
                reloadDataTable('#interviewedApplicantsDT');
                
                // Set buttons to unload state
                btnToUnloadState('#submitBtn', TEMPLATE.LABEL_ICON('Submit', 'check'));
                enableElement('#cancelApplicantHiringBtn');

                // Reload analytics
                applicantsPerJobAnalytics();

                // Show alert
                isRejected 
                    ? toastr.info('An applicant has been rejected from interview')
                    : toastr.success('An applicant is successfully hired')
            }
        },
        error: () => {
            
            //  Hide Applicant Details Modal
            hideModal('#applicantDetailsModal');

            // Set buttons to unload state
            btnToUnloadState('#submitBtn', TEMPLATE.LABEL_ICON('Submit', 'check'));
            enableElement('#cancelApplicantHiringBtn');

            // Show error alert
            toastr.error('There was an error in updating applicant status')
        }
    })
}

/**
 * ==============================================================================
 * HIRED APPLICANTS
 * ==============================================================================
*/

/** Hired Applicants DataTable */
initDataTable('#hiredApplicantsDT', {
    url: `${ ROUTE.API.H }job-posts/${ jobPostID }/applicants/hired`,
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
                        onclick="viewHiredApplicantDetails('${ data.applicant_id }')"
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
 * REJECTED APPLICANTS
 * ==============================================================================
*/

/** Rejected Applicants DataTable */
initDataTable('#rejectedApplicantsDT', {
    // debugMode: true,
    url: `${ ROUTE.API.H }job-posts/${ jobPostID }/applicants/rejected`,
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

        
        // Status
        {
            data: null,
            render: data => {
                return TEMPLATE.DT.BADGE('danger', TEMPLATE.ICON_LABEL('times', data.status));
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
                        onclick="viewRejectedApplicantDetails('${ data.applicant_id }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Details</div>
                    </div>
                `)
            }
        }
    ]
});


/**
 * ==============================================================================
 * REPLACE URL LINKS
 * ==============================================================================
*/

$('#forScreeningLink').on('click', () => location.replace(`${ ROUTE.WEB.H }job-posts/${ jobPostID }/applicants/for-screening`))
$('#forInterviewLink').on('click', () => location.replace(`${ ROUTE.WEB.H }job-posts/${ jobPostID }/applicants/for-interview`))
$('#interviewedLink').on('click', () => location.replace(`${ ROUTE.WEB.H }job-posts/${ jobPostID }/applicants/interviewed`))
$('#hiredLink').on('click', () => location.replace(`${ ROUTE.WEB.H }job-posts/${ jobPostID }/applicants/hired`))
$('#rejectedLink').on('click', () => location.replace(`${ ROUTE.WEB.H }job-posts/${ jobPostID }/applicants/rejected`))