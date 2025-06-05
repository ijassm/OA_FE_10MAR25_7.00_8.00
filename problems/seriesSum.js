function seriesSum(n) {
    let result = 0;
    while (n != 0) {
        result += n
        n -= 1
    }
    return result
}

console.log(seriesSum(6))