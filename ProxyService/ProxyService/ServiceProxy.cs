using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;

namespace ProxyServiceCJ
{
    public partial class ServiceProxy : ServiceBase
    {
        private Cmd _cmd;

        public ServiceProxy()
        {
            InitializeComponent();

            _cmd = new Cmd();
        }

        protected override void OnStart(string[] args)
        {
            // TODO: Add code here to start your service.
            _cmd.Run();
        }

        protected override void OnStop()
        {
            // TODO: Add code here to perform any tear-down necessary to stop your service.
            _cmd.Kill();
        }

       

    }
}
