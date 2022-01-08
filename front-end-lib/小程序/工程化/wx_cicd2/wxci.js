const ci = require('miniprogram-ci');

const wxci = {
    upload: async (message) => {
        const project = new ci.Project({
        appid: 'wxd2984809fc4c86c2',
        type: 'miniProgram',
        projectPath: './client/uni_min_program/dist/build/mp-weixin',
        privateKeyPath: './private.wxd2984809fc4c86c2.key',
        ignores: ['node_modules/**/*'],
        });

        const uploadResult = await ci.upload({
            project,
            version: '1.1.1',
            desc: message,
            setting: {
              es6: true,
            },
            onProgressUpdate: console.log,
          })
    },
};

module.exports = wxci;