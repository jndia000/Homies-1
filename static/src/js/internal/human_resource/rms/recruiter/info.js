"use strict";

/**
 * ==============================================================================
 * USER INFORMATION
 * ==============================================================================
 */


/** Get User Information */
(() => {
    let userInfo = JSON.parse(sessionStorage.getItem('user_info'));
    
    const setUserInfo = () => {
        userInfo = JSON.parse(sessionStorage.getItem('user_info'));
        setContent({
            '#userFullName': userInfo["fullName"],
            '#userPosition': userInfo["position"],
            '#userDepartment': userInfo["department"]
        });
        $('#userFullNameLoader').remove();
        showElement('#userFullNameDisplay');
    }

    const getUserInfo = () => {
        GET_ajax(`${ ROUTE.API.R }info`, {
            success: result => {
                if(result) {
                    sessionStorage.setItem('user_info', JSON.stringify({
                        "fullName": formatName("F M. L, S", {
                            firstName  : result.first_name,
                            middleName : result.middle_name,
                            lastName   : result.last_name,
                            suffixName : result.extension_name
                        }),
                        "position": result.position.name,
                        "department": result.position.sub_department.name
                    }));
                    userInfo = JSON.parse(sessionStorage.getItem('user_info'));
                    setUserInfo();
                } else toastr.error('There was an error while getting your information');
            },
            error: () => toastr.error('There was an error while getting your information')
        });
    }

    userInfo ? setUserInfo() : getUserInfo();
})();