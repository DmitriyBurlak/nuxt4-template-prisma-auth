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
