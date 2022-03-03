"use strict";

/**
 * ==============================================================================
 * SUBMIT MANPOWER REQUEST
 * ==============================================================================
 */

// Initialize Plugins for Custom Controls
ifSelectorExist('#addManpowerRequestForm', () => {
    
    /** Set Requisition No. */
    setValue('#requisitionNo', () => {
        const generateShortUID = () => {
            const id = () => { return ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(-3); }
            return id() + id();
        }
        return (`req-${ Date.now().toString(36) }-${ generateShortUID() }`).toUpperCase(); 
    });

    /** Vacant Position For Add Select2 */
    GET_ajax(`${ ROUTE.API.DM }positions`, {
        success: result => {
            if(result) {
                let vacantPosition = $('#vacantPosition');
                vacantPosition.empty();
                vacantPosition.append(`<option></option>`);
                
                result.length > 0
                    ? result.forEach(p => vacantPosition.append(`<option value="${ p.position_id }">${ p.name }</option>`))
                    : vacantPosition.append(`<option disabled>No data</option>`)

                vacantPosition.select2({
                    placeholder: "Please select a vacant position",
                });
            } else toastr.error('There was an error in getting positions')
        },
        error: () => toastr.error('There was an error in getting positions')
    })

    /** Request Nature For Add Select 2 */
    $('#requestNature').select2({
        placeholder: "Please select the nature of request",
        minimumResultsForSearch: -1,
    });
    
    /** Employment Type For Add Select2 */
    GET_ajax(`${ ROUTE.API.DM }employment-types`, {
        success: result => {
            let employmentType = $('#employmentType');
            employmentType.empty();
            employmentType.append(`<option></option>`);
                
            result.length > 0
                ? result.forEach(t => employmentType.append(`<option value="${ t.employment_type_id }">${ t.name }</option>`))
                : employmentType.append(`<option disabled>No data</option>`)

            employmentType.select2({
                placeholder: "Please select an employment type",
            });
        }
    });
    
    /** Request Description For Add Summernote */
    $('#requestDescription').summernote({
        height: 500,
        placeholder: "Write the description of your request here",
        toolbar: SUMMERNOTE_TOOLBAR
    });

    
    /** Validate Summernote */
    $('#requestDescription').summernote().on('summernote.change', () => {
        if($('#requestDescription').summernote('isEmpty')) {
            $('#requestDescription').next().addClass('border-danger');
            showElement('#requestDescriptionInvalidFeedback');
            disableElement('#submitBtn');
        } else {
            $('#requestDescription').next().removeClass('border-danger');
            hideElement('#requestDescriptionInvalidFeedback');
            enableElement('#submitBtn');
        }
    });

    /** Remove loader */
    showElement('#addManpowerRequestForm');
    $('#addManpowerRequestFormLoader').remove();
});

/** On Set Salary Range Change */
onChange('#setDeadline', () => showOrHideElement('#deadlineField', isChecked('#setDeadline')))

/** On Set Salary Range Change */
onChange('#setSalaryRange', () => showOrHideElement('#salaryRangeField', isChecked('#setSalaryRange'))) 

/** Validate Add Manpower Request Form */
validateForm('#addManpowerRequestForm', {
    rules: {
        requisitionNo: {
            required: true
        },
        vacantPosition: {
            required: true
        },
        requestNature: {
            required: true
        },
        staffsNeeded: {
            min: 1,
            required: true
        },
        employmentType: {
            required: true
        },
        requestDescription: {
            required: true
        },
        deadline: {
            required: true,
            afterToday: true
        },
        minSalary: {
            required: true,
            number: true,
            min: 1,
            lessThan: "#maxSalary"
        },
        maxSalary: {
            required: true,
            number: true,
            min: 1,
            greaterThan: "#minSalary"
        },
    },
    messages: {
        requisitionNo: {
            required: 'Please reload the page to generate requisition number'
        },
        vacantPosition: {
            required: 'Position is required',
        },
        requestNature: {
            required: 'Nature of request is required'
        },
        staffsNeeded: {
            min: 'The number of staffs must at least 1',
            required: 'Number of staffs is required'
        },
        employmentType: {
            required: 'Employment type is required'
        },
        requestDescription: {
            required: 'Job description is required'
        },
        deadline: {
            required: 'Please select a deadline',
            afterToday: 'Deadline must be in the future'
        },
        minSalary: {
            required: 'Please type the minimum salary here',
            number: "Minimum salary must have a valid value",
            min: "Minimum salary must have a valid value",
            lessThan: "This must be less than the maximum salary"
        },
        maxSalary: {
            required: 'Please type the maximum salary here',
            number: "Maximum salary must have a valid value",
            min: "Maximum salary must have a valid value",
            greaterThan: "This must be greater than the minimum salary"
        }
    },
    submitHandler:() => {
        showModal('#confirmAddManpowerRequestModal');
        return false
    }
});

/** Submit Manpower Request */
onClick('#confirmAddManpowerRequestBtn', () => {

    // Set buttons to loading state
    btnToLoadingState('#confirmAddManpowerRequestBtn');
    disableElement('#cancelAddManpowerRequestBtn');

    const formData = generateFormData('#addManpowerRequestForm')
    const get = (n) => { return formData.get(n) }
    
    const data = {
        requisition_no: get('requisitionNo'),
        position_id: get('vacantPosition'),
        employment_type_id: get("employmentType"),
        request_nature: get("requestNature"),
        staffs_needed: parseInt(get("staffsNeeded")),
        min_monthly_salary: isChecked('#setSalaryRange') ? parseFloat(get("minSalary")) : null,
        max_monthly_salary: isChecked('#setSalaryRange') ? parseFloat(get("maxSalary")) : null,
        content: get("requestDescription"),
        deadline: isChecked('#setDeadline') ? formatDateTime(get("deadline")) : null
    }

    // If error
    const ifError = () => {
        
        // Set modal buttons to unload state
        btnToUnloadState('#confirmAddManpowerRequestBtn', TEMPLATE.LABEL_ICON('Yes, submit it', 'check'));
        enableElement('#cancelAddManpowerRequestBtn');

        // Show error alert
        hideModal('#confirmAddManpowerRequestModal')
        toastr.error("There was an error in creating manpower request");
    }

    // Request create new manpower request
    POST_ajax(`${ ROUTE.API.DM }manpower-requests`, data, {
        success: result => {
            if(result) {
                setSessionedAlertAndRedirect({
                    theme: 'success', 
                    message: 'A new request has been submitted', 
                    redirectURL: `${ ROUTE.WEB.DM }manpower-requests`
                });
            } else ifError()
        },
        error: () => ifError()
    });
});


/**
 * ==============================================================================
 * VIEW ALL MANPOWER REQUESTS
 * ==============================================================================
 */

/** ManPower Requests DataTable */
initDataTable('#manpowerRequestDT', {
    url: `${ ROUTE.API.DM }manpower-requests`,
    // debugMode: true,
    enableButtons: true,
    columns: [

        // Created At (For Default Sorting)
        { data: 'created_at', visible: false },

        // Requisition No.
        { data: 'requisition_no', class: 'text-nowrap' },

        // Staffs Needed
        { 
            data: null,
            render: data => {
                const staffsNeeded = data.staffs_needed;
                return `
                    <div>${ data.vacant_position.name }</div>
                    ${TEMPLATE.SUBTEXT(`${ staffsNeeded } new ${ pluralize('staff', staffsNeeded) }`)}
                `;
            }
        },

        // Request Nature
        { data: "request_nature"},

        // Request Status
        {
            data: null,
            render: data => {
                const requestStatus = data.request_status;

                var bagdeTheme, badgeIcon;
                let validStatus = true;
                
                switch(requestStatus) {
                    case "For signature":
                        bagdeTheme = "secondary";
                        badgeIcon = "file-signature";
                        break;
                    case "For approval":
                        bagdeTheme = "warning";
                        badgeIcon = "sync-alt";
                        break;
                    case "Approved":
                        bagdeTheme = "success";
                        badgeIcon = "thumbs-up";
                        break;
                    case "Rejected for signing":
                    case "Rejected for approval":
                        bagdeTheme = "danger";
                        badgeIcon = "times";
                        break;
                    case "Completed":
                        bagdeTheme = "info";
                        badgeIcon = "check";
                        break;
                    default:
                        validStatus = false
                        break;
                }

                return validStatus 
                    ? TEMPLATE.DT.BADGE(bagdeTheme, TEMPLATE.ICON_LABEL(badgeIcon, requestStatus))
                    : TEMPLATE.DT.BADGE("light", "Invalid data")
            }
        },

        // Date Requested
        {
            data: null,
            render: data => {
                const createdAt = data.created_at
                return `
                    <div>${ formatDateTime(createdAt, "MMM. D, YYYY") }</div>
                    <div>${ formatDateTime(createdAt, "Time") }</div>
                    ${ TEMPLATE.SUBTEXT(fromNow(createdAt)) }
                `
            }
        },

        // Actions
        { 
            data: null,
            render: data => {
                const manpowerRequestID = data.manpower_request_id, requestStatus = data.request_status;

                const markAsCompletedBtn = `
                    <div 
                        class="dropdown-item d-flex"
                        onclick="markAsCompleted('${ manpowerRequestID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-check mr-1"></i></div>
                        <span>Mark as Completed</span>
                    </div>
                `;

                const editBtn = `
                    <a 
                        class="dropdown-item d-flex"
                        href="${ ROUTE.WEB.DM }edit-manpower-request/${ manpowerRequestID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-edit mr-1"></i></div>
                        <span>Edit</span>
                    </a>
                `

                const cancelBtn = `
                    <div 
                        class="dropdown-item d-flex"
                        role="button"
                        onclick="cancelManpowerRequest('${ manpowerRequestID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-times-circle mr-1"></i></div>
                        <span>Cancel</span>
                    </div>
                `;

                const deleteBtn = `
                    <div 
                        class="dropdown-item d-flex"
                        role="button"
                        onclick="deleteManpowerRequest('${ manpowerRequestID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-trash-alt mr-1"></i></div>
                        <span>Delete</span>
                    </div>
                `;

                let additionalOptions = "";

                switch(requestStatus) {
                    case "For signature":
                        additionalOptions = editBtn + cancelBtn;
                        break;
                    // case "Approved":
                    //     additionalOptions = markAsCompletedBtn;
                    //     break;
                    case "Rejected for approval":
                    case "Rejected for signing":
                        additionalOptions = deleteBtn;
                }

                return TEMPLATE.DT.OPTIONS(`
                    <a 
                        class="dropdown-item d-flex"
                        href="${ ROUTE.WEB.DM }manpower-requests/${ manpowerRequestID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-file-alt mr-1"></i></div>
                        <div>
                            <div>View Request</div>
                            <div class="small">See the details of requisition</div>
                        </div>
                    </a>
                    ${ additionalOptions }
                `);
            }
        }
    ],
});


/**
 * ==============================================================================
 * MANPOWER REQUESTS ANALYTICS
 * ==============================================================================
 */

/** Manpower Requests Analytics */
const manpowerRequestAnalytics = () => 
    GET_ajax(`${ ROUTE.API.DM }manpower-requests/analytics`, {
        success: result => {
            if(result) {
                setContent({
                    '#totalManpowerRequestsCount': formatNumber(result.total),
                    '#completedRequestsCount': formatNumber(result.completed),
                    '#signedRequestsCount': formatNumber(result.on_going.for_approval),
                    '#approvedRequestsCount': formatNumber(result.on_going.approved),
                    '#rejectedRequestsCount': formatNumber(result.rejected.total)
                });
            } else toastr.error('There was an error in getting manpower request analytics')
        },
        error: () => toastr.error('There was an error in getting manpower request analytics')
    });

/** Get Manpower Requests Analytics */
ifSelectorExist('#manpowerRequestAnalytics', () => manpowerRequestAnalytics());


/**
 * ==============================================================================
 * VIEW MANPOWER REQUEST DETAILS
 * ==============================================================================
 */

/** Get Manpower Request Details */
const getManpowerRequestDetails = () => {
    const manpowerRequestID = getPathnamePart(1);
    GET_ajax(`${ ROUTE.API.DM }manpower-requests/${ manpowerRequestID }`, {
        success: result => {
            if(result) {

                /** MANPOWER REQUEST DETAILS */
                setManpowerRequestDocument(result);
                
                /** MANPOWER REQUEST TIMELINE */
                setManpowerRequestTimeline('#manpowerRequestTimeline', result);
                
                /** MANPOWER REQUEST OPTIONS */
                setContent('#manpowerRequestOptions', () => {
                    const manpowerRequestID = result.manpower_request_id;

                    switch(result.request_status) {
                        case "For signature":
                            return `
                                <a 
                                    class="btn btn-sm btn-info btn-block"
                                    href="${ ROUTE.WEB.DM }edit-manpower-request/${ manpowerRequestID }"
                                >
                                    ${ TEMPLATE.ICON_LABEL("edit", "Edit Request") }
                                </a>

                                <div class="btn btn-sm btn-warning btn-block" onclick="cancelManpowerRequest('${ manpowerRequestID }')">
                                    ${ TEMPLATE.ICON_LABEL("times-circle", "Cancel request") }
                                </div>
                                <hr>
                                <div class="btn btn-sm btn-secondary btn-block" onclick="printManpowerRequest()">
                                    ${ TEMPLATE.ICON_LABEL("print", "Print Manpower Request Form") }
                                </div>
                            `
                        case "Approved":
                            $('#cancelManpowerRequestModal').remove();
                            return `
                                <div class="btn btn-sm btn-secondary btn-block" onclick="printManpowerRequest()">
                                    ${ TEMPLATE.ICON_LABEL("print", "Print Manpower Request Form") }
                                </div>
                            `
                        case "Completed":
                            $('#cancelManpowerRequestModal').remove();
                            $('#markAsCompletedModal').remove();
                            return `
                                <div class="btn btn-sm btn-secondary btn-block" onclick="printManpowerRequest()">
                                    ${ TEMPLATE.ICON_LABEL("print", "Print Manpower Request Form") }
                                </div>
                                `
                        default:
                            $('#cancelManpowerRequestModal').remove();
                            $('#markAsCompletedModal').remove();
                            return `
                                <div class="btn btn-sm btn-secondary btn-block" onclick="printManpowerRequest()">
                                    ${ TEMPLATE.LABEL_ICON("Print Manpower Request Form", "print") }
                                </div>
                            `
                    }
                });
                $('#optionsLoader').remove();
                showElement('#optionsContainer');
    
                /** MANPOWER REQUEST */
                $('#manpowerRequestTimelineLoader').remove();
                showElement('#manpowerRequestTimeline');
            } else toastr.error('Sorry, there was an error while getting requisition details')
        },
        error: () => toastr.error('Sorry, there was an error while getting requisition details')
    });
}


/** View Manpower Request */
ifSelectorExist('#manpowerRequestDocumentContainer', () => getManpowerRequestDetails());


/** Print Manpower Request */
const printManpowerRequest = () => printContent('Print Manpower Request Document', $("#manpowerRequestDocument").html())


/** 
 * ==============================================================================
 * EDIT MANPOWER REQUEST
 * ==============================================================================
 */

/** If Edit Manpower Request Form Exists */
ifSelectorExist('#editManpowerRequestForm', () => {

    /** Vacant Position For Add Select2 */
    GET_ajax(`${ ROUTE.API.DM }positions`, {
        success: result => {
            if(result) {
                let vacantPosition = $('#vacantPosition');
                vacantPosition.empty();
                vacantPosition.append(`<option></option>`);
                
                result.length > 0
                    ? result.forEach(p => vacantPosition.append(`<option value="${ p.position_id }">${ p.name }</option>`))
                    : vacantPosition.append(`<option disabled>No data</option>`)
                
                $('#vacantPosition').select2({
                    placeholder: "Please select a vacant position",
                });
            } else toastr.error('There was an error in getting positions')
        },
        error: () => toastr.error('There was an error in getting positions')
    });

    /** Request Nature For Add Select 2 */
    $('#requestNature').select2({
        placeholder: "Please select the nature of request",
        minimumResultsForSearch: -1,
    });
    
    /** Employment Type For Add Select2 */
    GET_ajax(`${ ROUTE.API.DM }employment-types`, {
        success: result => {
            let employmentType = $('#employmentType');
            employmentType.empty();
            employmentType.append(`<option></option>`);
                
            result.length > 0
                ? result.forEach(t => employmentType.append(`<option value="${ t.employment_type_id }">${ t.name }</option>`))
                : employmentType.append(`<option disabled>No data</option>`)

            employmentType.select2({
                placeholder: "Please select an employment type",
            });
        }
    });
    
    /** Request Description For Add Summernote */
    $('#requestDescription').summernote({
        height: 500,
        placeholder: "Write the description of your request here",
        toolbar: SUMMERNOTE_TOOLBAR
    });

    /** 
     * =====================================================================
     * GET REQUISITION DETAILS
     * =====================================================================
     */

    /** Get requisition ID from the URL */
    const manpowerRequestID = getPathnamePart(1);

    /** Get Manpower Request Information */
    GET_ajax(`${ ROUTE.API.DM }manpower-requests/${ manpowerRequestID }`, {
        success: result => {
            if(result) {

                /** Set Requisition ID */
                setValue('#manpowerRequestID', result.manpower_request_id);

                /** Set Requisition No. */
                setValue('#requisitionNo', result.requisition_no);

                /** Set Vacant Position */
                $('#vacantPosition').val(result.vacant_position.position_id).trigger('change');

                /** Set Nature of Request */
                $('#requestNature').val(result.request_nature).trigger('change');

                /** Set number of staffs */
                setValue('#staffsNeeded', result.staffs_needed);

                /** Set Employment Type */
                $('#employmentType').val(result.employment_type.employment_type_id).trigger('change');

                /** Set Deadline */
                const deadline = result.deadline;
                if(!isEmptyOrNull(deadline)) {
                    checkElement('#setDeadline');
                    showElement('#deadlineField');
                    setValue('#deadline', deadline);
                }

                /** Set Salary Range */
                const minSalary = result.min_monthly_salary;
                const maxSalary = result.max_monthly_salary;
                if(!(isEmptyOrNull(minSalary) && isEmptyOrNull(maxSalary))) {
                    checkElement('#setSalaryRange');
                    showElement('#salaryRangeField');
                    setValue('#minSalary', minSalary);
                    setValue('#maxSalary', maxSalary);
                }

                /** Set Requisition  */
                $('#requestDescription').summernote('code', result.content);

                /** Set Date Requested */
                const dateRequested = result.created_at;
                setContent('#dateRequested', `
                    <div>${ formatDateTime(dateRequested, "dddd, MMMM D, YYYY") }</div>
                    <div>${ formatDateTime(dateRequested, "hh:mm A") }</div>
                `);
                setContent('#dateRequestedHumanized', fromNow(dateRequested));

                /** Set Last Updated */
                const lastUpdated = result.updated_at;
                setContent('#lastUpdated', `
                    <div>${ formatDateTime(lastUpdated, "dddd, MMMM D, YYYY") }</div>
                    <div>${ formatDateTime(lastUpdated, "hh:mm A") }</div>
                `);
                setContent('#lastUpdatedHumanized', fromNow(lastUpdated));
            } else toastr.error('There was an error in getting manpower request information')
        },
        error: () => toastr.error('There was an error in getting manpower request information')
    });

    /** Validate Summernote */
    $('#requestDescription').summernote().on('summernote.change', () => {
        if($('#requestDescription').summernote('isEmpty')) {
            $('#requestDescription').next().addClass('border-danger');
            showElement('#requestDescriptionInvalidFeedback');
            disableElement('#saveBtn');
        } else {
            $('#requestDescription').next().removeClass('border-danger');
            hideElement('#requestDescriptionInvalidFeedback');
            enableElement('#saveBtn');
        }
    });
    
    /** Remove Loader */
    showElement('#editManpowerRequestForm');
    $('#editManpowerRequestFormLoader').remove();
});

/** Validate Edit Manpower Request Form */
validateForm('#editManpowerRequestForm', {
    rules: {
        manpowerRequestID: {
            required: true
        },
        vacantPosition: {
            required: true,
        },
        requestNature: {
            required: true
        },
        staffsNeeded: {
            min: 1,
            required: true
        },
        employmentType: {
            required: true
        },
        requestDescription: {
            required: true
        },
        deadline: {
            required: true,
            afterToday: true
        },
        minSalary: {
            required: true,
            number: true,
            min: 1,
            lessThan: "#maxSalary"
        },
        maxSalary: {
            required: true,
            number: true,
            min: 1,
            greaterThan: "#minSalary"
        },
    },
    messages:{
        manpowerRequestID: {
            required: 'This must have a value'
        },
        vacantPosition: {
            required: 'Position is required',
        },
        requestNature: {
            required: 'Nature of request is required'
        },
        staffsNeeded: {
            min: 'The number of staffs must at least 1',
            required: 'Number of staffs is required'
        },
        employmentType: {
            required: 'Employment type is required'
        },
        requestDescription: {
            required: 'Job description is required'
        },
        deadline: {
            required: 'Please select a deadline',
            afterToday: 'Deadline must be in the future'
        },
        minSalary: {
            required: 'Please type the minimum salary here',
            number: "Minimum salary must have a valid value",
            min: "Minimum salary must have a valid value",
            lessThan: "This must be less than the maximum salary"
        },
        maxSalary: {
            required: 'Please type the maximum salary here',
            number: "Maximum salary must have a valid value",
            min: "Maximum salary must have a valid value",
            greaterThan: "This must be greater than the minimum salary"
        }
    },
    submitHandler:() => {
        showModal('#confirmEditManpowerRequestModal');
        return false
    }
});

/** Submit Manpower Request */
onClick('#confirmEditManpowerRequestBtn', () => {
    
    // Set buttons to loading state]
    btnToLoadingState('#confirmEditManpowerRequestBtn');
    disableElement('#cancelEditManpowerRequestBtn');

    // Generate Form Data
    const formData = generateFormData('#editManpowerRequestForm')
    const get = (name) => { return formData.get(name) }
    
    // Set data
    const data = {
        position_id: get('vacantPosition'),
        employment_type_id: get("employmentType"),
        request_nature: get("requestNature"),
        staffs_needed: parseInt(get("staffsNeeded")),
        min_monthly_salary: isChecked('#setSalary') ? null : parseFloat(get("minSalary")),
        max_monthly_salary: isChecked('#setSalary') ? null : parseFloat(get("maxSalary")),
        content: get("requestDescription"),
        deadline: isChecked('#setDeadlline') ? formatDateTime(get("deadline")) : null
    }

    const ifError = () => {
        
        // Hide Modal
        hideModal('#confirmEditManpowerRequestModal');

        // Set buttons to unload state
        btnToUnloadState('#confimEditManpowerRequestBtn', TEMPLATE.LABEL_ICON('Yes, update it', 'check'))
        enableElement('#cancelEditManpowerRequestBtn');

        // Show error alert
        toastr.error("There was an error in creating manpower request");
    }

    PUT_ajax(`${ ROUTE.API.DM }manpower-requests/${ get('manpowerRequestID') }`, data, {
        success: result => {
            if(result) {
                setSessionedAlertAndRedirect({
                    theme: 'success', 
                    message: 'A new request has been updated', 
                    redirectURL: `${ ROUTE.WEB.DM }manpower-requests`
                });
            } else ifError()
        },
        error: () => ifError()
    });
});


/**
 * ==============================================================================
 * CANCEL MANPOWER REQUEST
 * ==============================================================================
 */

/** Cancel Manpower Request */
const cancelManpowerRequest = (manpowerRequestID) => {
    setValue('#manpowerRequestIDForCancel', manpowerRequestID);
    showModal('#cancelManpowerRequestModal');
}

/** On Cancel Manpower Request Modal is going to be hidden */
onHideModal('#cancelManpowerRequestModal', () => {
    
    // Set buttons to unload state
    btnToUnloadState('#cancelRequestManpowerRequestBtn', TEMPLATE.LABEL_ICON('Yes, cancel it', 'times-circle'));
    enableElement('#cancelCancelRequestManpowerRequestBtn');
    
    // Reset form as the modal has been hidden
    resetForm('#cancelManpowerRequestForm')
});

/** Validate Cancel Manpower Request Form */
validateForm('#cancelManpowerRequestForm', {
    rules: { manpowerRequestID: { required: true }},
    messages: { manpowerRequestID: { required: 'Manpower Request ID should be here' }},
    submitHandler: () => {

        // Set buttons to loading state
        btnToLoadingState('#cancelRequestManpowerRequestBtn')
        disableElement('#cancelCancelRequestManpowerRequestBtn')

        // Generate form data
        const manpowerRequestID = generateFormData('#cancelManpowerRequestForm').get('manpowerRequestID');

        // Cancel the request
        DELETE_ajax(`${ ROUTE.API.DM }manpower-requests/${ manpowerRequestID }`, {
            success: result => {
                if(result) {
                    if($('#manpowerRequestDocument').length) {
                        setSessionedAlertAndRedirect({
                            theme: 'info',
                            message: 'A manpower request has been canceled',
                            redirectURL: `${ ROUTE.WEB.DM }manpower-requests`
                        });
                    } else {
                        hideModal('#cancelManpowerRequestModal');
                        reloadDataTable('#manpowerRequestDT');
                        manpowerRequestAnalytics();
                        toastr.info('A manpower request has been canceled');
                    }
                }
            },
            error: () => {
                hideModal('#cancelManpowerRequestModal');
                toastr.error('There was a problem in canceling a manpower request')
            }
        });
    }
});


/** 
 * ==============================================================================
 * DELETE MANPOWER REQUEST
 * ==============================================================================
 */

/** Delete Manpower Request */
const deleteManpowerRequest = (manpowerRequestID) => {
    setValue('#requisitionIDForDelete', manpowerRequestID);
    showModal('#deleteManpowerRequestModal');
}

/** On Delete Manpower Request Modal is going to be hidden */
onHideModal('#deleteManpowerRequestModal', () => resetForm('#deleteManpowerRequestForm'));

/** Validate Delete Manpower Request Form */
validateForm('#deleteManpowerRequestForm', {
    rules: { requisitionID: { required: true }},
    messages: { requisitionID: { required: 'Requisition ID should be here' }},
    submitHandler: () => {
        const formData = generateFormData('#deleteManpowerRequestForm');
        const requisitionID = formData.get('requisitionID');
        DELETE_ajax(`${ ROUTE.API.DM }requisitions/${ requisitionID }`, {
            success: result => {
                if(result) {
                    hideModal('#deleteManpowerRequestModal');
                    reloadDataTable('#manpowerRequestDT');
                    manpowerRequestAnalytics();
                    toastr.info('A manpower request is successfully deleted');
                }
            },
            error: () => {
                hideModal('#deleteManpowerRequestModal');
                toastr.error('There was a problem in deleting a manpower request');
            }
        });
    }
});


/**
 * ==============================================================================
 * MARK AS COMPLETED
 * ==============================================================================
 */

/** Mark Manpower Request as Completed */
const markAsCompleted = (manpowerRequestID) => {
    setValue('#requisitionIDForCompletion', manpowerRequestID);
    showModal('#markAsCompletedModal');
}

/** On mark as completed modal is going to be hidden */
onHideModal('#markAsCompletedModal', () => resetForm('#markAsCompletedForm'));

/** Validate Form */
validateForm('#markAsCompletedForm', {
    submitHandler: () => {

        // Set buttons to loading state
        btnToLoadingState('#confirmMarkAsCompletedBtn');
        disableElement('#cancelMarkAsCompletedBtn');

        // Get the requisition ID
        const manpowerRequestID = generateFormData('#markAsCompletedForm').get('requisitionID');

        // Call if error
        const ifError = () => {
            hideModal('#markAsCompletedModal');
            toastr.error('There was an error while updating manpower request details');
        }

        // Update details
        PUT_ajax(`${ ROUTE.API.DM }manpower-requests/${ manpowerRequestID }/complete`, {}, {
            success: result => {
                if(result) {

                    /** If Manpower Request Document Container Exists */
                    ifSelectorExist('#manpowerRequestDocumentContainer', () => getManpowerRequestDetails());

                    /** If Manpower Request Document Container Exists */
                    ifSelectorExist('#manpowerRequestDocumentContainer', () => reloadDataTable('#manpowerRequestDT'));

                    // Hide Modal
                    hideModal('#markAsCompletedModal');

                    // Set buttons to unload state
                    btnToUnloadState('#confirmMarkAsCompletedBtn', TEMPLATE.LABEL_ICON('Yes, mark it.', 'check-circle'));
                    enableElement('#cancelMarkAsCompletedBtn');

                    // Show alert
                    toastr.info('A manpower request is successfully updated');
                } else ifError()
            },
            error: () => ifError()
        })
        return false;
    }
});