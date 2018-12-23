## Contributing
You may contribute to this tool by submitting a pull request. Please note that
the development of this tool requires the dependencies as listed below.

### Package manager
The dependencies required by this tool can be easily acquired through package
managers.

#### Install on macOS
The preferred package manager on macOS is [Homebrew]. You can install it by
running the following command

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Verify Homebrew by running the following command

    brew -v

The versions should be, at least, as follows

    Homebrew 1.8.6
    Homebrew/homebrew-core (git revision 304df; last commit 2018-12-23)

#### Install on Windows
The preferred package manager on Windows is [Chocolatey]. You can install it by
running the following command on a privileged Command Prompt.

    @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

Verify Chocolatey by running the following command

    choco -v

The version should be as follows

    0.10.11

**Note:** all updates, installations, and uninstallations through Chocolatey
must be done through a privileged Command Prompt or PowerShell.

### Git
[Git] is the preferred way to clone the repositories of this tool and the
[CommonMark] project. It is preinstalled on most operating systems. This section
is provided for edge cases where Git is, somehow, not installed by the base
operating system (I'm looking at you, Windows).

#### Install on macOS
The preferred way to install Git on macOS is through Homebrew.

    brew install git

Verify Git by running the following command

    git --version

The output should be similar as follows (any version works fine).

    git version 2.20.1

#### Install on Windows
The preferred way to install Git on Windows is through Chocolatey.

    choco install git

Verify Git by running the following command in a new command prompt

    git --version

The output should be similar as follows (any version works fine).

    git version 2.20.1.windows.1

### Node.js
This tool is developed on [Node.js] v11.5.0. Check your version of Node.js by
running `node -v`. If you have the right version of Node.js, you may continue to
the next step.

#### Install on macOS
The preferred way to install Node.js on macOS is through Homebrew.

    brew install node

Verify Node.js and npm by running the following command

    node -v && npm -v

The versions should be, at least, as follows

    v11.5.0
    6.5.0

#### Install on Windows
The preferred way to install Node.js on Windows is through Chocolatey.

    choco install nodejs

Verify Node.js and npm by running the following command in a new Command Prompt.

    node -v && npm -v

The versions should be, at least, as follows

    v11.5.0
    6.5.0

### Python 3
The CommonMark test suite runs on Python 3. This tool is developed on
`spec_tests.py` running on Python v3.7.1. Check your version of Python by
running `python3 --version`. If you have the right version of Python, you may
continue to the next step.

#### Install on macOS
The preferred way to install Python on macOS is through Homebrew.

    brew install python3

Verify Python by running the following command

    python3 --version

The version should be, at least, as follows

    Python 3.7.1

#### Install on Windows
The preferred way to install Python on Windows is through Chocolatey.

    choco install python3

Verify Python by running the following command

    py -3 --version

The version should be, at least, as follows

    Python 3.7.1

[Homebrew]: https://brew.sh "The missing package manager for macOS"
[Chocolatey]: https://chocolatey.org "The package manager for Windows"
[Git]: https://git-scm.com "--distributed-is-the-new-centralized"
[CommonMark]: https://commonmark.org "CommonMark"
[Node.js]: https://nodejs.org/en/ "Node.js"
