export const lightMask = (value: string, mask: string) => {
	let res = ''

	if (!mask) {
		for (let i = 0; i < value.length; i++) {
			res += value[i]
		}
		return res
	}

	const maskedNumber = '#'
	const maskedLetter = 'Z'
	const maskedCirilik = 'Ы'

	const regexNumber = /\d/
	const regexLetter = /[a-zа-яё]/i
	const regexCirilic = /[а-яё]/i

	let charIndex = 0

	for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
		if (!mask[maskIndex]) return res

		const char = value[charIndex]

		if (char == undefined) {
			break
		}

		const matchesNumber = maskedNumber.includes(mask[maskIndex])
		const matchesLetter = maskedLetter.includes(mask[maskIndex])
		const matchesCirilik = maskedCirilik.includes(mask[maskIndex])

		if (matchesNumber) {
			const isNum = regexNumber.test(char)

			if (isNum) {
				res += char
				++charIndex
			}
			else break

		} else if (matchesLetter) {
			const isLetter = regexLetter.test(char)

			if (isLetter) {
				res += char
				++charIndex
			}
			else break

		} else if (matchesCirilik) {
			const isCirilik = regexCirilic.test(char)

			if (isCirilik) {
				res += char
				++charIndex
			}
			else break

		} else if (char == mask[maskIndex]) {
			res += char
			++charIndex
		} else {
			res += mask[maskIndex]
		}
	}
	
	return res
}

export const getChangedFields = <T extends Record<string, any>>(
	state: T,
	copyState: T
): Partial<{ [K in keyof T]: Exclude<T[K], undefined> | null }> => {
  const changes: Partial<T> = {};
  
	(Object.keys(state) as Array<keyof T>).forEach(key => {
    const currentValue = state[key];
    const initialValue = copyState[key];
    
    // Проверяем, изменилось ли значение
    if (currentValue !== initialValue) {
      // Проверяем, является ли новое значение "пустым"
      const isEmpty = 
        currentValue === undefined || 
        currentValue === null || 
        currentValue === '';
      
      // Если значение стало пустым, передаем null для очистки в базе
      // Если значение непустое, передаем новое значение
      changes[key] = isEmpty ? null : currentValue;
    }
  });

  return changes as Partial<{ [K in keyof T]: Exclude<T[K], undefined> | null }>;
};