exports.prepareOptions = function (options) {
    return options.reduce((final, option) => `${final} -${option[0]} ${option[1]}`, '');
}

exports.prepareMetadata = function (metadata) {
    return metadata.map(item => ['metadata', `${item[0]}="${item[1]}"`]);
};