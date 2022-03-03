"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
 */

/** Get requisition ID from the URL */
const requisitionID = window.location.pathname.split("/")[3];


/**
 * ==============================================================================
 * HIRED APPLICANTS DATATABLE
 * ==============================================================================
 */

/** Initialize Hired Applicants DataTable */
initDataTable('#hiredApplicantsDT', {
    // debugMode: true,
    url: `${ ROUTE.API.DM }hired-applicants`,
    columns: [

        // Updated at (Hidden for default sorting)
        { data: 'created_at', visible: false},

        // Applicant Name
        {
            data: null,
            class: "w-100",
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

        // Position
        { data: 'onboarding_employee_position.name' },

        // Contract Signed at
        {
            data: null,
            render: data => {
                const appliedAt = data.created_at;
                return `
                    <div>${ formatDateTime(appliedAt, 'MMM. D, YYYY') }</div>
                    ${ TEMPLATE.SUBTEXT(fromNow(appliedAt)) }
                `
            }
        },

        // Action
        {
            data: null,
            render: data => {
                const onboardingEmployeeID = data.onboarding_employee_id;

                return TEMPLATE.DT.OPTIONS(`
                    <a 
                        href="${ ROUTE.WEB.DM }onboard-employee/${ onboardingEmployeeID }"
                        class="dropdown-item d-flex"
                    >
                        <div style="width: 2rem"><i class="fas fa-user-cog mr-1"></i></div>
                        <div>
                            <div>Onboard this applicant</div>
                            <div class="small">Set onboarding tasks for new employee</div>
                        </div>
                    </a>
                    <div class="dropdown-divider"></div>
                    <div 
                        class="dropdown-item d-flex"
                        role="button"
                        onclick="viewApplicantDetails('${ onboardingEmployeeID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View applicant details</div>
                    </div>
                    <a 
                        href="${ EMPLOYMENT_CONTRACT_PATH + data.employment_contract }"
                        class="dropdown-item d-flex"
                        target="_blank"
                    >
                        <div style="width: 2rem"><i class="fas fa-file-alt mr-1"></i></div>
                        <div>
                            <div>View Contract</div>
                            <div class="small">See employment contract for this applicant</div>
                        </div>
                    </a>
                `)
            }
        }
    ]
});


/**
 * ==============================================================================
 * APPLICANT DETAILS
 * ==============================================================================
 */

/** View Applicant Details */
const viewApplicantDetails = (onboardingEmployeeID) => {
    GET_ajax(`${ ROUTE.API.DM }hired-applicants/${ onboardingEmployeeID }`, {
        success: result => {

            /** APPLICANT DETAILS */
            
            // Set Applicant Full Name
            setContent({
                '#applicantFullName': formatName('F M. L, S', {
                    firstName: result.first_name,
                    middleName: result.middle_name,
                    lastName: result.last_name,
                    suffixName: result.suffix_name
                }),
                "#applicantContactNumber": result.contact_number,
                "#applicantEmail": result.email
            });

            // Set Resume Link
            $('#employmentContractBtn').attr('href', `${ EMPLOYMENT_CONTRACT_PATH }${ result.employment_contract }`);


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