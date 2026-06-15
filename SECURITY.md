# Security Policy

## Supported Project Scope

ELICIT is a local-first LLM assurance and security research tool. Security reports for this repository should focus on vulnerabilities in the tool itself, its published site, or its project artifacts.

Examples that are in scope:

- Cross-site scripting or unsafe rendering in the ELICIT web app
- Dependency vulnerabilities with a realistic impact path
- Evidence export behavior that exposes data beyond the local browser session
- Build, packaging, or deployment issues that could affect users of the project
- Documentation that could materially mislead users about safe or authorized use

Examples that are out of scope:

- Reports that a local model can be jailbroken using the included evaluation cases
- Findings against third-party LLM services, vendors, or production systems not owned by this project
- Social engineering, phishing, spam, or denial-of-service testing
- Automated high-volume scanning of the GitHub Pages site

## Responsible Disclosure

Please report suspected vulnerabilities privately before public disclosure.

Preferred contact:

- Open a private security advisory on GitHub for this repository.

If GitHub private advisories are unavailable, open a minimal public issue that says you have a security report and avoids exploit details. A maintainer will coordinate a private channel.

## What To Include

Helpful reports include:

- A clear description of the issue
- Steps to reproduce
- Affected files, routes, or versions
- Expected vs. observed behavior
- Impact and realistic exploitation conditions
- Suggested remediation, if known

## Response Expectations

This is an early-stage project, so response times may vary. The goal is to acknowledge valid reports within a reasonable timeframe, investigate reproducible issues, and credit reporters when appropriate.

## Safe Research Expectations

Do not test ELICIT or any LLM-enabled system without authorization. Do not use this project to attack production systems, bypass access controls, extract data from systems you do not own, or publish active exploit material without permission.

Framework mappings and evaluation outputs are evidence indicators only. They do not establish legal, audit, certification, or regulatory conclusions.
