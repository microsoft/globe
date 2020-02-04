# Globe

Provides localization services for Electron and the browser.
Respects the OS date and time format configuration.

## Usage

```typescript
import { TimeStringFormat, DateTimeFormatOptions, DateTimeFormatter } from 'globe';

const dateTimeFormatter = new DateTimeFormatter(
  this.locale,
  this.isSupportedOsPlatform,
  this.osLocaleInfo,
  this.i18nextWrapper.osPlatform,
  this.osDateTimeLocale
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

## Build

```sh
npm install
npm run build
```

## Release

GitHub Releases are made manually at the moment.

## Test

Build the package first: `npm run build`.

`npm test`

## Roadmap

- Set up Jest to run with TypeScript and TSDX and in watch mode
- Set up automated GitHub and NPM releases
- Add more docs, especially around formatting based on OS date time settings
- Set up Azure Pipelines CI

## Contributing

Contributions are welcome (see the [CONTRIBUTING](./CONTRIBUTING.md) file), though please keep in mind the work-in-progress proof-of-concept state. Might make sense to just observe/discuss until the thing gets stable and well-documented.

## License

This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.
