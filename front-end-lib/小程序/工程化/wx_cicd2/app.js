const http = require('http');
const spawn = require('child_process').spawn;
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/webhook', secret: 'testsercret' });
const wxci = require('./wxci');

// 创建http的服务
function runCommand(command, args) {
    return new Promise((reslove, reject) => {
        const child = spawn(command, args, { shell: true, stdio: 'inherit'});
        child.on('exit', (code) => {
            if (code === 0) {
                reslove(code);
                return;
            }
            reject('error');
        });
    });
};
http.createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end('no such location')
    })
  }).listen(8089)
   
  handler.on('error', function (err) {
    console.error('Error:', err.message)
  })
   
  handler.on('push', async function (event) {
      console.log('event----', event);
      const { head_commit } = event.payload;
    //   console.log('head_commit----', head_commit);
      await runCommand('sh', ['./build.sh']);
      await wxci.upload(head_commit.message);
    // console.log('Received a push event for %s to %s',
    //   event.payload.repository.name,
    //   event.payload.ref)
  })
