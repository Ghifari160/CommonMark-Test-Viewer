"use strict";

const fs = require("fs"),
      path = require("path"),
      { spawnSync } = require("child_process");

const error_code =
{
  uninit: 0,
  stp_path_unspecified: 1,
  stp_dne: 2,
  stp_stderr: 3,
  t_range_invalid: 4
};

var specTestsPy = "",
    tests = [],
    init = false;

class CTVError extends Error
{
  constructor(errCode, addMsg)
  {
    super(CTVError.__getErrorMsg(errCode));
    this.error_code = errCode;
  }

  static __getErrorMsg(errCode, addMsg = "")
  {
    var ret = "";

    switch(errCode)
    {
      case error_code.uninit:
        ret = "CommonMark Test Viewer is not yet initialized.";
        break;

      case error_code.stp_path_unspecified:
        ret = "Path to spec_tests.py is not specified.";
        break;

      case error_code.stp_dne:
        ret = "Path to spec_tests.py is invalid or the file does not exists";
        break;

      case error_code.stp_stderr:
        ret = "spec_tests.py stderr is not empty. Run python3 " + addMsg
            + " --dump-tests.";
        break;

      default:
        ret = "Unknown error.";
        break;
    }

    return ret;
  }
}

function __retrieveTests(spec_tests_py, cwd, env, hostPlatform)
{
  var st,
      stOpt =
      {
        cwd: cwd,
        env: env,
        encoding: "utf-8"
      };

  // Spawn child process in Windows
  if(hostPlatform == "win32")
    st = spawnSync("py", ["-3", spec_tests_py, "--dump-tests"]. stOpt);
  // Spawn child process literally everywhere else
  else
    st = spawnSync("python3", [spec_tests_py, "--dump-tests"], stOpt);

  if(st.stderr.length > 0)
    throw new CTVError(error_code.stp_stderr, spec_tests_py);

  return st.stdout;
}

module.exports =
{
  statInit: false,
  stp: "",
  tests: [],

  error_code: error_code,

  init: function(spec_tests_py, cwd, env, hostPlatform)
  {
    var st;

    if(spec_tests_py.length < 1)
      throw new CTVError(error_code.stp_path_unspecified);
    else if(!fs.existsSync(spec_tests_py))
      throw new CTVError(error_code.stp_dne);

    this.stp = spec_tests_py;

    try
    {
      st = __retrieveTests(spec_tests_py, cwd, env, hostPlatform);
    }
    catch(e)
    {
      throw e;
    }

    this.stp = spec_tests_py;
    this.tests = JSON.parse(st);
    this.statInit = true;

    return this.tests.length;
  },

  getMarkdown: function(index)
  {
    if(!this.statInit)
      throw new CTVError(error_code.uninit);

    if(index > this.tests.length)
      throw new CTVError(error_code.t_range_invalid);

    return "Example " + this.tests[index - 1].example + "\n"
        + this.tests[index - 1].markdown;
  },

  getMarkdownRange: function(indexRange)
  {
    var stackRet = [];

    if(!this.statInit)
      throw new CTVError(error_code.uninit);

    if(indexRange[0] > this.tests.length || indexRange[0] < 1
        || indexRange[1] > this.tests.length || indexRange[1] < 1
        || indexRange[0] > indexRange[1])
      throw new CTVError(error_code.t_range_invalid);

    for(var i = indexRange[0]; i < indexRange[1] + 1; i++)
      stackRet.push(this.getMarkdown(i));

    return stackRet.join("\n");
  },

  getHtml: function(index)
  {
    if(!this.statInit)
      throw new CTVError(error_code.uninit);

    if(index < 1 || index > this.tests.length)
      throw new CTVError(error_code.t_range_invalid);

    return "Example " + this.tests[index - 1].example + "\n"
        + this.tests[index - 1].html;
  },

  getHtmlRange: function(indexRange)
  {
    var stackRet = [];

    if(!this.statInit)
      throw new CTVError(error_code.uninit);

    if(indexRange[0] > this.tests.length || indexRange[0] < 1
        || indexRange[1] > this.tests.length || indexRange[1] < 1
        || indexRange[0] > indexRange[1])
      throw new CTVError(error_code.t_range_invalid);

    for(var i = indexRange[0]; i < indexRange[1] + 1; i++)
      stackRet.push(this.getHtml(i));

    return stackRet.join("\n");
  }
}
