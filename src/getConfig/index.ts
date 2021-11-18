export type Env = 'sit' | 'pre' | 'prod' | string;
export type QuickBuildConfig = {
  /** 编译的脚本 */
  getBuildBashWithEnv?: (env: Env) => string;
  environments?: Array<Env>,
  pushRetryTimes?: number;
  outPutDir?: string;
};
