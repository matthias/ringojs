// a simple web app/module
importFromModule('helma.skin', 'render');

function main_action() {
    var context = {
        title: 'Module Demo',
        href: request.path
    };
    render('skins/modules.html', context);
}
