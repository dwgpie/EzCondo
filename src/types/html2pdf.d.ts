declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number
    filename?: string
    image?: { type: string; quality: number }
    html2canvas?: { scale: number; useCORS: boolean; scrollY: number }
    jsPDF?: { unit: string; format: string; orientation: string }
  }

  interface Html2PdfInstance {
    set: (options: Html2PdfOptions) => Html2PdfInstance
    from: (element: HTMLElement | null) => Html2PdfInstance
    save: () => Promise<void>
  }

  const html2pdf: () => Html2PdfInstance
  export = html2pdf
}

interface Window {
  html2pdf: () => Html2PdfInstance
}
