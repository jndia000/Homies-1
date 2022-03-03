"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
 */

// Get the onboardingEmployeeID from the URL
const onboardingEmployeeID = getPathnamePart(1);


/**
 * ==============================================================================
 * ADD ONBOARDING EMPLOYEE
 * ==============================================================================
 */

// Onboarding Tasks Array
let generalOnboardingTasks = [];
let addedOnboardingTasks = [];

// For Add Onboarding Employee Form Validation
let addOnboardingEmployeeFormRules = {
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
    employmentStartDate: {
        required: true
    }
}
let addOnboardingEmployeeFormMessages = {
    firstName: {
        required: "First name is required"
    },
    lastName: {
        required: "Last name is required"
    },
    contactNumber: {
        required: "Contact number is required"
    },
    email: {
        required: "Email is required",
        email: "This must be a valid email"
    },
    employmentStartDate: {
        required: 'Start of Employment is required'
    }
}

/** Check if no task function */
const checkIfNoTasks = () => {
    const hasTask = generalOnboardingTasks.length == 0 && addedOnboardingTasks.length == 0;
    enableOrDisableElement('#addOnboardingEmployeeSubmitBtn', hasTask);
}

/** Get Hired Applicant Details */
ifSelectorExist('#addOnboardingEmployeeForm', () => {

    // Get applicant information
    GET_ajax(`${ ROUTE.API.DM }onboarding-employees/${ onboardingEmployeeID }`, {
        success: result => {

            const onboardingEmployeePosition = result.onboarding_employee_position;

            // Set Position
            setContent('#position', onboardingEmployeePosition.name);
            
            setValue({
                '#positionID': onboardingEmployeePosition.position_id,
                '#firstName': result.first_name,
                '#middleName': result.middle_name,
                '#lastName': result.last_name,
                '#suffixName': result.suffix_name,
                '#contactNumber': result.contact_number,
                '#email': result.email
            });

            $('#onboardingEmployeeFormLoader').remove();
            showElement('#onboardingEmployeeForm');
        },
        error: () => toastr.error('There was an error in getting hired onboardingEmployee details')
    });

    // Get general onboarding tasks
    GET_ajax(`${ ROUTE.API.DM }onboarding-tasks/general`, {
        success: result => {
            $('#generalOnboardingTasksDTBody').empty();

            if(result.length > 0) {
                result.forEach(t => {

                    const uniqueSuffix = `${Math.floor(Math.random() * 26)}${Date.now()}`;
                    
                    const startAtInputName = `startAt${ uniqueSuffix }`;
                    const endAtInputName = `endAt${ uniqueSuffix }`;

                    const taskType = () => {
                        const taskType = t.task_type;
                        const themes = {
                            "For new employees": "success",
                            "For the team": "info",
                            "For department manager": "warning"
                        }
                        return `<span class="badge border border-${ themes[taskType] } text-${ themes[taskType] }">${ taskType }</span>`
                    }

                    $('#generalOnboardingTasksDTBody').append(`
                        <tr id="generalTaskRow${ uniqueSuffix }">
                            <td>
                                <div>${ t.title }</div>
                                <div>${ taskType() }</div>
                                <div class="small text-secondary">${ t.description }</div>
                            </td>
                            <td>
                                <div class="form-group">
                                    <input 
                                        type="datetime-local" 
                                        class="form-control form-control-border"
                                        style="width: 15rem"
                                        name="${ startAtInputName }"
                                        id="${ startAtInputName }"
                                        required
                                    >
                                </div>
                            </td>
                            <td>
                                <div class="form-group">
                                    <input 
                                        type="datetime-local" 
                                        class="form-control form-control-border"
                                        style="width: 15rem"
                                        name="${ endAtInputName }"
                                        id="${ endAtInputName }"
                                        required
                                    >
                                </div>
                            </td>
                            <td>
                                <div class="text-center dropdown">
                                    <div class="btn btn-sm btn-default" role="button" data-toggle="dropdown">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </div>

                                    <div class="dropdown-menu dropdown-menu-right">
                                        <div 
                                            class="dropdown-item d-flex"
                                            role="button"
                                            onclick="removeGeneralTask('${ uniqueSuffix }')"
                                        >
                                            <div style="width: 2rem"><i class="fas fa-trash-alt mr-1"></i></div>
                                            <span>Remove</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        <tr>
                    `);

                    // Set Validation Rule
                    $(`[name="${ startAtInputName }"]`).rules('add', {
                        required: true,
                        afterToday: true,
                        beforeDateTime: `#${ endAtInputName }`,
                        messages: {
                            required: 'Start date is required',
                            afterToday: 'It must be in the future',
                            beforeDateTime: 'It must be before deadline'
                        }
                    });

                    // Set Validation Rule
                    $(`[name="${ endAtInputName }"]`).rules('add', {
                        required: true,
                        afterToday: true,
                        afterDateTime: `#${ startAtInputName }`,
                        messages: {
                            required: 'Deadline is required',
                            afterToday: 'It must be in the future',
                            afterDateTime: 'It must be after start date'
                        }
                    });


                    generalOnboardingTasks.push({ 
                        id: uniqueSuffix,
                        onboarding_task_id: t.onboarding_task_id
                    });
                });

            } else {
                setContent('#generalOnboardingTasksDTBody', `
                    <tr>
                        <td colspan="4">
                            <div class="py-5 text-center">
                                <h3>No general task yet</h3>
                                <div class="text-secondary mb-3">We found out that you haven't setup general tasks yet. You can add general tasks by clicking the button below</div>
                                <a href="${ ROUTE.WEB.DM }general-tasks" target="_blank" class="btn btn-sm btn-secondary">
                                    ${ TEMPLATE.ICON_LABEL('plus', 'Add general onboarding tasks') }
                                </a>
                            </div>
                        </td>
                    </tr>
                `);
            }

            // Call checkIfNoTasks to enable or disable submit button
            checkIfNoTasks();
        },
        error: () => toastr.error('There was an error in getting general onboarding tasks')
    });

    /** Assign Task To For Add Select 2 */
    $('#assignTaskTo').select2({
        placeholder: "Please select for whom the task for",
        minimumResultsForSearch: -1
    });
});

/** Remove General Task */
const removeGeneralTask = (id) => {
    setValue('#generalTaskID', id);
    showModal('#confirmRemoveGeneralTaskModal');
}

/** Validate Confirm Remove General Task Form */
validateForm('#confirmRemoveGeneralTaskForm', {
    rules: {
        generalTaskID: { required: true }
    },
    messages: {
        generalTaskID: { required: 'These filed must have value' }
    },
    submitHandler: () => {
        const generalTaskID = generateFormData('#confirmRemoveGeneralTaskForm').get('generalTaskID');

        hideModal('#confirmRemoveGeneralTaskModal');

        $(`#generalTaskRow${ generalTaskID }`).remove();

        generalOnboardingTasks = generalOnboardingTasks.filter(t => { return t.id != generalTaskID });

        if(generalOnboardingTasks.length == 0) setContent('#generalOnboardingTasksDTBody', `
            <tr>
                <td colspan="4">
                    <div class="py-5 text-center">
                        <h3>No general tasks</h3>
                        <div class="text-secondary">All general onboarding tasks has been removed</div>
                    </div>
                </td>
            </tr>
        `);

        checkIfNoTasks();

        toastr.info('A general task has been removed');
    }
});

/** Initalize Stepper for Add Onboarding Employee */
ifSelectorExist('.bs-stepper', () => {
    document.addEventListener('DOMContentLoaded', () => window.stepper = new Stepper(document.querySelector('.bs-stepper')));
});

/** If next button in applicant information is clicked */
onClick('#nextBtnForApplicantInformation', () => {
    if($('#addOnboardingEmployeeForm').valid()) stepper.next()
});

/** Validate Add Onboarding Task Form */
validateForm('#addOnboardingTaskForm', {
    rules: {
        assignTaskTo: { required: true },
        taskTitle: { required: true },
        description: { required: true }
    },
    messages: {
        assignTaskTo: { required: 'Please select to whom is the task for' },
        taskTitle: { required: 'Task title is required' },
        description: { required: "Description is required" }
    },
    submitHandler: () => {
        const formData = generateFormData('#addOnboardingTaskForm');

        const assignTaskTo = formData.get('assignTaskTo');
        const taskTitle = formData.get('taskTitle');
        const taskDescription = formData.get('description');

        const uniqueSuffix = `${Math.floor(Math.random() * 26)}${Date.now()}`;

        const startAtInputName = `startAt${ uniqueSuffix }`;
        const endAtInputName = `endAt${ uniqueSuffix }`;

        const taskType = () => {
            const taskTheme = {
                "For new employees": "success",
                "For the team": "info",
                "For department manager": "warning"
            }
            return `<span class="badge border border-${ taskTheme[assignTaskTo] } text-${ taskTheme[assignTaskTo] }">${ assignTaskTo }</span>`
        }

        if(addedOnboardingTasks.length == 0) $('#addedOnboardingTasksDTBody').empty();

        $('#addedOnboardingTasksDTBody').append(`
            <tr id="addedTaskRow${ uniqueSuffix }">
                <td>
                    <div>${ taskTitle }</div>
                    <div>${ taskType() }</div>
                    ${ TEMPLATE.SUBTEXT(taskDescription) }
                </td>
                <td>
                    <div class="form-group">
                        <input 
                            type="datetime-local" 
                            class="form-control form-control-border"
                            style="width: 15rem"
                            name="${ startAtInputName }"
                            id="${ startAtInputName }"
                            required
                        >
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <input 
                            type="datetime-local" 
                            class="form-control form-control-border"
                            style="width: 15rem"
                            name="${ endAtInputName }"
                            id="${ endAtInputName }"
                            required
                        >
                    </div>
                </td>
                <td>
                    ${
                        TEMPLATE.DT.OPTIONS(`
                            <!-- div 
                                class="dropdown-item d-flex"
                                role="button"
                                onclick="editAddedTask('${ uniqueSuffix }')"
                            >
                                <div style="width: 2rem"><i class="fas fa-edit mr-1"></i></div>
                                <span>Edit task</span>
                            -->
                            <div 
                                class="dropdown-item d-flex"
                                role="button"
                                onclick="removeAddedTask('${ uniqueSuffix }')"
                            >
                                <div style="width: 2rem"><i class="fas fa-trash-alt mr-1"></i></div>
                                <span>Remove</span>
                            </div>
                        `)
                    }
                </td>
            </tr>
        `);

        // Set Validation Rule
        $(`[name="${ startAtInputName }"]`).rules('add', {
            required: true,
            afterToday: true,
            beforeDateTime: `#${ endAtInputName }`,
            messages: {
                required: 'Start date is required',
                afterToday: 'It must be in the future',
                beforeDateTime: 'It must be before deadline'
            }
        });

        // Set Validation Rule
        $(`[name="${ endAtInputName }"]`).rules('add', {
            required: true,
            afterToday: true,
            afterDateTime: `#${ startAtInputName }`,
            messages: {
                required: 'Deadline is required',
                afterToday: 'It must be in the future',
                afterDateTime: 'It must be after start date'
            }
        });

        // Push Added Task to array
        addedOnboardingTasks.push({
            id: uniqueSuffix,
            task_type: assignTaskTo,
            task_title: taskTitle,
            description: taskDescription
        });

        // Check if there is no tasks
        checkIfNoTasks();

        // Hide modal
        hideModal('#addOnboardingTaskModal');

        // Show success alert
        toastr.success('Additional onboarding task has been added');

        return false;
    }
});

/** When add onboarding task modal is hidden */
onHideModal('#addOnboardingTaskModal', () => {
    $('#assignTaskTo').val('').trigger('change');
    resetForm('#addOnboardingTaskForm');
});

/** Edit Added Task */
const editAddedTask = (id) => {
    addedOnboardingTasks.forEach(t => {
        if(t.id == id) setValue({
            '#addedTaskID': t.id,
            '#taskTitleForEdit': t.task_title,
            '#descriptionForEdit': t.description
        });
    });
    showModal('#editAddedOnboardingTaskModal');
}

/** When Edit Added Onboarding Task Modal is going to be hidden */
onHideModal('#editAddedOnboardingTaskModal', () => resetForm('#editAddedOnboardingTaskForm'));

/** Validate Edit Added Onboarding Task Form */
validateForm('#editAddedOnboardingTaskForm', {
    rules: {
        taskTitle: { required: true },
        description: { required: true }
    },
    messages: {
        taskTitle: { required: 'Task Title is required' },
        description: { required: 'Task Description is required' }
    },
    submitHandler: () => {
        return false
    }
});

/** Remove Added Task */
const removeAddedTask = (id) => {
    setValue('#addedTaskIDForRemove', id);
    showModal('#confirmRemoveAddedTaskModal');
}

/** On Confirm Remove Added Task Modal is going to be hidden */
onHideModal('#confirmRemoveAddedTaskModal', () => resetForm('#confirmRemoveAddedTaskModal'));

/** Validate Confirm Remove Task Form */
validateForm('#confirmRemoveAddedTaskForm', {
    rules: {
        addedTaskID: { required: true }
    },
    messages: {
        addedTaskID: { required: 'These field must have value' }
    },
    submitHandler: () => {

        // Get added task ID from the form
        const addedTaskID = generateFormData('#confirmRemoveAddedTaskForm').get('addedTaskIDForRemove');

        // Remove the row from the table
        $(`#addedTaskRow${ addedTaskID }`).remove();

        // Remove the object from the array
        addedOnboardingTasks = addedOnboardingTasks.filter(t => { return t.id != addedTaskID });

        // Set the content if no rows in the table
        if(addedOnboardingTasks.length == 0) setContent('#addedOnboardingTasksDTBody', `
            <tr>
                <td colspan="4">
                    <div class="py-5 text-center">
                        <h3>No added tasks yet</h3>
                        <div class="text-secondary">You can add another onboarding task by clicking the button at the top-right.</div>
                    </div>
                </td>
            </tr>
        `);

        // Check if no tasks to enable/disable submit button
        checkIfNoTasks();

        // Hide confirm remove added task modal
        hideModal('#confirmRemoveAddedTaskModal');

        // Show info alert
        toastr.info('An added task has been removed');

        // Return false to prevent form from submitting
        return false;
    }
});

/** Validate Add Onboarding Employee Form */
validateForm('#addOnboardingEmployeeForm', {
    rules: addOnboardingEmployeeFormRules,
    messages: addOnboardingEmployeeFormMessages,
    submitHandler: () => {
        showModal('#confirmAddOnboardingEmployeeModal');
        return false;
    }
});

/** If confirm onboarding employee button has been clicked */
onClick('#confirmOnboardingEmployeeBtn', () => {

    // Buttons to loading state
    btnToLoadingState('#confirmOnboardingEmployeeBtn');
    disableElement('#cancelConfirmOnboardingEmployeeBtn');

    // Get form data
    const formData = generateFormData('#addOnboardingEmployeeForm');
    const get = (n) => { return formData.get(n) }

    // Set Data
    const onboardingEmployeeData = {
        first_name: get('firstName'),
        middle_name: get('middleName'),
        last_name: get('lastName'),
        suffix_name: get('suffixName'),
        contact_number: get('contactNumber'),
        email: get('email'),
        employment_start_date: get('employmentStartDate'),
        status: 'Onboarding'
    }

    // Update onboarding employee informations
    PUT_ajax(`${ ROUTE.API.DM }onboarding-employees/${ onboardingEmployeeID }`, onboardingEmployeeData, {
        success: result => {
            if(result) {
                
                // Add general tasks to employee
                if(generalOnboardingTasks.length > 0) {
                    generalOnboardingTasks.forEach(t => {
                        
                        // Set General Task Data 
                        const generalTasksData = {
                            onboarding_employee_id: onboardingEmployeeID,
                            onboarding_task_id: t.onboarding_task_id,
                            start_at: get(`startAt${ t.id }`),
                            end_at: get(`endAt${ t.id }`)
                        }

                        // Create onboarding employee task 
                        POST_ajax(
                            `${ ROUTE.API.DM }onboarding-employees/${ onboardingEmployeeID }/onboarding-tasks`, 
                                generalTasksData, {
                                success: () => {},
                                error: () => {
                                    toastr.error('There was an error in creating onboarding tasks to onboarding employee')
                                }
                            }
                        );
                    });
                }

                // Create and add onboarding tasks to employee
                if(addedOnboardingTasks.length > 0) {
                    addedOnboardingTasks.forEach(t => {

                        // Set added task data
                        const addedTasksData = {
                            title: t.task_title,
                            description: t.description,
                            task_type: t.task_type,
                            is_general: false
                        }
                        
                        // Create added task
                        POST_ajax(`${ ROUTE.API.DM }onboarding-tasks`, addedTasksData, {
                            success: result2 => {

                                // Set Added employee task data
                                const addedEmployeeTaskData = {
                                    onboarding_employee_id: onboardingEmployeeID,
                                    onboarding_task_id: result2.data.onboarding_task_id,
                                    start_at: get(`startAt${ t.id }`),
                                    end_at: get(`endAt${ t.id }`)
                                }

                                // Create added employee task
                                POST_ajax(
                                    `${ ROUTE.API.DM }onboarding-employees/${ onboardingEmployeeID }/onboarding-tasks`, 
                                    addedEmployeeTaskData, 
                                    {
                                        success: () => {},
                                        error: () => {
                                            toastr.error('There was an error in creating onbaording tasks to onboarding employee')
                                        }
                                    }
                                );
                            },
                            error: () => {
                                toastr.error('There was an error in adding onboarding task');
                            }
                        });
                    });
                }

                // Set sessioned alert and redirect
                setSessionedAlertAndRedirect({
                    theme: 'success',
                    message: 'A new onboarding employee has been added',
                    redirectURL: `${ ROUTE.WEB.DM }onboarding-employees`
                });
            }
        },
        error: () => {
            toastr.error('There was an error in adding onboarding employee')
        }
    });
});


/**
 * ==============================================================================
 * ADD GENERAL ONBOARDING TASKS
 * ==============================================================================
 */

/** Add general task */
const addGeneralTask = () => {
    const menu = URL_QUERY_PARAMS.get("menu");
    const taskDetails = {
        'for-new-employees': {
            taskType: "For new employees",
            taskDescription: "Add general task for new employees"
        },
        'for-the-team': {
            taskType: "For the team",
            taskDescription: "Add general task for the team"
        },
        'my-tasks': {
            taskType: "For department manager",
            taskDescription: "Add your general task as a department manager here"
        }
    }
    setValue('#taskType', taskDetails[menu].taskType);
    setContent('#onboardingTaskDescription', taskDetails[menu].taskDescription);
    showModal('#addGeneralTaskModal');
}

/** Validate Add General Task Form */
validateForm('#addGeneralTaskForm', {
    rules: {
        taskType: { required: true },
        taskTitle: { required: true },
        description: { required: true }
    },
    messages: {
        taskType: { required: 'Task Type must have value' },
        taskTitle: { required: 'Task title is required' },
        description: { required: 'Description is required' }
    },
    submitHandler: () => {
        addOnboardingTask();
        return false;
    }
});

/** On Add General Onboarding Task Modal is going to be hidden */
onHideModal('#addGeneralTaskModal', () => resetForm('#addGeneralTaskForm'));

/** Add onboarding task */
const addOnboardingTask = () => {
    
    // Set button to loading state
    btnToLoadingState('#addGeneralTaskBtn');
    disableElement('#cancelAddGeneralTaskBtn');

    const get = (n) => { return generateFormData('#addGeneralTaskForm').get(n) }

    const data = {
        title: get('taskTitle'),
        description: get('description'),
        task_type: get('taskType'),
        is_general: true
    }

    POST_ajax(`${ ROUTE.API.DM }onboarding-tasks`, data, {
        success: result => {
            if(result) {

                // Hide General Task Modal
                hideModal('#addGeneralTaskModal');            
                
                // Set button to unload state
                btnToUnloadState('#addGeneralTaskBtn', TEMPLATE.LABEL_ICON('Add', 'plus'));
                enableElement('#cancelAddGeneralTaskBtn');

                // Reload datatable
                reloadDataTable('#generalTasksDT');

                // Show success alert
                toastr.success('A new general onboarding task is successfully added');
            }
        },
        error: () => {

            // Hide add general task modal
            hideModal('#addGeneralTaskModal');            
            
            // Set buttons to unload state
            btnToUnloadState('#addGeneralTaskBtn', TEMPLATE.LABEL_ICON('Add', 'plus'));
            enableElement('#cancelAddGeneralTaskBtn');

            // Show error alert
            toastr.error('There was an error in adding a general inboarding tasks');
        }
    });
}


/**
 * ==============================================================================
 * GENERAL TASKS
 * ==============================================================================
 */

/** Initialize General Tasks DataTable */
const loadGeneralTasksDT = () => {

    const menu = URL_QUERY_PARAMS.get("menu");

    const titles = {
        'for-new-employees': 'Tasks for new employees',
        'for-the-team': 'Tasks for the team',
        'my-tasks': 'Your tasks'
    }

    setContent('#generalTasksTitle', titles[menu])

    initDataTable('#generalTasksDT', {
        url: `${ ROUTE.API.DM }onboarding-tasks/general/${ menu }`,
        columns: [

            // Created at (Hidden for default sorting)
            { data: 'created_at', visible: false },

            // Task Title
            {
                data: null,
                class: 'w-100',
                render: data => {
                    return `
                        <div>${ data.title }</div>
                        ${ TEMPLATE.SUBTEXT(data.description) }
                    `
                }
            },

            // Date Added
            {
                data: null,
                class: 'text-nowrap',
                render: data => {
                    const dateAdded = data.created_at;
                    return `
                        <div>${ formatDateTime(dateAdded, 'MMM. D, YYYY') }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(dateAdded)) }
                    `
                }
            },

            // Actions
            {
                data: null,
                render: data => {
                    const onboardingTaskID = data.onboarding_task_id;
                    return TEMPLATE.DT.OPTIONS(`
                        <div 
                            class="dropdown-item d-flex"
                            role="button"
                            onclick="viewOnboardingTaskDetails('${ onboardingTaskID }')"
                        >
                            <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                            <span>View Details</span>
                        </div>
                        <div 
                            class="dropdown-item d-flex"
                            role="button"
                            onclick="removeGenOnboardingTask('${ onboardingTaskID }')"
                        >
                            <div style="width: 2rem"><i class="fas fa-trash-alt mr-1"></i></div>
                            <span>Remove task</span>
                        </div>
                    `);
                }
            }
        ]
    });
}

ifSelectorExist('#generalTasksDT', () => loadGeneralTasksDT());

const loadGeneralTasksContent = (query) => {

    // Replace URL menu
    URL_QUERY_PARAMS.set('menu', query)
    history.replaceState(null, null, "?"+URL_QUERY_PARAMS.toString());

    // ReloadDataTable
    $('#generalTasksDT').dataTable().fnClearTable();
    $('#generalTasksDT').dataTable().fnDestroy();
    loadGeneralTasksDT();

    // Remove active class
    const menuIDs = ['#forNewEmployeesMenu', '#forTheTeamMenu', '#myTasksMenu'];
    menuIDs.forEach(id => $(id).removeClass('text-primary'))
}


$('#forNewEmployeesMenu').on('click', () => {
    if(URL_QUERY_PARAMS.get('menu') !== "for-new-employees") {
        loadGeneralTasksContent('for-new-employees');
        $('#forNewEmployeesMenu').addClass('text-primary');
    }
});
$('#forTheTeamMenu').on('click', () => {
    if(URL_QUERY_PARAMS.get('menu') !== "for-the-team") {
        loadGeneralTasksContent('for-the-team');
        $('#forTheTeamMenu').addClass('text-primary');
    }
});
$('#myTasksMenu').on('click', () => {
    if(URL_QUERY_PARAMS.get('menu') !== "my-tasks") {
        loadGeneralTasksContent('my-tasks');
        $('#myTasksMenu').addClass('text-primary');
    }
});


/** View Onboarding Task Details */
const viewOnboardingTaskDetails = (onboardingTaskID) => {
    GET_ajax(`${ ROUTE.API.DM }onboarding-tasks/${ onboardingTaskID }`, {
        success: result => {
            if(result) {
                
                // Set Task title
                setContent('#taskTitle', result.title);

                // Set Task Description
                setContent('#taskDescription', result.description);

                // Set Added By
                setContent('#addedBy', () => {
                    const addedBy = result.onboarding_task_added_by;
                    const addedByFullName = formatName('F M. L, S', {
                        firstName  : addedBy.first_name,
                        middleName : addedBy.middle_name,
                        lastName   : addedBy.last_name,
                        suffixName : addedBy.suffix_name
                    });
                    return `
                        <div>${ addedByFullName }</div>
                        ${ TEMPLATE.SUBTEXT(addedBy.position.name) }
                        ${ TEMPLATE.SUBTEXT(addedBy.position.sub_department.name) }
                    `
                });

                // Set Added At
                setContent('#addedAt', () => {
                    const addedAt = result.created_at;
                    return `
                        <div>${ formatDateTime(addedAt, 'Full Date') }</div>
                        <div>${ formatDateTime(addedAt, 'Time') }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(addedAt)) }
                    `
                });

                // Set Last Updated By
                setContent("#lastUpdatedBy", () => {
                    const updatedBy = result.onboarding_task_updated_by;

                    if(isEmptyOrNull(updatedBy)) {
                        return `<div class="text-secondary font-italic">Not updated yet</div>`
                    } else {
                        const updatedByFullName = formatName('F M. L, S', {
                            firstName  : updatedBy.first_name,
                            middleName : updatedBy.middle_name,
                            lastName   : updatedBy.last_name,
                            suffixName : updatedBy.suffix_name
                        });
                        return `
                            <div>${ updatedByFullName }</div>
                            ${ TEMPLATE.SUBTEXT(updatedBy.position.name) }
                            ${ TEMPLATE.SUBTEXT(updatedBy.position.sub_department.name) }
                        `
                    }
                });

                // Set Last Updated At
                setContent("#lastUpdatedAt", () => {
                    const updatedAt = result.updated_at;
                    return `
                        <div>${ formatDateTime(updatedAt, 'Full Date') }</div>
                        <div>${ formatDateTime(updatedAt, 'Time') }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(updatedAt)) }
                    `
                });

                // Show Modal
                showModal('#generalOnboardingTaskDetailsModal');
            }
        },
        error: () => toastr.error('There was an error in getting onboarding task details')
    });
}


/**
 * ==============================================================================
 * REMOVE GENERAL ONBOARDING TASKS
 * ==============================================================================
 */

const removeGenOnboardingTask = (onboardingTaskID) => {
    setValue('#onboardingTaskID', onboardingTaskID);
    showModal('#removeGenOnboardingTaskModal');
}

validateForm('#removeGenOnboardingTaskForm', {
    submitHandler: () => {
        const onboardingTaskID = generateFormData('#removeGenOnboardingTaskForm').get('onboardingTaskID')
        DELETE_ajax(`${ ROUTE.API.DM }onboarding-tasks/${ onboardingTaskID }/remove`, {
            success: result => {
                if(result) {
                    $('#generalTasksDT').dataTable().fnClearTable();
                    $('#generalTasksDT').dataTable().fnDestroy();
                    loadGeneralTasksDT();
                    hideModal('#removeGenOnboardingTaskModal');
                    toastr.info("A general onboarding task has been removed");
                }
            },
            error: () => toastr.error('There was an error in removing general onboarding task')
        })
        return false;
    }
})


/**
 * ==============================================================================
 * ONBOARDING EMPLOYEES
 * ==============================================================================
 */

/** Onboarding employees analytics */
ifSelectorExist('#onboardingEmployeesAnalyticsContainer', () => {
    GET_ajax(`${ ROUTE.API.DM }onboarding-employees/analytics`, {
        success: result => {

            // Set Total Onboarding Employees Count
            setContent('#totalOnboardingEmployeesCount', result.total);
        }, 
        error: () => toastr.error('There was an error in getting onboarding employee analytics')
    });
});

/** Initialize Onboarding Employees DataTable */
initDataTable('#onboardingEmployeesDT', {
    url: `${ ROUTE.API.DM }onboarding-employees`,
    columns: [

        // Created At (Hidden By Default)
        { data: 'created_at', visible: false },

        // Onboarding Employee
        {
            data: null,
            render: data => {
                const fullName = formatName('F M. L, S', {
                    firstName  : data.first_name,
                    middleName : data.middle_name,
                    lastName   : data.last_name,
                    suffixName : data.suffix_name
                });

                return `
                    <div>${ fullName }</div>
                    ${ TEMPLATE.SUBTEXT(data.onboarding_employee_position.name) }
                `
            }
        },

        // No. of tasks
        {
            data: null,
            render: data => {
                const tasksCount = data.onboarding_employee_tasks.length;
                return `${ tasksCount } ${ pluralize('task', tasksCount) }`
            }
        },

        // Task Progress
        {
            data: null,
            class: 'text-nowrap',
            render: data => {
                const tasks = data.onboarding_employee_tasks;
                if(tasks.length > 0) {
                    let completed = 0;
                    tasks.forEach(t => { if(t.status == "Completed") completed++ });
    
                    var taskProgress = ((completed/tasks.length) * 100).toFixed(2);
    
                    var bgColor;
                    if(taskProgress <= 25) bgColor = 'danger';
                    else if(taskProgress <= 75) bgColor = 'warning';
                    else if(taskProgress < 100) bgColor = 'info';
                    else if(taskProgress == 100) bgColor = 'success';
    
                    var completeStatus = taskProgress == 100
                        ? `
                            <small>
                                <i class="fas fa-check-circle text-success mr-1"></i>
                                <span>Completed</span>
                            </small>
                        ` 
                        : `<small>${ taskProgress }% complete</small>`
    
                    return `
                        <div class="project_progress">
                            <div class="progress progress-sm rounded">
                                <div 
                                    class="progress-bar bg-${ bgColor }" 
                                    role="progressbar" 
                                    aria-valuenow="${ taskProgress }" 
                                    aria-valuemin="0" 
                                    aria-valuemax="100" 
                                    style="width: ${ taskProgress }%"
                                ></div>
                            </div>
                            ${ completeStatus }
                        </div>
                    `
                } else {
                    return TEMPLATE.SUBTEXT(TEMPLATE.EMPTY('No tasks has been set'))
                }
            }
        },

        // Action
        {
            data: null,
            render: data => {
                return TEMPLATE.DT.OPTIONS(`
                    <a 
                        href="${ ROUTE.WEB.DM }onboarding-employees/${ data.onboarding_employee_id }/onboarding-tasks"
                        class="dropdown-item d-flex"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Tasks</div>
                    </a>
                `);
            }
        }
    ]
});


/**
 * ==============================================================================
 * ONBOARDING EMPLOYEE TASKS
 * ==============================================================================
 */

/** Assign Task To For Add Select 2 */
ifSelectorExist('#onboardingEmployeeTasksDT', () => $('#assignTaskTo').select2({
    placeholder: "Please select for whom the task for",
    minimumResultsForSearch: -1
}));


/** Initialize Onboarding Employee Tasks DataTable */
initDataTable('#onboardingEmployeeTasksDT', {
    url: `${ ROUTE.API.DM }onboarding-employees/${ onboardingEmployeeID }/onboarding-tasks`,
    columns: [

        // Start at (Hidden for default sorting)
        { data: 'start_at', visible: false },

        // Tasks
        {
            data: null,
            class: 'w-100',
            render: data => {
                const task = data.onboarding_task, startAt = data.start_at, deadline = data.end_at;

                const taskType = () => {
                    const taskType = task.task_type;
                    const taskTheme = {
                        "For new employees": "success",
                        "For the team": "info",
                        "For department manager": "warning"
                    }
                    return `<span class="badge border border-${ taskTheme[taskType] } text-${ taskTheme[taskType] }">${ taskType }</span>`
                }

                return `
                    <div>
                        <div>
                            <span>${ task.title }</span>
                            <span class="ml-sm-1">${ taskType() }</span>
                        </div>
                        <div class="small text-secondary mb-3">${ task.description }</div>
                        <div class="small d-flex mb-2">
                            <div class="mr-1">
                                <i class="fas fa-hourglass-half text-secondary"></i>
                            </div>
                            <div class="font-weight-bold">
                                <div>Start: ${ formatDateTime(startAt, 'DateTime') }</div>
                                <div>End: ${ formatDateTime(deadline, 'DateTime')  }</div>
                            </div>
                        </div>
                        <div>${ getOnboardingEmployeeTaskStatus(data.status, startAt, deadline, data.completed_at) }</div>
                    </div>
                `
            }
        },

        // Action
        { 
            data: null,
            render: data => {
                const onboardingEmplyeeTaskID = data.onboarding_employee_task_id;

                const markAsCompletedLink = () => {
                    return data.status == "Pending" || data.status == "On Going"
                        ? `
                            <div 
                                class="dropdown-item d-flex"
                                role="button"
                                onclick="changeProgressStatus('${ onboardingEmplyeeTaskID }')"
                            >
                                <div style="width: 2rem"><i class="fas fa-edit mr-1"></i></div>
                                <span>Change Task Progress</span>
                            </div>
                        `
                        : ''
                }

                const deleteTask = () => {
                    return data.status == "Pending"
                        ? `
                            <div class="dropdown-divider"></div>
                            <div 
                                class="dropdown-item d-flex"
                                role="button"
                                onclick="deleteOnboardingEmployeeTask('${ onboardingEmplyeeTaskID }')"
                            >
                                <div style="width: 2rem"><i class="fas fa-trash-alt mr-1"></i></div>
                                <span>Delete Task</span>
                            </div>
                        `
                        : ''
                }

                return TEMPLATE.DT.OPTIONS(`
                    <div 
                        class="dropdown-item d-flex"
                        role="button"
                        onclick="viewOnboardingEmployeeTaskDetails('${ onboardingEmplyeeTaskID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <span>View Details</span>
                    </div>
                    ${ markAsCompletedLink() }
                    ${ deleteTask() }
                `);
            }
        }
    ]
});

/** Initialize Onboarding Employee Tasks Doughnut Chart */
let onboardingEmployeeTasksDoughnutChart;
ifSelectorExist('#onboardingEmployeeTasksDoughnutChart', () => {
    onboardingEmployeeTasksDoughnutChart = new Chart($('#onboardingEmployeeTasksDoughnutChart').get(0).getContext('2d'), {
        type: 'doughnut',
        data: CHART_CONFIG.NO_DATA,
        options: CHART_CONFIG.PIE.OPTIONS,
        plugins: CHART_CONFIG.PIE.PLUGINS
    });
});

/** Get Onboarding Employee Details */
const getOnboardingEmployeeDetails = () => {
    GET_ajax(`${ ROUTE.API.DM }onboarding-employees/${ onboardingEmployeeID }`, {
        success: result => {

            // Get task Progress
            const getTaskProgress = () => {
                const onboardingEmployeeTasks = result.onboarding_employee_tasks;
                const chartConfig = onboardingEmployeeTasksDoughnutChart.config;
                if(onboardingEmployeeTasks.length > 0) {
                    let pending = 0, onGoing = 0, completed = 0, sum = 0;
                    const taskProgressIterator = {
                        'Pending': () => pending++,
                        'On Going': () => onGoing++,
                        'Completed': () => completed++
                    }
    
                    onboardingEmployeeTasks.forEach(t => {
                        taskProgressIterator[t.status]();
                        sum++;
                    });
    
                    // Configure Onboarding Employee Task Doughnut Chart
                    chartConfig.data = {
                        labels: ['Pending','On Going','Completed',],
                        datasets: [{
                            data: [pending, onGoing, completed],
                            backgroundColor : [
                                CHART_BG.WARNING,
                                CHART_BG.INFO,
                                CHART_BG.SUCCESS
                            ],
                            borderColor:  [
                                CHART_BD.WARNING,
                                CHART_BD.INFO,
                                CHART_BD.SUCCESS
                            ],
                            borderWidth: 2
                        }]
                    }
    
                    // Update chart
                    onboardingEmployeeTasksDoughnutChart.update();
    
                    // Task Progress
                    const taskProgress = ((completed/sum)*100).toFixed(2);
                    return taskProgress == 100 
                        ? `All tasks are completed` 
                        : `${ taskProgress }% tasks are completed`
                } else {
                    
                    // Set empty data to chart
                    chartConfig.data = CHART_CONFIG.NO_DATA

                    // Update chart
                    onboardingEmployeeTasksDoughnutChart.update();
                    
                    return TEMPLATE.EMPTY('No task has been set')
                }
            }

            const employeeFullName = formatName('F M. L, S', {
                firstName: result.first_name,
                middleName: result.middle_name,
                lastName: result.last_name,
                suffixName: result.suffix_name
            })

            const employmentStartDate = formatDateTime(result.employment_start_date, 'Full Date');

            // Set employee details (summary)
            setContent({
                '#employeeFullName': employeeFullName,
                '#employeePosition': result.onboarding_employee_position.name,
                '#taskProgress': getTaskProgress(),
                '#employeeEmail': result.email,
                '#employeeContactNumber':result.contact_number,
                '#startOfEmploymentDate': employmentStartDate,
                '#startOfEmploymentHumanized': fromNow(result.employment_start_date),
                '#employeeDetailsBtns': `
                    <div 
                        class="dropdown-item d-flex"
                        data-toggle="modal"
                        data-target="#onboardingEmployeeDetailsModal"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <span>View Full Details</span>
                    </div>
                    <a 
                        href="${ EMPLOYMENT_CONTRACT_PATH }${ result.employment_contract }" 
                        class="dropdown-item d-flex"
                        target="_blank"
                    >
                        <div style="width: 2rem"><i class="fas fa-file-alt mr-1"></i></div>
                        <div>
                            <div>View Employment Contract</div>
                            <div class="small">Click here to view contract</div>
                        </div>
                    </a>
                    <div 
                        class="dropdown-item d-flex"
                        data-toggle="modal"
                        data-target="#editOnboardingEmployeeDetailsModal"
                    >
                        <div style="width: 2rem"><i class="fas fa-edit mr-1"></i></div>
                        <span>Edit Details</span>
                    </div>
                `
            });

            // Set employee details (summary)
            setContent({
                '#employeeFullNameForDetails': employeeFullName,
                '#employeePositionForDetails': result.onboarding_employee_position.name,
                '#employeeContactNumberForDetails': result.contact_number,
                '#employeeEmailForDetails': result.email,
                '#employmentStartDetails': `
                    ${employmentStartDate}
                    <div class="small">${ fromNow(result.employment_start_date) }</div>
                `
            });

            $('#employmentContractBtn').attr('href', `${ EMPLOYMENT_CONTRACT_PATH }${ result.employment_contract }`);

            // Remove loader and show container
            $('#onboardingEmployeeDetailsLoader').remove();
            showElement('#onboardingEmployeeDetails');
        },
        error: () => toastr.error('There was an error in getting onboarding employee details')
    });
}

/** Onboarding Employee Details */
ifSelectorExist('#onboardingEmployeeDetails', () => getOnboardingEmployeeDetails());

/** Mark as Completed */
const changeProgressStatus = (onboardingEmployeeTaskID) => {
    GET_ajax(`${ ROUTE.API.DM }onboarding-employee-tasks/${ onboardingEmployeeTaskID }`, {
        success: result => {
            switch(result.status) {
                case "Pending": checkElement('#pending'); break;
                case "On Going": checkElement('#onGoing'); break;
                case "Completed": checkElement('#completed'); break;
            }
            setValue('#onboardingEmployeeTaskID', onboardingEmployeeTaskID);
            showModal('#changeTaskStatusModal');
        },
        error: () => toastr.error('There was an error in getting onboarding task details')
    });
}

/** When confirm mark as completed modal was hidden */
onHideModal('#changeTaskStatusModal', () => resetForm('#updateTaskStatusForm'));

/** Validate Form */
validateForm('#updateTaskStatusForm', {
    submitHandler: () => {
        
        // Set buttons to loading state
        btnToLoadingState('#saveOnboardingTaskStatusBtn');
        disableElement('#cancelSaveOnboardingTaskStatusBtn');

        // Generate form data
        const formData = generateFormData('#updateTaskStatusForm');
        const status = formData.get('taskStatus');
        const onboardingEmployeeTaskID = formData.get('onboardingEmployeeTaskID');

        const data = { status: status }

        PUT_ajax(`${ ROUTE.API.DM }onboarding-employee-tasks/${ onboardingEmployeeTaskID }`, data, {
            success: result => {
                if(result) {
                    // Reload DataTable
                    reloadDataTable('#onboardingEmployeeTasksDT');

                    // Reload Onboarding Employee Details
                    getOnboardingEmployeeDetails();

                    // Hide Modal
                    hideModal('#changeTaskStatusModal');

                    // Set buttons to loading state
                    btnToUnloadState('#saveOnboardingTaskStatusBtn', TEMPLATE.LABEL_ICON('Save', 'check'));
                    enableElement('#cancelSaveOnboardingTaskStatusBtn');

                    // Show alert
                    toastr.info('An onboarding task has been updated successfully')
                } else toastr.error('There was an error in updating onboarding task')
            },
            error: () => toastr.error('There was an error in updating onboarding task')
        });
        return false;
    }
})

/** View Onboarding Employee Task Details */
const viewOnboardingEmployeeTaskDetails = (onboardingEmployeeTaskID) => {
    GET_ajax(`${ ROUTE.API.DM }onboarding-employee-tasks/${ onboardingEmployeeTaskID }`, {
        success: result => {

            /** ONBOARDING EMPLOYEE TASK DETAILS */
            const onboardingTask = result.onboarding_task;

            // Get Task Status
            const getTaskStatus = () => {
                const status = result.status;
                return status === "Completed"
                    ? `
                        <div>Completed</div>
                        <div>${ formatDateTime(result.completed_at, 'Full DateTime') }</div>
                        ${ TEMPLATE.SUBTEXT(fromNow(result.completed_at)) }
                    `
                    : status
            }

            // Set Onboarding Employee Task Details
            setContent({
                '#taskTitle': onboardingTask.title,
                '#taskDescription': onboardingTask.description,
                '#taskType': onboardingTask.task_type,
                '#taskStart': `
                    <div>${ formatDateTime(result.start_at, 'Full Date') }</div>
                    <div>${ formatDateTime(result.start_at, 'Time') }</div>
                    ${ TEMPLATE.SUBTEXT(fromNow(result.start_at)) }
                `,
                '#taskEnd': `
                    <div>${ formatDateTime(result.end_at, 'Full Date') }</div>
                    <div>${ formatDateTime(result.end_at, 'Time') }</div>
                    ${ TEMPLATE.SUBTEXT(fromNow(result.end_at)) }
                `,
                '#taskStatus': getTaskStatus(),
                '#progress': getOnboardingEmployeeTaskStatus(result.status, result.start_at, result.end_at, result.completed_at)
            });

            /** ONBOARDING EMPLOYEE TASK TIMELINE */
            setOnboardingEmployeeTaskTimeline('#onboardingEmployeeTaskTimeline', result);

            // Set Onboarding Employee Task
            hideElement('#onboardingEmployeeTaskTimelineLoader');
            showElement('#onboardingEmployeeTaskTimeline');
        },
        error: () => toastr.error('There was an error in getting onboarding employee task details')
    });
    showModal('#onboardingEmployeeTaskDetailsModal');
}

/** On Onboarding Employee Task Details Modal has been hidden */
onHideModal('#onboardingEmployeeTaskDetailsModal', () => {
    showElement('#onboardingEmployeeTaskTimelineLoader');
    hideElement('#onboardingEmployeeTaskTimeline');
    $('#taskDetailsTab').tab('show');
});


/** Delete Onboarding Employee Task */
const deleteOnboardingEmployeeTask = (onboardingEmplyeeTaskID) => {
    setValue('#onboardingEmployeeTaskIDForDelete', onboardingEmplyeeTaskID);
    showModal('#deleteOnboardingEmployeeTaskModal');
}

/** Validate Delete Onboarding Employee Task Form */
validateForm('#deleteOnbaordingEmployeeTaskForm', {
    submitHandler: () => {
        
        // Set buttons to loading state
        btnToLoadingState('#deleteOnboardingEmployeeTaskBtn');
        disableElement('#cancelDeleteOnboardingEmployeeTaskBtn');

        const onboardingEmplyeeTaskID = generateFormData('#deleteOnbaordingEmployeeTaskForm').get('onboardingEmployeeTaskID');

        DELETE_ajax(`${ ROUTE.API.DM }onboarding-employee-tasks/${ onboardingEmplyeeTaskID }`, {
            success: result => {
                if(result) {

                    // Reload DataTable
                    reloadDataTable('#onboardingEmployeeTasksDT');

                    // Reload Onboarding Employee Details
                    getOnboardingEmployeeDetails();

                    // Hide Modal
                    hideModal('#deleteOnboardingEmployeeTaskModal');

                    // Set buttons to unload state
                    btnToUnloadState('#deleteOnboardingEmployeeTaskBtn', TEMPLATE.LABEL_ICON('Yes, delete it.', 'trash-alt'));
                    enableElement('#cancelDeleteOnboardingEmployeeTaskBtn');

                    // Show alert
                    toastr.info('A task is successfully deleted');

                } else toastr.error('There was an error in deleting onboarding employee task')
            },
            error: () => toastr.error('There was an error in deleting onboarding employee task')
        });

        return false;
    }
})



/**
 * ==============================================================================
 * ADD ONBOARDING EMPLOYEE TASKS
 * ==============================================================================
 */

// Validate Add Onboarding Employee Task Form
validateForm('#addOnboardingEmployeeTaskForm', {
    rules: {
        assignTaskTo: {
            required: true
        },
        taskTitle: {
            required: true
        },
        description: {
            required: true
        },
        startAt: {
            required: true,
            afterToday: true,
            beforeDateTime: '#deadline'
        },
        deadline: {
            required: true,
            afterToday: true,
            afterDateTime: '#startAt'
        }

    },
    messages: {
        assignTaskTo: {
            required: 'Please select for whom the task is'
        },
        taskTitle: {
            required: 'Task title is required'
        },
        description: {
            required: 'Task description is required'
        },
        startAt: {
            required: 'Start date and time is required',
            afterToday: 'It must be in the future',
            beforeDateTime: 'It must be before deadline'
        },
        deadline: {
            required: 'Deadline is required',
            afterToday: 'It must be in the future',
            afterDateTime: 'It must be after start date and time'
        }

    },
    submitHandler: () => {

        // Set buttons to loading state
        btnToLoadingState('#addOnboardingEmployeeTaskBtn');
        disableElement('#cancelAddOnboardingEmployeeTaskBtn');
    
        // For getting values in formData
        const get = (n) => { return generateFormData('#addOnboardingEmployeeTaskForm').get(n) }

        // Set Data
        const newOnboardingTaskData = {
            title: get('taskTitle'),
            description: get('description'),
            task_type: get('assignTaskTo'),
            is_general: false
        }
        
        // Add New Onboarding Task
        POST_ajax(`${ ROUTE.API.DM }onboarding-tasks`, newOnboardingTaskData, {
            success: result => {
                if(result) {

                    // Set Data
                    const newOnboardingEmployeeTaskData = {
                        onboarding_task_id: result.data.onboarding_task_id,
                        start_at: get('startAt'),
                        end_at: get('deadline')
                    }

                    // Add New Onboarding Employee Task
                    POST_ajax(
                        `${ ROUTE.API.DM }onboarding-employees/${ onboardingEmployeeID }/onboarding-tasks`, 
                            newOnboardingEmployeeTaskData, {
                            success: result => {
                                if(result) {

                                    // Set buttons to unload state
                                    btnToUnloadState('#addOnboardingEmployeeTaskBtn', TEMPLATE.LABEL_ICON('Add', 'plus'));
                                    enableElement('#cancelAddOnboardingEmployeeTaskBtn');

                                    // Reload DataTable
                                    reloadDataTable('#onboardingEmployeeTasksDT');

                                    // Reload Onboarding Employee Details
                                    getOnboardingEmployeeDetails()

                                    // Hide Modal
                                    hideModal('#addOnboardingEmployeeTaskModal');

                                    // Show Alert
                                    toastr.success('A new onboarding task is successfully added');
                                } else toastr.error('There was an error in creating onbaording tasks to onboarding employee')
                            },
                            error: () => toastr.error('There was an error in creating onbaording tasks to onboarding employee')
                        }
                    );
                } else toastr.error('There was an error in adding new onboarding task')
            },
            error: () => toastr.error('There was an error in adding new onboarding task')
        });

        return false;
    }
});


// On Add Onboarding Employee Task Modal is going to be hidden
onHideModal('#addOnboardingEmployeeTaskModal', () => {
    $('#assignTaskTo').val('').trigger('change');
    resetForm('#addOnboardingEmployeeTaskForm');
});