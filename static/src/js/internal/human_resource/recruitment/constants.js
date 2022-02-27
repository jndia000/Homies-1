"use strict";

/** 
 * ===================================================================================
 * * CONSTANTS
 * ===================================================================================
 * */

// Base URLs
const ORIGIN = window.location.origin;
const BASE_URL_WEB = ORIGIN + '/';
const BASE_URL_API = `${ BASE_URL_WEB }api/`;


// Web File URLs
const URL_WEB_FILES = `${ BASE_URL_WEB }static/app/files/`;
const URL_RESUME_FILES = `${ URL_WEB_FILES }resumes/`;
const EMPLOYMENT_CONTRACT_PATH = `${ URL_WEB_FILES }employment_contracts/`;


// User Routes
const ROUTE = {
    WEB: { /** WEB ROUTES */
        DH  : `${ BASE_URL_WEB }dh/`,
        DM  : `${ BASE_URL_WEB }dm/`,
        H   : `${ BASE_URL_WEB }h/`,
        R   : `${ BASE_URL_WEB }r/`
    },
    API: { /** API ROUTES */
        DH  : `${ BASE_URL_API }department-head/`,
        DM  : `${ BASE_URL_API }department-manager/`,
        H   : `${ BASE_URL_API }hiring-manager/`,
        R   : `${ BASE_URL_API }recruiter/`,
        AUTH: `${ BASE_URL_API }auth/`
    }
}


// URL Query Parameters
const URL_QUERY_PARAMS = new URLSearchParams(window.location.search)


// Configurations
const IF_SELECTOR_EXIST_DEBUG_MODE = false;


// AJAX Header
const AJAX_HEADERS = {
    Accept: 'application/json',
    Authorization: `Bearer ${ localStorage.getItem('access_token') }`
}


// Summernote Toolbar
const SUMMERNOTE_TOOLBAR = [
    ['view' , ['undo','redo']],
    ['font' , ['bold', 'italic', 'underline', 'clear']],
    ['font' , ['strikethrough', 'superscript', 'subscript']],
    ['para' , ['ol', 'ul', 'paragraph', 'height']],
    ['table', ['table']],
    ['view' , ['help']],
]


// Fetch Rows
const FETCH_ROWS = 10;


// DateTime Formats
const DATETIME_FORMATS = {
    "Full DateTime"  : "dddd, MMMM D, YYYY; hh:mm A",
    "DateTime"       : "MMMM D, YYYY; hh:mm A",
    "Short DateTime" : "MMM. D, YYYY; hh:mm A",
    "Full Date"      : "dddd, MMMM D, YYYY",
    "Date"           : "MMMM D, YYYY",
    "Short Date"     : "MMM. D, YYYY",
    "Time"           : "hh:mm A"
}

// Date Ranges
const DATE_RANGES = {
    'Today': [
        moment().startOf('day'), 
        moment().endOf('day')
    ],
    'Yesterday': [
        moment().subtract(1, 'days').startOf('day'), 
        moment().subtract(1, 'days').endOf('day')
    ],
    'Last 7 Days': [
        moment().subtract(6, 'days').startOf('day'), 
        moment().endOf('day')
    ],
    'Last 30 Days': [
        moment().subtract(29, 'days').startOf('day'), 
        moment().endOf('day')
    ],
    'This Week': [
        moment().startOf('week'),
        moment().endOf('week')
    ],
    'Last Week': [
        moment().subtract(1, 'week').startOf('week'),
        moment().subtract(1, 'week').endOf('week')
    ],
    'This Month': [
        moment().startOf('month'),
        moment().endOf('month')
    ],
    'Last Month': [
        moment().subtract(1, 'month').startOf('month'), 
        moment().subtract(1, 'month').endOf('month')
    ],
    'This Year': [
        moment().startOf('year'), 
        moment().endOf('year')
    ],
    'Last Year': [
        moment().subtract(1, 'year').startOf('year'), 
        moment().subtract(1, 'year').endOf('year')
    ],
}

// Default Filter Range
let DATE_RANGE_PARAM = URL_QUERY_PARAMS.get('dateRange')
const DEFAULT_FILTER_RANGE = DATE_RANGE_PARAM && DATE_RANGE_PARAM in DATE_RANGES 
    ? DATE_RANGE_PARAM : "This Month"


// Start and End Date Range
const START_DATE_RANGE = DATE_RANGES[DEFAULT_FILTER_RANGE][0];
const END_DATE_RANGE = DATE_RANGES[DEFAULT_FILTER_RANGE][1];


// Chart Colors
const CHART_STYLE = {
    BACKGROUND: {
        PRIMARY: '#67c389',
        SECONDARY: '#9fa5aa',
        SUCCESS: '#64d1ad',
        INFO: '#5dcfe3',
        WARNING: '#f19261',
        DANGER: '#f48686'
    },
    BORDER: {
        WIDTH: 2,
        PRIMARY: '#16a34a',
        SECONDARY: '#6c757d',
        SUCCESS: '#10b981',
        INFO: '#06b6d4',
        WARNING: '#ea580c',
        DANGER: '#ef4444'
    }
}
const CHART_BG = CHART_STYLE.BACKGROUND;
const CHART_BD = CHART_STYLE.BORDER;


const CHART_CONFIG = {
    NO_DATA: {
        labels: ['No data'],
        datasets: [{
            data: [-1],
            backgroundColor : [CHART_BG.SECONDARY],
            borderColor: [CHART_BD.SECONDARY],
            borderWidth: CHART_BD.WIDTH
        }]
    },
    PIE: {
        OPTIONS: {
            plugins: {
                datalabels: {
                    font: { weight: 'bold' },
                    color: 'black',
                    backgroundColor: (context) => {
                        return context.active 
                            ? 'rgba(255, 255, 255, 1)'
                            : 'rgba(255, 255, 255, 0.5)'
                    },
                    padding: {
                        top: 6,
                        bottom: 4,
                        left: 6,
                        right: 6,
                    },
                    borderColor: (context) => {
                        return context.chart.data.datasets[0].borderColor[context.dataIndex]
                    },
                    borderWidth: 2,     
                    borderRadius: 3,
                    formatter: (value, context) => {
                        if(value == -1)
                            return context.active ? "No data" : 0
                        if(context.active) {
                            let sum = 0;
                            let dataArr = context.chart.data.datasets[0].data;
                            dataArr.map(data => sum += data);
                            let percentage = (value*100 / sum).toFixed(2)+"%";
                            return `${ context.chart.data.labels[context.dataIndex] }: ${value}\n${percentage}`;
                        }
                        return value
                    },
                    display: (context) => {
                        var dataset = context.dataset;
                        var value = dataset.data[context.dataIndex];
                        return value > 0 || value === -1;
                    },
                },
                tooltip: {
                    enabled: false,
                }
            }
        },
        PLUGINS: [ChartDataLabels]
    }
}