"use strict";

/** Validate Login Form */
validateForm("#loginForm", {
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true
        }
    },
    messages: {
        email: {
            required: "Your email is required",
            email: "Input must be a valid email"
        },
        password: {
            required: "Your password is required"
        }
    },
    submitHandler: () => loginAJAX()
})

const loginAJAX = () => {
    btnToLoadingState('#loginBtn');
    disableElement('#loginBtn');

    const formData = generateFormData('#loginForm');
    
    const data = {
        username: formData.get('email'),
        password: formData.get('password')
    }
    
    disableElement('#email');
    disableElement('#password');
    
    $.ajax({
        url: `${ BASE_URL_API }auth/login`,
        type: 'POST',
        data: data,
        dataType: 'json',
        success: result => {
            if(result.authorized) {
                localStorage.setItem("access_token", result.access_token);

                toastr.options = {
                    "preventDuplicates": true,
                    "positionClass": "mt-3 toast-top-center",
                    "showDuration": "3000"
                }
                toastr.success("Log in was successful!");

                location.assign(`${ BASE_URL_WEB }redirect`);
            } else {
                toastr.options = {
                    "preventDuplicates": true,
                    "positionClass": "mt-3 toast-top-center",
                    "showDuration": "3000"
                }
                toastr.warning(result.message);
                setContent('#loginBtn', TEMPLATE.LABEL_ICON('Log in', 'sign-in-alt'));
                enableElement('#loginBtn');

                enableElement('#email');
                enableElement('#password');
            }
        },
    }).fail(() => {
        toastr.options = {
            "preventDuplicates": true,
            "positionClass": "toast-top-center",
            "showDuration": "3000"
        }
        toastr.danger("There was a problem in logging in. Please try again later")
    });
}