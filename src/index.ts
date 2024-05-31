import * as core from '@actions/core';
import axios from 'axios';
import * as xml2js from 'xml2js';

async function run() {
  try {
    const appName = core.getInput('app-name');
    const publishProfile = core.getInput('publish-profile');

    // Parse the publish profile
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(publishProfile);
    const profile = result.publishData.publishProfile[0].$;

    const userName = profile.userName;
    const password = profile.userPWD;
    const scmUri = profile.publishUrl;

    // Construct the URL
    const url = `https://${scmUri}/api/command`;

    // Make the POST request to restart the web app
    const response = await axios.post(
      url,
      { command: 'restart' },
      {
        auth: {
          username: userName,
          password: password,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      const webappUrl = profile.destinationAppUrl;
      core.setOutput('webapp-url', webappUrl);
      console.log(`App Service Application URL: ${webappUrl}`);
    } else {
      throw new Error(`Failed to restart web app. Status code: ${response.status}`);
    }

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
