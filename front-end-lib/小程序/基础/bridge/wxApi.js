const wxApi = {
    openPhoto: (ws, config) => {
        console.log('我是native端的打开摄像头功能');
        // do something
        if (config.cb) {
            ws.sendText(config.cb)
        }
    },
};

module.exports = wxApi;