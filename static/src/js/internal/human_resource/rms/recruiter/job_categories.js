"use strict";


// Validate Add Job Category Form
validateForm('#addJobCategoryForm', {
    rules: {
        name: {
            required: true
        },
        description: {
            required: true
        }
    },
    messages: {
        name: {
            required: "Category name is required"
        },
        description: {
            required: "Description is required"
        }
    },
    submitHandler: () => {
        addJobCategory();
        return false;
    }
});


// Add Job Category
const addJobCategory = () => {

    // Set buttons to loading state
    btnToLoadingState('#addJobCategoryBtn');
    disableElement('#cancelAddJobCategoryBtn');

    // Generate data
    const formData = generateFormData('#addJobCategoryForm')
    const data = {
        name: formData.get('name'),
        description: formData.get('description'),
    }

    // Commit add
    POST_ajax(`${ ROUTE.API.R }job-categories`, data, {
        success: result => {
            if(result) {

                // Reload Datatable
                reloadDataTable('#jobCategoriesDT');

                // Hide Job category modal
                hideModal('#addJobCategoryModal');

                // Set buttons to unload state
                btnToUnloadState('#addJobCategoryBtn', TEMPLATE.LABEL_ICON('Add', 'plus'));
                enableElement('#cancelAddJobCategoryBtn');
                
                // Show success alert
                toastr.success('A new job category has been added');
            }
        },
        error: () => toastr.error('There was an error in adding new job category')
    })
}


// Reset form if modal has been hidden
onHideModal('#addJobCategoryModal', () => resetForm('#addJobCategoryForm'));


// Job Categpries DataTable
initDataTable(`#jobCategoriesDT`, {
    url: `${ ROUTE.API.R }job-categories`,
    columns: [
        
        // Created At (For Default Sorting)
        { data: 'created_at', visible: false },

        // Category Name
        { data: 'name' },

        // Description
        { data: 'description' },

        // Action
        {
            data: null,
            class: 'text-center',
            render: data => {
                const jobCategoryID = data.job_category_id;
                return TEMPLATE.DT.OPTIONS(`
                    <div
                        type="button"
                        class="dropdown-item d-flex"
                        onclick="viewJobCategoryDetails('${ jobCategoryID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-list"></i></div>
                        <div>View Details</div>
                    </div>
                    <div
                        type="button"
                        class="dropdown-item d-flex"
                        onclick="editJobCategory('${ jobCategoryID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-edit"></i></div>
                        <div>Edit Category</div>
                    </div>
                    <div
                        type="button"
                        class="dropdown-item d-flex"
                        onclick="removeJobCategory('${ jobCategoryID }')"
                    >
                        <div style="width: 2rem"><i class="fas fa-trash-alt"></i></div>
                        <div>Remove Category</div>
                    </div>
                `)
            }
        }
    ]
});


// View Job Category Details
const viewJobCategoryDetails = (jobCategoryID) => {
    GET_ajax(`${ ROUTE.API.R }job-categories/${ jobCategoryID }`, {
        success: result => {

            // Set Content
            setContent({
                '#jobCategoryName': result.name,
                '#jobCategoryDescription': result.description,
                '#jobCategoryAddedBy': () => {
                    const createdBy = result.job_category_created_by;
                    const createdByFullName = formatName('L, F M., S', {
                        firstName: createdBy.first_name,
                        middleName: createdBy.middle_name,
                        lastName: createdBy.last_name,
                        suffixName: createdBy.suffix_name,
                    });
                    return createdByFullName
                },
                '#jobCategoryAddedAt': `
                    <div>${ formatDateTime(result.created_at, 'Date') }</div>
                    <div>${ formatDateTime(result.created_at, 'Time') }</div>
                    <div class="small text-secondary">${ fromNow(result.created_at) }</div>
                `
            });

            // Show Modal
            showModal('#jobCategoryDetailsModal');
        },
        error: () => toastr.error('There was an error in getting job category details')
    });
}


// Edit Job Category
const editJobCategory = (jobCategoryID) => {
    GET_ajax(`${ ROUTE.API.R }job-categories/${ jobCategoryID }`, {
        success: result => {
            setValue({
                '#jobCategoryIDForEdit': result.job_category_id,
                '#jobCategoryNameForEdit': result.name,
                '#jobCategoryDescriptionForEdit': result.description
            });
            showModal('#editJobCategoryModal');
        },
        error: () => toastr.error('There was an error in getting job category details')
    });
}


// Validate Edit Job Category Form
validateForm('#editJobCategoryForm', {
    rules: {
        name: { required: true },
        description: { required: true }
    },
    messages: {
        name: { required: "Category name is required" },
        description: { required: "Description is required" }
    },
    submitHandler: () => {
        saveChangesToJobCategory();
        return false;
    }
});


// Save changes to job category
const saveChangesToJobCategory = () => {

    // Set buttons to loading state
    btnToLoadingState('#editJobCategoryBtn');
    disableElement('#cancelEditJobCategoryBtn');

    // Generate data
    const formData = generateFormData('#editJobCategoryForm')
    const data = {
        name: formData.get('name'),
        description: formData.get('description')
    }

    PUT_ajax(`${ ROUTE.API.R }job-categories/${ formData.get('jobCategoryID') }`, data, {
        success: result => {
            if(result) {

                // Reload datatable
                reloadDataTable('#jobCategoriesDT');

                // Hide Modal
                hideModal('#editJobCategoryModal');

                // Set buttons to unload state
                btnToUnloadState('#editJobCategoryBtn', TEMPLATE.LABEL_ICON('Save', 'check'));
                enableElement('#cancelEditJobCategoryBtn');

                // Show success alert
                toastr.info('A job category is successfully updated')
            }
        },
        error: () => toastr.error('There was an error in updating job category details')
    })
}


// Reset form on edit job category modal has been hidden
onHideModal('#editJobCategoryModal', () => resetForm('#editJobCategoryForm'));


// Remove Job Category
const removeJobCategory = (jobCategoryID) => {
    setValue('#jobCategoryIDForRemove', jobCategoryID);
    showModal('#removeJobCategoryModal');
}

onHideModal('#removeJobCategoryModal', () => resetForm('#removeJobCategoryForm'));

validateForm('#removeJobCategoryForm', {
    submitHandler: () => {
        const formData = generateFormData('#removeJobCategoryForm');
        DELETE_ajax(`${ ROUTE.API.R }job-categories/${ formData.get('jobCategoryID') }`, {
            success: result => {
                if(result) {
                    reloadDataTable('#jobCategoriesDT');
                    hideModal('#removeJobCategoryModal');
                    toastr.info('A job category has been removed');
                }
            },
            error: () => toastr.error('There was an error in removing job category')
        });
    }
})