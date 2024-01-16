
// table permissions 
const tablePermisstions = document.querySelector('[table-permissions]');
if (tablePermisstions) {
    const buttonSubmit = document.querySelector('[button-submit');
    buttonSubmit.addEventListener('click', () => {
        let result = [];
        const rows = tablePermisstions.querySelectorAll('[data-name]');
        rows.forEach(row => {
            const name = row.getAttribute('data-name');
            const inputs = row.querySelectorAll('input');
            if (name == 'id') {
                inputs.forEach(input => {
                    const value = input.value;
                    result.push({
                        id: value,
                        permissions: []
                    })
                })
            } else {
                inputs.forEach((input, index) => {
                    if (input.checked)
                        result[index].permissions.push(name)
                })
            }
        })

        const formChangePermissions = document.querySelector('#form-change-permissions');
        const inputPermissions = formChangePermissions.querySelector('input');
        inputPermissions.value = JSON.stringify(result);
        formChangePermissions.submit();
    })
}
// end table permisstion 

// permissions data default 
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    let records = dataRecords.getAttribute('data-records');
    const tablePermisstions = document.querySelector('[table-permissions]');

    records = JSON.parse(records);
    records.forEach((record, index) => {
        record.permissions.forEach(item => {
            const row = tablePermisstions.querySelector(`tr[data-name=${item}]`);
            const inputs = row.querySelectorAll('input');
            inputs[index].checked = true;
        })
    })
}

// end permissions data default 