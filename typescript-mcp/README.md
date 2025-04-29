# 同程旅行火车票 MCP Server

非官方，基于同城旅行网的接口，实现的同程旅行网火车票的MCP Server

## Tools

1. `query_train_tickets_list`
   - 火车票车次列表查询功能，它可以帮助用户获取指定城市/车站的火车票信息，数据来源于同程旅行网火车票查询，根据用户提供的出发站出发城市、到达站到达城市、出发日期进行查询结果，返回出发站信息和到达站信息和座位票价信息
   
   - Input: 
     - `depStationName` (string): 出发火车站名称或者出发城市名称。
     - `arrStationName` (string): 目的地火车站名称或者到城市名称。
     - `depDate` (string): 出发日期，格式为yyyy-MM-dd。
     
   - Returns: 
   
     ```json
      {
             用户查询出发站:xxxxxx,
             用户查询到达站:xxxxx,
             车次列表: [
               是否当日到达:"是",
               出发火车站是否是经停站:"是经停站",
               出发火车站是否是始发站:"是始发站",
               车次号: xxxxx,
               出发车站名称:xxxxx	,
               出发日期: xxxx		,
               出发时间: xxxx,
     
               到达车站名称: xxxx	,
               到达日期: xxxx	,
               到达时间: xxxx,
             
               历时小时分钟: xxxxx,
               座位类型: [
                 类型: xxxxx,
                 价格: xxxx,
                 余票:xxxx
              ]
          ]
     }
     ```
 2. `get_current_system_time`
   - 当前时间查询功能，它可以帮助你获取当前系统日期时间是多少,返回格式为:yyyy-MM-dd hh:mm:ss，火车票查询时时间相关可以使用

   - Returns:

     返回字符串格式的数据日期时间。     

### NPX本地开发环境

```json
{
  "mcpServers": {
    "tongchenglvxing-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "/Users/tongchenglvxing-mcp-server/dist/index.js"
      ]
    }
  }
}
```

### NPX发布环境

```json
{
  "mcpServers": {
    "tongchenglvxing-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@wuchubuzai/tongchenglvxing-mcp-server"
      ]
    }
  }
}
```

