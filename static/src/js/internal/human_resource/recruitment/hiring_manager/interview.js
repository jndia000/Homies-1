"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
 */

// Get interview schedule ID from URL
const interviewScheduleID = getPathnamePart(1);

// Get interviewee ID form URL
const intervieweeID = getPathnamePart(1);


/**
 * ==============================================================================
 * GET ALL GENERAL INTERVIEW QUESTIONS
 * ==============================================================================
 */

// Initialize General Interview Questions DataTable
initDataTable('#generalInterviewQuestionsDT', {
    url: `${ ROUTE.API.H }interview-questions/general`,
    columns: [
        
        // Created At (For default sorting)
        { data: 'created_at' , visible: false },

        // Question
        { data: 'question', class: 'w-100' },

        // Added At
        {
            data: null,
            class: 'text-nowrap',
            render: data => {
                const addedAt = data.created_at;
                return `
                    <div>${ formatDateTime(addedAt, 'MMM. D, YYYY') }</div>
                    ${ TEMPLATE.SUBTEXT(fromNow(addedAt)) }
                `
            }
        },

        // Actions
        {
            data: null,
            render: data => {
                const interviewQuestionID = data.interview_question_id;
                
                return TEMPLATE.DT.OPTIONS(`
                    <div 
                        class="dropdown-item d-flex"
                        role="button"
                        onclick="viewGenInterviewQuestionDetails('${ interviewQuestionID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Details</div>
                    </div>
                    <div 
                        class="dropdown-item d-flex"
                        role="button"
                        onclick="editGenInterviewQuestion('${ interviewQuestionID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-edit mr-1"></i></div>
                        <div>Edit Question</div>
                    </div>
                `)
            }
        }
    ]
});


/**
 * ==============================================================================
 * CREATE GENERAL INTERVIEW QUESTIONS
 * ==============================================================================
 */

// Validate Add General Interviwe Question Form
validateForm('#addGeneralInterviewQuestionForm', {
    rules: {
        question: { required: true }
    },
    messages: {
        question: { required: 'General interview question is required' }
    },
    submitHandler: () => addGeneralInterviewQuestion()
});

// Add General Interview Question
const addGeneralInterviewQuestion = () => {

    // Set buttons to loading state
    btnToLoadingState('#addGeneralInterviewQuestionBtn');
    disableElement('#cancelGeneralInterviewQuestionBtn');

    const formData = generateFormData('#addGeneralInterviewQuestionForm');

    const data = {
        question: formData.get('question'),
        type: "General"
    }

    POST_ajax(`${ ROUTE.API.H }interview-questions`, data, {
        success: result => {
            if(result) {

                // Hide modal
                hideModal('#addGeneralInterviewQuestionModal');

                // Set buttons to unload state
                btnToUnloadState('#addGeneralInterviewQuestionBtn', TEMPLATE.LABEL_ICON('Add', 'plus'));
                enableElement('#cancelGeneralInterviewQuestionBtn');

                // Reload DataTable
                reloadDataTable('#generalInterviewQuestionsDT');

                // Alert success message
                toastr.success('A new general interview question is successfully added');
            }
        },
        error: () => {
            
            // Hide Modal
            hideModal('#addGeneralInterviewQuestionModal');

            // Set buttons to unload state
            btnToUnloadState('#addGeneralInterviewQuestionBtn', TEMPLATE.LABEL_ICON('Add', 'plus'));
            enableElement('#cancelGeneralInterviewQuestionBtn');

            // Alert error message
            toastr.error('There was an error in creating a general interview question');
        }
    })
}

// When add general interview question modal is going to be hidden
onHideModal('#addGeneralInterviewQuestionModal', () => resetForm('#addGeneralInterviewQuestionForm'));


/**
 * ==============================================================================
 * GET ONE GENERAL INTERVIEW QUESTIONS
 * ==============================================================================
 */

/** View Interview Question Details */
const viewGenInterviewQuestionDetails = (interviewQuestionID) => {
    GET_ajax(`${ ROUTE.API.H }interview-questions/${ interviewQuestionID }`, {
        success: result => {
            if(result) {
                
                // Set Interview Question
                setContent('#interviewQuestion', result.question)
                
                // Set Added By
                setContent('#interviewQuestionAddedBy', () => {
                    const addedBy = result.interview_question_added_by;

                    const fullName = formatName('F M. L, S', {
                        firstName  : addedBy.first_name,
                        middleName : addedBy.middle_name,
                        lastName   : addedBy.last_name,
                        suffixName : addedBy.suffix_name
                    });

                    const position = addedBy.position;
                    return `
                        <div>${ fullName }</div>
                        ${ TEMPLATE.SUBTEXT(position.name) }
                        ${ TEMPLATE.SUBTEXT(position.sub_department.name) }
                    `
                });

                // Set Added At
                setContent('#interviewQuestionAddedAt', () => {
                    const addedAt = result.created_at;

                    return `
                        <div>${ formatDateTime(addedAt, 'Full Date') }</div>
                        <div>${ formatDateTime(addedAt, 'Time') }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(addedAt)) }
                    `
                })
                
                // Set Updated By
                setContent('#interviewQuestionUpdatedBy', () => {
                    const updatedBy = result.interview_question_updated_by;

                    const fullName = formatName('F M. L, S', {
                        firstName  : updatedBy.first_name,
                        middleName : updatedBy.middle_name,
                        lastName   : updatedBy.last_name,
                        suffixName : updatedBy.suffix_name
                    });

                    const position = updatedBy.position;

                    return `
                        <div>${ fullName }</div>
                        ${ TEMPLATE.SUBTEXT(position.name) }
                        ${ TEMPLATE.SUBTEXT(position.sub_department.name) }
                    `
                })
                
                // Set Updated At
                setContent('#interviewQuestionUpdatedAt', () => {
                    const updatedAt = result.updated_at;

                    return `
                        <div>${ formatDateTime(updatedAt, 'Full Date') }</div>
                        <div>${ formatDateTime(updatedAt, 'Time') }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(updatedAt)) }
                    `
                });

                showModal('#genInterviewQuestionDetailsModal');
            }
        },
        error: () => toastr.error('There was an error in getting a general interview question details')
    })
}


/** Edit General Interview Question */
const editGenInterviewQuestion = (interviewQuestionID) => {
    GET_ajax(`${ ROUTE.API.H }interview-questions/${ interviewQuestionID }`, {
        success: result => {
            setValue({
                '#interviewQuestionID': result.interview_question_id,
                '#questionForEdit': result.question
            });
            showModal('#editGeneralInterviewQuestionModal');
        },
        error: () => toastr.error('There was an erro in getting general interview question details')
    });
}


/** On edit general interview question modal has been hidden*/
onHideModal('#editGeneralInterviewQuestionModal', () => resetForm('#editGeneralInterviewQuestionForm'));

validateForm('#editGeneralInterviewQuestionForm', {
    rules: {
        question: { required: true }
    },
    messages: {
        question: { required: 'Interview question is required' }
    },
    submitHandler: () => {

        // Set buttons to loading state
        btnToLoadingState('#saveGenInterviewQuestionBtn');
        disableElement('#cancelGenInterviewQuestionBtnForEdit');

        // Generate Form Data
        const formData = generateFormData('#editGeneralInterviewQuestionForm');
        const data = { question: formData.get('question') }

        // Update Interview Question
        PUT_ajax(`${ ROUTE.API.H }interview-question/${ formData.get('interviewQuestionID') }`, data, {
            success: result => {
                if(result) {
                    // Reload DataTable
                    reloadDataTable('#generalInterviewQuestionsDT');

                    // Set buttons to unload state
                    btnToUnloadState('#saveGenInterviewQuestionBtn', TEMPLATE.LABEL_ICON('Save', 'check'));
                    enableElement('#cancelGenInterviewQuestionBtnForEdit');

                    // Hide modal
                    hideModal('#editGeneralInterviewQuestionModal');

                    // Show alert
                    toastr.info('An interview question is successfully updated');
                } else toastr.error('There was an error in updating interview question')
            },
            error: () => toastr.error('There was an error in updating interview question')
        });
        return false;
    }
});


/**
 * ==============================================================================
 * INTERVIEW SCHEDULES
 * ==============================================================================
 */

initDataTable('#interviewSchedulesDT', {
    url: `${ ROUTE.API.H }interview-schedules`,
    // debugMode: true,
    columns: [

        // Set At
        {
            data: null,
            visible: false,
            render: data => {
                return moment(`${ data.scheduled_date } ${ data.start_session }`).format();
            }
        }, 

        // Schedule
        {
            data: null, 
            render: data => {
                const scheduledDate = data.scheduled_date;
                const startSession = moment(`${ scheduledDate } ${ data.start_session }`);
                const endSession = moment(`${ scheduledDate } ${ data.end_session }`);

                return `
                    <div>${ formatDateTime(scheduledDate, 'Full Date') }</div>
                    <div>${ formatDateTime(startSession, 'Time') } - ${ formatDateTime(endSession, 'Time') }</div>
                `
            }
        },

        // For Job Post/Position
        { data: 'schedule_for.manpower_request.vacant_position.name' },

        // Number of Interviewees
        {
            data: null,
            render: data => {
                const interviewees = data.interviewees.length;
                return `${ interviewees } ${ pluralize('interviewee', interviewees) }`
            }
        },

        // Status
        {
            data: null,
            render: data => {

                const scheduledDate = data.scheduled_date;
                const startSession = moment(`${ scheduledDate } ${ data.start_session }`);
                const endSession = moment(`${ scheduledDate } ${ data.end_session }`);

                if(moment().isSame(scheduledDate, 'date')) {
                    if(isAfterToday(startSession) && isAfterToday(endSession)) {
                        return `
                            ${ TEMPLATE.DT.BADGE('warning', 'Will happen soon', 'mr-2') }
                            ${ TEMPLATE.SUBTEXT(`Started ${ fromNow(startSession) }`) }
                        `
                    } else if(isBeforeToday(startSession) && isAfterToday(endSession)) {
                        return `
                            ${ TEMPLATE.DT.BADGE('info', 'On going', 'mr-2') }
                            ${ TEMPLATE.SUBTEXT(`Started ${ fromNow(startSession) }`) }
                        `
                    } else {
                        return `
                            ${ TEMPLATE.DT.BADGE('danger', 'Ended today', 'mr-2') }
                            ${ TEMPLATE.SUBTEXT(fromNow(endSession)) }
                        `
                    }
                } else if(isAfterToday(startSession)) {
                    return `
                        ${ TEMPLATE.DT.BADGE('secondary', 'Soon', 'mr-2') }
                        ${ TEMPLATE.SUBTEXT(fromNow(startSession)) }
                    `
                } else {
                    return `
                        ${ TEMPLATE.DT.BADGE('danger', 'Ended', 'mr-2') }
                        ${ TEMPLATE.SUBTEXT(fromNow(endSession)) }
                    `
                }
            }
        },

        // Options
        {
            data: null,
            render: data => {
                return TEMPLATE.DT.OPTIONS(`
                    <a 
                        class="dropdown-item d-flex"
                        role="button"
                        href="${ ROUTE.WEB.H }interview-schedules/${ data.interview_schedule_id }"                  
                    >
                        <div style="width: 2rem"><i class="fas fa-calendar-alt mr-1"></i></div>
                        <div>
                            <div>View Details</div>
                            ${ TEMPLATE.SUBTEXT('View the details of this schedule') }
                        </div>
                    </a>
                `)
            }
        }
    ]
});



/**
 * ==============================================================================
 * INTERVIEW SCHEDULE DETAILS
 * ==============================================================================
 */

/** Interview Schedule Details */
ifSelectorExist('#interviewScheduleDetails', () => {
    GET_ajax(`${ ROUTE.API.H }interview-schedules/${ interviewScheduleID }`, {
        success: result => {

            /** SCHEDULE DETAILS */

            const scheduledDate = result.scheduled_date;
            const startSession = moment(`${ scheduledDate } ${ result.start_session }`);
            const endSession = moment(`${ scheduledDate } ${ result.end_session }`);

            // Set Scheduled Date
            setContent('#scheduledDate', formatDateTime(scheduledDate, 'Full Date'));

            // Set Session Range
            setContent('#sessionRange', `${ formatDateTime(startSession, 'Time') } - ${ formatDateTime(endSession, 'Time') }`);
            
            // Set Session Humanized
            const momentDetails = () => {
                if(moment().isSame(scheduledDate, 'date')) {
                    if(isAfterToday(startSession) && isAfterToday(endSession)) {
                        return `
                            ${ TEMPLATE.BADGE('warning', 'Will happen soon', 'mr-2') }
                            ${ TEMPLATE.SUBTEXT(`Started ${ fromNow(startSession) }`) }
                        `
                    } else if(isBeforeToday(startSession) && isAfterToday(endSession)) {
                        return `
                            ${ TEMPLATE.BADGE('info', 'On going', 'mr-2') }
                            ${ TEMPLATE.SUBTEXT(`Started ${ fromNow(startSession) }`) }
                        `
                    } else {
                        return `
                            ${ TEMPLATE.BADGE('danger', 'Ended today', 'mr-2') }
                            ${ TEMPLATE.SUBTEXT(fromNow(endSession)) }
                        `
                    }
                } else if(isAfterToday(startSession)) {
                    return `${ TEMPLATE.SUBTEXT(fromNow(startSession)) }`
                } else {
                    return `
                        ${ TEMPLATE.BADGE('danger', 'Ended', 'mr-2') }
                        ${ TEMPLATE.SUBTEXT(fromNow(endSession)) }
                    `
                }
            }
            setContent('#scheduledDateHumanized', momentDetails())

            // Remove Loaders
            $('#interviewScheduleDetailsLoader').remove();
            showElement('#interviewScheduleDetails');

            
            /** JOB POST DETAILS */

            const jobPost = result.schedule_for;

            // Set Vacant Position
            setContent('#vacantPosition', jobPost.manpower_request.vacant_position.name);

            // Set Posted At
            setContent('#jobPostedAt', `Posted ${ formatDateTime(jobPost.created_at, 'Full Date') }`);

            const staffsNeeded = jobPost.manpower_request.staffs_needed;
            
            // Set Staffs Needed
            setContent('#staffsNeeded', `${ staffsNeeded } new staff${ staffsNeeded > 1 ? 's' : '' }`);

            // Set Employment Type
            setContent('#employmentType', jobPost.manpower_request.employment_type.name);

            // Set Deadline
            const deadline = jobPost.manpower_request.deadline;
            isEmptyOrNull(deadline)
                ? setContent('#deadline', TEMPLATE.UNSET('No deadline', 'span'))
                : setContent('#deadline', formatDateTime(deadline, 'Full DateTime'))

                // Remove loaders
            $('#jobPostSummaryLoader').remove();
            showElement('#jobPostSummary');
        },
        error: () => toastr.error('There was an error in getting interview schedule details')
    });
});

/** Scheduled Interviewees DataTable */
initDataTable('#intervieweesDT', {
    // debugMode: true,
    url: `${ ROUTE.API.H }interview-schedules/${ interviewScheduleID }/interviewees`,
    columns: [

        // Created At (Hidden for default)
        { data: "created_at", visible: false },

        // Applicant
        {
            data: null,
            class: 'w-100',
            render: data => {
                const applicant = data.applicant_info;
                const applicantFullName = formatName('F M. L, S', {
                    firstName  : applicant.first_name,
                    middleName : applicant.middle_name,
                    lastName   : applicant.last_name,
                    suffixName : applicant.suffixName
                });
                return `
                    <div>${ applicantFullName }</div>
                    ${ TEMPLATE.SUBTEXT(applicant.email) }
                    ${ TEMPLATE.SUBTEXT(applicant.contact_number) }
                `
            }
        },

        // Date Applied
        {
            data: null,
            class: 'text-nowrap',
            render: data => {
                const appliedAt = data.applicant_info.created_at;
                return `
                    <div>${ formatDateTime(appliedAt, 'MMM. D, YYYY') }<div>
                    ${ TEMPLATE.SUBTEXT(fromNow(appliedAt)) }
                `
            }
        },

        // Status
        {
            data: null,
            render: data => {
                const isInterviewed = data.is_interviewed;
                if(isEmptyOrNull(isInterviewed))
                    return TEMPLATE.DT.BADGE('warning', TEMPLATE.ICON_LABEL('question', "Not interviewed yet"))
                else if(isInterviewed) {
                    const applicant_status = data.applicant_info.status;
                    if(applicant_status === "Hired" || applicant_status === "Contract signed")
                        return TEMPLATE.DT.BADGE('success', TEMPLATE.ICON_LABEL('handshake', "Hired"))
                    else
                        return TEMPLATE.DT.BADGE('success', TEMPLATE.ICON_LABEL('check', "Interviewed"))
                }
                else
                    return TEMPLATE.DT.BADGE('danger', TEMPLATE.ICON_LABEL('times', "Not Interviewed"))
            }
        },

        // Actions
        {
            data: null,
            render: data => {
                const intervieweeID = data.interviewee_id

                const viewIntervieweeDetails = () => {
                    return `
                        <div 
                            class="dropdown-item d-flex"
                            role="button"
                            onclick="viewIntervieweeDetails('${ intervieweeID }')"                  
                        >
                            <div style="width: 2rem"><i class="fas fa-user-tie mr-1"></i></div>
                            <div>
                                <div>View Interviewee Details</div>
                                ${ TEMPLATE.SUBTEXT('View the details of this interviewee') }
                            </div>
                        </div>
                    `
                }

                if(isEmptyOrNull(data.is_interviewed)) {
                    return TEMPLATE.DT.OPTIONS(`
                        ${ viewIntervieweeDetails() }
                        <div class="dropdown-divider"></div>
                        <a 
                            class="dropdown-item d-flex"
                            href="${ ROUTE.WEB.H }interview/${ intervieweeID }"                                  
                        >
                            <div style="width: 2rem"><i class="fas fa-tasks mr-1"></i></div>
                            <div>
                                <div>Interview this applicant</div>
                                ${ TEMPLATE.SUBTEXT('Set the questions and scores for interview') }
                            </div>
                        <a>
                        <div 
                            class="dropdown-item d-flex"
                            role="button"
                            onclick="markAsNotInterviewed('${ intervieweeID }')"
                        >
                            <div style="width: 2rem"><i class="fas fa-times mr-1"></i></div>
                            <div>Mark as Not Interviewed</div>
                        <div>
                    `)
                } else {
                    return TEMPLATE.DT.OPTIONS(`
                        ${ viewIntervieweeDetails() }
                    `)
                }
            }
        }
    ]
});

/** View Interviewee Details */
const viewIntervieweeDetails = (intervieweeID) => {
    GET_ajax( `${ ROUTE.API.H }interviewee/${ intervieweeID }`, {
        success: result => {
            const applicant = result.applicant_info;
            const applicant_status = applicant.status;
            
            console.log(result)

            /**
             * Load Interviewee Details
             * Not yet interviewed
             */
            const loadIntervieweeDetails = () => {

                // Set Applicant Details
                setContent({
                    '#intervieweeFullName': formatName('F M. L, S', {
                        firstName  : applicant.first_name,
                        middleName : applicant.middle_name,
                        lastName   : applicant.last_name,
                        suffixName : applicant.suffix_name
                    }),
                    '#intervieweeContactNumber': applicant.contact_number,
                    '#intervieweeEmail': applicant.email
                });

                // Set Resume
                $('#viewIntervieweeResumeBtn').attr('href', `${ URL_RESUME_FILES }${ applicant.resume }`);

                // Set Interview Now Button
                $('#interviewNowBtn').attr('href', `${ ROUTE.WEB.H }interview/${ result.interviewee_id }`)

                // Set Applicant Timeline
                setApplicantTimeline('#intervieweeTimeline', applicant);
                
                // Remove Applicant Timeline Loader
                hideElement('#intervieweeTimelineLoader');
                showElement('#intervieweeTimeline');

                // Show Modal
                showModal('#intervieweeDetailsModal');
            }

            /**
             * Load Interviewed Details
             * Interviewed Applicant
             */
            const loadInterviewedDetails = () => {
                
                // Set Applicant ID (For Hiring Or Reject)
                setValue('#interviewedApplicantID', applicant.applicant_id);

                // Set Applicant Details
                setContent({
                    '#interviewedFullName': formatName('F M. L, S', {
                        firstName  : applicant.first_name,
                        middleName : applicant.middle_name,
                        lastName   : applicant.last_name,
                        suffixName : applicant.suffix_name
                    }),
                    '#interviewedContactNumber': applicant.contact_number,
                    '#interviewedEmail': applicant.email
                });

                // Set Resume
                $('#viewApplicantResumeBtn').attr('href', `${ URL_RESUME_FILES }${ applicant.resume }`);

                // Set Applicant Timeline
                setApplicantTimeline('#interviewedTimeline', applicant);

                // Set Score Sheet
                setIntervieweeScoreSheet('#interviewedScoreSheet', result.interview_scores);
                
                // Remove Applicant Timeline Loader
                hideElement('#interviewedTimelineLoader');
                showElement('#interviewedTimeline');

                // Show Modal
                showModal('#interviewedDetailsModal');
            }

            /** 
             * Load Applicant Details 
             * Either Hired or Rejected
             */
            const loadApplicantDetails = () => {
                
                // Set Applicant Details
                setContent({
                    '#applicantFullName': formatName('F M. L, S', {
                        firstName  : applicant.first_name,
                        middleName : applicant.middle_name,
                        lastName   : applicant.last_name,
                        suffixName : applicant.suffix_name
                    }),
                    '#applicantContactNumber': applicant.contact_number,
                    '#applicantEmail': applicant.email
                });

                // Set Resume
                $('#viewApplicantResumeBtn').attr('href', `${ URL_RESUME_FILES }${ applicant.resume }`);

                // Set Applicant Timeline
                setApplicantTimeline('#applicantTimeline', applicant);

                // Set Score Sheet
                setIntervieweeScoreSheet('#applicantScoreSheet', result.interview_scores);
                
                // Remove Applicant Timeline Loader
                hideElement('#applicantTimelineLoader');
                showElement('#applicantTimeline');

                showModal('#applicantDetailsModal');
            }

            const isInterviewed = result.is_interviewed;
                if(isEmptyOrNull(isInterviewed))
                    loadIntervieweeDetails()
                else if(
                    isInterviewed && (
                        applicant_status === "Hired" || 
                        applicant_status === "Contract signed"
                    )
                )
                    loadApplicantDetails();
                else
                    loadInterviewedDetails();
        },
        error: () => toastr.error('There was an error in getting interviewee details')
    })
}

/** On Interviewee Details Modal has been hidden */
onHideModal('#intervieweeDetailsModal', () => {
    $('#intervieweeDetailsTab').tab('show');

    // Remove Applicant Timeline Loader
    showElement('#intervieweeTimelineLoader');
    hideElement('#intervieweeTimeline');
});


/** On Interviewed Details Modal has been hidden */
onHideModal('#interviewedDetailsModal', () => {
    $('#intervieweeDetailsTab').tab('show');

    // Reset Form
    resetForm('#interviewedApplicantHiringForm');

    // Set Score Sheet to Loading State
    setContent('#interviewedScoreSheet', `
        <tr>
            <td colspan="3">
                <div class="py-5 text-center">
                    <div class="spinner-border text-primary my-3">
                        <div class="sr-only">Loading ...</div>
                    </div>
                    <div class="text-secondary">Loading ...</div>
                </div>
            </td>
        </tr>
    `);

    // Remove Applicant Timeline Loader
    showElement('#interviewedTimelineLoader');
    hideElement('#interviewedTimeline');
});


/** On Interviewee Details Modal has been hidden */
onHideModal('#applicantDetailsModal', () => {
    $('#applicantDetailsTab').tab('show');

    // Set Score Sheet to Loading State
    setContent('#applicantScoreSheet', `
        <tr>
            <td colspan="3">
                <div class="py-5 text-center">
                    <div class="spinner-border text-primary my-3">
                        <div class="sr-only">Loading ...</div>
                    </div>
                    <div class="text-secondary">Loading ...</div>
                </div>
            </td>
        </tr>
    `);

    // Remove Applicant Timeline Loader
    showElement('#applicantTimelineLoader');
    hideElement('#applicantTimeline');
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
validateForm('#interviewedApplicantHiringForm', {
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
    const formData = generateFormData('#interviewedApplicantHiringForm');
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
                hideModal('#interviewedDetailsModal');

                // Reload DataTable
                reloadDataTable('#intervieweesDT');
                
                // Set buttons to unload state
                btnToUnloadState('#submitBtn', TEMPLATE.LABEL_ICON('Submit', 'check'));
                enableElement('#cancelApplicantHiringBtn');

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
    });
}


/** Mark as Not Interviewed */
const markAsNotInterviewed = (intervieweeID) => {
    showModal('#markAsNotInterviewedModal');
}


/** Validate Mark as not interviewed form */
validateForm('#markAsNotInterviewedForm', {
    rules: { remarks: { required: true }},
    messages: {
        remarks: {
            required: 'Please insert remarks about why this interviewee marked as not interviewed'
        }
    },
    submitHandler: () => {
        return false
    }
});


/** When validate mark as not interviewed modal has been hidden */
onHideModal('#markAsNotInterviewedModal', () => {
    resetForm('#markAsNotInterviewedForm');
});

/**
 * ==============================================================================
 * INTERVIEW SCORESHEET
 * ==============================================================================
 */

var generalQuestionInputs = [];
var addedQuestions = [];

/** Applicants Details */
ifSelectorExist('#applicantDetails', () => {
    GET_ajax(`${ ROUTE.API.H }interviewee/${ intervieweeID }`, {
        success: result => {
            const applicant = result.applicant_info;

            // Set Applicant Details
            setContent({
                '#intervieweeName': formatName('L, F M., S', {
                    firstName  : applicant.first_name,
                    middleName : applicant.middle_name,
                    lastName   : applicant.last_name,
                    suffixName : applicant.suffixName
                }),
                '#applyingFor': applicant.applied_job.manpower_request.vacant_position.name,
                '#applicantEmail': applicant.email,
                '#applicantContactNumber': applicant.contact_number,
                '#appliedDate': formatDateTime(applicant.created_at, 'Full Date'),
                '#appliedTime': formatDateTime(applicant.created_at, 'Time'),
                '#appliedAtHumanized': TEMPLATE.SUBTEXT(fromNow(applicant.created_at)),
            });

            // Set Resume
            $('#viewResumeBtn').attr('href', URL_RESUME_FILES+applicant.resume)

            // Components to loaded state
            $('#applicantDetailsLoader').remove();
            showElement('#applicantDetails');
        },
        error: () => toastr.error('There was an error in getting interviewee details')
    })
});

/** For General Interview Questions Table */
ifSelectorExist('#generalInterviewQuestionsForIntervieweeDT', () => {
    GET_ajax(`${ ROUTE.API.H }interview-questions/general`, {
        success: result => {
            $('#generalInterviewQuestionsForIntervieweeDTBody').empty();

            if(result.length > 0) {
                result.forEach(r => {
                    const inputName = `input${ r.interview_question_id.replace(/\-/g, '') }`;

                    $('#generalInterviewQuestionsForIntervieweeDTBody').append(`
                        <tr>
                            <td>
                                <p>${ r.question }</p>
                            </td>
                            <td>
                                <div class="form-group">
                                    <input 
                                        class="form-control form-control-border" 
                                        type="number" 
                                        min=0 
                                        max=100 
                                        name="${ inputName }"
                                        placeholder="%"
                                        required
                                    >
                                </div>
                            </td>
                            <td>
                                ${ TEMPLATE.DT.OPTIONS(`
                                    <div 
                                        class="dropdown-item d-flex"
                                        role="button"
                                        onclick="removeGeneralQuestion('${ 'test' }')"
                                    >
                                        <div style="width: 2rem"><i class="fas fa-trash-alt mr-1"></i></div>
                                        <span>Remove</span>
                                    </div>
                                `)}
                            </td>
                        </tr>
                    `);

                    generalQuestionInputs.push({
                        interviewQuestionID: r.interview_question_id,
                        name: inputName
                    });

                    // Set Validation Rule
                    $(`[name="${ inputName }"]`).rules('add', {
                        required: true,
                        number: true,
                        min: 0,
                        max: 100,
                        messages: {
                            required: 'Required',
                            number: 'Invalid value',
                            min: 'Min. of 0',
                            max: 'Max. of 100'
                        }
                    });
                });
            } else {
                $('#generalInterviewQuestionsForIntervieweeDTBody').append(`
                    <tr>
                        <td colspan="2">
                            <div class="py-5 text-center">
                                <h5>No general interview questions</h5>
                            </div>
                        </td>
                    </tr>
                `);
            }

        },
        error: () => toastr.error('There was an error in getting the general interview questions')
    })
});

/** Validate Interview Scoresheet Form */
validateForm('#interviewScoresheetForm', {
    submitHandler: () => {
        showModal('#confirmSaveScoresheetModal');
        return false;
    }
});

/** Validate Add Interview Question Modal */
validateForm('#addInterviewQuestionForm', {
    rules: {
        question: { required: true }
    },
    messages: {
        question: { required: 'Please type your additional question here' }
    },
    submitHandler: () => {
        const question = generateFormData('#addInterviewQuestionForm').get('question');
        
        if(addedQuestions.length == 0) $('#addedInterviewQuestionsDTBody').empty();

        const inputName = `${String.fromCharCode(97+Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 26)}${Date.now()}`;
        
        $('#addedInterviewQuestionsDTBody').append(`
            <tr id="row${ inputName }">
                <td>
                    <p>${ question }</p>
                </td>
                <td>
                    <div class="form-group">
                        <input 
                            class="form-control form-control-border" 
                            type="number" 
                            min=0 
                            max=100 
                            name="${ inputName }"
                            placeholder="%"
                            required
                        >
                    </div>
                </td>
                <td>
                    ${ TEMPLATE.DT.OPTIONS(`
                        <div 
                            class="dropdown-item d-flex"
                            role="button"
                            onclick="removeAddedQuestion('${ inputName }')"
                        >
                            <div style="width: 2rem"><i class="fas fa-trash-alt mr-1"></i></div>
                            <span>Remove</span>
                        </div>
                    `) }
                </td>
            </tr>
        `);

        // Set Validation Rule
        $(`[name="${ inputName }"]`).rules('add', {
            required: true,
            number: true,
            min: 0,
            max: 100,
            messages: {
                required: 'Required',
                number: 'Invalid value',
                min: 'Min. of 0',
                max: 'Max. of 100'
            }
        });

        addedQuestions.push({ name: inputName, question: question });
        hideModal('#addInterviewQuestionModal');
        toastr.success('A new interview question has been added');
        return false;
    }
});

/** When Add Interview Question Modal is going to be hidden */
onHideModal('#addInterviewQuestionModal', () => resetForm('#addInterviewQuestionForm'));

/** Save Scoresheet */
onClick('#saveScoresheetBtn', () => {

    // Set buttons to loading state
    btnToLoadingState('#saveScoresheetBtn');
    disableElement('#cancelConfirmSaveScoresheetModalBtn');

    const get = (n) => { return generateFormData('#interviewScoresheetForm').get(n) }
    
    generalQuestionInputs.forEach(g => {
        const data = {
            interview_question_id: g.interviewQuestionID,
            score: get(g.name)
        };
        POST_ajax(`${ ROUTE.API.H }interview-scores/${ intervieweeID }`, data, {
            error: () => toastr.error('There was an error in saving interviewee score')
        });
    });

    if(addedQuestions.length > 0) {
        addedQuestions.forEach(a => {
            const data = { question: a.question, type: 'Added' }

            POST_ajax(`${ ROUTE.API.H }interview-questions`, data, {
                success: result => {
                    const data = {
                        interview_question_id: result.data.interview_question_id,
                        score: get(a.name)
                    }

                    POST_ajax(`${ ROUTE.API.H }interview-scores/${ intervieweeID }`, data, {
                        error: () => toastr.error('There was an error in saving interviewee score for added questions')
                    });
                },
                error: () => toastr.error('There was an error in saving added questions')
            });
        });
    }

    PUT_ajax(
        `${ ROUTE.API.H }interviewee/${ intervieweeID }`,
        {
            is_interviewed: true,
            interviewed_at: formatDateTime(moment())
        },
        {
            success: result => {
                if(result) {
                    localStorage.setItem('sessioned_alert', true);
                    localStorage.setItem('sessioned_alert_theme', 'success');
                    localStorage.setItem('sessioned_alert_message', 'Applicant is successfully interviewed');
                    history.back();
                }
            },
            error: () => {
                btnToUnloadState('#saveScoresheetBtn', TEMPLATE.LABEL_ICON('Yes, save it!', 'check'));
                enableElement('#cancelConfirmSaveScoresheetModalBtn');
                toastr.error('There was an error in updating interviewee record')
            }
        }
    );
});

/** Remove General Question */
const removeGeneralQuestion = () => {
    showModal('#confirmRemoveGeneralQuestionModal');
    setValue('#', )
}

/** Remove Added Question */
const removeAddedQuestion = (inputName) => {
    showModal('#confirmRemoveAddedQuestionModal');
    setValue('#addedInputName', inputName);
}

/** Validate Confirm Added Question Form */
validateForm('#confirmRemoveAddedQuestionForm', {
    rules: {
        addedInputName: { required: true }
    },
    messages: {
        addedInputName: { required: 'This field must have value' }
    },
    submitHandler: () => {

        // Get added input name from the form
        const inputName = generateFormData('#confirmRemoveAddedQuestionForm').get('addedInputName');

        // Remove Row
        $(`#row${ inputName }`).remove();

        // Remove Added Question from array
        addedQuestions = $.grep(addedQuestions, e => { return e.name != inputName });

        // Set empty body if added questions array is empty
        if(addedQuestions.length == 0) {
            setContent('#addedInterviewQuestionsDTBody', `
                <tr>
                    <td colspan="2">
                        <div class="text-center py-5">
                            <h5 class="text-secondary">No additional question yet</h5>
                        </div>
                    </td>
                </tr>
            `);
        }

        // Hide Confirm Remove Added Question Modal
        hideModal('#confirmRemoveAddedQuestionModal');

        // Show info alert
        toastr.info('An added interview question has been removed')

        return false;
    }
})

/** On Confirm Remove Added Question Modal is going to be hidden */
onHideModal('#confirmRemoveAddedQuestionModal', () => resetForm('#confirmRemoveAddedQuestionForm'));