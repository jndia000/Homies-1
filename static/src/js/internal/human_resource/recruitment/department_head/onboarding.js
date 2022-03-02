"use strict";

/**
 * ==============================================================================
 * CONSTANTS
 * ==============================================================================
 */

/** Onboarding Employee ID */
const onboardingEmployeeID = getPathnamePart(2);


/**
 * ==============================================================================
 * ONBOARDING EMPLOYEES
 * ==============================================================================
 */

/** Onboarding employees analytics */
ifSelectorExist('#onboardingEmployeesAnalyticsContainer', () => {
    GET_ajax(`${ ROUTE.API.DH }onboarding-employees/analytics`, {
        success: result => {

            // Set Total Onboarding Employees Count
            setContent('#totalOnboardingEmployeesCount', result.total);
        }, 
        error: () => toastr.error('There was an error in getting onboarding employee analytics')
    });
});

/** Initialize Onboarding Employees DataTable */
initDataTable('#onboardingEmployeesDT', {
    url: `${ ROUTE.API.DH }onboarding-employees`,
    columns: [

        // Created At (Hidden By Default)
        { data: 'created_at', visible: false },

        // Onboarding Employee
        {
            data: null,
            render: data => {
                const fullName = formatName('F M. L, S', {
                    firstName   : data.first_name,
                    middleName  : data.middle_name,
                    lastName    : data.last_name,
                    suffix_name : data.suffix_name
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
                return  TEMPLATE.DT.OPTIONS(`
                    <a 
                        href="${ ROUTE.WEB.DH }onboarding-employees/${ data.onboarding_employee_id }/onboarding-tasks"
                        class="dropdown-item d-flex"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Tasks</div>
                    </a>
                `)
            }
        }
    ]
});


/**
 * ==============================================================================
 * ONBOARDING EMPLOYEE TASKS
 * ==============================================================================
 */

/** Initialize Onboarding Employee Tasks DataTable */
initDataTable('#onboardingEmployeeTasksDT', {
    url: `${ ROUTE.API.DH }onboarding-employees/${ onboardingEmployeeID }/onboarding-tasks`,
    columns: [

        // Start at (Hidden for default sorting)
        { data: 'start_at', visible: false },

        // Tasks
        {
            data: null,
            class: 'w-100',
            render: data => {
                const task = data.onboarding_task;
                const startAt = data.start_at;
                const deadline = data.end_at;

                const taskType = () => {
                    const taskTheme = {
                        "For new employees": "success",
                        "For the team": "info",
                        "For department manager": "warning"
                    }
                    return `<span class="badge border border-${ taskTheme[task.task_type] } text-${ taskTheme[task.task_type] }">${ task.task_type }</span>`
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

                return TEMPLATE.DT.OPTIONS(`
                    <div 
                        class="dropdown-item d-flex"
                        role="button"
                        onclick="viewOnboardingEmployeeTaskDetails('${ onboardingEmplyeeTaskID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <span>View Details</span>
                    </div>
                `)
            }
        }
    ]
});


/** Initialize Onboarding Employee Tasks Doughnut Chart */
const onboardingEmployeeTasksDoughnutChart = new Chart($('#onboardingEmployeeTasksDoughnutChart').get(0).getContext('2d'), {
    type: 'doughnut',
    data: CHART_CONFIG.NO_DATA,
    options: CHART_CONFIG.PIE.OPTIONS,
    plugins: CHART_CONFIG.PIE.PLUGINS
});


/** Get Onboarding Employee Details */
const getOnboardingEmployeeDetails = () => {
    GET_ajax(`${ ROUTE.API.DH }onboarding-employees/${ onboardingEmployeeID }`, {
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
                    return taskProgress === 100 
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

            setContent({
                '#employeeFullName': formatName('F M. L, S', {
                    firstName  : result.first_name,
                    middleName : result.middle_name,
                    lastName   : result.last_name,
                    suffixName : result.suffix_name
                }),
                '#employeePosition': result.onboarding_employee_position.name,
                '#taskProgress': getTaskProgress(),
                '#employeeEmail': result.email,
                '#employeeContactNumber': result.contact_number,
                '#startOfEmploymentDate': formatDateTime(result.employment_start_date, 'Full Date'),
                '#startOfEmploymentHumanized': fromNow(result.employment_start_date),
                '#employeeDetailsBtns': `
                    <div class="dropdown-item d-flex">
                        <div style="width: 2rem"><i class="fas fa-list mr-1"></i></div>
                        <div>View Full Details</div>
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
                `
            });

            // Remove loader and show container
            $('#onboardingEmployeeDetailsLoader').remove();
            showElement('#onboardingEmployeeDetails');
        },
        error: () => toastr.error('There was an error in getting onboarding employee details')
    });
}

/** Onboarding Employee Details */
ifSelectorExist('#onboardingEmployeeDetails', () => getOnboardingEmployeeDetails());

/** View Onboarding Employee Task Details */
const viewOnboardingEmployeeTaskDetails = (onboardingEmployeeTaskID) => {
    GET_ajax(`${ ROUTE.API.DH }onboarding-employee-tasks/${ onboardingEmployeeTaskID }`, {
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
    })
    showModal('#onboardingEmployeeTaskDetailsModal');
}

/** On Onboarding Employee Task Details Modal has been hidden */
onHideModal('#onboardingEmployeeTaskDetailsModal', () => {
    showElement('#onboardingEmployeeTaskTimelineLoader');
    hideElement('#onboardingEmployeeTaskTimeline');
    $('#taskDetailsTab').tab('show');
});
