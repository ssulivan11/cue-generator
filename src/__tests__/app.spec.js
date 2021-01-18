import { render } from '@testing-library/svelte'
import App from '../App.svelte'

test('should render App with props', () => {
  const { container, getByText } = render(App)

  expect(getByText(mockGreeting.text.translate)).toBeInTheDocument()

  expect(
    container.querySelector('.background').style._values['--image-url']
  ).toMatch(/images/)
})
