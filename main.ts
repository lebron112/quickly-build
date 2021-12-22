import { Env, QuickBuildConfig } from "./src/getConfig";
import { buildJob, git } from './src/buildJob';
import { consoleGreen, consoleRed, readlineJob } from "./src/utils";

type ParamsType<T> = T extends (param: infer P) => any ? P : T;

export class QuickBuild {

  private quickBuildConfig: QuickBuildConfig;

  constructor(config: QuickBuildConfig) {
    const { environments } = config;
    if (environments) {
      const check = environments.filter(item => typeof item !== "string");
      if (check.length) {
        throw new Error(`config.environments must be Array<string> !`);
      }
    }
    this.quickBuildConfig = config;
  }

  public start = async (env?: Env) => {
    let buildEnv: Env;
    const argv2 = process.argv[2];
    const { onJobSuccess, onJobError } = this.quickBuildConfig;
    const st = Date.now();
    const nextTickDoJob = (v: ParamsType<QuickBuildConfig["onJobSuccess"]>, env?: string) => {
      process.nextTick(() => {
        const buildTime = Date.now() - st;
        const min = Math.floor(buildTime / 60000);
        const str = min > 0 ?
          `${min} min ${((buildTime - min * 60000) / 1000).toFixed(1)}s` :
          `${(buildTime / 1000).toFixed(1)}s`;
        consoleGreen(`✔️   build job use time: ${str}...`);
        if (onJobSuccess) {
          onJobSuccess(v, env);
        }
      });
    };

    if (!env) {
      const { environments = ['sit', 'pre', 'prod'] } = this.quickBuildConfig;
      if (argv2) {
        // 从node argv取参数
        if (environments.includes(argv2)) {
          buildEnv = argv2;
          const distName = await buildJob({ ...this.quickBuildConfig, buildEnv });
          nextTickDoJob(null, buildEnv);
          return distName;
        } else {
          return consoleRed(`${argv2} not in config.environments`);
        }
      }
      const { env: res, rl: rlRes } = await readlineJob(`enter a build env [ '${environments.join("'' | '")}' ] > `);
      buildEnv = res;
      const distName = await buildJob({ ...this.quickBuildConfig, buildEnv, onJobError });
      nextTickDoJob(rlRes, buildEnv);
      return distName;
    } else {
      buildEnv = env;
      const distName = await buildJob({ ...this.quickBuildConfig, buildEnv });
      nextTickDoJob(null, buildEnv);
      return distName;
    }

  }
}

export default { QuickBuild, git };