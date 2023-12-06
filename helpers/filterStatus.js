
module.exports = (query) => {
    let filterStatus = [
        {
            name: 'All',
            status: '',
            class: ''
        },
        {
            name: 'Active',
            status: 'active',
            class: ''
        },
        {
            name: 'Inactive',
            status: 'inactive',
            class: ''
        }
    ]

    let indexStatus = 0;
    if (query.status) {
        indexStatus = filterStatus.findIndex((item) => {
            return item.status == query.status;
        })
    }
    filterStatus[indexStatus].class = 'active';
    return filterStatus;
}