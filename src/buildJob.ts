import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import rimraf from 'rimraf';
import { consoleGreen, consoleRed, bashCmd, retry } from './utils';
import { Env, QuickBuildConfig } from './getConfig';

export const git = simpleGit();

// 检查当前打包分支的文件，再切换回分支
const checkAndBack = async (currentBranch: string) => {
  const { files } = await git.status();
  const filePath = [];
  for (let i = 0; i < files.length; i++) {
    filePath.push(files[i].path);
  }
  if (filePath.length) {
    await git.add(filePath);
    await git.commit(`build: add files`);
  }
  await git.checkout(currentBranch);
};

// 修改package.json文件
const writePackageJson = () => {
  // npm install 时执行的钩子  需要排除
  const npmHooksScripts = ['preinstall', 'postinstall', 'prepare', 'install'];
  const dataStr = fs.readFileSync(path.join(__dirname, '../temp/package.hbs'));
  const originalDataStr = fs.readFileSync(path.join(process.cwd(), './package.json'));
  const data = JSON.parse(dataStr.toString());
  const originalData = JSON.parse(originalDataStr.toString());
  const writeData = {
    ...originalData, ...data, scripts: {
      ...originalData.scripts,
      ...data.scripts,
    }
  };
  npmHooksScripts.forEach(item => {
    if (writeData.scripts[item]) {
      delete writeData.scripts[item];
    }
  });
  const writeDataStr = JSON.stringify(writeData, null, 2);
  fs.writeFileSync(path.join(process.cwd(), './package.json'), writeDataStr);
};

// 命令合计
const gitCommitList = async (buildEnv: string, retryTimes: number, onJobError: (v: any) => void): Promise<string> => {
  const { all, current: currentBranch } = await git.branch({});
  buildEnv = buildEnv.trim();
  // 检查：不能在含有dist的分支进行打包
  if (/_dist_/.test(currentBranch)) {
    console.warn(`⚠️ ${currentBranch} build not allow.`);
    onJobError(new Error(`${currentBranch} build not allowed`));
    return currentBranch;
  }

  // 检查当前版本的名字
  const nowName = (/^trunk_/.test(currentBranch) && currentBranch.replace('trunk_', '')) ||
    (/^release_/.test(currentBranch) && currentBranch.replace('release_', '')) ||
    currentBranch;
  const distName = `${buildEnv === 'sit' ? 'trunk_dist_' :
    (buildEnv === 'pre' ? 'release_pre_dist_' : 'release_dist_')}${nowName}`;
  const find = all.find(item => item === distName);

  // 删除当前打包分支 重新创建
  if (find) {
    await git.branch(['-D', find]);
  }
  await git.checkout(['-b', distName]);
  consoleGreen(`✔️  switch to ${distName} .`);
  // 读取package.json模板 写入到文件
  writePackageJson();

  // 读取.gitignore模板 写入到文件
  const igonreData = fs.readFileSync(path.join(__dirname, '../temp/ignore.hbs'));
  fs.writeFileSync(path.join(process.cwd(), './.gitignore'), igonreData);

  // 进行提交
  await git.add('.');
  try {
    await git.commit(`build: ${currentBranch} and auto push`);
  } catch (e) {
    onJobError(e);
    await checkAndBack(currentBranch);
    return distName;
  }
  try {
    // 推送失败尝试3次
    await retry(async (retryTime?: number) => {
      try {
        await git.push('origin', distName, ['-f']); // 强制推送 打包分支只需要最新的dist输出
      } catch (e) {
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 500);
        });

        throw new Error('retry');
      }

    }, retryTimes, (err, num) => {
      consoleRed(`⚠️   push fail times: ${num}`);
    });
    consoleGreen('✔️  commit pushed success.');
  } catch (e) {
    consoleRed('❌  pushed fail, process exit.');
    onJobError(e);
    await checkAndBack(currentBranch);
    return distName;
  }
  // 切回当前分支
  await checkAndBack(currentBranch);
  return distName;
};

// 服务器node版本太低 ， 本地打包后切换到另一个 xxx_dist_xxx分支，秒发布
export const buildJob = async ({
  buildEnv,
  getBuildBashWithEnv = (env: Env) => `npm run build:${env}`,
  pushRetryTimes = 3,
  outPutDir = './dist',
  onJobError = (v: any) => { },
}: Omit<QuickBuildConfig, 'onJobSuccess'> & { buildEnv: Env }): Promise<string> => {
  consoleGreen(`start build env: '${buildEnv}' .`);
  // 检查是否有未提交的内容
  const statusRes = await git.status();

  const { files } = statusRes;
  let notCommit = false;
  for (let i = 0; i < files.length; i++) {
    const { path } = files[i];
    consoleRed(`❌  has file not commited, path: ${path}.`);
    notCommit = true;
  }
  if (notCommit) {
    onJobError(new Error('❌  has file not commited'));
    return '';
  }
  // 编译
  const bash = getBuildBashWithEnv(buildEnv);
  await bashCmd(bash);
  try {
    fs.statSync(path.join(process.cwd(), outPutDir));
    consoleGreen('✔️   编译完成');
  } catch (e) {
    onJobError(e);
    consoleRed('❌  build fail.');
    return '';
  }

  const distName = await gitCommitList(buildEnv, pushRetryTimes, onJobError);
  await new Promise((res, rej) => {
    rimraf(path.join(process.cwd(), outPutDir), (err) => {
      if (err) rej(err);
      res(undefined);
    });
  });
  consoleGreen(`✔️  ${outPutDir} removed.`);
  return distName;
};

export default {
  buildJob,
  git,
};