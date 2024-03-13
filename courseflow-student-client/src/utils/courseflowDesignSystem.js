import { createTheme, Button } from '@mantine/core';
const courseflowTheme = createTheme({
  components: {
    Button: Button.extend({
      classNames: {
        root: 'button-primary'
      }
    })
  },
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif'
  }
});

export default courseflowTheme;