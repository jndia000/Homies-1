"use strict";

/** 
 * ===================================================================================
 * * FUNCTIONS
 * ===================================================================================
 * */


/** If Selector Exist */
const ifSelectorExist = (selector = "", handler = () => { }, isRequired = true) => {
	if ($(selector).length) return handler()
	else if (isRequired && IF_SELECTOR_EXIST_DEBUG_MODE) console.warn(`Selector ${selector} does not exist.`)
}


/** Initialize Data Mask */
ifSelectorExist('[data-mask]', () => $('[data-mask]').inputmask());


/** Initialize Bootstrap Custom File Input */
bsCustomFileInput.init();


/** Is Empty Or Null */
const isEmptyOrNull = (value) => { return $.trim(value) === "" || value == null }


/** Null Or With Value */
const nullOrReturnValue = (nullable, returnValue) => { return isEmptyOrNull(nullable) ? null : returnValue }


/** Initialize DataTable */
const initDataTable = (selector = "", dtOptions = {
	debugMode: false,
	enableButtons: false,
	url: "",
	columns: []
}) => $(() => ifSelectorExist(selector, () => {

	/** DATATABLE CONFIGURATIONS */

	const ajax = {
		url: dtOptions.url,
		headers: AJAX_HEADERS,
		dataSrc: ""
	}

	const dtLanguage = {
		emptyTable: `
        <div class="text-center p-5">
            <h3>No records yet</h3>
            <div class="text-secondary">Hey! We found no records here yet.</div>
        </div>
    `,
		loadingRecords: `
        <div class="text-center py-5 wait">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="sr-only">Loading ...</span>
            </div>
            <div class="text-secondary">Making it ready ...</div>
        </div>
    `,
		processing: `
        <div class="text-center p-5 wait">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="sr-only">Loading ...</span>
            </div>
            <div class="text-secondary">Processing, please wait ...</div>
        </div>
    `,
		zeroRecords: `
        <div class="text-center p-5">
            <h3>No match found</h3>
            <div class="text-secondary">No records was found that matched to your request. Please check if the spelling is correct or try other keywords.</div>
        </div>
    `,
		paginate: {
			previous: `<i class="fas fa-caret-left"></i>`,
			next: `<i class="fas fa-caret-right"></i>`,
		}
	}

	const dtColumnDefs = [{
		targets: [-1],
		orderable: false
	}];

	const dtOrder = [[0, 'desc']];

	let visibleCols = [], columnOpts = [];
	for (var i = 1; i < dtOptions.columns.length - 1; i++) {
		visibleCols.push(i);
		if (i >= 2) columnOpts.push(i);
	}

	var dtParams;

	/** SETTING UP DATATABLE PARAMETERS */

	if (dtOptions.debugMode) dtParams = {
		ajax: {
			url: dtOptions.url,
			headers: AJAX_HEADERS,
			success: result => console.log(result)
		}
	}
	else if (dtOptions.enableButtons) dtParams = {
		ajax: ajax,
		columns: dtOptions.columns,
		order: dtOrder,
		dom: `
			<"row w-100"
				<"col-md-2" l>
				<"col-md-6" B>
				<"col-md-4" f>
			>
			<t>
			<"row"
				<"col-md-6" i>
				<"col-md-6" p>
			>
		`,
		responsive: true,
		autoWidth: false,
		buttons: [
			{
				extend: "copy",
				text: TEMPLATE.LABEL_ICON("Copy", "copy"),
				className: "btn-sm btn-default",
				exportOptions: { columns: visibleCols }
			}, {
				extend: "csv",
				text: TEMPLATE.LABEL_ICON("CSV", "file-csv"),
				className: "btn-sm btn-default",
				exportOptions: { columns: visibleCols }
			}, {
				extend: "excel",
				text: TEMPLATE.LABEL_ICON("Excel", "file-excel"),
				className: "btn-sm btn-default",
				exportOptions: { columns: visibleCols }
			}, {
				extend: "pdf",
				text: TEMPLATE.LABEL_ICON("PDF", "file-pdf"),
				className: "btn-sm btn-default",
				exportOptions: { columns: visibleCols }
			}, {
				extend: "print",
				text: TEMPLATE.LABEL_ICON("Print", "print"),
				className: "btn-sm btn-default",
				exportOptions: { columns: visibleCols }
			}, {
				extend: "colvis",
				text: TEMPLATE.LABEL_ICON("Columns", "eye"),
				className: "btn-sm btn-default",
				columns: columnOpts
			}
		],
		columnDefs: dtColumnDefs,
		language: dtLanguage,
	}
	else dtParams = {
		ajax: ajax,
		columns: dtOptions.columns,
		order: dtOrder,
		responsive: true,
		columnDefs: dtColumnDefs,
		language: dtLanguage
	}

	/** INITIATE DATATABLE */
	$(selector).DataTable(dtParams);
}));


/** Reload DataTable */
const reloadDataTable = (selector) => ifSelectorExist(selector, () => $(selector).DataTable().ajax.reload());


/** jQuery Validation Methods */

// Less Than
jQuery.validator.addMethod("lessThan", function (val, elem, params) {
	if ($(params).length) {
		const c = getValue(params);
		return isEmptyOrNull(c) ? true : parseFloat(val) < parseFloat(c);
	}
	return true;
}, `It must be less than something`);

// Greater Than
jQuery.validator.addMethod("greaterThan", function (val, elem, params) {
	if ($(params).length) {
		const c = getValue(params);
		return isEmptyOrNull(c) ? true : parseFloat(val) > parseFloat(c);
	}
	return true;
}, `It must be greater than something`);

// Less Than Or Equal To
jQuery.validator.addMethod("lessThanOrEqualTo", function (val, elem, params) {
	if ($(params).length) {
		const c = getValue(params);
		if (!(isEmptyOrNull(c) || c == 0)) return parseFloat(val) <= parseFloat(c);
	}
	return true;
}, `It must be less than or equal to something`);

// Greater Than Or Equal To
jQuery.validator.addMethod("greaterThan", function (val, elem, params) {
	if ($(params).length) {
		const c = getValue(params);
		if (!(isEmptyOrNull(c) || c == 0)) return parseFloat(val) >= parseFloat(c);
	}
	return true;
}, `It must be greater than or equal to something`);

// Before Today
jQuery.validator.addMethod("beforeToday", function (val, elem, params) {
	return this.optional(elem) || isBeforeToday(val);
}, `Date and Time must be before today`);

// After Today
jQuery.validator.addMethod("afterToday", function (val, elem, params) {
	return this.optional(elem) || isAfterToday(val);
}, `Date and Time must be before today`);

// Before Time
jQuery.validator.addMethod("beforeTime", function (val, elem, params) {
	if ($(params).length) {
		const c = getValue(params);
		return isEmptyOrNull(c) ? true : moment(val, 'H:mm').isBefore(moment(c, 'H:mm'));
	}
	return true;
});

// After Time
jQuery.validator.addMethod("afterTime", function (val, elem, params) {
	if ($(params).length) {
		const c = getValue(params);
		return isEmptyOrNull(c) ? true : moment(val, 'H:mm').isAfter(moment(c, 'H:mm'));
	}
	return true;
});

// Before DateTime
jQuery.validator.addMethod("beforeDateTime", function (val, elem, params) {
	if ($(params).length) {
		const c = getValue(params);
		return isEmptyOrNull(c) ? true : moment(val, 'YYYY-MM-DD HH:mm:ss').isBefore(moment(c, 'YYYY-MM-DD HH:mm:ss'));
	}
	return true;
});

// After DateTime
jQuery.validator.addMethod("afterDateTime", function (val, elem, params) {
	if ($(params).length) {
		const c = getValue(params);
		return isEmptyOrNull(c) ? true : moment(val, 'YYYY-MM-DD HH:mm:ss').isAfter(moment(c, 'YYYY-MM-DD HH:mm:ss'));
	}
	return true;
});

/** Validate Form */
const validateForm = (selector = "", validationOptions = { rules: {}, messages: {}, submitHandler: () => { } }) => {
	ifSelectorExist(selector, () => {
		$(selector).validate({
			rules: validationOptions.rules,
			messages: validationOptions.messages,
			errorElement: 'div',
			errorPlacement: (error, element) => {
				error.addClass('invalid-feedback');
				element.closest('.form-group').append(error);
			},
			highlight: (element) => $(element).addClass('is-invalid'),
			unhighlight: (element) => $(element).removeClass('is-invalid'),
			submitHandler: validationOptions.submitHandler
		});
	}, false);
}


/** Reset Form */
const resetForm = (selector) => ifSelectorExist(selector, () => $(selector).trigger('reset'));


/** Generate Form Data */
const generateFormData = (selector) => { return new FormData($(selector)[0]) }


/** Humanize DateTime */
const fromNow = (datetime) => { return moment(datetime).fromNow() }
const toNow = (datetime) => { return moment(datetime).fromNow() }


/** If date is before/after today */
const isBeforeToday = (datetime) => { return moment(datetime).isBefore(moment()) }
const isAfterToday = (datetime) => { return moment(datetime).isAfter(moment()) }


/** Format DateTime */
const formatDateTime = (datetime, format = "") => {
	return isEmptyOrNull(format)
		? moment(datetime).format()
		: moment(datetime).format(format in DATETIME_FORMATS ? DATETIME_FORMATS[format] : format)
}


/** Show/Hide Modal */
const showModal = (selector) => ifSelectorExist(selector, () => $(selector).modal('show'));
const hideModal = (selector) => ifSelectorExist(selector, () => $(selector).modal('hide'));


/** On modal was showned/hidden */
const onHideModal = (selector, handler = () => {}) => { ifSelectorExist(selector, () => $(selector).on('hide.bs.modal', () => handler())) }
const onShowModal = (selector, handler = () => {}) => { ifSelectorExist(selector, () => $(selector).on('show.bs.modal', () => handler())) }


/** Set Content */
const setContent = (param1, param2) => {
	if (typeof param1 === "string")
		ifSelectorExist(param1, () => { $(param1).html(param2) });
	else if (typeof param1 === "object")
		Object.keys(param1).forEach(key => ifSelectorExist(key, () => $(key).html(param1[key])))
	else
		console.error("[Error]: setContent error param type")
};


/** Set Value */
const setValue = (param1, param2) => {
	if (typeof param1 === "string")
		ifSelectorExist(param1, () => $(param1).val(param2));
	else if (typeof param1 === "object")
		Object.keys(param1).forEach(key => ifSelectorExist(key, () => $(key).val(param1[key])))
	else
		console.error("[Error]: setValue error param type")
}


/** Get Value */
const getValue = (selector) => { return ifSelectorExist(selector, () => { return $(selector).val() }) }


/** Enable/Disable Element */
const enableElement = (selector) => ifSelectorExist(selector, () => $(selector).prop("disabled", false));
const disableElement = (selector) => ifSelectorExist(selector, () => $(selector).prop("disabled", true));
const enableOrDisableElement = (selector, condition) => ifSelectorExist(selector, () => {
	condition ? $(selector).prop("disabled", true) : $(selector).prop("disabled", false)
});

/** Check/Uncheck Element */
const checkElement = (selector) => ifSelectorExist(selector, () => $(selector).prop("checked", true));
const uncheckElement = (selector) => ifSelectorExist(selector, () => $(selector).prop("checked", false));
const checkOrUncheckElement = (selector, condition) => ifSelectorExist(selector, () => {
	condition ? $(selector).prop("checked", true) : $(selector).prop("checked", false)
})


/** Show/Hide Element */
const showElement = (selector) => ifSelectorExist(selector, () => $(selector).show());
const hideElement = (selector) => ifSelectorExist(selector, () => $(selector).hide());
const showOrHideElement = (selector, condition) => ifSelectorExist(selector, () => condition ? $(selector).show() : $(selector).hide());

/** On Event */
const onEvent = (selector, event, handler = () => {}) => ifSelectorExist(selector, () => $(selector).on(event, () => handler()))


/** On Click */
const onClick = (selector, handler = () => {}) => onEvent(selector, 'click', () => handler());


/** On Change */
const onChange = (selector, handler = () => {}) => onEvent(selector, 'change', () => handler());


/** Is checked */
const isChecked = (selector) => {
	return ifSelectorExist(selector, () => { return $(selector).is(':checked') })
}


/** Format Name */
const formatName = (format = '', fullName = { firstName: '', middleName: '', lastName: '', suffixName: '' }) => {
	const F = $.trim(fullName.firstName);
	const L = $.trim(fullName.lastName);

	let M = $.trim(fullName.middleName);
	let S = $.trim(fullName.suffixName);

	const Mi = isEmptyOrNull(M) ? '' : ` ${M.charAt(0)}.`;

	M = isEmptyOrNull(M) ? '' : ` ${M}`;
	S = isEmptyOrNull(S) ? '' : `, ${S}`;

	const formats = {
		"L, F M., S": L + ', ' + F + Mi + S,
		"F M. L, S": F + Mi + ' ' + L + S
	}

	return format in formats ? formats[format] : () => {
		console.error(`Format "${format}" for name is invalid`);
		return '';
	}
}


/** Format Number */
const formatNumber = (n) => { return new Intl.NumberFormat('en-US').format(n) }


/** Format Currency */
const formatCurrency = (money) => {
	return new Intl.NumberFormat('fil-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(money);
}


/** Button To Loading State */
const btnToLoadingState = (selector) => {
	disableElement(selector);
	setContent(selector, `<div class="spinner-border spinner-border-sm mx-3">`);
}

/** Button To Unload State */
const btnToUnloadState = (selector, originalContent) => {
	enableElement(selector);
	setContent(selector, originalContent);
}


/**
 * ====================================================================================
 * * AJAX METHODS
 * ====================================================================================
 */

/** GET AJAX */
const GET_ajax = (url = '', options = { success: () => { }, error: () => console.error('GET_ajax failed') }) => {
	$.ajax({
		url: url,
		type: 'GET',
		headers: AJAX_HEADERS,
		success: options.success,
		error: options.error
	}).fail(options.error);
}


/** POST AJAX */
const POST_ajax = (url = '', data = {}, options = { success: () => { }, error: () => console.error('POST_ajax failed') }) => {
	$.ajax({
		url: url,
		type: 'POST',
		headers: AJAX_HEADERS,
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(data),
		success: options.success,
		error: options.error
	}).fail(options.error);
}


/** PUT AJAX */
const PUT_ajax = (url = '', data = {}, options = { success: () => { }, error: () => console.error('PUT_ajax failed') }) => {
	$.ajax({
		url: url,
		type: 'PUT',
		headers: AJAX_HEADERS,
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(data),
		success: options.success,
		error: options.error
	}).fail(options.error);
}


/** DELETE AJAX */
const DELETE_ajax = (url = '', options = { success: () => { }, error: () => console.error('DELETE_ajax failed') }) => {
	$.ajax({
		url: url,
		type: 'DELETE',
		headers: AJAX_HEADERS,
		success: options.success,
		error: options.error
	}).fail(options.error);
}



/** Check if there are sessioned alert */
$(() => {
	if (localStorage.getItem('sessioned_alert')) {
		const alertTheme = localStorage.getItem('sessioned_alert_theme');
		const alertMessage = localStorage.getItem('sessioned_alert_message');

		// Show Alert
		const alerts = {
			"success": () => toastr.success(alertMessage),
			"info": () => toastr.info(alertMessage),
			"warning": () => toastr.warning(alertMessage),
			"error": () => toastr.error(alertMessage)
		}
		setTimeout(() => alerts[alertTheme](), 500);

		// Remove session after 1s
		const sessions = [
			"sessioned_alert",
			"sessioned_alert_theme",
			"sessioned_alert_message"
		];
		setTimeout(() => sessions.forEach(s => localStorage.removeItem(s)), 500);
	}
})


/** Set Sessioned Alert */
const setSessionedAlertAndRedirect = (data = { theme: "", message: "", redirectURL: "" }) => {
	localStorage.setItem('sessioned_alert', true)
	localStorage.setItem('sessioned_alert_theme', data.theme)
	localStorage.setItem('sessioned_alert_message', data.message)
	location.assign(data.redirectURL)
}


/** Show Timeline */
const setTimeline = (selector, attr = { title: "", timelineData: [] }) => {
	ifSelectorExist(selector, () => {
		const timelineData = attr.timelineData;

		let timelines = "";

		const timelineComponent = (properties = { icon: "", iconTheme: "", dateTime: "", timelineTitle: "", timelineBody: "" }) => {
			return `
				<div>
					<i class="fas fa-${properties.icon} bg-${properties.iconTheme}"></i>
					<div class="timeline-item">
						<div class="time">
							${TEMPLATE.ICON_LABEL('clock', fromNow(properties.dateTime))}
						</div>
						<div class="timeline-header">${properties.timelineTitle}</div>
						<div class="timeline-body">${properties.timelineBody}</div>
					</div>
				</div>
			`
		}

		timelineData.forEach(t => {
			timelines = timelineComponent({
				icon: t.icon,
				iconTheme: t.iconTheme,
				dateTime: t.dateTime,
				timelineTitle: t.timelineTitle,
				timelineBody: t.timelineBody
			}) + timelines;
		});

		setContent(selector, `
        <div class="timeline">
            <div class="time-label">
                <span class="bg-primary shadow-sm">${attr.title}</span>
            </div>
            ${timelines}
            <div><i class="fas fa-clock bg-secondary"></i></div>
        </div>
    `);
	});
}


/** Get URL Query Object */
const getURLQueryObj = () => {
	const queryString = window.location.search;
	const queryParams = queryString === '' ? null : queryString.replace('?', '').split('&');
	let queryObj = {}
	if(queryParams) {
		queryParams.forEach(q => {
			const queryParts = q.split("=");
			queryObj[queryParts[0]] = queryParts[1]
		});
	}
	return queryObj
}


/** Get URL Query String */
const getURLQueryString = (queryObj = {}) => {
	let queryStringHolder = [];

    Object.entries(queryObj).forEach(([key, val]) => {
        if(!isEmptyOrNull(val)) queryStringHolder.push(key + '=' + val)
    });
    
    let queryString = '';

    queryStringHolder.forEach((urlParam, index) => {
        queryString += index === 0 ? '?' : '&';
        queryString += urlParam;
    });

    return queryString;
}



/** Set Pagination */
const setPagination = (selector, attr = { query: '', totalRows: 0, currentPage: 0 }) => {
	const totalRows = parseInt(attr.totalRows), currentPage = parseInt(attr.currentPage);
	const getLink = (pageNumber) => { 
		let queries = getURLQueryObj();
		queries["page"] = pageNumber;
		return window.location.href.split('?')[0] + getURLQueryString(queries);
	}
	const totalPages = Math.ceil(totalRows / FETCH_ROWS);

	let paginationItems = '';

	const appendPageItem = (page) => {
		if(page == currentPage)
			paginationItems += `
				<div class="page-item active">
					<div class="page-link">${page}</div>
				</div>
			`
		else
			paginationItems += `
				<div class="page-item">
					<a class="page-link" href="${getLink(page)}">${page}</a>
				</div>
			`
	}

	const appendDisabledPageItem = () => paginationItems += `
        <div class="page-item disabled">
            <div class="page-link">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    `;

	paginationItems += `
        <div class="page-item${currentPage == 1 ? ' disabled' : ''}">
            <a class="page-link" href="${getLink(currentPage - 1)}">
                <i class="fas fa-caret-left"></i>
            </a>
        </div>
    `;

	if (currentPage > 3 && totalPages > 5) {
		appendPageItem(1);
		appendDisabledPageItem()
	}

	if (currentPage < 3)
		for (let i = 1; i <= 5 && i <= totalPages; i++) appendPageItem(i)
	else if (currentPage <= totalPages - 2)
		for (let i = currentPage - 2; i <= currentPage + 2 && i <= totalPages; i++) appendPageItem(i);
	else if (totalPages > 5)
		for (let i = totalPages - 4; i <= totalPages; i++) appendPageItem(i)
	else
		for (let i = 1; i <= totalPages; i++) appendPageItem(i)

	if (currentPage < totalPages - 2 && totalPages > 5) {
		appendDisabledPageItem()
		appendPageItem(totalPages);
	}

	paginationItems += `
        <div class="page-item${currentPage == totalPages ? ' disabled' : ''}">
            <a class="page-link" href="${getLink(currentPage + 1)}">
                <i class="fas fa-caret-right"></i>
            </a>
        </div>
    `;

	if (currentPage > 0 && currentPage <= totalPages) setContent(selector, paginationItems);
}


/** Print Content */
const printContent = (pageTitle, content) => {
	const w = window.open();
	w.document.write(TEMPLATE.PRINT(pageTitle, content));
	w.document.close();
	w.print();
	w.onafterprint = () => w.close();
}


/** Pluralize Word */
const pluralize = (word, count) => {
	return count > 1 || count === 0 ? word + 's' : word
}


/** Create days labels for chart */
const daysLabels = (start, end) => {
	let days = [], currDate = start.startOf('day');
	while(currDate.diff(end.endOf('day')) <= 0) {
		days.push(currDate.format());
		currDate = currDate.add(1, 'days');
	}
	return days;
}


/** Get pathnamePart */
const getPathnamePart = (toTheLast = 0) => {
	const pathname = window.location.pathname.split('/')
	return pathname[pathname.length-toTheLast]
}