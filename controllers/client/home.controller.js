
// [GET] /
const index = (req, res) => {
    res.render('client/pages/home/index', {pageTitle: 'page Home'});
}

module.exports = {
    index,
}