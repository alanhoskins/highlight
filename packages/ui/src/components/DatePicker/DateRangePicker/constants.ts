const DATE_INPUT_FORMAT_WITH_COMMA = 'MMM DD, YYYY'
const DATE_INPUT_FORMAT_WITH_SINGLE_DAY = 'MMM D, YYYY'
const DATE_INPUT_FORMAT_WITH_SINGLE_DAY_AND_NO_COMMA = 'MMM D YYYY'
const DATE_INPUT_FORMAT_WITH_NO_COMMA = 'MMM DD YYYY'
const DATE_INPUT_FORMAT_WITH_SLASH = 'MM/DD/YYYY'
const DATE_INPUT_FORMAT_WITH_DASH = 'MM-DD-YYYY'
const DATE_INPUT_FORMAT_WITH_DOT = 'MM.DD.YYYY'

export const TIME_INPUT_FORMAT = 'HH:mm a'
const TIME_INPUT_FORMAT_NO_SPACE = 'HH:mma'

const TIME_INPUT_FORMAT_12_HOUR = 'h:mm a'
const TIME_INPUT_FORMAT_12_HOUR_NO_SPACE = 'h:mma'
const TIME_INPUT_FORMAT_24_HOURS_MINUTES_NO_AM_PM_24 = 'HH:mm'
const TIME_INPUT_FORMAT_12_HOURS_NO_AM_PM = 'h:mm'

const TIME_INPUT_FORMAT_HOURS_NO_MINUTES = 'h a'
const TIME_INPUT_FORMAT_HOURS_NO_MINUTES_NO_AM_PM = 'h'
const TIME_INPUT_FORMAT_HOURS_NO_MINUTES_NO_SPACE = 'ha'
const TIME_INPUT_FORMAT_HOURS_NO_MINUTES_NO_AM_PM_24_HOUR = 'HH'

export const TIME_DISPLAY_FORMAT = 'hh:mm a'

export const VALID_DATE_INPUT_FORMATS = [
	DATE_INPUT_FORMAT_WITH_SLASH,
	DATE_INPUT_FORMAT_WITH_DASH,
	DATE_INPUT_FORMAT_WITH_DOT,
	DATE_INPUT_FORMAT_WITH_COMMA,
	DATE_INPUT_FORMAT_WITH_NO_COMMA,
	DATE_INPUT_FORMAT_WITH_SINGLE_DAY_AND_NO_COMMA,
	DATE_INPUT_FORMAT_WITH_SINGLE_DAY,
]

export const VALID_TIME_INPUT_FORMATS = [
	TIME_INPUT_FORMAT,
	TIME_INPUT_FORMAT_NO_SPACE,
	TIME_INPUT_FORMAT_12_HOUR,
	TIME_INPUT_FORMAT_12_HOUR_NO_SPACE,
	TIME_INPUT_FORMAT_HOURS_NO_MINUTES,
	TIME_INPUT_FORMAT_HOURS_NO_MINUTES_NO_SPACE,
	TIME_INPUT_FORMAT_HOURS_NO_MINUTES_NO_AM_PM,
	TIME_INPUT_FORMAT_HOURS_NO_MINUTES_NO_AM_PM_24_HOUR,
	TIME_INPUT_FORMAT_24_HOURS_MINUTES_NO_AM_PM_24,
	TIME_INPUT_FORMAT_12_HOURS_NO_AM_PM,
]
