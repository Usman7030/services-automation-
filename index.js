const Apify = require("apify");
const { log } = Apify.utils;
const functions = require("./file_read");
const yaml = require("js-yaml");
const fs = require("fs");
YAML = require("yamljs");
const writeYamlFile = require("write-yaml-file");

// put keys in arrays according to their indentation
const terms = [
  "typeorm",
  "uri",
  "retry",
  "retries",
  "eventstore",
  "redis",
  "authServerUrl",
  "realm",
  "clientId",
  "secret",
  "node",
  "name",
  "db",
];

const terms1 = ["memcached", "database", "keycloak", "elasticsearch", "agenda"]; // heading

const terms2 = [
  "type:",
  "host",
  "port:",
  "username",
  "password:",
  "poolMax:",
  "poolMin",
  "streamProtocol:",
  "hostname:",
  "httpPotocol:",
  "address:",
  "tcpPassword:",
  "tcpUsername:",
  "tcpPort",
  "tcpProtocol",
];
const terms3 = ["mevrisdb"]; // all check
Apify.main(async () => {
  const input = await Apify.getValue("INPUT");

  const browser = await Apify.launchPuppeteer();
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8500/ui/dc1/kv/create");

  let abc = await functions.try2();

  for (var k = 0; k < abc.length; k++) {
  
    await page.waitForSelector(".CodeMirror");

    await page.type("label.type-text:nth-child(1)", abc[k][0]);

    for (let j = 1; j < abc[k].length; j++) {
      if (abc[k][j].includes("#")) {
        continue;
      }
      const result1 = await terms.some((term) =>
        abc[k][j].match(new RegExp(`\\b${term}\\b`))
      );
      const result2 = await terms1.some((term) => abc[k][j].includes(term));
      const result3 = await terms2.some((term) => abc[k][j].includes(term));
      const result4 = await terms3.every((term) => abc[k][j].includes(term));

  
      if (result1) {
        await page.type(
          ".CodeMirror > div:nth-child(1) > textarea:nth-child(1)",
          "  " + abc[k][j] + "\n"
        );
      } else if (result2 && !result4 && !result3) {
        await page.type(
          ".CodeMirror > div:nth-child(1) > textarea:nth-child(1)",
          abc[k][j] + "\n"
        );
      } else if (result3 || (result2 && result4)) {
        await page.type(
          ".CodeMirror > div:nth-child(1) > textarea:nth-child(1)",
          `    ` + abc[k][j] + "\n"
        );
      }
    }

    await page.click(
      ".app-view > div:nth-child(2) > form:nth-child(1) > button:nth-child(2)"
    );
    await page.waitForTimeout(1000);

    await page.click(".type-create");
  }

  //  await page.waitForNavigation();

  await browser.close();

  log.info("Done.");
});
