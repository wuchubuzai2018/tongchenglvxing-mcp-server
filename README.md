# 非官方的同程旅行 MCP Server

## 概述

目前支持对接同程旅行网站上的的火车票的接口，获取指定火车票的车次列表信息。

依赖`MCP Typescript SDK`开发，目前提供Node方式的对接，Java方式后续提供。



## 开始

使用MCP Server主要通过两种形式，计划分别是`java`和`Typescript`，目前已支持TypeScript方式。

### Typescript接入

详细信息可以参考typescript-mcp文件夹下的说明。

#### nodejs安装
通过Typescript接入，你只需要安装[node.js](https://nodejs.org/en/download)。

当你在终端可以运行

```bash
node -v
```

则说明你的`node.js`已经安装成功。

### NPX本地开发环境接入

下载项目后，执行npm install进行项目构建，然后再MCP Client中进行配置。

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

### NPX已发布环境接入

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



## 更新

| 版本 | 功能说明                       | 更新日期      |
| ---- | ------------------------------ | ------------- |
| V0.0.1 | MCP Server初始版本，简单支持下火车票车次查询 | 2025-04-29 |

## 反馈

在使用MCP Server时遇到的任何问题，欢迎通过`issue`或是反馈给我，非常感谢各位的支持与贡献❤️
