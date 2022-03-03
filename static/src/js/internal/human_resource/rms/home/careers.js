"use strict";

/**
 * ==============================================================================
 * VARIABLES
 * ==============================================================================
 */

// Get URL Parameter Values
const urlParams = new URLSearchParams(window.location.search);
let urlParamsObj = {
    searchQuery: $.trim(urlParams.get('searchQuery')).replace(/\s\s+/g, ' '),
    datePosted: urlParams.get('datePosted'),
    jobCategory: urlParams.get('jobCategory'),
    employmentType: urlParams.get('employmentType'),
    page: urlParams.get('page'),
}

history.replaceState(null, null, getURLQueryString(urlParamsObj));

/**
 * ==============================================================================
 * FUNCTIONS
 * ==============================================================================
 */


// Set Search Form Values according to URL parameters
const setSearchFormValues = () => {

    // Reset the form
    resetForm('#searchJobForm');
    $("#datePosted").val(null).trigger('change');
    $("#jobCategory").val(null).trigger('change');
    $("#employmentType").val(null).trigger('change');
    
    // Set Search Query Input
    if(!isEmptyOrNull(urlParamsObj.searchQuery)) 
        setValue('#searchQuery', urlParamsObj.searchQuery);
    
    // Set Date Posted Option
    if(!isEmptyOrNull(urlParamsObj.datePosted)) {
        setValue('#datePosted', urlParamsObj.datePosted);
        $('#datePosted').val(urlParamsObj.datePosted).trigger('change');
    }

    // Set Job Category Option
    if(!isEmptyOrNull(urlParamsObj.jobCategory)) {
        setValue('#jobCategory', urlParamsObj.jobCategory);
        $('#jobCategory').val(urlParamsObj.jobCategory).trigger('change');
    }
    
    // Set Employment Type Option
    if(!isEmptyOrNull(urlParamsObj.employmentType)) {
        setValue('#employmentType', urlParamsObj.employmentType);
        $('#employmentType').val(urlParamsObj.employmentType).trigger('change');
    }
}


// Redirect with URL params
const redirectWithURLParams = () => {

    // Get URL Params string
    const urlParamsString = getURLQueryString(urlParamsObj);

    // Redirect to correct link (with URL parameter if set)
    isEmptyOrNull(urlParamsString) 
        ? location.assign("/careers")
        : location.assign("/careers" + urlParamsString)
}

/**
 * ==============================================================================
 * FOR SEARCH FORM INPUT SETUP
 * ==============================================================================
 */

ifSelectorExist('#searchJobForm', () => {

    /** Date Posted Select 2 */
    const datePostedOptions = [
        {
            "label": "Last 7 days",
            "value": moment().subtract(7, 'days').format('YYYY-MM-DD')
        }, {
            "label": "Last 14 days",
            "value": moment().subtract(14, 'days').format('YYYY-MM-DD')
        }, {
            "label": "Last month",
            "value": moment().subtract(1, 'months').format('YYYY-MM-DD')
        }, {
            "label": "Last 2 months",
            "value": moment().subtract(2, 'months').format('YYYY-MM-DD')
        }, {
            "label": "Last 6 months",
            "value": moment().subtract(6, 'months').format('YYYY-MM-DD')
        }
    ]

    let datePosted = $('#datePosted');
    datePosted.empty();
    datePosted.append(`<option></option>`);
    
    datePostedOptions.length > 0
        ? datePostedOptions.forEach(o => datePosted.append(`<option value="${ o.value }">${ o.label }</option>`))
        : employmentType.append(`<option disabled>No data</option>`)

    datePosted.select2({
        placeholder: "Date Posted",
    });

    datePosted.val(urlParamsObj.datePosted).trigger('change');


    /** Job Categories Select 2 */
    GET_ajax(`${ BASE_PUBLIC_API }careers/job-categories`, {
        success: result => {
            let jobCategory = $('#jobCategory');
            jobCategory.empty();
            jobCategory.append(`<option></option>`);
            
            result.length > 0
                ? result.forEach(c => jobCategory.append(`<option value="${ c.job_category_id }">${ c.name }</option>`))
                : jobCategory.append(`<option disabled>No data</option>`)

            /** Employment Type For Add Select2 */
            $('#jobCategory').select2({
                placeholder: "Job Category",
            });

            $('#jobCategory').val(urlParamsObj.jobCategory).trigger('change');
        },
        error: () => toastr.error('There was an error in getting job categories')
    });


    /** Employment Type Select2 */
    GET_ajax(`${ BASE_PUBLIC_API }careers/employment-types`, {
        success: result => {
            let employmentType = $('#employmentType');
            employmentType.empty();
            employmentType.append(`<option></option>`);
            
            result.length > 0
                ? result.forEach(t => employmentType.append(`<option value="${ t.employment_type_id }">${ t.name }</option>`))
                : employmentType.append(`<option disabled>No data</option>`)
        
            employmentType.select2({
                placeholder: "Employment Type",
            });
        
            employmentType.val(urlParamsObj.employmentType).trigger('change');
        }
    });
});


/**
 * ==============================================================================
 * GET ALL AVAILABLE JOBS
 * ==============================================================================
 */

/** Get All Jobs */
ifSelectorExist('#availableJobList', () => {

    // Set Search Form Values
    setSearchFormValues();

    // Get URL Param String
    const urlParamsString = getURLQueryString(urlParamsObj);

    // Get all job post filtered by page
    $.ajax({
        url: `${ BASE_PUBLIC_API }careers/job-posts${ urlParamsString }`,
        type: 'GET',
        success: result => {
            let jobList = '';

            // This function will be called if has job list result
            const hasJobList = () => result.forEach(r => {
                const manpowerRequest = r.manpower_request;

                const jobCategory = () => {
                    const jobCategory = r.job_category;
                    return `
                        <div>
                            <i style="width: 1.25rem" class="fas fa-th-list text-center text-secondary mr-1"></i>
                            <span>${ jobCategory.is_removed ? "Others" : jobCategory.name }</span>
                        </div>
                    `
                }

                const salaryRange = r.is_salary_visible 
                    ? `<div>
                            <i style="width: 1.25rem" class="fas fa-handshake text-center text-secondary mr-1"></i>
                            <span>${ formatCurrency(manpowerRequest.min_monthly_salary) } - ${ formatCurrency(manpowerRequest.max_monthly_salary) }</span>
                        </div>`
                    : '';

                const expirationDate = isEmptyOrNull(r.expiration_date) 
                    ? `<div>
                            <i style="width: 1.25rem" class="fas fa-clock text-center text-secondary mr-1"></i>
                            <span>Still open for all applicants</span>
                        </div>` 
                    : `<div>
                            <i style="width: 1.25rem" class="fas fa-clock text-center text-danger mr-1"></i>
                            <span>Open until ${ formatDateTime(r.expiration_date, 'Date') }</span>
                        </div>`

                jobList += `
                    <div class="col-12 col-md-6 d-flex align-items-stretch flex-column">
                        <div class="card d-flex flex-fill">
                            <div class="card-body">

                                <div>
                                    <div class="mb-3">
                                        <a href="${ ORIGIN }careers/${ r.job_post_id }" class="h5 text-primary mb-0 font-weight-bold">${ manpowerRequest.vacant_position.name }</a>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="small text-muted">
                                                <span>Posted ${ formatDateTime(r.created_at, "Date") }</span>
                                                <span class="mx-1">&middot;</span>
                                                <span>${ fromNow(r.created_at) }</span>
                                            </div>
                                            <div class="small text-muted">
                                                <i class="fas fa-eye mr-1"></i>
                                                <span>${ r.views }</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        ${ jobCategory() }
                                        <div>
                                            <i style="width: 1.25rem" class="fas fa-briefcase text-center text-secondary mr-1"></i>
                                            <span>${ manpowerRequest.employment_type.name }</span>
                                        </div>
                                        ${ salaryRange }
                                        ${ expirationDate }
                                        <div class="pt-3 career-content-preview">
                                            ${ r.content }
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="card-footer text-right">
                                <a href="${ ORIGIN }careers/${ r.job_post_id }" class="btn btn-sm btn-primary">
                                    ${ TEMPLATE.LABEL_ICON('View More', 'caret-right') }
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            });

            // This function will be called if no job list result
            const noJobList = () => {
                jobList = `
                    <div class="col-12">
                        <div class="d-flex flex-column justify-content-center align-items-center text-center">
                            <div class="py-5 d-flex justify-content-center">
                                <img 
                                    draggable="false"
                                    src="${ ORIGIN }static/dist/img/careers_full.svg" 
                                    alt="Not found" 
                                    width="25%"
                                >
                            </div>
                            <h4>Oops! There is no result!</h4>
                            <p class="text-secondary">We find nothing based on your request. Please try other keywords.</p>
                        </div>
                    </div>
                `;
            }

            // Call the function based on result
            result.length > 0 ? hasJobList() : noJobList();

            // Set the content
            setContent('#availableJobList', jobList);
        },
        error: () => toastr.error('There was an error in getting all job posts')
    });

    // Get job post analytics
    $.ajax({
        url: `${ BASE_PUBLIC_API }careers/job-posts/analytics${ urlParamsString }`,
        type: 'GET',
        success: result => {
            const total = result.total;
            const currentPage = urlParamsObj.page ? urlParamsObj.page : 1;
            const totalPage = Math.ceil(total/FETCH_ROWS)

            // This function will be called if has result
            const hasResult = () => {

                setContent({
                    '#pageDisplay': `Showing page ${ currentPage } out of ${ totalPage }`,
                    '#totalResultDisplay': `${ total } ${ pluralize('result', total) } are found`
                });

                setPagination('#pagination', {
                    totalRows: total,
                    currentPage: currentPage
                });

                showElement('#pagination');
            }

            // This function will be called if no result
            const noResult = () => {
                setContent({
                    '#pageDisplay': `No page was displayed`,
                    '#totalResultDisplay': `0 results were found`
                });
            }

            // If search query is set then show the label
            if(!isEmptyOrNull(urlParamsObj.searchQuery)) {
                if(total > 0 && currentPage <= totalPage)
                    setContent('#searchLabel', `Search result for <b>"${ urlParamsObj.searchQuery }"</b>`)
                else
                    setContent('#searchLabel', `The search <b>"${ urlParamsObj.searchQuery }"</b> did not found any result`)
            } else {
                $('#searchLabel').remove()
            }

            // Call function based on total number of results
            total > 0 && currentPage <= totalPage ? hasResult() : noResult();
        }
    });
});


/**
 * ==============================================================================
 * GET AVAILABLE JOB DETAILS
 * ==============================================================================
 */

/** Get Available Jobs Details */
ifSelectorExist('#availableJobDetails', () => {
    const jobPostID = getPathnamePart(1);

    // Set Job Post Details
    $.ajax({
        url: `${ BASE_PUBLIC_API }careers/job-posts/${ jobPostID }`,
        type: 'GET',
        success: result => {
            const manpowerRequest = result.manpower_request;

            // Set Job Post ID for the form
            setValue('#jobPostID', result.job_post_id);

            const datePosted = result.created_at;
            setContent({
                '#vacantPosition': manpowerRequest.vacant_position.name,
                '#datePosted': `Posted ${ formatDateTime(datePosted, "Date") }`,
                "#jobPostViews": () => {
                    const views = result.views;
                    return `This post was visited ${ views } ${ pluralize('time', views) }`
                },
                '#datePostedHumanized': fromNow(datePosted),
                '#jobDescription': result.content,
                '#employmentType': manpowerRequest.employment_type.name,
                '#jobCategory': result.job_category.name
            });

            // Set Salary Range
            result.is_salary_visible
                ? setContent('#salaryRange', `${ formatCurrency(manpowerRequest.min_monthly_salary) } - ${ formatCurrency(manpowerRequest.max_monthly_salary) }`)
                : hideElement('#salaryRangeDisplay')

            // Set Open Until
            setContent('#openUntil', () => {
                const expiresAt = result.expiration_date;
                return isEmptyOrNull(expiresAt)
                    ? TEMPLATE.UNSET('No deadline')
                    : `
                        <div>${ formatDateTime(expiresAt, "Date") }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(expiresAt)) }
                    `
            });

            if(isBeforeToday(result.expiration_date)) {
                $('#applicationForm').remove();
                showElement('#applicationsNotAvailable');
            } else {
                $('#applicationsNotAvailable').remove();
            }

            $('#vacantPositionLoader').remove();
            $('#availableJobDetailsLoader').remove();

            showElement('#vacantPositionContainer');
            showElement('#availableJobDetails');
        },
        error: () => toastr.error('There was an error in getting job details')
    });

    // For page views update
    const incrementPageViews = () => {
        PUT_ajax(`${ BASE_PUBLIC_API }careers/job-posts/${ jobPostID }/increment-views`, null, {
            success: views => {
                setContent('#jobPostViews', `This post was visited ${ views } ${ pluralize('time', views) }`)
            },
            error: () => toastr.error('There was an error in updating page views')
        })
    }

    /**
     * Check if job post is already visited
     * 
     * Logic: The jobPostID is stored in an array, and that
     * array is stored in sessionStorage. If jobPostID is not yet
     * in array, the view counter will increment and the jobPostID
     * will be pushed  in array so even user will refresh the
     * page, it will not re-iterate even though user will visit it
     * multiple times, unless tab will close
     */
    let visitedJobPosts = JSON.parse(sessionStorage.getItem('visited_job_posts'))
    if(!visitedJobPosts) {
        sessionStorage.setItem('visited_job_posts', JSON.stringify([jobPostID]));
        incrementPageViews();
    } else {
        const isVisited = visitedJobPosts.includes(jobPostID)
        if(!isVisited) {
            visitedJobPosts.push(jobPostID)
            sessionStorage.setItem('visited_job_posts', JSON.stringify(visitedJobPosts));
            incrementPageViews();
        }
    }

});


/**
 * ==============================================================================
 * JOB APPLICATION
 * ==============================================================================
 */

/** Validate Application Form */
validateForm('#applicationForm', {
    rules: {
        jobPostID: {
            required: true
        },
        firstName: {
            required: true
        },
        lastName: {
            required: true
        },
        contactNumber: {
            required: true
        },
        email: {
            required: true,
            email: true
        },
        resume: {
            required: true,
            accept: 'application/pdf'
        }
    },
    messages: {
        jobPostID: {
            required: "This must have a value"
        },
        firstName: {
            required: "Your first name is required"
        },
        lastName: {
            required: "Your last name is required"
        },
        contactNumber: {
            required: "Your contact number is required"
        },
        email: {
            required: "Your email is required",
            email: "This must be a valid email"
        },
        resume: {
            required: "Your resume is required to upload",
            accept: "Please upload your resume in PDF type"
        }
    },
    submitHandler: () => {
        const formData = generateFormData('#applicationForm');

        // Set Applicant details
        setContent({
            '#applicantFullName': formatName('F M. L, S', {
                firstName: formData.get('firstName'),
                middleName: formData.get('middleName'),
                lastName: formData.get('lastName'),
                suffixName: formData.get('suffixName') 
            }),
            '#applicantContactNumber': formData.get('contactNumber'),
            '#applicantEmail': formData.get('email'),
            '#submitApplicationMode': true
        });

        // Show Modal
        $('#confirmApplicationModal').modal('show');
        return false;
    }
});


/** If Confirm Application Modal is going to be hidden */
onHideModal('#confirmApplicationModal', () => {
    uncheckElement('#confirmReview');
    disableElement('#submitApplicationBtn');
    setContent({
        '#applicantFullName': '',
        '#applicantContactNumber': '',
        '#applicantEmail': '',
        '#submitApplicationMode': false
    });
});

/** If confirm review checkbox has been checked */
onChange('#confirmReview', () => isChecked('#confirmReview') 
    ? enableElement('#submitApplicationBtn') 
    : disableElement('#submitApplicationBtn')
);

/** If submit application button is click */
onClick('#submitApplicationBtn', () => {
    
    // Set button in loading state
    btnToLoadingState('#submitApplicationBtn');
    disableElement('#cancelApplicationBtn');
    disableElement('#confirmReview');

    // Generate Form Data
    const formData = generateFormData('#applicationForm');
    const get = (name) => { return formData.get(name) }

    // Get resume file
    const resume = $('#resume')[0].files[0];
    const fd = new FormData();
    fd.append('file', resume);

    // Call this function if error occured in calling ajax
    const ifError = () => {

        // Hide Confirm Application Modal
        hideModal('#confirmApplicationModal');

        // Set buttons to unload state
        setContent('#submitApplicationBtn', TEMPLATE.LABEL_ICON('Submit','file-export'));
        enableElement('#cancelApplicationBtn');
        enableElement('#confirmReview');

        // Uncheck Confirm Review
        uncheckElement('#confirmReview');
    }

    // Upload resume
    $.ajax({
        url: `${ BASE_PUBLIC_API }careers/upload/resume`,
        type: 'POST',
        processData: false,
        contentType: false,
        data: fd,
        success: result => {

            // Get the data from form
            const data = {
                job_post_id: get('jobPostID'),
                first_name: get('firstName'),
                middle_name: get('middleName'),
                last_name: get('lastName'),
                suffix_name: get('suffixName'),
                contact_number: get('contactNumber'),
                email: get('email'),
                resume: result.new_file
            }

            // Record Applicant's Data
            $.ajax({
                url: `${ BASE_PUBLIC_API }careers/apply`,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                success: result2 => {
                    if(result2) {

                        // Hide Confirm Application Modal
                        hideModal('#confirmApplicationModal');

                        // Set buttons to unload state
                        setContent('#submitApplicationBtn', TEMPLATE.LABEL_ICON('Submit','file-export'));
                        enableElement('#cancelApplicationBtn');
                        enableElement('#confirmReview');

                        // Reset Form
                        resetForm('#applicationForm');

                        // Uncheck Confirm Review
                        uncheckElement('#confirmReview');

                        // Show Success Alert
                        toastr.success('Your application is successfully submitted. Please check your email.');
                    }
                },
                error: () => {
                    ifError();
                    toastr.error('There was a problem in submitting your application')
                }
            });
        },
        error: () => {
            ifError();
            toastr.error('There was a problem in uploading your resume')
        }
    });
});


/**
 * ==============================================================================
 * SEARCH JOB
 * ==============================================================================
 */

/** Validate Form Search */
validateForm('#searchJobForm', {
    submitHandler: () => {

        // Generate form data
        const formData = generateFormData('#searchJobForm');
        const searchQuery = formData.get('searchQuery');
        
        // Set content into loading screen
        if(!isEmptyOrNull(searchQuery)) {
            setContent('#availableJobList', `
                <div class="col-12">
                    <div class="text-center my-5 py-5 wait">
                        <div class="spinner-border text-primary mb-2" style="width: 2.5rem; height: 2.5rem"></div>
                        <div>Please wait while loading the list ...</div>
                    </div>
                </div>
            `);
            hideElement('#pagination');
        }

        // Change search query parameter with the form data
        urlParamsObj.searchQuery = $.trim(searchQuery).replace(/\s\s+/g, ' ');
        urlParamsObj.page = null;

        // Redirect with url parameter
        redirectWithURLParams();

        // Return false to prevent form from submitting values by default
        return false;
    }
});


/**
 * ==============================================================================
 * FOR FILTERS
 * ==============================================================================
 */

// Date Posted Option On Change
$('#datePosted').on('select2:select', () => {
    urlParamsObj.searchQuery = $("#searchQuery").val();
    urlParamsObj.datePosted = $("#datePosted").val();
    urlParamsObj.page = null;
    redirectWithURLParams();
});

// Job Category Option On Change
$('#jobCategory').on('select2:select', () => {
    urlParamsObj.searchQuery = $("#searchQuery").val();
    urlParamsObj.jobCategory = $("#jobCategory").val();
    urlParamsObj.page = null;
    redirectWithURLParams();
});

// Employment Type Option On Change
$('#employmentType').on('select2:select', () => {
    urlParamsObj.searchQuery = $("#searchQuery").val();
    urlParamsObj.employmentType = $("#employmentType").val();
    urlParamsObj.page = null;
    redirectWithURLParams();
});


// Change the content into loading if options is selected
$('#datePosted, #jobCategory, #employmentType').on('select2:select', () => {
    setContent('#availableJobList', `
        <div class="col-12">
            <div class="text-center my-5 py-5 wait">
                <div class="spinner-border text-primary mb-2" style="width: 2.5rem; height: 2.5rem"></div>
                <div>Please wait while loading the list ...</div>
            </div>
        </div>
    `);
    hideElement('#pagination');
});


/**
 * ==============================================================================
 * RESET FILTERS
 * ==============================================================================
 */

// When reset filters button is clicked
$('#resetFilters').on('click', () => {
    if(
        !isEmptyOrNull(urlParamsObj.datePosted) ||
        !isEmptyOrNull(urlParamsObj.jobCategory) ||
        !isEmptyOrNull(urlParamsObj.employmentType)
    ) {
        // Reset form
        urlParamsObj.datePosted = null;
        urlParamsObj.jobCategory = null;
        urlParamsObj.employmentType = null;
        urlParamsObj.page = null;

        $("#datePosted").val('').trigger('change');
        $("#jobCategory").val('').trigger('change');
        $("#employmentType").val('').trigger('change');

        
        // Show loading status
        setContent('#availableJobList', `
            <div class="col-12">
                <div class="text-center my-5 py-5 wait">
                    <div class="spinner-border text-primary mb-2" style="width: 2.5rem; height: 2.5rem"></div>
                    <div>Please wait while loading the list ...</div>
                </div>
            </div>
        `);
        hideElement('#pagination');
        
        // Redirect without URL Parameters
        redirectWithURLParams();
    }
});