// create a function which generate random simple username and similar password
exports.generateUsernameAndPassword = function() {
    const {employeeId, randomNumber} = generateEmployeeId();
    
    const password = randomNumber.toString() + randomNumber.toString(); 
    return { employeeId, password };
  }
  function generateEmployeeId() {
    const randomNumber = Math.floor(Math.random() * 5000) + 1000;
    const employeeId = "EMP" + randomNumber;
    return {employeeId, randomNumber};
  }