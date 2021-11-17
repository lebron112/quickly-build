import { Env, QuickBuildConfig } from "./src/getConfig";
import { buildJob, git } from './src/buildJob';
import { consoleGreen, readlineJob } from "./src/utils";

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
    if (!env) {
      const { environments = ['sit', 'pre', 'prod'] } = this.quickBuildConfig;
      const { env: res, rl: rlRes } = await readlineJob(`enter a build env [ '${environments.join("'' | '")}' ] > `);
      buildEnv = res;
      consoleGreen(`start build env: '${res}' .`);
      await buildJob({ ...this.quickBuildConfig, buildEnv });
      rlRes.close();
    } else {
      buildEnv = env;
      await buildJob({ ...this.quickBuildConfig, buildEnv });
    }

  }
}

export default { QuickBuild, git };