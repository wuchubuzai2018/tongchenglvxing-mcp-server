#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const TONGCHENG_CODE_URL = "https://www.ly.com/trainbffapi/getCodeByStationName";
const TONGCHENG_TRAIN_URL = "https://www.ly.com/trainsearchbffapi/trainSearch";

const GET_HUOCHEPIAO_LIST:Tool = {
    name: "get_huochepiao_list",
    description: "火车票车次列表查询功能，数据来源于同程旅行网火车票查询，输入用户提供的出发站出发城市、到达站到达城市、出发日期进行查询结果，返回出发站信息和到达站信息和座位票价信息",
    inputSchema: {
        type: "object",
        properties: {
            startCityName: {
                type: "string",
                description: "出发火车站名称或者出发城市名称"
            },
            arryCityName: {
                type: "string",
                description: "目的地火车站名称或者到城市名称"
            },
            startDate: {
                type: "string",
                description: "出发日期，格式为yyyy-MM-dd"
            }
        },
        required: ["startCityName","arryCityName","startDate"]
    }
};

const GET_SYSTIME:Tool = {
    name: "get_systemtime",
    description: "当前时间查询功能，它可以帮助你获取当前系统日期时间是多少,返回格式为:yyyy-MM-dd hh:mm:ss，火车票查询时时间相关可以使用",
    inputSchema: {
        type: "object",
        properties: {
        },
        required: []
    }
};

const SUPPORT_TOOLS = [
    GET_HUOCHEPIAO_LIST,
    GET_SYSTIME
  ] as const;
  

  async function handleGetHuochepiaoList(startCityName :string,arryCityName :string,startDate :string) {
    const headers = {
       'Content-Type': 'application/json'
    };

	// 先发送第一个请求，根据城市名称获取编码数据
    const response1 = await fetch(TONGCHENG_CODE_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                names: [startCityName, arryCityName],
                pid: 1
            })
    });

    const respBody:any = await response1.json();
    if (respBody.code !== 200) {
        return {
            content: [{
                    type: "text",
                    text: `获取火车票城市编码数据失败`
                }],
            isError: true
        };
    }
    // 如果执行到这里说明第1个请求成功，在请求第2个接口 {"code":200,"data":["CQW","BJP"],"g":"1745854839135-18780"}
    const startCode = respBody.data[0];
    const endCode = respBody.data[1];
   
	// 在发送第2个请求
	
    const params2 = {
    	"depStation":startCode,
    	"arrStation":endCode,
    	"depDate":startDate,
    	"type":"ADULT",
        "traceId":Date.now.toString(),
        "pid":1
    };
 	console.log(JSON.stringify(params2));
    const response2 = await fetch(TONGCHENG_TRAIN_URL, {
        method: 'POST', 
        headers: headers,
        body:  JSON.stringify(params2) 
    });

    const data2:any = await response2.json();
    if (data2.code && data2.code !== 200) {
         // 如果执行到这里说可能失败了
        return {
            content: [{
                    type: "text",
                    text: `获取火车票列表数据失败:${data2.message}`
                }],
            isError: true
        };
    }
    if(!data2.success){
        // 如果执行到这里说可能失败了
         return {
            content: [{
                    type: "text",
                    text: `获取火车票列表数据失败:${data2.errorMessage}`
                }],
            isError: false
        };
    }
    //  数据解析与格式化
    const resultData = data2.data;
    if(!resultData.trains || resultData.trains.length == 0){
        return {
            content: [{
                    type: "text",
                    text: "数据为空"
                }],
            isError: false
        };
    }
    // 如果知道这里，说明数据存在，则开始进行数据的清洗
    const finalResult = convertFieldNames(resultData,startCityName,arryCityName);

    // 返回正确的结果
    return {
        content: [{
                type: "text",
                text: JSON.stringify(finalResult, null, 2)
            }],
        isError: false
    };
}


async function handleGetSystemTime() {
    // 获取当前系统时间
    const now = new Date();
    
    // 格式化日期时间
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 组合成标准格式
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    //  计算当前的系统时间是什么
	return {
        content: [{
                type: "text",
                text: formattedTime
            }],
        isError: false
    };
}

const convertFieldNames = (resultData: any,startCityName:string,arryCityName:string) => {
    if (!resultData) return resultData;
    return {
        用户查询出发站:startCityName,
        用户查询到达站:arryCityName,
        车次列表: resultData.trains?.map((item: { trainCode: string;depStationName:any, depTime:any, runTime:any,depDate: any, 
            arrDate: any,arrTime:any,arrivalDays:any, arrStationName: any,depStationCode:string,startStationCode:string,trainAvs: any[]; }) => ({
          是否当日到达:item.arrivalDays > 1 ? "否" : "是",
          出发火车站是否是经停站:item.depStationCode	=== item.startStationCode ? "不是经停站" : "是经停站",
          出发火车站是否是始发站:item.depStationCode	=== item.startStationCode ? "是始发站" : "不是始发站",
          车次号: item.trainCode,
          出发车站名称:item.depStationName	,
          出发日期: item.depDate		,
          出发时间: item.depTime,

          到达车站名称: item.arrStationName	,
          到达日期: item.arrDate	,
          到达时间: item.arrTime,
        
          历时小时分钟: item.runTime,
          座位类型: item.trainAvs?.map((seat: { seatClassCode: any; price: any; num: any; }) => ({
            类型: convertSeatName(seat.seatClassCode),
            价格: seat.price,
            余票: seat.num	
          }))
        })) || []
      };
}
function convertSeatName(seatClassCode: any): any {
    if(seatClassCode === "9"){
        return "商务座";
    }
    if(seatClassCode === "M"){
        return "一等座";
    }
    if(seatClassCode === "O"){
        return "二等座";
    }
    if(seatClassCode === "4"){
        return "软卧";
    }
    if(seatClassCode === "3"){
        return "硬卧";
    }
    if(seatClassCode === "1"){
        return "硬座";
    }
    if(seatClassCode === "W"){
        return "无座";
    }
    return "";
}



// Server setup
const server = new Server({
    name: "mcp-server/tongchenglvxing",
    version: "0.0.1",
}, {
    capabilities: {
        tools: {},
    },
});

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: SUPPORT_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      switch (request.params.name) {
        case "get_huochepiao_list": {
          const { startCityName,arryCityName,startDate } = request.params.arguments as { startCityName :string,arryCityName :string,startDate :string };
          return await handleGetHuochepiaoList(startCityName,arryCityName,startDate);
        }
  
        case "get_systemtime": {
            return await handleGetSystemTime();
        }
        default:
          return {
            content: [{
              type: "text",
              text: `Unknown tool: ${request.params.name}`
            }],
            isError: true
          };
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  });


async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Tongchenglvxing MCP Server running on stdio");
}
runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
