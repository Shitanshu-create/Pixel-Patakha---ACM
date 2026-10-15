export const getRegistrationStatus = (competition) => {
  if (!competition) return { isOpen: false, reason: 'Loading competition status...' };

  if (!competition.registrationOpen) {
    return { isOpen: false, reason: 'Registration is currently closed by organizers.' };
  }

  if (competition.registrationDeadline && new Date() > new Date(competition.registrationDeadline)) {
    return { isOpen: false, reason: 'Registration deadline has passed.' };
  }

  return { isOpen: true, deadline: competition.registrationDeadline };
};

export const getSubmissionStatus = (competition) => {
  if (!competition) return { isOpen: false, reason: 'Loading competition status...' };

  if (!competition.submissionOpen) {
    return { isOpen: false, reason: 'Design submissions are currently closed.' };
  }

  if (competition.submissionDeadline && new Date() > new Date(competition.submissionDeadline)) {
    return { isOpen: false, reason: 'Submission deadline has passed.' };
  }

  return { isOpen: true, deadline: competition.submissionDeadline };
};

export default {
  getRegistrationStatus,
  getSubmissionStatus,
};
