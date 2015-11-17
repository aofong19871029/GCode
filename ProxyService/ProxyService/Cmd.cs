using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Sockets;

namespace ProxyService
{
    public class Cmd
    {
        private Process p;


        internal string Path { get; set; }

        internal bool IsEnable { get; set; }

        public Cmd(string path = @"D:\Applications\nodejs\node.exe")
        {
            this.p = new Process();
            this.Path = path;

        }

        private void ListeneProcess()
        {
            if (this.p == null) return;

            this.p.OutputDataReceived += p_OutputDataReceived;
            this.p.Exited += p_Exited;
        }

        protected void p_Exited(object sender, EventArgs e)
        {

        }

        protected void p_OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            try
            {
               Log.Information(e.Data);
            }
            catch (Exception) { }
        }

        public void Run()
        {
            p.StartInfo.FileName = this.Path;
            p.StartInfo.UseShellExecute = false;
            p.StartInfo.RedirectStandardInput = true;
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.RedirectStandardError = true;
            p.StartInfo.CreateNoWindow = true;
            p.StartInfo.Arguments = @"client.js";
            p.StartInfo.WorkingDirectory = @"C:\Users\Administrator\Desktop\proxy";

            try
            {
                p.Start();
                if (!isPortBeTaken()) {
                    if (p.StandardError.Peek() != -1)
                    {
                        Log.Failure("Start Process Failure: " + p.StandardError.ReadToEnd());
                    }
                    else {
                        Log.Error("Port be used");
                    }
                }                
                else
                {
                    Log.Success("Start Process Success");
                }
            }
            catch (Exception e)
            {
                Log.Error("Start Process Failure: " + e.Message);
            }
            finally
            {
                Log.Information("Start Process Complete");
            }
        }

        public void Kill()
        {
            if (this.p != null)
            {
                try
                {
                    p.Kill();
                    Log.Success("Kill Process Success");
                }
                catch (Exception ex)
                {
                    string errorMsg = ex.Message;

                    while (ex.InnerException != null)
                    {
                        ex = ex.InnerException;
                        errorMsg = ex.Message;
                    }

                    Log.Error("Kill Process Failure: " + errorMsg);
                }
                finally {
                    Log.Information("Kill Process Complete");
                }
            }
        }

        private bool isPortBeTaken(int port = 1234) {
            TcpListener listener;
            try
            {
                listener = new TcpListener(IPAddress.Parse("0.0.0.0"), port);
                listener.Start();
                listener.Stop();
                return false;
            }
            catch (Exception)
            {
                return true;
            }
            finally {
                listener = null;
            }
        }
    }
}
