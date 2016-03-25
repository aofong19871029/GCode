using Microsoft.Win32;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration.Install;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.IO;

namespace ProxyServiceCJ
{
    [RunInstaller(true)]
    public partial class ProxyInstall : System.Configuration.Install.Installer
    {
        private ServiceInstaller serviceInstaller;
        private ServiceProcessInstaller processInstaller;
        public const string SERVICENAME = "ProxyServiceCJ";

        public ProxyInstall()
        {
            InitializeComponent();
            // 初始化Installer           
            InitInstaller();
        }

        private void InitInstaller() {
            processInstaller = new ServiceProcessInstaller();
            serviceInstaller = new ServiceInstaller();

            processInstaller.Account = ServiceAccount.LocalSystem;
            serviceInstaller.Description = "翻墙代理服务, node client.js 本地端口 1234, 远程端口 80, 代理服务器域名 proxy.jiani.info";
            serviceInstaller.StartType = ServiceStartMode.Automatic;
            serviceInstaller.ServiceName = SERVICENAME;

            Installers.Add(serviceInstaller);
            Installers.Add(processInstaller);
        }

        protected override void OnBeforeInstall(IDictionary savedState)
        {
            base.OnBeforeInstall(savedState);

            try
            {
                if (IsServiceIsExisted(SERVICENAME) && File.Exists("ProxyServiceCJ.exe"))
                {
                    UnInstallmyService("ProxyServiceCJ.exe");
                }
            }
            catch (Exception) { }
        }

        protected override void OnAfterInstall(IDictionary savedState)
        {
            if (!StartService(SERVICENAME))
            {
                Log.Error(SERVICENAME + " Start Failure!");
            }
        }

        protected override void OnBeforeUninstall(IDictionary savedState)
        {
            if (!StopService(SERVICENAME))
            {
                Log.Error(SERVICENAME + " Stop Failure!");
            }
        }


        #region 检查服务存在的存在性  
        /// <summary>  
        /// 检查服务存在的存在性  
        /// </summary>  
        /// <param name=" NameService ">服务名</param>  
        /// <returns>存在返回 true,否则返回 false;</returns>  
        public static bool IsServiceIsExisted(string NameService)
        {
            ServiceController[] services = ServiceController.GetServices();
            foreach (ServiceController s in services)
            {
                if (s.ServiceName.ToLower() == NameService.ToLower())
                {
                    return true;
                }
            }
            return false;
        }
        #endregion

        #region 安装Windows服务  
        /// <summary>  
        /// 安装Windows服务  
        /// </summary>  
        /// <param name="stateSaver">集合</param>  
        /// <param name="filepath">程序文件路径</param>  
        public static void InstallmyService(IDictionary stateSaver, string filepath)
        {
            AssemblyInstaller AssemblyInstaller1 = new AssemblyInstaller();
            AssemblyInstaller1.UseNewContext = true;
            AssemblyInstaller1.Path = filepath;
            AssemblyInstaller1.Install(stateSaver);
            AssemblyInstaller1.Commit(stateSaver);
            AssemblyInstaller1.Dispose();
        }
        #endregion

        #region 卸载Windows服务  
        /// <summary>  
        /// 卸载Windows服务  
        /// </summary>  
        /// <param name="filepath">程序文件路径</param>  
        public static void UnInstallmyService(string filepath)
        {
            AssemblyInstaller AssemblyInstaller1 = new AssemblyInstaller();
            AssemblyInstaller1.UseNewContext = true;
            AssemblyInstaller1.Path = filepath;
            AssemblyInstaller1.Uninstall(null);
            AssemblyInstaller1.Dispose();
        }
        #endregion

        #region 判断window服务是否启动  
        /// <summary>  
        /// 判断某个Windows服务是否启动  
        /// </summary>  
        /// <returns></returns>  
        public static bool IsServiceStart(string serviceName)
        {
            ServiceController psc = new ServiceController(serviceName);
            bool bStartStatus = false;
            try
            {
                if (!psc.Status.Equals(ServiceControllerStatus.Stopped))
                {
                    bStartStatus = true;
                }

                return bStartStatus;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

        #region  修改服务的启动项  
        /// <summary>    
        /// 修改服务的启动项 2为自动,3为手动    
        /// </summary>    
        /// <param name="startType"></param>    
        /// <param name="serviceName"></param>    
        /// <returns></returns>    
        public static bool ChangeServiceStartType(int startType, string serviceName)
        {
            try
            {
                RegistryKey regist = Registry.LocalMachine;
                RegistryKey sysReg = regist.OpenSubKey("SYSTEM");
                RegistryKey currentControlSet = sysReg.OpenSubKey("CurrentControlSet");
                RegistryKey services = currentControlSet.OpenSubKey("Services");
                RegistryKey servicesName = services.OpenSubKey(serviceName, true);
                servicesName.SetValue("Start", startType);
            }
            catch (Exception ex)
            {

                return false;
            }
            return true;


        }
        #endregion

        #region 启动服务  
        private bool StartService(string serviceName)
        {
            bool flag = true;
            if (IsServiceIsExisted(serviceName))
            {
                System.ServiceProcess.ServiceController service = new System.ServiceProcess.ServiceController(serviceName);
                if (service.Status != System.ServiceProcess.ServiceControllerStatus.Running && service.Status != System.ServiceProcess.ServiceControllerStatus.StartPending)
                {
                    service.Start();
                    for (int i = 0; i < 60; i++)
                    {
                        service.Refresh();
                        System.Threading.Thread.Sleep(1000);
                        if (service.Status == System.ServiceProcess.ServiceControllerStatus.Running)
                        {
                            break;
                        }
                        if (i == 59)
                        {
                            flag = false;
                        }
                    }
                }
            }
            return flag;
        }
        #endregion

        #region 停止服务  
        private bool StopService(string serviceName)
        {
            bool flag = true;
            if (IsServiceIsExisted(serviceName))
            {
                System.ServiceProcess.ServiceController service = new System.ServiceProcess.ServiceController(serviceName);
                if (service.Status == System.ServiceProcess.ServiceControllerStatus.Running)
                {
                    service.Stop();
                    for (int i = 0; i < 60; i++)
                    {
                        service.Refresh();
                        System.Threading.Thread.Sleep(1000);
                        if (service.Status == System.ServiceProcess.ServiceControllerStatus.Stopped)
                        {
                            break;
                        }
                        if (i == 59)
                        {
                            flag = false;
                        }
                    }
                }
            }
            return flag;
        }
        #endregion
    }
}
