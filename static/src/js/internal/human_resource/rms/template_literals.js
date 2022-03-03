/** 
 * ===================================================================================
 * * TEMPLATE LITERALS
 * ===================================================================================
 */

const TEMPLATE = {
    
    /**
     * =====================================================================
     * UNIVESAL TEMPLATE LITERALS
     * =====================================================================
     */

    SUBTEXT: content => {
        return `<div class="small text-secondary">${ content }</div>`
    },
    BADGE: (theme, content, addClass='') => {
        return `<span class="badge badge-${theme} p-2${ addClass !== '' ? ' ' + addClass : '' }">${content}</span>`
    },
    EMPTY: content => {
        return `<div class="text-secondary font-italic">${content}</div>`
    },
    ICON_LABEL: (icon, label, iconType="s") => {
        return `
            <i class="fa${iconType} fa-${icon} mr-1"></i>
            <span>${label}<span>
        `
    },
    LABEL_ICON: (label, icon, iconType="s") => {
        return `
            <span>${label}<span>
            <i class="fa${iconType} fa-${icon} ml-1"></i>
        `
    },
    NOWRAP: (content) => {
        const nowrap = (content) => { return `<div class="text-nowrap">${ content }</div>` }
        let contents = '';
        if(typeof content == "object") {
            content.forEach(c => contents += nowrap(c))
            return contents
        } else return nowrap(content)
    },
    UNSET: (content, tag = "div") => {
        const unset = (content) => { return `<${tag} class="text-secondary font-italic">${ content }</${tag}>` }
        let contents = '';
        if(typeof content == "object") {
            content.forEach(c => contents += unset(c))
            return contents
        } else return unset(content)
    },
    PRINT: (pageTitle, content) => {
        return `
            <!DOCTYPE html>
            <html>
                <title>${ pageTitle }</title>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="icon" href="/dist/img/AdminLTELogo.png')}}">
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
                    <link rel="stylesheet" href="/dist/css/adminlte.min.css">
                </head>
                <body onload="window.print()"> ${ content } </body>
            </html>
        `
    },

    /**
     * =====================================================================
     * UNIVESAL RESOURCE LOCATOR (URL) QUERY PARAMETER TEMPLATE LITERALS
     * =====================================================================
     */
    URL_QUERY_PARAM: {
        DATE_RANGE: (start, end) => {
            return start && end ? `?start=${ start }&end=${ end }` : '';
        }
    },

    /**
     * =====================================================================
     * DATATABLE TEMPLATE LITERALS
     * =====================================================================
     */

    DT: {
        BADGE: (theme="light", content="No data") => {
            return `<div class="badge badge-${ theme } p-2 w-100">${ content }</div>`
        },
        OPTIONS: options => {
            return `
                <div class="text-center dropdown">
                    <div class="d-block d-lg-inline-block btn btn-sm btn-default text-nowrap" data-toggle="dropdown" role="button">
                        <i class="fas fa-ellipsis-v d-none d-lg-inline-block"></i>
                        <i class="fas fa-ellipsis-h d-lg-none mr-1 mr-md-0"></i>
                        <span class="d-lg-none">Options</span>
                    </div>

                    <div class="dropdown-menu dropdown-menu-right">
                        ${ options }
                    </div>
                </div>
            `
        }
    }
}