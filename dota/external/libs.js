define('libs', ['$', '_', 'B', 'F'], function ($, _, B, F) {
    // 绑定fastclick
    $(function() {
        F.attach(document.body);
    });
});