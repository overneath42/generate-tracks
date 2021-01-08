function prepareMetadata(metadata) {
  return metadata.map(item => ['metadata', `${item[0]}="${item[1]}"`]);
}

exports.prepareMetadata = prepareMetadata;