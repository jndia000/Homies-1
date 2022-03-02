"use strict";

// Set Date Range Filter
const setDateRangeFilter = (start, end, label) => { 
    setContent('#selectedFilter', label)
    setContent('#selectedDate', `From <b>${ formatDateTime(start, 'MMM. D, YYYY; hh:mm A') }</b> to <b>${ formatDateTime(end, 'MMM. D, YYYY; hh:mm A') }</b>`)
}


/** INITIALIZE CHARTS */

// Manpower Requests Bar Chart
const manpowerRequestBarChart = new Chart($('#manpowerRequestsBarChart').get(0).getContext('2d'), {
    type: 'bar',
    data: {
        datasets: [{
            label: "Manpower Requests",
            backgroundColor: '#68c389',
            borderColor: '#16a34a',
            borderWidth: 2,
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

// Manpower Request Pie Chart
const manpowerRequestPieChart = new Chart($('#manpowerRequestsPieChart').get(0).getContext('2d'), {
    type: 'pie',
    data: CHART_CONFIG.NO_DATA,
    options: CHART_CONFIG.PIE.OPTIONS,
    plugins: CHART_CONFIG.PIE.PLUGINS
});

/** SET PAGE TO LOADING STATE */

const setPageToLoadingState = () => {
    const SPINNER = '<span class="spinner-border"></span>'
    const SPINNER_SM = '<span class="spinner-border spinner-border-sm"></span>'
    
    /** INFO CARS */
    setContent({
        '#manpowerRequestsCountForInfoCard': SPINNER,
        '#hiredApplicantsCountForInfoCard': SPINNER,
        '#onboardingEmployeesCountForInfoCard': SPINNER,
    });

    /** Manpower Requests */

    // Footer
    setContent({
        '#totalRequests': SPINNER_SM,
        '#totalOnGoingRequests': SPINNER_SM,
        '#totalCompletedRequests': SPINNER_SM,
        '#totalRejectedRequests': SPINNER_SM,
    });
}

/** RENDER DATA */

const renderData = (start, end) => {
    
    // Set page to loading state
    setPageToLoadingState();

    // Set date range parameters for API
    const DATE_RANGE = TEMPLATE.URL_QUERY_PARAM.DATE_RANGE(start.format(), end.format());


    /** FOR INFO CARDS, PIE CHARTS */

    // Manpower Requests Analytics
    GET_ajax(`${ ROUTE.API.DH }manpower-requests/analytics${ DATE_RANGE }`, {
        success: result => {

            // Update info box
            setContent('#manpowerRequestsCountForInfoCard', formatNumber(result.total));

            // Configure Pie Chart
            const chartConfig = manpowerRequestPieChart.config;

            if(result.total > 0) chartConfig.data = {
                labels: ['On Going','Completed','Rejected',],
                datasets: [{
                    data: [
                        result.on_going.total,
                        result.completed, 
                        result.rejected.total
                    ],
                    backgroundColor : [
                        CHART_BG.SUCCESS,
                        CHART_BG.INFO,
                        CHART_BG.DANGER
                    ],
                    borderColor:  [
                        CHART_BD.SUCCESS,
                        CHART_BD.INFO,
                        CHART_BD.DANGER
                    ],
                    borderWidth: 2
                }]
            }
            else chartConfig.data = CHART_CONFIG.NO_DATA

            // Commit Update
            manpowerRequestPieChart.update();
            
            // Update footer manpower request data
            setContent({
                '#totalRequests': formatNumber(result.total),
                '#totalOnGoingRequests': formatNumber(result.on_going.total),
                '#totalCompletedRequests': formatNumber(result.completed),
                '#totalRejectedRequests': formatNumber(result.rejected.total),
            });
        },
        error: () => toastr.error('There was an error in getting completed manpower requests count')
    });

    // Hired Applicants Analytics
    GET_ajax(`${ ROUTE.API.DH }hired-applicants/analytics`, {
        success: result => setContent('#hiredApplicantsCountForInfoCard', formatNumber(result.hired_applicants)),
        error: () => toastr.error('There was an error in getting hired applicants analytics')
    });

    // Onboarding Employees Analytics
    GET_ajax(`${ ROUTE.API.DH }onboarding-employees/analytics`, {
        success: result => setContent('#onboardingEmployeesCountForInfoCard', formatNumber(result.total)),
        error: () => toastr.error('There was an error in getting onboarding employees analytics')
    });

    /** FOR BAR AND LINE GRAPHS */

    // Manpower Requests Data
    GET_ajax(`${ ROUTE.API.DH }manpower-requests/data${ DATE_RANGE }`, {
        success: result => {

            // Configure Bar Chart
            const chartConfig = manpowerRequestBarChart.config;
            
            // Update minimum and maximum x axis
            chartConfig.options.scales.x.min = start.format("YYYY-MM-DD");
            chartConfig.options.scales.x.max = end.format("YYYY-MM-DD");
            
            // Update days labels
            chartConfig.data.labels = daysLabels(start, end);

            // Update datasets
            chartConfig.data.datasets[0].data = result;

            // Commit update
            manpowerRequestBarChart.update();
        },
        error: () => toastr.error('There was an error in getting manpower requests data')
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