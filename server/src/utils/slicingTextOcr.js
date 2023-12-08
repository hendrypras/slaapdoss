const parseOCRTextToKTPObject = ocrText => {
  const lines = ocrText.split('\n').filter(line => line.trim() !== '')

  const ktpObject = {
    nik: '',
    name: '',
    birthday: '',
    address: '',
    marial_status: '',
    job: '',
    citizenship: '',
    religion: '',
  }

  lines.forEach(line => {
    if (line.includes('NIK')) {
      ktpObject.nik = line.split(':')[1].trim()
    } else if (line.includes('Nama')) {
      ktpObject.name = line.split(':')[1].trim()
    } else if (line.includes('Tempat/Tgl Lahir')) {
      const birthInfo = line.split(':')
      if (birthInfo.length > 1) {
        const dateRegex = /\b\d{2}-\d{2}-\d{4}\b/
        const dateMatch = line.match(dateRegex)
        ktpObject.birthday = dateMatch ? dateMatch[0] : ''
      }
    } else if (line.includes('Alamat')) {
      ktpObject.address = line.split('+')[1].trim()
    } else if (line.includes('Status Perkawinan')) {
      ktpObject.marial_status = line.split(':')[1].trim()
    } else if (line.includes('Pekerjaan')) {
      ktpObject.job = line.split(':')[1].trim()
    } else if (line.includes('Kewarganegaraan')) {
      ktpObject.citizenship = line.split(':')[1].trim()
    } else if (line.includes('Agama')) {
      ktpObject.religion = line.split(':')[1].trim()
    }
  })

  return ktpObject
}

module.exports = parseOCRTextToKTPObject
