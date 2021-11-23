# react-router-nav

react-router具名路由

# 对应react-router版本

^5.2.0

# 应用场景

根据路由中的name来找到相应的path并进行操作


# API

详细入参请查阅index.d.ts

>* createPath (创建路径)
>* createFullPath (创建完整路径)
>* createRouteNav (创建路由导航)
>* useRouterNav (基于hooks使用路由导航)
>* addHistory (添加一个history)
>* removeHistory (移除一个histroy)
>* useInjectHistory (使用hooks快速注入一个路由栈)

## 额外属性

>* routeStack (当前路由栈中所有history的集合)
>* RouteList: distributionData.RouteList,
>* RoutePathMaps: distributionData.RoutePathMaps,
>* RouteNameConfig: distributionData.RouteNameConfig