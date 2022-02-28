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
});

/** Login */
const loginAJAX = () => {

    // Generate Form Data
    // Important: form data first before disabling elements
    const fd = generateFormData('#loginForm');
    
    // Set elements to loading states
    btnToLoadingState('#loginBtn');
    disableElement('#email');
    disableElement('#password');

    // Configure toast options
    toastr.options = {
        "preventDuplicates": true,
        "positionClass": "mt-3 toast-top-center",
        "showDuration": "3000"
    }

    // If error
    const err = () => {

        // Set elements to unload state
        btnToUnloadState('#loginBtn', TEMPLATE.LABEL_ICON('Log in', 'sign-in-alt'));
        enableElement('#email');
        enableElement('#password');
    }
    
    // Call ajax
    $.ajax({
        url: `/api/auth/login?remember=${ $('#remember').is(':checked') }`,
        type: 'POST',
        data: {
            username: fd.get('email'),
            password: fd.get('password')
        },
        dataType: 'json',
        success: result => {
            if(result.authorized) {

                // Store access token to localStorage
                localStorage.setItem("access_token", result.access_token);
                
                // Show Success Alert
                toastr.success("Log in was successful!");

                // Redirect to a page
                location.assign('/internal/home');
            } else {
                err();
                toastr.warning(result.message);
            }
        },
    }).fail(() => {
        err();
        toastr.danger("There was a problem in logging. Please try again later")
    });

    // Return false to prevent default submitting form
    return false;
}