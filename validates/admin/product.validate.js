

const createProduct = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', 'Tieu de khong duoc de trong!');
        res.redirect('back');
        return ;
    }

    if (req.body.title.length < 5) {
        req.flash('error', 'Tieu de dai toi 5 ky tu');
        res.redirect('back');
        return;
    }
    next();
}

module.exports = {
    createProduct,
}