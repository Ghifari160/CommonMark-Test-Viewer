#!/usr/bin/env node

// Switch to ES6
"use strict";

const path = require("path"),
      ctv = require("./ctv.lib.js");

const app =
{
  title: "CommonMark Test Viewer",
  version: [0, 2, 3],
  shellVersion: [0, 1, 0],
  libVersion: [0, 1, 0],
  author: "GHIFARI160",
  copyright: "(C) 2018 GHIFARI160, all rights reserved. Released under\n"
           + "the MIT license."
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
  console.log("The CommonMark spec (spec.txt) and DTD (CommonMark.dtd) are"
            + "\n\nCopyright (C) 2014-16 John MacFarlane\n\nReleased under "
            + "the Creative Commons CC-BY-SA 4.0 license:\n<http://creative"
            + "commons.org/licenses/by-sa/4.0/>.");
  console.log("+=========================================================+");
  console.log("");
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
      && path.basename(process.argv[i]) != "cli.js"
      && path.basename(process.argv[i]) != "cli")
    specTestsPy = process.argv[i];
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

// Print the banner and indicate the number of tests that are loaded
banner();
console.log("");
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
