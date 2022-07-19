const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of matias', () => {
  const result = palindrome('matias')

  expect(result).toBe('saitam')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})