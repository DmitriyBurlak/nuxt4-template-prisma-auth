import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

type DeadlineInput = CalendarDate | Date | string | null | undefined

const formatter = new DateFormatter('ru-RU', {
  dateStyle: 'medium'
})

export const useCalendarHelper = () => {
	// Из CalendarDate (или DateValue) в строку для базы данных
	 const toDatabaseString =  (date: DateValue | null | undefined): string | null => {
    if (!date) return null
    // DateValue всегда имеет метод toString() который возвращает "YYYY-MM-DD"
    return date.toString()
  }

	// Из строки базы данных в CalendarDate
  const fromDatabaseString = (dateString: string | null | undefined): CalendarDate | undefined => {
    if (!dateString) return undefined
    
    try {
      const parts = dateString.split('-')
      if (parts.length !== 3) {
        return undefined
      }
      const year = Number(parts[0])
      const month = Number(parts[1])
      const day = Number(parts[2])
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return undefined
      }
      
      return new CalendarDate(year, month, day)
    } catch {
      return undefined
    }
  }
  
  // Из JavaScript Date в CalendarDate
  const fromJsDate = (date: Date | null | undefined): CalendarDate | undefined => {
    if (!date) return undefined
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    )
  }
  
  // Из CalendarDate в JavaScript Date
  const toJsDate = (date: CalendarDate | null | undefined): Date | undefined => {
    if (!date) return undefined
    return new Date(date.year, date.month - 1, date.day)
  }

	const toCalendarDate = (value: DeadlineInput): CalendarDate | undefined => {
		if (!value) return undefined
		if (value instanceof CalendarDate) return value
		if (value instanceof Date) {
			return new CalendarDate(value.getFullYear(), value.getMonth() + 1, value.getDate())
		}
		try {
			const date = new Date(value)
			return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
		} catch {
			return undefined
		}
	}

	const toDate = (value: DeadlineInput): Date | undefined => {
    if (!value) return undefined
    if (value instanceof Date) return value
    if (value instanceof CalendarDate) {
      return value.toDate(getLocalTimeZone())
    }
    try {
      return new Date(value)
    } catch {
      return undefined
    }
  }

	const format = (value: DeadlineInput): string => {
    const date = toDate(value)
    return date ? formatter.format(date) : 'Не установлен'
  }
	
	// Проверяем, не прошла ли дата
	const isOverdue = (value: DeadlineInput): boolean => {
    const date = toDate(value)
    return date ? date < new Date() : false
  }
	
	// Проверяет установленую дату и 3 для вперед
	// Например можно использовать когда срок подходит к концу
	const isDueSoon = (value: DeadlineInput): boolean => {
    const date = toDate(value)
    if (!date) return false
    
    const today = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(today.getDate() + 3)
    
    return date > today && date <= threeDaysFromNow
  }
	
	// Проверяем, есть ли у пользователя все указанные роли
	const getStatus = (value: DeadlineInput): 'normal' | 'due-soon' | 'overdue' => {
    if (isOverdue(value)) return 'overdue'
    if (isDueSoon(value)) return 'due-soon'
    return 'normal'
  }

	// Проверка, является ли дата выходным
  const isWeekend = (date: CalendarDate): boolean => {
    const jsDate = date.toDate(getLocalTimeZone())
    return jsDate.getDay() === 0 || jsDate.getDay() === 6
  }
  
  // Добавление дней к дате
  const addDays = (date: CalendarDate, days: number): CalendarDate => {
    return date.add({ days })
  }
  
  // Разница между двумя датами в днях
  const diffInDays = (date1: CalendarDate, date2: CalendarDate): number => {
    const jsDate1 = date1.toDate(getLocalTimeZone())
    const jsDate2 = date2.toDate(getLocalTimeZone())
    const diffTime = Math.abs(jsDate2.getTime() - jsDate1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
	// Форматирование даты для отображения
  const formatDate = (date: CalendarDate): string => {
    return formatter.format(date.toDate(getLocalTimeZone()))
  }

	// Получить сегодняшнюю дату как CalendarDate
	const getToday = (): CalendarDate => {
		const now = new Date()
		return new CalendarDate(
			now.getFullYear(),
			now.getMonth() + 1,
			now.getDate()
		)
	}

	// Проверка, что дата в прошлом (или сегодня)
	const isPastOrToday = (date: CalendarDate): boolean => {
		const today = getToday()
		return date.compare(today) <= 0
	}

	// Проверка, что дата в будущем (или сегодня)
	const isFutureOrToday = (date: CalendarDate): boolean => {
		const today = getToday()
		return date.compare(today) >= 0
	}

	// Проверка, что дата в прошлом (строго)
	const isPast = (date: CalendarDate): boolean => {
		const today = getToday()
		return date.compare(today) < 0
	}

	// Проверка, что дата в будущем (строго)
	const isFuture = (date: CalendarDate): boolean => {
		const today = getToday()
		return date.compare(today) > 0
	}
	
	return {
		toCalendarDate,
		toDate,
		format,
		isOverdue,
		isDueSoon,
		getStatus,
		toDatabaseString,
		fromDatabaseString,
		fromJsDate,
		toJsDate,
		isWeekend,
		addDays,
		diffInDays,
		formatDate,
		getToday,
		isPastOrToday,
		isFutureOrToday,
		isPast,
		isFuture,
	}
}