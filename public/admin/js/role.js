
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
                    if (input.checked == true)
                        result[index].permissions.push(name)
                })
            }
        })
        console.log(result)
    })
}
// end table permisstion 