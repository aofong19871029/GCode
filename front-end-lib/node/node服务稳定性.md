## Node 服务稳定性

* docker + 系统监控工具监控cpu、内存，redis, db, 网卡, pm2

- checkHealth机制
- 日志工具记录用户请求
- 用dump工具分析服务遇到的问题
- 生产集群支持HPA 自动扩缩容
- 设定指标警告，不同警告等级，发送告警邮件，短信，RCA