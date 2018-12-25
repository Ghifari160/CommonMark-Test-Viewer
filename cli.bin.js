#!/usr/bin/env node

// Switch to ES6
"use strict";

const path = require("path"),
      { spawnSync } = require("child_process"),
      homedir = require("os").homedir(),
      fs = require("fs");

const ctv = require("./ctv.lib.js");

const app =
{
  title: "CommonMark Test Viewer",
  version: [0, 2, 3],
  shellVersion: [0, 1, 0],
  libVersion: [0, 1, 0],
  author: "GHIFARI160",
  copyright: "(C) 2018 GHIFARI160, all rights reserved. Released under\n"
           + "the MIT license.",
  latestKnownTag: "0.28"
};

var hostPlatform = process.platform, // Get host platform
    specTestsPy = "";

process.title = app.title;

// Prints the app banner
function banner()
{
  console.log(app.title, "v" + app.version.join("."));
  console.log("CTVShell v" + app.shellVersion.join("."));
  console.log("libctv v" + app.libVersion.join("."), "(" + hostPlatform + ")");
}

// Spawns child process
// @param       string      Child process executable name or path.
// @param       ref:Array   Arguments of the child process.
// @param       string      Environment of the child process.
// @param       string      Working directory of the child process.
// @param:opt   string      Encoding of the child process stdio.
function __spawnChildProcess(process, args, env, cwd, encoding = "utf-8")
{
  var st,
      stOpt =
      {
        env: env,
        cwd: cwd,
        encoding: encoding
      };

  st = spawnSync(process, args, stOpt);

  return [st.stdout, st.stderr];
}

// Retrieves Git version
function __gitVersion()
{
  var cp,
      stStack = [];

  cp = __spawnChildProcess("git", ["--version"], process.env, process.cwd());

  if(cp[0] == null)
    return [-1, -1, -1];
  else
  {
    stStack = cp[0].split(" ");

    for(var i = 0; i < stStack.length; i++)
    {
      if(stStack[i].indexOf(".") > -1 && stStack[i].split(".").length > 2)
      {
        return [parseInt(stStack[i].split(".")[0]),
                parseInt(stStack[i].split(".")[1]),
                parseInt(stStack[i].split(".")[2])];
      }
    }
  }

  return [-1, -1, -1];
}

// Clones CommonMark through Git
function __gitCloneCommonMark()
{
  console.log("Cloning CommonMark from ",
      "https://github.com/commonmark/CommonMark.git" + "....");

  var cp = __spawnChildProcess("git", ["clone",
      "https://github.com/commonmark/CommonMark.git"], process.env, homedir);

  if(cp[1].length > 0 && cp[1].indexOf("not found") > -1)
    return false;
  else
    return true;
}

// Checkouts the latest CommonMark version in Git
// @param   string    latestTag   Git tag for the latest version of CommonMark.
function __gitCheckoutCommonMarkLatest(latestTag)
{
  console.log("Checking out the latest known tag for CommonMark", latestTag,
      "...");

  var cp = __spawnChildProcess("git", ["checkout", `tags/${latestTag}`],
      process.env, homedir + "/CommonMark");

  if(cp[1].length > 0 && cp[1].indexOf("error:") > -1)
    return false;
  else
    return true;
}

function downloadCommonMark(latestTag)
{
  var gitVersion = __gitVersion();

  // Check if spec_tests.py exists at the user's home directory
  if(fs.existsSync(homedir + "/CommonMark/test/spec_tests.py"))
  {
    specTestsPy = homedir + "/CommonMark/test/spec_tests.py";

    return true;
  }

  // Check if Git is installed
  if(gitVersion[0] != -1 && gitVersion[1] != -1 && gitVersion[2] != -1)
  {
    console.log("+=========================================================+");
    console.log("");

    console.log("Git installed. Attempting to retrieve CommonMark",
        "through Git...");

    // Clone CommonMark and checkout the latest tag known by this tool
    if(__gitCloneCommonMark(), __gitCheckoutCommonMarkLatest(latestTag))
    {
      console.log("");

      specTestsPy = homedir + "/CommonMark/test/spec_tests.py";

      return true;
    }
  }

  return false;
}

// Prints the about page upon execution of the `about` command
function cmd_about()
{
  console.log("");
  banner();
  console.log("");
  console.log(app.copyright);
  console.log("");
  console.log("THIS PROJECT IS NOT AFFILIATED WITH THE COMMONMARK PROJECT.");
  console.log("");
  console.log("+=========================================================+");
  console.log(fs.readFileSync(__dirname + "/CommonMark.license",
  {
    encoding: "utf-8"
  }));
  console.log("+=========================================================+");
}

// Prints the help page upon execution of the `help` or `?` commands
function cmd_help()
{
  console.log("about\t\t\t\t\tAbout CommonMark Test Viewer.");
  console.log("clear\t\t\t\t\tClear the shell.");
  console.log("exit\t\t\t\t\tExit out of CommonMark Test Viewer.");
  console.log("help, ?\t\t\t\t\tDisplay this help page.");
  console.log("html<# or range>, ht<# or range>\tView the HTML parse of a",
              "specific test.");
  console.log("markdown<# or range>, md<# or range>\tView the markdown of a",
              "specific test.");
}

// Get spec_tests.py
for(var i = 0; i < process.argv.length; i++)
{
  if(process.argv[i] != "node"
      && path.basename(process.argv[i]) != "node"
      && process.argv[i] != "node.exe"
      && path.basename(process.argv[i]) != "node.exe"
      && process.argv[i] != "cli.bin"
      && path.basename(process.argv[i]) != "cli.bin"
      && path.basename(process.argv[i]) != "cli.bin.js"
      && process.argv[i] != "cli"
      && path.basename(process.argv[i]) != "cli"
      && path.basename(process.argv[i]) != "cli.js"
      && process.argv[i] != "commonmark-test-viewer"
      && path.basename(process.argv[i]) != "commonmark-test-viewer"
      && process.argv[i] != "ctv"
      && path.basename(process.argv[i]) != "ctv")
    specTestsPy = path.resolve(process.argv[i]);
}

// Print the banner
banner();
console.log("");

if(specTestsPy.length < 1 && !downloadCommonMark(app.latestKnownTag))
{
  console.warn("Fatal error: spec_tests.py is unspecified and unable to\n"
      + "retrieve the CommonMark repository from the internet.",
        "Exiting the tool now...");

  process.exit(1);
}

// Attempt to initialize libctv
var init;
try
{
  init = ctv.init(specTestsPy, path.dirname(path.dirname(specTestsPy)),
      process.env, hostPlatform);
}
catch(e)
{
  console.warn(e.message);
  process.exit(1);
}

// Indicate the number of tests that are loaded
console.log(`${init} tests loaded`);
console.log("+=========================================================+");
console.log("");

// @begin   CTVShell
process.stdout.write("CTV> ");
var stdin = process.openStdin();
stdin.addListener("data", function(d)
{
  var input = d.toString().trim().toLowerCase(),
      inputInt = 0,
      inputRange = [],
      rangedMode = false;

  if(input == "about")
    cmd_about();
  else if(input == "clear")
    process.stdout.write("\x1Bc");
  else if(input == "exit")
    process.exit(0);
  else if(input == "help" || input == "?")
    cmd_help();
  else if(input.substring(0, 4) == "html" || input.substring(0, 2) == "ht")
  {
    // Detect if the input is a range
    if(input.indexOf("-") > -1)
      rangedMode = true;

    // Parse range boundaries
    if(rangedMode && input.substring(0, 4) == "html")
    {
      inputRange.push(parseInt(input.substring(4).split("-")[0]));
      inputRange.push(parseInt(input.substring(4).split("-")[1]));
    }
    else if(rangedMode && input.substring(0, 2) == "ht")
    {
      inputRange.push(parseInt(input.substring(2).split("-")[0]));
      inputRange.push(parseInt(input.substring(2).split("-")[1]));
    }
    // Parse input index
    else if(!rangedMode && input.substring(0, 4) == "html")
      inputInt = parseInt(input.substring(4));
    else
      inputInt = parseInt(input.substring(2));

    if(rangedMode && !isNaN(inputRange[0]) && !isNaN(inputRange[1]))
    {
      // Attempt to print the tests in the specified range
      try
      {
        console.log(ctv.getHtmlRange(inputRange));
      }
      catch(e)
      {
        console.warn("Error:", e.message);
      }
    }
    else if(!isNaN(inputInt))
    {
      // Attempt to print the test with the specified index
      try
      {
        console.log(ctv.getHtml(inputInt));
      }
      catch(e)
      {
        console.warn("Error:", e.message);
      }
    }
  }
  else if(input.substring(0, 8) == "markdown" || input.substring(0, 2) == "md")
  {
    // Detect if the input is a range
    if(input.indexOf("-") > -1)
      rangedMode = true;

    // Parse range boundaries
    if(rangedMode && input.substring(0, 8) == "markdown")
    {
      inputRange.push(parseInt(input.substring(8).split("-")[0]));
      inputRange.push(parseInt(input.substring(8).split("-")[1]));
    }
    else if(rangedMode && input.substring(0, 2) == "md")
    {
      inputRange.push(parseInt(input.substring(2).split("-")[0]));
      inputRange.push(parseInt(input.substring(2).split("-")[1]));
    }
    // Parse input index
    else if(!rangedMode && input.substring(0, 8) == "markdown")
      inputInt = parseInt(input.substring(8));
    else
      inputInt = parseInt(input.substring(2));

    if(rangedMode && !isNaN(inputRange[0]) && !isNaN(inputRange[1]))
    {
      // Attempt to print the tests in the specified range
      try
      {
        console.log(ctv.getMarkdownRange(inputRange));
      }
      catch(e)
      {
        console.warn("Error:", e.message);
      }
    }
    else if(!isNaN(inputInt))
    {
      // Attempt to print the test with the specified index
      try
      {
        console.log(ctv.getMarkdown(inputInt));
      }
      catch(e)
      {
        console.warn("Error:", e.message);
      }
    }
  }
  // Indicate invalid commands but ignore empty lines
  else if(input.length > 0)
  {
    console.log("Invalid command. Type \"help\" or \"?\"",
        "to see a list of valid commands.");
  }

  // Reprompt user input
  process.stdout.write("CTV> ");
});
// @end   CTVShell
