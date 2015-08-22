define('libs', ['$', '_', 'B', 'F', 'stickit'], function ($, _, B, F, S) {
    // 绑定fastclick
    $(function() {
        F.attach(document.body);
    });
});