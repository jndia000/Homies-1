"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
 */

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