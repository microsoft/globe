# Globe

Provides localization services for Electron and the browser.
Respects the OS date and time format configuration.

## Installation

`npm i @microsoft/globe`

## Usage

```typescript
import { TimeStringFormat, DateTimeFormatOptions, DateTimeFormatter } from 'globe';

const dateTimeFormatter = new DateTimeFormatter(
  // locale: string
  // isSupportedOsPlatform: boolean
  // osLocaleInfo: ILocaleInfo
  // osPlatform: 'windows' | 'mac' | 'linux' | 'chromeos' | 'android' | 'ios' | 'windowsphone' | 'unknown'
  // osDateTimeLocale: string
);

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

NPM Releases are made manually by @TomasHubelbauer at the moment.

```sh
npm publish --access public
# @microsoft/globe
```

## Release Notes

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
