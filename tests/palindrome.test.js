const { palindrome } = require('../utils/for_testing')

test('palindrome of matias', () => {
  const result = palindrome('matias')

  expect(result).toBe('saitam')
})

test('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})