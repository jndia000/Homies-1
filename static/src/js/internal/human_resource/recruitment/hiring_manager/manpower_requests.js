"use strict";

/**
 * ==============================================================================
 * VIEW ALL MANPOWER REQUESTS
 * ==============================================================================
 */

/** Manpower Request DataTable */
initDataTable('#manpowerRequestDT', {
    url: `${ ROUTE.API.H }manpower-requests`,
    enableButtons: true,
    columns: [
        
        // Created At (For Default Sorting)
        { data: 'created_at', visible: false },

        // Requisition No.
        { data: 'requisition_no', class: 'text-nowrap' },

        // Vacant Position
        {
            data: null,
            render: data => {
                const vacantPosition = data.vacant_position;
                return `
                    <div>${ vacantPosition.name }</div>
                    ${ TEMPLATE.SUBTEXT(vacantPosition.sub_department.name) }
                `
            }
        },
        
        // Staffs Needed
        { 
            data: null,
            render: data => {
                const staffsNeeded = data.staffs_needed;
                return `${ staffsNeeded } new staff${ staffsNeeded > 1 ? "s" : "" }`;
            }
        },

        // Request Status
        {
            data: null,
            render: data => {
                const requestStatus = data.request_status;

                var bagdeTheme, badgeIcon;
                let validStatus = true;

                switch(requestStatus) {
                    case "For approval":
                        bagdeTheme = "warning";
                        badgeIcon = "sync-alt";
                        break;
                    case "Approved":
                        bagdeTheme = "success";
                        badgeIcon = "thumbs-up";
                        break;
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
                    : TEMPLATE.DT.BADGE('light', 'Undefined')
            }
        },

        // Requested At
        {
            data: null,
            render: data => {
                const createdAt = data.created_at
                return `
                    <div>${ formatDateTime(createdAt, "MMM. D, YYYY") }<div>
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
                        href="${ ROUTE.WEB.H }manpower-requests/${ manpowerRequestID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-file-alt mr-1"></i></div>
                        <div>
                            <div>View Request</div>
                            <div class="small">See the details of requisition</div>
                        </div>
                    </a>
                `)
            }
        }
    ],
});


/**
 * ==============================================================================
 * MANPOWER REQUESTS ANALYICS
 * ==============================================================================
 */

/** Manpower Requests Analytics */
const manpowerRequestAnalytics = () => {
    GET_ajax(`${ ROUTE.API.H }manpower-requests/analytics`, {
        success: result => {
            setContent({
                '#totalManpowerRequestsCount':formatNumber(result.total),
                '#forReviewRequestsCount': () => {
                    const forReviewCount = result.for_review
                    return forReviewCount > 0
                        ? TEMPLATE.ICON_LABEL('exclamation-triangle text-warning', formatNumber(forReviewCount))
                        : 0
                },  
                '#approvedRequestsCount': formatNumber(result.approved.total),
                '#rejectedRequestsCount': formatNumber(result.rejected)
            });
        },
        error: () => toastr.error('There was an error in getting manpower request analytics')
    });
}

/** Load manpower request analytics if its container exist */
ifSelectorExist('#manpowerRequestAnalytics', () => manpowerRequestAnalytics())


/**
 * ==============================================================================
 * VIEW MANPOWER REQUEST DETAILS
 * ==============================================================================
 */

/** View Manpower Request */
ifSelectorExist('#manpowerRequestDocument', () => {
    const manpowerRequestID = getPathnamePart(1);
    GET_ajax(`${ ROUTE.API.H }manpower-requests/${ manpowerRequestID }`, {
        success: result => {

            // Set Manpower Request Document
            setManpowerRequestDocument(result);

            // Set Manpower Request Timeline
            setManpowerRequestTimeline('#manpowerRequestTimeline', result)

            // For Manpower Request Approval
            const requestStatus = result.request_status;
            if(requestStatus === "Approved" || requestStatus === "Rejected for approval") 
                $('#approvalForm').remove()
            else if(requestStatus == "For approval")
                showElement('#approvalForm');
            
            // Remove Manpower Request Timeline Loader
            $('#manpowerRequestTimelineLoader').remove();
            showElement('#manpowerRequestTimeline');
        },
        error: () => toastr.error('Sorry, there was an error while getting requisition details')
    });
});

/** Reset Update Request Status Form if its modal is going to be hide */
onHideModal('#viewManpowerRequestModal', () => {
    $('#remarksField').hide();
    resetForm('#updateManpowerRequestStatusForm');
});


/**
 * ==============================================================================
 * APPROVAL FORM
 * ==============================================================================
 */

/** Validate Approval Form */
validateForm('#approvalForm', {
    submitHandler: () => {
        const requestStatus = generateFormData('#approvalForm').get('requestStatus');
        if(requestStatus == "Approved")
            showModal('#confirmApproveRequestModal')
        else if(requestStatus == "Rejected for approval")
            showModal('#rejectRequestModal')
        return false;
    }
});

/** Approve Requests Form */
validateForm('#approveRequestForm', {
    submitHandler: () => {
        
        // Buttons to loading state
        btnToLoadingState('#submitApproveRequestBtn');
        disableElement('#cancelApproveRequestBtn');

        // Request Approval
        requestApproval({request_status: 'Approved'});
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

        // Request Approval
        requestApproval({
            remarks: generateFormData('#rejectRequestForm').get('remarks'),
            request_status: 'Rejected for approval'
        });
        return false;
    }
});

/** Reset form if reject request modal has been hidden */
onHideModal('#rejectRequestModal', () => resetForm('#rejectRequestForm'));

/** Update Request For approval */
const requestApproval = (data) => {
    const manpowerRequestID = window.location.pathname.split('/')[3];

    const ifError = () => {
        if(data.request_status == "Approved") {
    
            // Buttons to unload state
            btnToUnloadState('#submitApproveRequestBtn', TEMPLATE.LABEL_ICON('Yes, approve it!', 'thumbs-up'));
            enableElement('#cancelSignRequestBtn');

            // Hide modal
            hideModal('#confirmSignRequestModal');
        } else if(data.request_status == "Rejected for approval") {
            
            // Buttons to loading state
            btnToLoadingState('#submitRejectRequestBtn', TEMPLATE.LABEL_ICON("Submit", 'check'));
            disableElement('#cancelRejectRequestBtn');

            // Hide modal
            hideModal('#rejectRequestModal');
        }
    }

    PUT_ajax(`${ ROUTE.API.H }manpower-requests/${ manpowerRequestID }`, data, {
        success: result => {
            if(result) {
                if(data.request_status == "Approved")
                    setSessionedAlertAndRedirect({
                        theme: 'success',
                        message: 'A manpower request is successfully approved',
                        redirectURL: `${ ROUTE.WEB.H }manpower-requests`
                    });
                else if(data.request_status == "Rejected for approval")
                    setSessionedAlertAndRedirect({
                        theme: 'info',
                        message: 'A manpower request has been rejected for approval',
                        redirectURL: `${ ROUTE.WEB.H }manpower-requests`
                    });
            } else ifError()
        },
        error: () => ifError()
    });
}