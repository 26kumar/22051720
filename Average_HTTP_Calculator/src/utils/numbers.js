const calculateAverage = (numbers) => {
    if (!numbers.length) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return parseFloat((sum / numbers.length).toFixed(2));
  };
  
  const updateWindow = (currentWindow, newNumbers, windowSize) => {
    const prevWindow = [...currentWindow];
    const uniqueNewNumbers = [...new Set(newNumbers)];
    
    uniqueNewNumbers.forEach(num => {
      if (!currentWindow.includes(num)) {
        if (currentWindow.length >= windowSize) {
          currentWindow.shift();
        }
        currentWindow.push(num);
      }
    });
    
    return { prevWindow, newWindow: currentWindow };
  };
  
  module.exports = { calculateAverage, updateWindow };