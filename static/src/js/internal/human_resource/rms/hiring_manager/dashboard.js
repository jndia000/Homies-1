"use strict";

// Set Date Range Filter
const setDateRangeFilter = (start, end, label) => { 
    setContent('#selectedFilter', label)
    setContent('#selectedDate', `From <b>${ formatDateTime(start, 'MMM. D, YYYY; hh:mm A') }</b> to <b>${ formatDateTime(end, 'MMM. D, YYYY; hh:mm A') }</b>`)
}


/** INITIALIZE CHARTS */

// Manpower Request Bar Chart
const manpowerRequestsBarChart = new Chart($('#manpowerRequestsBarChart').get(0).getContext('2d'), {
    type: 'bar',
    data: {
        datasets: [{
            label: "Manpower Requests",
            backgroundColor: CHART_BG.INFO,
            borderColor: CHART_BD.INFO,
            borderWidth: CHART_BD.WIDTH,
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date Requested',
                    font: {
                        weight: 'bold'
                    }
                },
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM. d, yyyy'
                    },
                },
                min: START_DATE_RANGE.format("YYYY-MM-DD"),
                max: END_DATE_RANGE.format("YYYY-MM-DD"),
            },
            y: {
                title: {
                    display: true,
                    text: 'Frequency',
                    font: {
                        weight: 'bold'
                    }
                },
                ticks: {
                    stepSize: 1
                }
            }
        },
        parsing: {
            xAxisKey: 'created_at',
            yAxisKey: 'total',
        }
    },
});

// Manpower Request Status Pie Chart
const manpowerRequestsStatusPieChart = new Chart($('#manpowerRequestsStatusPieChart').get(0).getContext('2d'), {
    type: 'pie',
    data: CHART_CONFIG.NO_DATA,
    options: CHART_CONFIG.PIE.OPTIONS,
    plugins: CHART_CONFIG.PIE.PLUGINS
});

// Job Posts Status Pie Chart
const jobPostsStatusPieChart = new Chart($('#jobPostsStatusPieChart').get(0).getContext('2d'), {
    type: 'doughnut',
    data: CHART_CONFIG.NO_DATA,
    options: CHART_CONFIG.PIE.OPTIONS,
    plugins: CHART_CONFIG.PIE.PLUGINS
});

// Job Posts Bar Chart
const jobPostsBarChart = new Chart($('#jobPostsBarChart').get(0).getContext('2d'), {
    type: 'bar',
    data: {
        datasets: [{
            label: "Job Posts",
            backgroundColor: CHART_BG.PRIMARY,
            borderColor: CHART_BD.PRIMARY,
            borderWidth: CHART_BD.WIDTH,
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date Created',
                    font: {
                        weight: 'bold'
                    }
                },
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM. d, yyyy'
                    },
                },
                min: START_DATE_RANGE.format("YYYY-MM-DD"),
                max: END_DATE_RANGE.format("YYYY-MM-DD"),
            },
            y: {
                title: {
                    display: true,
                    text: 'No. of Job Posts',
                    font: { weight: 'bold' }
                },
                ticks: { stepSize: 1 }
            }
        },
        parsing: {
            xAxisKey: 'created_at',
            yAxisKey: 'total',
        }
    },
});

// Applicants Line Chart
const applicantsLineChart = new Chart($('#applicantsLineChart').get(0).getContext('2d'), {
    type: 'line',
    data: {
        datasets: [{
            label: 'Applications',
            backgroundColor: CHART_BG.WARNING,
            borderColor: CHART_BD.WARNING,
            borderWidth: CHART_BD.WIDTH
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date Applied',
                    font: {
                        weight: 'bold'
                    }
                },
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM. d, yyyy'
                    },
                },
                min: START_DATE_RANGE.format("YYYY-MM-DD"),
                max: END_DATE_RANGE.format("YYYY-MM-DD"),
            },
            y: {
                title: {
                    display: true,
                    text: 'No. of Applications',
                    font: {
                        weight: 'bold'
                    }
                },
                ticks: { stepSize: 1 }
            }
        },
        parsing: {
            xAxisKey: 'created_at',
            yAxisKey: 'total',
        }
    }
});

// Application Status Pie Chart
const applicationStatusPieChart = new Chart($('#applicationStatusPieChart').get(0).getContext('2d'), {
    type: 'pie',
    data: CHART_CONFIG.NO_DATA,
    options: CHART_CONFIG.PIE.OPTIONS,
    plugins: CHART_CONFIG.PIE.PLUGINS
});


/** SET PAGE TO LOADING STATE */

const setToLoadingState = () => {
    const SPINNER = '<span class="spinner-border"></span>'
    const SPINNER_SM = '<span class="spinner-border spinner-border-sm"></span>'


    /** INFO CARDS */

    setContent({
        '#manpowerRequestsCountForInfoCard': SPINNER,
        '#jobPostsCountForInfoCard': SPINNER,
        '#applicationsCountForInfoCard': SPINNER
    });


    /** MANPOWER REQUESTS */

    // Footer
    setContent({
        '#totalMRCountForFooter': SPINNER_SM,
        '#forReviewMRCountForFooter': SPINNER_SM,
        '#approvedMRCountForFooter': SPINNER_SM,
        '#rejectedMRCountForFooter': SPINNER_SM,
    });


    /** JOB POSTS */

    // Footer
    setContent({
        '#totalJPCountForFooter': SPINNER_SM,
        '#onGoingJPCountForFooter': SPINNER_SM,
        '#endedJPCountForFooter': SPINNER_SM
    });


    /** APPLICANTS */
    setContent({
        '#totalACountForFooter': SPINNER_SM,
        '#onProcessACountForFooter': SPINNER_SM,
        '#contractSignedACountForFooter': SPINNER_SM,
        '#rejectedACountForFooter': SPINNER_SM
    });
}


/** RENDER DATA */

const renderData = (start, end) => {

    // Set page to loading state
    setToLoadingState();

    // Set date range paramaters for API
    const DATE_RANGE = TEMPLATE.URL_QUERY_PARAM.DATE_RANGE(start.format(), end.format());


    /** FOR INFO CARDS, PIE CHARTS */

    // Manpower Request Analytics
    GET_ajax(`${ ROUTE.API.H }manpower-requests/analytics${ DATE_RANGE }`, {
        success: result => {
            
            // Set content for info card
            setContent('#manpowerRequestsCountForInfoCard', formatNumber(result.total));

            // Configure chart
            const chartConfig = manpowerRequestsStatusPieChart.config;

            // Update chart data
            if(result.total > 0) chartConfig.data = {
                labels: [
                    'For Review',
                    'Approved',
                    'Rejected'
                ],
                datasets: [{
                    data: [
                        result.for_review, 
                        result.approved.total,
                        result.rejected
                    ],
                    backgroundColor : [
                        CHART_BG.WARNING, 
                        CHART_BG.SUCCESS, 
                        CHART_BG.DANGER
                    ],
                    borderColor: [
                        CHART_BD.WARNING, 
                        CHART_BD.SUCCESS, 
                        CHART_BD.DANGER
                    ],
                    borderWidth: CHART_BD.WIDTH
                }]
            }
            else chartConfig.data = CHART_CONFIG.NO_DATA
            
            // Commit data
            manpowerRequestsStatusPieChart.update();

            // Set content for footer
            setContent({
                '#totalMRCountForFooter': formatNumber(result.total),
                '#forReviewMRCountForFooter': formatNumber(result.for_review),
                '#approvedMRCountForFooter': formatNumber(result.approved.total),
                '#rejectedMRCountForFooter': formatNumber(result.rejected),
            });
        },
        error: () => toastr.error('There was an error in getting manpower requests analytiscs')
    });
    
    // Job Posts Analytics
    GET_ajax(`${ ROUTE.API.H }job-posts/analytics${ DATE_RANGE }`, {
        success: result => {
            
            // Set content for info card
            setContent('#jobPostsCountForInfoCard', formatNumber(result.total));

            // Configure chart
            const chartConfig = jobPostsStatusPieChart.config;

            // Update chart data
            if(result.total > 0) chartConfig.data = {
                labels: ['On Going','Ended'],
                datasets: [{
                    data: [result.on_going, result.ended],
                    backgroundColor : [CHART_BG.INFO, CHART_BG.DANGER],
                    borderColor: [CHART_BD.INFO, CHART_BD.DANGER],
                    borderWidth: CHART_BD.WIDTH
                }]
            }
            else { chartConfig.data = CHART_CONFIG.NO_DATA; }

            // Commit data
            jobPostsStatusPieChart.update();

            // Set content for footer
            setContent({
                '#totalJPCountForFooter': result.total,
                '#onGoingJPCountForFooter': result.on_going,
                '#endedJPCountForFooter': result.ended
            });
        },
        error: () => toastr.error('There was an error in getting on going job posts count')
    });

    // Applicants Analytics
    GET_ajax(`${ ROUTE.API.H }applicants/analytics${ DATE_RANGE }`, {
        success: result => {

            console.log(result)

            // Set info card content
            setContent('#applicationsCountForInfoCard', result.total)

            // Configure chart
            const chartConfig = applicationStatusPieChart.config;

            // Update chart data
            if(result.total > 0) chartConfig.data = {
                labels: [
                    'For Evaluation',
                    'For Screening',
                    'For Interview',
                    'Hired',
                    'Contract Signed',
                    'Rejected'
                ],
                datasets: [{
                    data: [
                        result.for_evaluation,
                        result.for_screening,
                        result.for_interview,
                        result.hired,
                        result.contract_signed,
                        result.rejected.total
                    ],
                    backgroundColor : [
                        CHART_BG.WARNING, 
                        CHART_BG.SECONDARY, 
                        CHART_BG.INFO, 
                        CHART_BG.SUCCESS, 
                        CHART_BG.PRIMARY, 
                        CHART_BG.DANGER
                    ],
                    borderColor:[
                        CHART_BD.WARNING, 
                        CHART_BD.SECONDARY, 
                        CHART_BD.INFO, 
                        CHART_BD.SUCCESS, 
                        CHART_BD.PRIMARY, 
                        CHART_BD.DANGER
                    ],
                    borderWidth: CHART_BD.WIDTH
                }]
            }
            else chartConfig.data = CHART_CONFIG.NO_DATA
            
            // Commit data
            applicationStatusPieChart.update();

            // Set content for footer
            setContent({
                '#totalACountForFooter': formatNumber(result.total),
                '#onProcessACountForFooter': formatNumber(result.for_screening + result.for_interview),
                '#contractSignedACountForFooter': formatNumber(result.contract_signed),
                '#rejectedACountForFooter': formatNumber(result.rejected.total)
            });
        }, 
        error: () => toastr.error('There was an error in geeting applicants analytics')
    });


    /** FOR BAR AND LINE CHARTS */

    // Manpower Requests Data
    GET_ajax(`${ ROUTE.API.H }manpower-requests/data${ DATE_RANGE }`, {
        success: result => {
            
            // Configure Chart
            const chartConfig = manpowerRequestsBarChart.config;
            
            // Update minimum and maximum x axis
            chartConfig.options.scales.x.min = start.format("YYYY-MM-DD");
            chartConfig.options.scales.x.max = end.format("YYYY-MM-DD");

            // Update data
            chartConfig.data.datasets[0].data = result;

            // Commit configuration updates
            manpowerRequestsBarChart.update();
        },
        error: () => toastr.error('There was an error in getting manpower requests data')
    });

    // Job Posts Data
    GET_ajax(`${ ROUTE.API.H }job-posts/data${ DATE_RANGE }`, {
        success: result => {

            // Configure Chart
            const chartConfig = jobPostsBarChart.config;
            
            // Update minimum and maximum x axis
            chartConfig.options.scales.x.min = start.format("YYYY-MM-DD");
            chartConfig.options.scales.x.max = end.format("YYYY-MM-DD");

            // Update data
            chartConfig.data.datasets[0].data = result;

            // Commit configuration updates
            jobPostsBarChart.update();
        },
        error: () => toastr.error('There was an error in getting job posts data')
    });

    // Applicants Data
    GET_ajax(`${ ROUTE.API.H }applicants/data${ DATE_RANGE }`, {
        success: result => {
            
            // Configure Chart
            const chartConfig = applicantsLineChart.config;
            
            // Update minimum and maximum x axis
            chartConfig.options.scales.x.min = start.format("YYYY-MM-DD");
            chartConfig.options.scales.x.max = end.format("YYYY-MM-DD");

            // Update data
            chartConfig.data.datasets[0].data = result;

            // Commit configuration updates
            applicantsLineChart.update();
        },
        error: () => toastr.error('There was an error in getting applicants data')
    });
}


/** AS DOCUMENT HAS BEEN LOADED */

(() => {

    if(isEmptyOrNull(DATE_RANGE_PARAM)) {
        // Set URL dateRange
        URL_QUERY_PARAMS.set('dateRange', DEFAULT_FILTER_RANGE)
        history.replaceState(null, null, "?" + URL_QUERY_PARAMS.toString());
    }
    
    /** Initialize DateRange Filter */
    setDateRangeFilter(START_DATE_RANGE, END_DATE_RANGE, DEFAULT_FILTER_RANGE);

    /** Initialize DateRangeFilter for Filter Date */
    $('#filterDate').daterangepicker({
        timePicker: true,
        startDate: START_DATE_RANGE,
        endDate: END_DATE_RANGE,
        ranges: DATE_RANGES
    }, (start, end, label) => {

        // Change DateRange Filter
        setDateRangeFilter(start, end, label);
    
        // Replace URL dateRange
        URL_QUERY_PARAMS.set('dateRange', label)
        history.replaceState(null, null, "?"+URL_QUERY_PARAMS.toString());

        // Refresh charts and quantitive data
        renderData(start, end);
    });

    // Initialize charts and quantitative data
    renderData(START_DATE_RANGE, END_DATE_RANGE);
})();