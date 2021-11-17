module.exports = {
  environments: ['sit', 'pre', 'prod'],
  getBuildBashWithEnv: (env) => `npm run local_build:${env}`,
}