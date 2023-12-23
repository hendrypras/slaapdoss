const extractKTPInfoFromOCR = ocrText => {
  const ktpObject = {
    nik: '',
    name: '',
    birthday: '',
  }

  const nikRegex = /NIK\s*:\s*(\d{16})/
  const nameRegex = /Nama\s*:\s*([A-Z\s]+)/
  const birthdayRegex =
    /Tempat\/Tgl Lahir\s*:\s*([A-Z,\s]+),\s*(\d{1,2}-\d{2}-\d{4})/

  const nikMatches = ocrText.match(nikRegex)
  if (nikMatches && nikMatches.length > 1) {
    ktpObject.nik = nikMatches[1]
  }

  const nameMatches = ocrText.match(nameRegex)
  if (nameMatches && nameMatches.length > 1) {
    ktpObject.name = nameMatches[1]
  }

  const birthdayMatches = ocrText.match(birthdayRegex)
  if (birthdayMatches && birthdayMatches.length > 2) {
    ktpObject.birthday = birthdayMatches[2]
  }

  return ktpObject
}

module.exports = { extractKTPInfoFromOCR }
