"use strict";

// Set Date Range Filter
const setDateRangeFilter = (start, end, label) => { 
    setContent('#selectedFilter', label)
    setContent('#selectedDate', `From <b>${ formatDateTime(start, 'MMM. D, YYYY; hh:mm A') }</b> to <b>${ formatDateTime(end, 'MMM. D, YYYY; hh:mm A') }</b>`)
}


/** INITIALIZE CHARTS */

// Job Posts Status Pie Chart
const jobPostsStatusPieChart = new Chart($('#jobPostsStatusPieChart').get(0).getContext('2d'), {
    type: 'pie',
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
                ticks: {
                    stepSize: 1
                }
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
    type: 'doughnut',
    data: CHART_CONFIG.NO_DATA,
    options: CHART_CONFIG.PIE.OPTIONS,
    plugins: CHART_CONFIG.PIE.PLUGINS
});


/** SET PAGE TO LOADING STATE */
const setPageToLoadingState = () => {
    const SPINNER = '<span class="spinner-border"></span>'
    const SPINNER_SM = '<span class="spinner-border spinner-border-sm"></span>'


    /** INFO CARDS */

    setContent({
        '#jobPostsCount': SPINNER,
        '#applicationsCount': SPINNER,
    });

    /** JOB POSTS */

    // Footer
    setContent({
        '#totalJobPostsCountForFooter': SPINNER_SM,
        '#onGoingCountForFooter': SPINNER_SM,
        '#endedCountForFooter': SPINNER_SM
    });

    /** APPLICATIONS */
    setContent({
        "#totalApplicationsCountForFooter": SPINNER_SM,
        "#forEvaluationCountForFooter": SPINNER_SM,
        "#evaluatedCountForFooter": SPINNER_SM,
        "#rejectedCountForFooter": SPINNER_SM
    });
}


/** RENDER DATA */

const renderData = (start, end) => {

    // Set Page to loading state
    setPageToLoadingState();

    // Set date range parameters for API
    const DATE_RANGE = TEMPLATE.URL_QUERY_PARAM.DATE_RANGE(start.format(), end.format());
    
    /** FOR INFO CARDS, PIE CHARTS */

    /** Job Posts */
    GET_ajax(`${ ROUTE.API.R }job-posts/analytics${ DATE_RANGE }`, {
        success: result => {
            
            // Set content for info card
            setContent('#jobPostsCount', formatNumber(result.total));

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
            else chartConfig.data = CHART_CONFIG.NO_DATA
            
            // Commit data
            jobPostsStatusPieChart.update();

            // Set content for footer
            setContent({
                '#totalJobPostsCountForFooter': result.total,
                '#onGoingCountForFooter': result.on_going,
                '#endedCountForFooter': result.ended
            });
        },
        error: () => toastr.error('There was an error in getting on going job posts count')
    });

    /** Applications */
    GET_ajax(`${ ROUTE.API.R }applicants/analytics${ DATE_RANGE }`, {
        success: result => {

            // Set info card content
            setContent('#applicationsCount', formatNumber(result.total));
            
            // Configure pie chart
            const chartConfig = applicationStatusPieChart.config;

            // Update chart data
            if(result.total > 0) chartConfig.data = {
                labels: ['For Evaluation', 'Evaluated', 'Rejected'],
                datasets: [{
                    data: [
                        result.for_evaluation, 
                        result.evaluated.total, 
                        result.rejected.total
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
                    borderWidth: 2
                }]
            } 
            else chartConfig.data = CHART_CONFIG.NO_DATA
            
            // Commit changes
            applicationStatusPieChart.update();
            
            // Set content for footer
            setContent({
                "#totalApplicationsCountForFooter": formatNumber(result.total),
                "#forEvaluationCountForFooter": formatNumber(result.for_evaluation),
                "#evaluatedCountForFooter": formatNumber(result.evaluated.total),
                "#rejectedCountForFooter": formatNumber(result.rejected.total)
            });
        },
        error: () => toastr.error('There was an error in getting applicants for evaluation count')
    });

    /** FOR LINE AND BAR CHARTS */
    
    // Job Posts
    GET_ajax(`${ ROUTE.API.R }job-posts/data${ DATE_RANGE }`, {
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

    // Applications
    GET_ajax(`${ ROUTE.API.R }applicants/data${ DATE_RANGE }`, {
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


/** IF DOCUMENT HAS BEEN LOADED */

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