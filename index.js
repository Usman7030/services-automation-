const functions = require("./file_read");
const yaml = require("js-yaml");

main(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8500/ui/dc1/kv/create");

  let [abc, files] = await functions.try2();

  for (var i = 0; i < abc.length; i++) {
    const tk = await yaml.dump(abc[i], {
      styles: {
        "!!null": "empty", // dump null as ~
      },
      forceQuotes: true,
      // sortKeys: true,
    });

    await page.waitForSelector(".CodeMirror");
    await page.waitForSelector("label.type-text:nth-child(1)");

    await page.type("label.type-text:nth-child(1)", files[i]);
    await page.type(
      ".CodeMirror > div:nth-child(1) > textarea:nth-child(1)",
      tk
    );

    await page.click(
      ".app-view > div:nth-child(2) > form:nth-child(1) > button:nth-child(2)"
    );
    await page.waitForTimeout(1000);

    await page.waitForSelector(".type-create");

    await page.click(".type-create");
  }

  await browser.close();

  log.info("Done.");
});

main();
