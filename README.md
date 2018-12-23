# CommonMark Test Viewer
[CommonMark] provides a suite of comprehensive tests. During the development
process of a Markdown parser, it is sometimes needed to extract a specific
part(s) of the test suite. CommonMark Test Viewer is a simple command line tools
that allow you to extract a specific portion of the test suite.

**DISCLAIMER: THIS PROJECT IS NOT AFFILIATED WITH THE COMMONMARK PROJECT.**

## What is CommonMark
CommonMark is a widely adopted specification of Markdown. It is built on the
base of the original Markdown specification. CommonMark removes the ambiguity
from the original specification.

## Why should you use this tool
CommonMark provides its test suite in the `test/spec_tests.py` file. It is
possible to run a program through the test suite with the `--program` flag.
Although you can extract the whole test suite, it is not possible to extract a
specific portion of the test suite. This tool allows you to extract a specific
portion from your chosen test suite version.

## How to use this tools
This tool does not provide the test suite. First you must clone the CommonMark
spec.

    cd ~
    git clone https://github.com/commonmark/CommonMark.git
    cd ~/CommonMark
    git fetch --all --tags --prune
    git checkout tags/0.28

Next, clone this tool.

    cd ~
    git clone https://github.com/Ghifari160/CommonMark-Test-Viewer.git

Run the tool with the CommonMark test suite.

    cd ~/CommonMark-Test-Viewer
    node app ~/CommonMark/test/spec_tests.py

The tool should output something similar to this:

    +==========================+
    Successfuly loaded 624 tests.
    +==========================+
    commonmark-test-viewer>

You can now use the tool. To extract the Markdown portion of a specific test,
enter `markdown<test #>` or `md<test #>`. Example:

    commonmark-test-viewer> md30
    Example 30
    * Foo
    * * *
    * Bar

    commonmark-test-viewer>

To extract the HTML portion of a specific test, enter `html<test #>` or
`ht<test #>`. Example:

    commonmark-test-viewer> ht30
    Example 30
    <ul>
    <li>Foo</li>
    </ul>
    <hr />
    <ul>
    <li>Bar</li>
    </ul>

    commonmark-test-viewer>

## Contributing
You may contribute to this tool by submitting a pull request. Please note that
the development of this tool requires the dependencies as listed below.

### Package managers
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

### Git
[Git] is the preferred way to clone the repositories of this tool and the
CommonMark project. It is preinstalled on most operating systems. This section
is provided for edge cases where Git is, somehow, not installed by the base
operating system (I'm looking at you, Windows).

#### Install on macOS
The preferred way to install Git on macOS is through Homebrew.

    brew install git

Verify Git by running the following command

    git --version

The output should be similar as follows (any version works fine).

    git version 2.20.1

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

## Troubleshooting
This section provides guidance on some common errors. The section is in no way
a complete list.

### spec_tests.py not found: test/spec_tests.py does not exists.
The file you provided does not actually exists. Double check the path to
`spec_tests.py`.

### spec_tests.py not found: path unspecified.
This tool requires `spec_tests.py` to accurately extract each tests. Please
clone the CommonMark repository and provide the tool with `spec_tests.py`.

[CommonMark]: https://commonmark.org "CommonMark"
[Node.js]: https://nodejs.org/en/ "Node.js"
[Homebrew]: https://brew.sh "The missing package manager for macOS"
[Git]: https://git-scm.com "--distributed-is-the-new-centralized"
