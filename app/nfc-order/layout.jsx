import { generateMetadata as generateMeta } from '../metadata'

export const metadata = generateMeta({
  title: 'Order NFC Card',
  description: 'Order your custom NFC card from Zapy Card. Choose from premium plastic, metal, or wooden NFC cards. Fast shipping and professional quality guaranteed.',
  keywords: ['order nfc card', 'buy nfc card', 'nfc card purchase', 'custom nfc card', 'nfc card order', 'premium nfc card'],
  canonical: '/nfc-order',
})

export default function NFCOrderLayout({ children }) {
  return children
}

