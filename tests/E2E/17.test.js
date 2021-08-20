const getDataTestIdSelector = dataTestId => `[data-testid="${dataTestId}"]`

describe('Login', () => {
  beforeEach(async () => {
    console.log('beforeEach do teste');
    await page.goto(BASE_URL)
  })

  it('shows error message when password is not set', async () => {
    console.log('preenchendo email');
    await page.type(getDataTestIdSelector('email'), 'fulano@qa.com')
    console.log('preenchendo senha');
    await page.type(getDataTestIdSelector('senha'), 'teste')
    console.log('clicando entrar');
    await page.click(getDataTestIdSelector('entrar'))
    console.log('esperando \'logout\'');
    await page.waitForSelector(getDataTestIdSelector('logout'))
    expect(true).toBe(false)
  })

  xit('successful login', async () => {
    await page.type(getDataTestIdSelector('email'), 'someuser@gmail.com')
    await page.type(getDataTestIdSelector('senha'), 'somepass')
    await page.click(getDataTestIdSelector('entrar'))

    await page.waitForSelector(getDataTestIdSelector('logout'))

    const url = await page.url()
    expect(url).toContain('/admin/home')
  })
})
