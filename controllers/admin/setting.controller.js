const SettingGeneral = require('../../models/settings-general.model')

// [GET] /admin/settings/general 
async function getGeneral(req, res) {
    try {
        const settingGeneral = await SettingGeneral.findOne();

        res.render('admin/pages/settings/general', {
            pageTitle: 'Cai dat chung',
            settingGeneral
        })
    } catch {

    }
}

// [PATCH] /admin/settings/general 
async function general(req, res) {
    try {
        if (req.file) {
            req.body[req.file.fieldname] = req.file.path;
        }

        const settingGeneral = await SettingGeneral.findOne();
        if (settingGeneral) {
            await SettingGeneral.updateOne({}, req.body);
        } else {
            await new SettingGeneral(req.body).save();
        }


        req.flash('success', `cap nhat thanh cong!`)
        res.redirect('back')
    } catch(error) {
        req.flash('error', `error: ${error}`)
        res.redirect('back')
    }
}

module.exports = {
    getGeneral,
    general,
}