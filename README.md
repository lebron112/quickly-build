```
npm i quickly-build
```

**_配置文件_**  
在项目中创建 .quicklyrc.js

```
module.exports = {
  environments: ['sit', 'pre', 'prod'],
  getBuildBashWithEnv: (env) => `npm run build:${env}`,// this env from environments
  onJobSuccess(rl) => { rl.close; }
}

```

```
// package.json add
"npm run build": "quickly-build [env]"
```

**_或者直接引用的方式_**

```
// xxx.js
const { QuickBuild } = require('quickly-build');
// import { QuickBuild } from 'quickly-build'; in ts
const job = new QuickBuild({
  environments: ['sit', 'pre', 'prod'],
  getBuildBashWithEnv: (env) => `npm run build:${env}`,
   onJobSuccess(rl) => { rl.close; }
});
job.start();// job.start('sit')

```

```
node xxx.js [env]
```

```
type Env = 'sit' | 'pre' | 'prod' | string;
export type QuickBuildConfig = {
  /** 编译的脚本  default: (env) => `npm run build:${env}` */
  getBuildBashWithEnv?: (env: Env) => string;
  /** readline 提示的 环境变量  default: ['sit','pre', 'prod'] */
  environments?: Array<Env>,
  /** git push 失败重新尝试推送次数, default: 3 */
  pushRetryTimes?: number;
  /** 检查编译后输出的相对目录， default: './dist' */
  outPutDir?: string;
  /** 脚本执行成功的钩子， readline输入的会返回一个readline对象  */
  onJobSuccess?: (v?: readline.Interface) => void;
  /** 脚本执行失败的钩子 ，不一定会结束  */
  onJobError?: (error: any) => void;
};

```

***该脚本会和自动依赖的vscode插件冲突***
***带commit检查类型的可能会导致commit失败而导致切换回当前分支失败***
