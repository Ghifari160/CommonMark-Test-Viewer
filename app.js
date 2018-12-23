#!/usr/bin/env node

"use strict";

const fs = require("fs"),
      path = require("path"),
      { spawnSync } = require("child_process");

const app =
{
  title: "CommonMark Test Viewer",
  version: [0, 1, 0],
  author: "GHIFARI160",
  copyright: "(C) 2018 GHIFARI160, all rights reserved. Released under the MIT "
           + "license."
};

var hostOS = process.platform, // Get host operating system
    specTestsPy = "";

process.title = app.title;

// Get spec_tests.py
for(var i = 0; i < process.argv.length; i++)
{
  if(process.argv[i] != "node" && path.basename(process.argv[i]) != "node"
      && process.argv[i] != "app" && path.basename(process.argv[i]) != "app.js")
    specTestsPy = process.argv[i];
}

// Verify that spec_tests.py is specified
if(specTestsPy.length < 1)
{
  console.warn("spec_tests.py not found: path unspecified.");
  process.exit(1)
}

// Verify the existence of spec_tests.py
if(!fs.existsSync(specTestsPy))
{
  console.warn("spec_tests.py not found:", specTestsPy, "does not exists.");
  process.exit(1);
}

// Get test suite from spec_tests.py
var st,
    stOpt =
    {
      cwd: path.dirname(path.dirname(specTestsPy)),
      env: process.env,
      encoding: "utf-8"
    };

// Spawn child process in Windows
if(hostOS == "win32")
  st = spawnSync("py", ["-3", specTestsPy, "--dump-tests"], stOpt);
// Spawn child process literally everywhere else
else
  st = spawnSync("python3", [specTestsPy, "--dump-tests"], stOpt);

if(st.stderr.length > 0)
{
  console.warn("spec_tests.py error:");
  console.warn("+==========================+");
  console.warn(st.stderr);
  console.warn("+==========================+");
  process.exit(1);
}

var testsDump = JSON.parse(st.stdout);

console.log("Running", app.title, "on platform", hostOS);
console.log("+==========================+");
console.log("Successfuly loaded", testsDump.length, "tests.");
console.log("+==========================+");

// Prompt the user to view test items
process.stdout.write("commonmark-test-viewer> ");
var stdin = process.openStdin();
stdin.addListener("data", function(d)
{
  var input = d.toString().trim().toLowerCase(),
      inputInt = 0;

  if(input == "about")
  {
    console.log("");
    console.log(app.title, "v" + app.version.join("."), "on platform", hostOS);
    console.log(app.copyright);
    console.log("");
    console.log("THIS PROJECT IS NOT AFFILIATED WITH THE COMMONMARK PROJECT.");
    console.log("");
    console.log("+===========================================+");
    console.log("The CommonMark spec (spec.txt) and DTD (CommonMark.dtd) are\n"
        + "\nCopyright (C) 2014-16 John MacFarlane\n\nReleased under the "
        + "Creative Commons CC-BY-SA 4.0 license:\n<http://creativecommons.org/"
        + "licenses/by-sa/4.0/>.");
    console.log("+===========================================+");
    console.log("");
  }
  else if(input == "exit")
    process.exit(0);
  else if(input == "help" || input == "?")
  {
    console.log("about\t\t\t\tAbout CommonMark Test Viewer.");
    console.log("exit\t\t\t\tExit out of the program.");
    console.log("help, ?\t\t\t\tDisplay this help page.");
    console.log("html<test #>, ht<test #>\tView the HTML parse of a specific "
        + "test #.");
    console.log("markdown<test #>, md<test #>\tView the markdown of a "
        + "specific test #.");
  }
  else if(input.substring(0, 4) == "html" || input.substring(0, 2) == "ht")
  {
    if(input.substring(0, 4) == "html")
      inputInt = parseInt(input.substring(4));
    else
      inputInt = parseInt(input.substring(2));

    if(!isNaN(inputInt) && inputInt <= testsDump.length)
    {
      console.log("Example", testsDump[inputInt - 1].example);
      console.log(testsDump[inputInt - 1].html);
    }
  }
  else if(input.substring(0, 8) == "markdown" || input.substring(0, 2) == "md")
  {
    if(input.substring(0, 8) == "markdown")
      inputInt = parseInt(input.substring(8));
    else
      inputInt = parseInt(input.substring(2));

    if(!isNaN(inputInt) && inputInt <= testsDump.length)
    {
      console.log("Example", testsDump[inputInt - 1].example);
      console.log(testsDump[inputInt - 1].markdown);
    }
  }
  else
    console.log("Invalid command. Type 'help' or '?'",
        "to see a list of valid commands.");

  process.stdout.write("commonmark-test-viewer> ");
});
