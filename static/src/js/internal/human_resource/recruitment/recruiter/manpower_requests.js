"use strict";

/**
 * ==============================================================================
 * VIEW ALL MANPOWER REQUESTS
 * ==============================================================================
 */

/** Initialize Manpower Request DataTable */
initDataTable('#manpowerRequestDT', {
    url: `${ ROUTE.API.R }manpower-requests`,
    columns: [

        // Created At (For Default Sorting)
        { data: 'reviewed_at', visible: false },

        // Requisition No.
        { data: 'requisition_no', class: 'text-nowrap'},

        // Requested By
        {
            data: null,
            class: 'text-nowrap',
            render: data => {
                const requestedBy = data.manpower_request_requested_by;

                const requestedByFullName = formatName("F M. L, S", {
                    firstName  : requestedBy.first_name,
                    middleName : requestedBy.middle_name,
                    lastName   : requestedBy.last_name,
                    suffixName : requestedBy.extension_name
                });

                return `
                    <div>${ requestedByFullName }</div>
                    ${ TEMPLATE.SUBTEXT(requestedBy.position.sub_department.name) }
                `
            }
        },

        // Staff Needed
        {
            data: null,
            render: data => { 
                return `
                    <div>${ data.vacant_position.name }</div>
                    ${ TEMPLATE.SUBTEXT(`${ data.staffs_needed } new ${ pluralize('staff', data.staffs_needed) }`) }
                `
            }
        },

        // Status
        {
            data: null,
            render: data => {
                if(data.request_status === "Completed")
                    return TEMPLATE.DT.BADGE('info', TEMPLATE.ICON_LABEL('check', 'Completed'))
                else if(data.job_post)
                    return TEMPLATE.DT.BADGE('success', TEMPLATE.ICON_LABEL('briefcase', 'Job post is created'))
                else {
                    return TEMPLATE.DT.BADGE('warning', TEMPLATE.ICON_LABEL('exclamation-triangle', 'No job post yet'))
                }
            }
        },

        // Deadline
        {
            data: null,
            class: 'text-nowrap',
            render: data => {
                const deadline = data.deadline;
                return isEmptyOrNull(deadline)
                    ? TEMPLATE.UNSET('No deadline')
                    : `
                        <div>${ formatDateTime(deadline, "MMM. D, YYYY") }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(deadline)) }
                    `
            }
        },

        // Actions
        {
            data: null,
            render: data => {
                const manpowerRequestID = data.manpower_request_id, jobPost = data.job_post;

                const createJobPostBtn = jobPost 
                    ? "" 
                    : `
                        <div 
                            class="dropdown-item d-flex" 
                            role="button"
                            onclick="createJobPost('${ manpowerRequestID }')"
                        >
                            <div style="width: 2rem"><i class="fas fa-edit mr-1"></i></div>
                            <div>
                                <div>Create Job Post</div>
                                <div class="small">Compose available job for applicants</div>
                            </div>
                        </div>
                    `;
                
                return TEMPLATE.DT.OPTIONS(`
                    <a 
                        class="dropdown-item d-flex" 
                        href="${ROUTE.WEB.R}manpower-requests/${ manpowerRequestID }"
                    >
                        <div style="width: 2rem"><i class="fas fa-file-alt mr-1"></i></div>
                        <div>
                            <div>View Request</div>
                            <div class="small">View the details of requisition</div>
                        </div>
                    </a>

                    ${ createJobPostBtn }
                `)
            }
        }
    ]
});


/**
 * ==============================================================================
 * MANPOWER REQUESTS ANALYTICS
 * ==============================================================================
 */

// Set Content for Manpower Request Analytics
const manpowerRequestAnalytics = () => {
    GET_ajax(`${ ROUTE.API.R }manpower-requests/analytics`, {
        success: result => {
            setContent({
                '#approvedRequestsCount': formatNumber(result.approved_requests),
                '#withJobPostsCount': formatNumber(result.with_job_post)
            });
        },
        error: () => toastr.error('There was an error in getting manpower request analytics')
    });
}

// Manpower Request Analytics
ifSelectorExist('#manpowerRequestAnalytics', () => manpowerRequestAnalytics());


/**
 * ==============================================================================
 * VIEW MANPOWER REQUEST DETAILS
 * ==============================================================================
 */

/** View Manpower Request */
ifSelectorExist('#manpowerRequestDocumentContainer', () => {
    const manpowerRequestID = getPathnamePart(1);
    GET_ajax(`${ ROUTE.API.R }manpower-requests/${ manpowerRequestID }`, {
        success: result => {
            
            /** SET MANPOWER REQUEST CONTENTS */
            setManpowerRequestDocument(result);

            // Set Modal Footer and Other Fields
            const requestStatus = result.request_status;
            var modalFooterBtns;
            
            if(requestStatus === "For Review") {
                showElement('#requestApprovalField');
                modalFooterBtns = `
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button 
                        type="submit" 
                        class="btn btn-success" 
                        id="submitBtn"
                        disabled
                    >
                        ${ TEMPLATE.LABEL_ICON('Submit', 'check') }
                    </button>
                `;
            } else {
                hideElement('#requestApprovalField');
                modalFooterBtns = `<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>`;
            }

            if(requestStatus === "Approved" || requestStatus === "Rejected for approval") 
                $('#approvalForm').remove()
            else if(requestStatus == "For approval")
                showElement('#approvalForm');


            /** FOR MANPOWER REQUEST TIMELINE */
            setManpowerRequestTimeline('#manpowerRequestTimeline', result)

            /** REMOVE LOADERS */
            
            // Remove Manpower Request Timeline Loader
            $('#manpowerRequestTimelineLoader').remove();
            showElement('#manpowerRequestTimeline');

            // Remobe Manpower Request Options Loader
            if(result.job_post) {
                $('#optionsLoader').remove();
                $('#optionsContainer').remove();
            } else {
                $('#optionsLoader').remove();
                showElement('#optionsContainer');
            }
        },
        error: () => toastr.error('Sorry, there was an error while getting requisition details')
    });
});

/** Create Job Post */
const createJobPost = (requisitionID) => location.assign(`${ ROUTE.WEB.R }add-job-post/${ requisitionID }`);

const createJobPostFromViewRequest = () => createJobPost(window.location.pathname.split('/')[3]);