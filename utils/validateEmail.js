function validateEmployeeEmail(email, role) {
    // Check if the role is 'employee' and the email matches the required format
    if (role.toLowerCase() === 'employee') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+\.helpdesk@gmail\.com$/;
      return emailRegex.test(email);
    }
  
    // For roles other than 'employee', no validation required
    return true;
  }

module.exports = validateEmployeeEmail;