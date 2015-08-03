require.config({
    baseUrl: 'external',
    shim: {
        $: {
            exports: 'zepto'
        },
        _: {
            exports: '_'
        },
        B: {
            deps: [
                '_',
                '$'
            ],
            exports: 'Backbone'
        },
        F: {
            exports: 'F'
        }
    },
    paths: {
        '$': 'zepto',
        '_': 'underscore',
        'B': 'backbone.custom.js',
        'F': 'fastclick',
        'text': 'require.text.js'
    }
});

define('libs', ['$', '_', 'B', 'F'], function ($, _, B, F) {
    // 绑定fastclick
    $(function() {
        F.attach(document.body);
    });
});