// https://github.com/danestves/markdown-to-text/blob/main/index.ts

interface Options {
  stripListLeaders?: boolean
  listUnicodeChar: string | boolean
  gfm?: boolean
  useImgAltText?: boolean
  preserveLinks?: boolean
}

/**
 * @function removeMarkdown
 *
 * @description
 * Parse the markdown and returns a string
 *
 * @param markdown - The markdown string to parse
 * @param options - The options for the function
 *
 * @returns The parsed plain text
 */
function removeMarkdown(
  markdown: string,

  options: Options = {
    listUnicodeChar: "",
  },
) {
  options = options || {}
  options.listUnicodeChar = Object.prototype.hasOwnProperty.call(
    options,
    "listUnicodeChar",
  )
    ? options.listUnicodeChar
    : false
  options.stripListLeaders = Object.prototype.hasOwnProperty.call(
    options,
    "stripListLeaders",
  )
    ? options.stripListLeaders
    : true
  options.gfm = Object.prototype.hasOwnProperty.call(options, "gfm")
    ? options.gfm
    : true
  options.useImgAltText = Object.prototype.hasOwnProperty.call(
    options,
    "useImgAltText",
  )
    ? options.useImgAltText
    : true
  options.preserveLinks = Object.prototype.hasOwnProperty.call(
    options,
    "preserveLinks",
  )
    ? options.preserveLinks
    : false

  let output = markdown || ""

  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}$/gm, "")

  try {
    if (options.stripListLeaders) {
      if (options.listUnicodeChar) {
        output = output.replace(
          /^(\s*)([*\-+]|\d+\.)\s+/gm,
          `${options.listUnicodeChar} $1`,
        )
      } else {
        output = output.replace(/^(\s*)([*\-+]|\d+\.)\s+/gm, "$1")
      }
    }
    if (options.gfm) {
      output = output
        // Header
        .replace(/\n={2,}/g, "\n")
        // Fenced codeblocks
        .replace(/~{3}.*\n/g, "")
        // Strikethrough
        .replace(/~~/g, "")
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, "")
    }
    if (options.preserveLinks) {
      // Remove inline links while preserving the links
      output = output.replace(/\[(.*?)\][[(](.*?)[\])]/g, "$1 ($2)")
    }
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, "")
      // Remove footnotes?
      .replace(/\[\^.+?\](: .*$)?/g, "")
      .replace(/\s{0,2}\[.*?\]: .*$/g, "")
      // Remove images
      .replace(/!\[(.*?)\][[(].*?[\])]/g, options.useImgAltText ? "$1" : "")
      // Remove inline links
      .replace(/\[(.*?)\][[(].*?[\])]/g, "$1")
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, "")
      .replace(/(^|\n)\s{0,3}>\s?/g, "\n\n")
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "")
      // Remove atx-style headers
      // eslint-disable-next-line regexp/optimal-quantifier-concatenation, regexp/no-super-linear-backtracking
      .replace(/^(\n)?\s*#{1,6}\s+| *(\n)?\s*(?:#+ *)?(\n)?\s*$/gm, "$1$2$3")
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([*_]{1,3})(\S.*?\S?)\1/g, "$2")
      .replace(/([*_]{1,3})(\S.*?\S?)\1/g, "$2")
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/g, "$2")
      // Remove inline code
      .replace(/`(.+?)`/g, "$1")
      // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      .replace(/\n{2,}/g, "\n\n")
  } catch (e) {
    console.error(e)

    return markdown
  }
  return output
}

export default removeMarkdown
