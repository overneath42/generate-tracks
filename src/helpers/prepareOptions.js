function prepareOptions(options) {
  return options.reduce((final, option) => `${final} -${option[0]} ${option[1]}`, '');
}

exports.prepareOptions = prepareOptions;