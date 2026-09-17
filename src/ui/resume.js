import { sound } from '../audio/engine'
import { person } from '../data/content'

// Every resume link both downloads the PDF and opens it in a new tab, so a
// visitor can read it straight away and still keep a copy.
export const resumeLink = {
  href: person.resume,
  download: 'Aditya_Kumar_Joshi_Resume.pdf',
  onClick: () => {
    sound.pageTurn(5)
    window.open(person.resume, '_blank', 'noopener')
  },
}
