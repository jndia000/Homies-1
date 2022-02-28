/** When logout button ic clicked */
$('#logoutBtn').on('click', () => {

    // Set elements to Loading State
    btnToLoadingState('#logoutBtn');
    disableElement('#cancelLogoutBtn');
    disableElement('#closeLogoutModalBtn');

    // If Error
    const err = () => {
        
        // Hide Modal
        hideModal('#logoutModal');

        // Set Button To Unload State
        btnToUnloadState('#logoutBtn', `
            <span>Log out</span>
            <i class="fas fa-sign-out-alt ml-1"></i>
        `);
        enableElement('#cancelLogoutBtn');
        enableElement('#closeLogoutModalBtn');

        // Show Error Alert
        toastr.error('There was an error while trying to logout');
    }

    // Logout
    GET_ajax(`/api/auth/logout`, {
        success: result => {
            if(result.status === "Success") {
                toastr.info(result.message);
                localStorage.clear();
                sessionStorage.clear();
                location.assign(`/login`)
            } else err()
        },
        error: () => err()
    });
});