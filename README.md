```
npm i quickly-build
```
***配置文件***  
在项目中创建 .quicklyrc.js
```
module.exports = {
  environments: ['sit', 'pre', 'prod'],
  getBuildBashWithEnv: (env) => `npm run build:${env}`,
}

```
***或者直接引用的方式***  

```
const { QuickBuild } = require('quickly-build');
// import { QuickBuild } from 'quickly-build'; in ts
const job = new QuickBuild({
  environments: ['sit', 'pre', 'prod'],
  getBuildBashWithEnv: (env) => `npm run build:${env}`,
});
job.start();

```

```
type Env = 'sit' | 'pre' | 'prod' | string;
type QuickBuildConfig = {
  /** 编译的脚本 */
  getBuildBashWithEnv?: (env: Env) => string;
  environments?: Array<Env>,
  pushRetryTimes?:number;
};
```