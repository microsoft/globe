# Globe

Provides localization services for Electron and the browser.
Respects the OS date and time format configuration.

## Installation

`npm i `[`@microsoft/globe`](https://www.npmjs.com/package/@microsoft/globe)

## Usage

```typescript
import { TimeStringFormat, DateTimeFormatOptions, DateTimeFormatter } from 'globe';

// Instantiate the formatter
const dateTimeFormatter = new DateTimeFormatter(locale: string | ILocaleInfo);
```

`locale` is either a locale string (e.g.: `en-US`) or `ILocaleInfo` instance:

```typescript
type ILocaleInfo = {
  // Supported platform
  platform: 'windows' | 'macos';

  // OS date & time format settings (see below for OS support)
  regionalFormat: string; // e.g.: 'en-US'
  shortDate: string; // e.g.: 'dd/MM/y'
  longDate: string; // e.g.: 'd MMMM y'
  shortTime: string; // e.g.: 'HH:mm'
};
```

To format a date and time value:

```typescript
/**
 * Localize the date/time
 * @param date The date/time to localize
 * @param format The format to be used for the localization
 * @returns The localized date/time string
 */
function formatDateTime(date: number | Date, format: DateTimeFormatOptions) {
  return dateTimeFormatter.formatDateTime(date, format);
}
```

### OS Support

Globe is able to honor OS system date and time formatting settings, but it does
not do OS detection and date and time settings querying out of the box as these
features depend on the context you're using Globe in.

If you want to take an advantage of this feature, we recommend you follow this
pattern:

- Make `window.getLocaleInfoAsync` available (return `Promise<ILocaleInfo>`)
- Cache the result of that function and provide it in the `DateTimeFormatter`
  constructor
- Use the exported `getLocaleInfoAsync` alias function if you prefer, which
  wraps the `window.getLocaleInfoAsync` function for you:

```typescript
import { getLocaleInfoAsync } from '@microsoft/globe';
// Provide the supported platform name and obtain the OS locale settings
const localeInfo = await getLocaleInfoAsync(/* 'windows` | 'macos' */);
new DateTimeFormatter(localeInfo);
```

#### Windows

The values provided can be found in Date & Time this way:

- Click on the date and time in the taskbar
- Click on Adjust date and time
- Click on Region & language (here you see the values formatted)
- Click on Advanced
- Check the values of short date, long date and short time

![](windows.png)

#### macOS

- Click on the date and time in the menubar
- Click on Open date and time preferences
- Click on Date and time
- Click on Oppen language and region
- Click on Advanced
- Click on Dates
- Check the values of short and long

![](macos-dates.png)

- Click on Times
- Check the value of 

![](macos-times.png)

## Building

```sh
npm install
npm run build
```

## Testing

Build the package first: `npm run build`.

`npm test`

There is a [GitHub Actions workflow](.github/workflows/main.yml) which runs the
tests on every push to any branch.

## GitHub Release Publishing

GitHub Releases are made manually by @TomasHubelbauer at the moment.

## NPM Release Publishing

Don't forget to build prior to cutting a release!

```sh
# --tag=next pro pre-release (also include a pre-release tag in the version code)
npm publish [--tag=next] --access public
# @microsoft/globe
```

Install the pre-release package using: `npm i @microsoft/globe@next`

NPM Releases are made manually by @TomasHubelbauer at the moment.

## Release Notes

### `2.1` 2020-02-24

Refactored the `DateTimeFormatter` constructor to accept either a locale
string or an instance of `ILocaleInfo` and added information and support
for obtaining `ILocaleInfo` through OS settings.

### `1.0.2` 2020-02-11

Release a version with the release notes in the readme.

### `1.0.1` 2020-02-11

- Fixed a typo in the file name in the `module` field of `package.json`
- Fixed installation instructions to use the current scope - `@microsoft`
- Fixed the usage sample and clean up the readme a bit

### `1.0.0` 2020-02-06

Initial release of the code pulled out of a larger codebase for
public consumption.

## Roadmap

- Set up Jest to run with TypeScript and TSDX and in watch mode
- Set up automated GitHub and NPM releases
- Add more docs, especially around formatting based on OS date time settings

## Contributing

Contributions are welcome (see the [CONTRIBUTING](./CONTRIBUTING.md) file),
though please keep in mind the work-in-progress proof-of-concept state.
Might make sense to just observe/discuss until the thing gets stable and well-documented.

## License

This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.
