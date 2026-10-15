export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

export const validateTeamRegistration = ({
  teamName,
  college,
  leaderEmail,
  password,
  confirmPassword,
  members = [],
  minTeamSize = 1,
  maxTeamSize = 3,
}) => {
  const errors = {};

  if (!teamName || !teamName.trim()) {
    errors.teamName = 'Team name is required.';
  }

  if (!college || !college.trim()) {
    errors.college = 'College/University name is required.';
  }

  if (!leaderEmail || !leaderEmail.trim()) {
    errors.leaderEmail = 'Leader email is required.';
  } else if (!isValidEmail(leaderEmail)) {
    errors.leaderEmail = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!Array.isArray(members) || members.length < minTeamSize || members.length > maxTeamSize) {
    errors.members = `Team must consist of ${minTeamSize} to ${maxTeamSize} members.`;
  } else {
    members.forEach((m, idx) => {
      if (!m.name || !m.name.trim()) {
        errors[`members[${idx}].name`] = `Member ${idx + 1} name is required.`;
      }
      if (!m.email || !m.email.trim()) {
        errors[`members[${idx}].email`] = `Member ${idx + 1} email is required.`;
      } else if (!isValidEmail(m.email)) {
        errors[`members[${idx}].email`] = `Member ${idx + 1} has an invalid email.`;
      }
      if (!m.phone || !m.phone.trim()) {
        errors[`members[${idx}].phone`] = `Member ${idx + 1} phone number is required.`;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isValidEmail,
  validateTeamRegistration,
};
