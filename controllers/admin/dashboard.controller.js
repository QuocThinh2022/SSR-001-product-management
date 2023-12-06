

// [GET] /admin/dashboard
const index = async (req, res) => {
    res.render('admin/pages/dashboard/index', {
        pageTitle: 'page dashboard'
    });
}

module.exports = {
    index,
}