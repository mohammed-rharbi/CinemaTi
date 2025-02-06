export const replaceIp = (url: string, newIp: string) => {
    const updatedUrl = url.replace(/https?:\/\/(\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3})/, (match, ip) => {
      return match.replace(ip, newIp)
    })
    return updatedUrl
  }