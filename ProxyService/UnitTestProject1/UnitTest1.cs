using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProxyService;
using System.Threading;
using System.Diagnostics;

namespace UnitTestProject1
{
    [TestClass]
    public class UnitTest1
    {
        private Cmd _cmd;

        [TestMethod]
        public void TestMethod1()
        {
            _cmd = new Cmd();
            _cmd.Run();

            _cmd.Kill();
        }
    }
}
