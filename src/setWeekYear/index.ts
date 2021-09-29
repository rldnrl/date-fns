import differenceInCalendarDays from '../differenceInCalendarDays/index'
import startOfWeekYear from '../startOfWeekYear/index'
import toDate from '../toDate/index'
import toInteger from '../_lib/toInteger/index'
import requiredArgs from '../_lib/requiredArgs/index'
import type {
  LocaleOptions,
  WeekStartOptions,
  FirstWeekContainsDateOptions,
} from '../types'

/**
 * @name setWeekYear
 * @category Week-Numbering Year Helpers
 * @summary Set the local week-numbering year to the given date.
 *
 * @description
 * Set the local week-numbering year to the given date,
 * saving the week number and the weekday number.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#Week_numbering
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param date - the date to be changed
 * @param weekYear - the local week-numbering year of the new date
 * @param options - an object with options.
 * @returns the new date with the local week-numbering year set
 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
 *
 * @example
 * // Set the local week-numbering year 2004 to 2 January 2010 with default options:
 * const result = setWeekYear(new Date(2010, 0, 2), 2004)
 * //=> Sat Jan 03 2004 00:00:00
 *
 * @example
 * // Set the local week-numbering year 2004 to 2 January 2010,
 * // if Monday is the first day of week
 * // and 4 January is always in the first week of the year:
 * const result = setWeekYear(new Date(2010, 0, 2), 2004, {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> Sat Jan 01 2005 00:00:00
 */
export default function setWeekYear(
  dirtyDate: Date | number,
  dirtyWeekYear: number,
  options: LocaleOptions & WeekStartOptions & FirstWeekContainsDateOptions = {}
): Date {
  requiredArgs(2, arguments)

  const locale = options.locale
  const localeFirstWeekContainsDate =
    locale && locale.options && locale.options.firstWeekContainsDate
  const defaultFirstWeekContainsDate =
    localeFirstWeekContainsDate == null
      ? 1
      : toInteger(localeFirstWeekContainsDate)
  const firstWeekContainsDate =
    options.firstWeekContainsDate == null
      ? defaultFirstWeekContainsDate
      : toInteger(options.firstWeekContainsDate)

  let date = toDate(dirtyDate)
  const weekYear = toInteger(dirtyWeekYear)
  const diff = differenceInCalendarDays(date, startOfWeekYear(date, options))
  const firstWeek = new Date(0)
  firstWeek.setFullYear(weekYear, 0, firstWeekContainsDate)
  firstWeek.setHours(0, 0, 0, 0)
  date = startOfWeekYear(firstWeek, options)
  date.setDate(date.getDate() + diff)
  return date
}
