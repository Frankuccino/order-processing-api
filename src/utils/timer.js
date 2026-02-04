function timeExecution(fn) {
  return async function (...args) {
    const start = Date.now();
    const result = await fn(...args);
    const end = Date.now();
    return { execution_ms: end - start, data: result };
  };
}

module.exports = { timeExecution };
