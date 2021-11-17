
import { exec } from 'child_process';
import readline from 'readline';
import chalk from 'chalk';

export const consoleRed = (str: any) => console.log(chalk.red(str));
export const consoleGreen = (str: any) => console.log(chalk.green(str));
export const consoleYellow = (str: any) => console.log(chalk.blue(str));

export const bashCmd = (bash: string,) => new Promise(res => {
  const job = exec(bash, { cwd: process.cwd() });
  console.log(process.cwd());
  job.stdout?.on('data', (data) => {
    console.info(`stdout: ${data}`);
  });
  job.stderr?.on('data', async (data) => {
    // console.log(data);
    if (/Error/i.test(data)) {
      const arr = data.match(/Error:(.|\s|\S)*?(?<=(}|,))/gi);
      if (arr) {
        arr.forEach((item: any) => consoleRed(item));
      }
    }
    if (/stack/.test(data)) {
      const arr = data.match(/stack:(.|\s|\S)*?(?<=(}|,))/g);
      if (arr) {
        arr.forEach((item: any) => consoleRed(item));
      }
    } else {
      consoleYellow(data);
    }
  });
  job.on('close', (code) => {
    res(undefined);
  });
});

// 交互式选择
export const readlineJob: (txt: string) => Promise<{
  env: string;
  rl: readline.Interface;
}> = (txt) => new Promise((reslove, reject) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: txt,
  });
  rl.prompt();
  rl.on('line', (line) => {
    const res = line.trim();
    reslove({ env: res, rl });
    // rl.close();
  }).on('close', () => {
    process.exit(0);
  });
});

// promise错误重试
export const retry = (fnc: () => void, time = 1, retryErrorCb: (err: Error, index: number) => void) => {
  return new Promise((resolve, reject) => {
    let index = 0;
    const job = () => {
      Promise.resolve(fnc()).then(res => {
        resolve(res);
      }).catch(err => {
        index++;
        retryErrorCb && retryErrorCb(err, index);
        index < time ? job() : reject(err);
      });
    };
    job();
  });
};

export default {
  bashCmd,
  consoleRed,
  consoleGreen,
  consoleYellow,
  readlineJob,
  retry
};