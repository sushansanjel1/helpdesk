export function hasMeaningfulText(html: string): boolean {
  if (typeof document === 'undefined') {
    return (
      html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
        .trim().length > 0
    )
  }

  const element = document.createElement('div')
  element.innerHTML = html
  return (element.textContent ?? '').replace(/\u00a0/g, ' ').trim().length > 0
}
