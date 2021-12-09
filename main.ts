import { Env, QuickBuildConfig } from "./src/getConfig";
import { buildJob, git } from './src/buildJob';
import { consoleRed, readlineJob } from "./src/utils";

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

    const nextTickDoJob = (v?: ParamsType<QuickBuildConfig["onJobSuccess"]>) => {
      process.nextTick(() => {
        if (onJobSuccess) {
          onJobSuccess(v);
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
          nextTickDoJob();
          return distName;
        } else {
          return consoleRed(`${argv2} not in config.environments`);
        }
      }
      const { env: res, rl: rlRes } = await readlineJob(`enter a build env [ '${environments.join("'' | '")}' ] > `);
      buildEnv = res;
      const distName = await buildJob({ ...this.quickBuildConfig, buildEnv, onJobError });
      nextTickDoJob(rlRes);
      return distName;
    } else {
      buildEnv = env;
      const distName = await buildJob({ ...this.quickBuildConfig, buildEnv });
      nextTickDoJob();
      return distName;
    }

  }
}

export default { QuickBuild, git };