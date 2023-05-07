function easeOutQuad(t, b, c, d) {
    t /= d;
    return -c * (t * (t - 2) - 1) + b;
};

module.exports = { easeOutQuad };