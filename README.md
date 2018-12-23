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
