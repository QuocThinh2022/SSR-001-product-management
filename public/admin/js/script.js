

// button status 
const buttonStatus = document.querySelectorAll('[button-status]');

if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('button-status');
            if (status == '')
                url.searchParams.delete('status');
            else{
                url.searchParams.set('status', status);
                url.searchParams.delete('page');
            }
            window.location.href = url.href;
        })
    })
}
// end button status 

// form search 
const formSearch = document.querySelector('#form-search');

if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        let value = e.target.elements.keyword.value;
        if (value == '')
            url.searchParams.delete('keyword');
        else{
            
            url.searchParams.set('keyword', value);
            url.searchParams.delete('page');
            url.searchParams.delete('status');
        }
        window.location.href = url.href;
    })
}
// end form search 

// pagination 
const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination.length > 0) {
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            url.searchParams.set('page', page);
            window.location.href = url.href;
        })
    })
}

// end pagination 

// change status 
const buttonsChangeStatus = document.querySelectorAll('[button-change-status]');
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');

    buttonsChangeStatus.forEach(button => {
        button.addEventListener('click', () => {
            let status = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');

            status = (status == 'active' ? 'inactive':'active');
            const action = path + `/${status}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            // formChangeStatus.setAttribute('action', action);
            formChangeStatus.submit();
        })
    })
}

// end change status 

// checkbox multi 
const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector('input[name="checkall"]');
    const inputsId = checkboxMulti.querySelectorAll('input[name="id"]');
    
    inputCheckAll.addEventListener('click', () => [
        inputsId.forEach(input => {
            input.checked = inputCheckAll.checked;
        })
    ])
    
    inputsId.forEach(input => {
        input.addEventListener('click', () => {
            const countChecked = checkboxMulti.querySelectorAll('input[name="id"]:checked').length;
            inputCheckAll.checked = (countChecked == inputsId.length);
        })
    })

}
// end checkbox multi 

// form change multi 
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputsChecked = checkboxMulti.querySelectorAll('input[name="id"]:checked');
        const typeChange = e.target.elements.type.value;
        if (typeChange == 'delete-all' || typeChange == 'delete-trash-all') {
            const isConfirm = confirm('Ban co chac muon xoa nhung ban ghi nay?');
            if (!isConfirm)
                return;            
        }

        if (inputsChecked.length > 0) {
            const inputIds = formChangeMulti.querySelector('input[name="ids"]');
            let ids = [];
            inputsChecked.forEach(input => {
                const id = input.value;
                if (typeChange == 'change-position') {
                   const position = input.closest('tr').querySelector('input[name="position"]').value;
                    ids.push(`${id}-${position}`);
                }
                else
                    ids.push(id);
            })
            inputIds.value = ids.join(', ');
            formChangeMulti.submit();
        } else {
            alert('Vui long chon it nhat 1 ban ghi');
        }
    })
}

// end form change multi 

// form delete item 
const buttonsDelete = document.querySelectorAll('[button-delete]');
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector('#form-delete-item');
    const path = formDeleteItem.getAttribute('data-path');
    buttonsDelete.forEach(button => {
        button.addEventListener('click', () => {
            const confirmDelete = confirm("Ban co chac muon xoa ban ghi nay?");
            if (confirmDelete) {
                const id = button.getAttribute('data-id');
                const action = path + `/${id}?_method=PATCH`;

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
}
// end form delete item 

// form undo item 
const buttonsUndo = document.querySelectorAll('[button-undo]');
if (buttonsUndo.length > 0) {
    const formUndoItem = document.querySelector('#form-undo-item');
    const path = formUndoItem.getAttribute('data-path');
    buttonsUndo.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const action = path + `/${id}?_method=PATCH`;

            formUndoItem.action = action;
            formUndoItem.submit();
        })
    })
}
// end form undo item 

// form delete item trash
const buttonsDeleteTrash = document.querySelectorAll('[button-delete-trash]');
if (buttonsDeleteTrash.length > 0) {
    const formDeleteTrashItem = document.querySelector('#form-delete-trash-item');
    const path = formDeleteTrashItem.getAttribute('data-path');

    buttonsDeleteTrash.forEach(button => {
        button.addEventListener('click', () => {
            const confirmDelete = confirm("Ban co chac muon xoa ban ghi nay?");
            if (confirmDelete) {
                const id = button.getAttribute('data-id');
                const action = path + `/${id}?_method=DELETE`;

                formDeleteTrashItem.action = action;
                formDeleteTrashItem.submit();
            }
        })
    })
}
// end form delete item trash


// show alert 
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute('data-time')) || 1500;
    const closeAlert = showAlert.querySelector('[close-alert]');
    setTimeout(() => {
        showAlert.classList.add('alert-hidden');
    }, time);

    closeAlert.addEventListener('click', () => {
        showAlert.classList.add('alert-hidden');
    })
}
// end show alert 


// upload Image 
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector('[upload-image-input]');
    const uploadImagePreview = uploadImage.querySelector('[upload-image-preview]');
    
    uploadImageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            const image = URL.createObjectURL(e.target.files[0]);
            uploadImagePreview.src = image;
        }
    })
    
}
// end upload image 

// sort 
const sortDiv = document.querySelector('[sort-div]');
if (sortDiv) {
    let url = new URL(window.location.href);
    const sortSelect = sortDiv.querySelector('[sort-select]');
    const sortClear = sortDiv.querySelector('[sort-clear]');
    sortSelect.addEventListener('change', (e) => {
        const [sortKey, sortValue] = e.target.value.split('-');
        url.searchParams.set('sortKey', sortKey);
        url.searchParams.set('sortValue', sortValue);
        window.location.href = url.href;
    })

    // hien thi lua chon sap xep (select)
    const sortKey = url.searchParams.get('sortKey');
    const sortValue = url.searchParams.get('sortValue');
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`)
        optionSelected.selected = true;
    }

    // xoa chon sap xep (clear)
    sortClear.addEventListener('click', () => {
        url.searchParams.delete('sortKey');
        url.searchParams.delete('sortValue');
        window.location.href = url.href;
    })
}
// end sort 