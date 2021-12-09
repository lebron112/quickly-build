import readline from 'readline';
export type Env = 'sit' | 'pre' | 'prod' | string;
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
