# Changelog
All notable changes to this project will be documented in this file.

Use the following tags to note what has changed:
* `Added` A new feature that made it to production. 
* `Changed` A public feature that now has (slightly) different functionality, this includes uix changes.
* `Fixed` Any bug fixes
* `Removed` Now removed features
* `Security` In case of vulnerabilities
* `Deprecated` Soon to be removed features

FYI: This Log will be parsed and is end user facing.

unreleased
----------
### Added
- twitter
### Changed

### Fixed

### Removed

### Security

### Deprecated


## 2021-12-30
### Added
- You can now submit a poll and follow the reactions through the website.
- All 15k confessions are now displayed.
- Frequently asked questions, answered on one handy page.
- sponsorships through GitHub
- feature requests and bug reports through GitHub

### Changed
- Confess input is prettier, the photo button is displayed for everyone (login is still required)
- Default font is Recursive. used to be Josefin Slab
- Confessions are paginated so that you are no longer limited to the last x confessions.
- Links in confessions are clickable.
- Hashtags are highlighted
- Printable styling ( just try it out! )

### Fixed
- show status for pending confessions and redirect if posted
- fix archive scrolling
- 15k confessions
- '#NoFilter' correctly displays dates and id's of posted confessions


## 2021-05-28
### Added
 - Changelog
 - Footer

### Changed
 - Moved trigger warning and help links to Article header
 - Use device share api instead of copy to clipboard

### Fixed
 - break words in confessions if they get too long -> long hashtags and urls

## 2021-05-26
### Added
 - Mental help content
 - Append mental health link to confessions
 - Display trigger warnings on website
 - RSS feed

### Changed
 - Option for admins to toggle trigger warnings and mental health links on a confession
 - Differentiate sensitive confessions with a background color
 - Unfiltered feed displays 50 confessions instead of 200
 - Login/Account navigation item is visible by default

### Removed
 - Verify account is removed due to no use case for it. Might reintroduce later

## 2021-04-10
### Changed
 - Default font is Josefin Slab. used to be Alef

### Fixed 
 - Users can upload photos when logged in
