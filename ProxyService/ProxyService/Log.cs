using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace ProxyServiceCJ
{
    static class Log
    {
        private static void WriteSystemLog(string message, EventLogEntryType errotype)
        {
            string sourcename = "proxyservice";
            string now = DateTime.Now.ToString("yyyy-MM-dd hh:mmm:ss") + " ";

            using (EventLog mylog = new EventLog())
            {
                try
                {
                    if (!EventLog.SourceExists(sourcename))
                    {
                        EventLog.CreateEventSource(sourcename, sourcename);
                    }
                    mylog.Source = sourcename;
                    mylog.MaximumKilobytes = 1024 * 20;
                    mylog.ModifyOverflowPolicy(OverflowAction.OverwriteAsNeeded, 30);
                    mylog.WriteEntry(now + message, errotype);
                }
                catch (Exception ex) {
                    throw ex;
                }
            }
        }

        public static void Success(string message) {
            WriteSystemLog(message, EventLogEntryType.SuccessAudit);
        }

        public static void Failure(string message)
        {
            WriteSystemLog(message, EventLogEntryType.Warning);
        }

        public static void Error(string message)
        {
            WriteSystemLog(message, EventLogEntryType.Error);
        }

        public static void Information(string message)
        {
            WriteSystemLog(message, EventLogEntryType.Information);
        }

        public static void Warn(string message)
        {
            WriteSystemLog(message, EventLogEntryType.Warning);
        }
    }
}
