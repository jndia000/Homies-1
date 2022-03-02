"use strict";

/**
 * ==============================================================================
 * MANPOWER REQUESTS
 * ==============================================================================
 */

/** ManPower Requests DataTable */
initDataTable('#manpowerRequestDT', {
    url: `${ ROUTE.API.DH }manpower-requests`,
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
                    ${ TEMPLATE.SUBTEXT(`${ staffsNeeded } new staff${ staffsNeeded > 1 ? "s" : "" }`) }
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

                var bagdeTheme, badgeIcon, bagdeContent;
                let validStatus = true;

                switch(requestStatus) {
                    case "For signature":
                        bagdeTheme = "warning";
                        badgeIcon = "file-signature";
                        bagdeContent = requestStatus
                        break;
                    case "For approval":
                    case "Approved":
                    case "Completed":
                        bagdeTheme = "success";
                        badgeIcon = "check";
                        bagdeContent = "Signed"
                        break;
                    case "Rejected for signing":
                    case "Rejected for approval":
                        bagdeTheme = "danger";
                        badgeIcon = "times";
                        bagdeContent = requestStatus;
                        break;
                    default:
                        validStatus = false
                        break;
                }

                return validStatus 
                    ? TEMPLATE.DT.BADGE(bagdeTheme, TEMPLATE.ICON_LABEL(badgeIcon, bagdeContent))
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
                const manpowerRequestID = data.manpower_request_id;

                return TEMPLATE.DT.OPTIONS(`
                    <a 
                        class="dropdown-item d-flex"
                        href="${ ROUTE.WEB.DH }manpower-requests/${ manpowerRequestID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-eye mr-1"></i></div>
                        <span>View Request</span>
                    </a>
                `)
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
const manpowerRequestAnalytics = () => GET_ajax(`${ ROUTE.API.DH }manpower-requests/analytics`, {
    success: result => {
        if(result) {

            // Set Total Mapower Requests Count
            setContent('#totalManpowerRequestsCount', formatNumber(result.total));

            // For Signature Count
            setContent('#forSignatureCount', () => {
                const forSignatureCount = parseInt(result.for_signature);
                return forSignatureCount > 0
                    ? TEMPLATE.ICON_LABEL('exclamation-triangle text-warning', formatNumber(forSignatureCount)) 
                    : 0
            });

            // Set Signed Requests
            setContent('#signedRequestsCount', formatNumber(
                parseInt(result.on_going.for_approval) 
                + parseInt(result.on_going.approved) 
                + parseInt(result.completed)
            ));

            // Set Rejected Requests
            setContent('#rejectedRequestsCount', formatNumber(result.rejected.total));
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

/** View Manpower Request */
ifSelectorExist('#manpowerRequestFormDocument', () => {
    const manpowerRequestID = getPathnamePart(1);

    GET_ajax(`${ ROUTE.API.DH }manpower-requests/${ manpowerRequestID }`, {
        success: result => {

            /** SET MANPOWER REQUEST DOCUMENT */
            setManpowerRequestDocument(result);

            /** SET MANPOWER REQUEST TIMELINE */
            setManpowerRequestTimeline('#manpowerRequestTimeline', result);
            
            // Options
            setContent('#manpowerRequestOptions', () => {
                return `
                    <div class="btn btn-sm btn-secondary btn-block" onclick="printManpowerRequest()">
                        ${ TEMPLATE.LABEL_ICON('Print Manpower Request Form', 'print') }
                    </div>
                `
            });
            
            // Show signature form if request status is for signature
            result.request_status === "For signature" 
                ? showElement('#signatureForm') 
                : $('#signatureForm').remove();

            // Remove Manpower Request Options Loader
            $('#optionsLoader').remove();
            showElement('#optionsContainer');
            
            // Remove Manpower Request Timeline Loader
            $('#manpowerRequestTimelineLoader').remove();
            showElement('#manpowerRequestTimeline');
        },
        error: () => toastr.error('Sorry, there was an error while getting requisition details')
    });
});


/**
 * ==============================================================================
 * PRINT MANPOWER REQUEST FORM
 * ==============================================================================
 */

const printManpowerRequest = () => printContent('Print Manpower Request Document', $("#manpowerRequestDocument").html())


/**
 * ==============================================================================
 * SIGNING FORM
 * ==============================================================================
 */

/** Validate Signature Form */
validateForm('#signatureForm', {
    submitHandler: () => {
        const requestStatus = generateFormData('#signatureForm').get('requestStatus');
        if(requestStatus == "For approval") showModal('#confirmSignRequestModal');
        else if(requestStatus == "Rejected for signature") showModal('#rejectRequestModal');
        return false;
    }
});

/** Sign Requests Form */
validateForm('#signRequestForm', {
    submitHandler: () => {
        
        // Buttons to loading state
        btnToLoadingState('#submitSignRequestBtn');
        disableElement('#cancelSignRequestBtn');

        // Sign Request
        signRequest({request_status: 'For approval'})
    }
});

/** Reject Request Form */
validateForm('#rejectRequestForm', {
    rules: { remarks: { required: true }},
    messages: { remarks: { required: 'Remarks is required' }},
    submitHandler: () => {

        // Buttons to loading state
        btnToLoadingState('#submitRejectRequestBtn');
        disableElement('#cancelRejectRequestBtn');

        // Sign Request
        signRequest({
            remarks: generateFormData('#rejectRequestForm').get('remarks'),
            request_status: 'Rejected for signing'
        });
        return false;
    }
});

/** Reset form if reject request modal has been hidden */
onHideModal('#rejectRequestModal', () => resetForm('#rejectRequestForm'));

/** Sign Request */
const signRequest = (data) => {
    const manpowerRequestID = window.location.pathname.split('/')[3];

    const ifError = () => {
        if(data.request_status == "For approval") {
    
            // Buttons to unload state
            btnToUnloadState('#submitSignRequestBtn', TEMPLATE.LABEL_ICON('Yes, sign it!', 'file-signature'));
            enableElement('#cancelSignRequestBtn');

            // Hide modal
            hideModal('#confirmSignRequestModal');
        } else if(data.request_status == "Rejected for signing") {
            
            // Buttons to loading state
            btnToLoadingState('#submitRejectRequestBtn', TEMPLATE.LABEL_ICON('Submit', 'check'));
            disableElement('#cancelRejectRequestBtn');

            // Hide modal
            hideModal('#rejectRequestModal');
        }
    }

    PUT_ajax(`${ ROUTE.API.DH }manpower-requests/${ manpowerRequestID }/sign`, data, {
        success: result => {
            if(result) {
                if(data.request_status == "For approval")
                    setSessionedAlertAndRedirect({
                        theme: 'success',
                        message: 'A manpower request is successfully signed',
                        redirectURL: `${ ROUTE.WEB.DH }manpower-requests`
                    });
                else if(data.request_status == "Rejected for signing")
                    setSessionedAlertAndRedirect({
                        theme: 'info',
                        message: 'A manpower request has been rejected for signing',
                        redirectURL: `${ ROUTE.WEB.DH }manpower-requests`
                    });
            } else ifError()
        },
        error: () => ifError()
    });
}