process.env.FUNCTIONS_EMULATOR = 'aws_lambda';
process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs12.x';

const chromium = require('chrome-aws-lambda');
let autocodePuppeteer = chromium.puppeteer;
let puppeteerLaunch = chromium.puppeteer.launch.bind(autocodePuppeteer);

// allow passing of font-render-hinting flags to address Puppeteer text rendering issues
// https://github.com/puppeteer/puppeteer/issues/2410
const allowedArgs = ['--font-render-hinting=none', '--font-render-hinting=medium']

autocodePuppeteer.launch = async (options) => {
  options = options || {};
  if (options.hasOwnProperty('args')) {
    options.args.forEach((arg) => {
      if (!allowedArgs.includes(arg)) {
        throw new Error(`You may not specify ${arg} as a custom "args" option when launching Puppeteer in Autocode. Allowed custom "args": ${allowedArgs}`)
      }
    })
  }
  if (options.hasOwnProperty('executablePath')) {
    throw new Error('You may not specify a custom "executablePath" option when launching Puppeteer in Autocode.')
  }
  if (options.hasOwnProperty('headless')) {
    throw new Error('You may not specify a custom "headless" option when launching Puppeteer in Autocode.')
  }
  if (!options.hasOwnProperty('defaultViewport')) {
    options.defaultViewport = chromium.defaultViewport;
  }
  if (!options.hasOwnProperty('ignoreHTTPSErrors')) {
    options.ignoreHTTPSErrors = true;
  }
  options.args = Object.assign(chromium.args, options.args);
  options.executablePath = await chromium.executablePath;
  options.headless = chromium.headless;
  return puppeteerLaunch(options);
};

module.exports = autocodePuppeteer;
