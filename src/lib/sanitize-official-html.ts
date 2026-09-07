import 'server-only'
import sanitizeHtml from 'sanitize-html'

const allowedTags = [
  'p', 'br', 'hr', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'iframe', 'video', 'audio', 'source',
]

/**
 * Sanitize rich text originating from the legacy CMS before it reaches
 * dangerouslySetInnerHTML. This module is server-only and never enters the
 * browser bundle.
 */
export function sanitizeOfficialHtml(value = ''): string {
  return sanitizeHtml(value, {
    allowedTags,
    allowedAttributes: {
      '*': ['class', 'id', 'title', 'aria-label'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'loading'],
      video: ['src', 'controls', 'poster', 'width', 'height'],
      audio: ['src', 'controls'],
      source: ['src', 'srcset', 'type', 'media'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedIframeHostnames: [
      'www.youtube.com',
      'youtube.com',
      'www.youtube-nocookie.com',
      'maps.google.com',
      'www.google.com',
      'surabaya.go.id',
      'www.surabaya.go.id',
    ],
    transformTags: {
      a: (_tagName, attributes) => {
        const external = /^https?:\/\//i.test(attributes.href || '')
        return {
          tagName: 'a',
          attribs: external
            ? { ...attributes, target: '_blank', rel: 'noopener noreferrer' }
            : attributes,
        }
      },
      iframe: (_tagName, attributes) => ({
        tagName: 'iframe',
        attribs: { ...attributes, loading: 'lazy', title: attributes.title || 'Konten media' },
      }),
    },
    disallowedTagsMode: 'discard',
  })
}
