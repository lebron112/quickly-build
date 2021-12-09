import { Env, QuickBuildConfig } from "./src/getConfig";
import { buildJob, git } from './src/buildJob';
import { consoleRed, readlineJob } from "./src/utils";

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

    if (!env) {
      const { environments = ['sit', 'pre', 'prod'] } = this.quickBuildConfig;
      if (argv2) {
        // 从node argv取参数
        if (environments.includes(argv2)) {
          buildEnv = argv2;
          return await buildJob({ ...this.quickBuildConfig, buildEnv });
        } else {
          return consoleRed(`${argv2} not in config.environments`);
        }
      }
      const { env: res, rl: rlRes } = await readlineJob(`enter a build env [ '${environments.join("'' | '")}' ] > `);
      buildEnv = res;
      const distName = await buildJob({ ...this.quickBuildConfig, buildEnv });
      rlRes.close();
      return distName;
    } else {
      buildEnv = env;
      return await buildJob({ ...this.quickBuildConfig, buildEnv });
    }

  }
}

export default { QuickBuild, git };