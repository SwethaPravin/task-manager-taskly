export const getStatusText = (statusId) => {
  switch (statusId) {
    case 0:
      return 'Pending';
    case 1:
      return 'In Progress';
    case 2:
      return 'Completed';
    default:
      return 'not found';
  }
}

  //function to get the priority text from the priority id
  export const getPriorityText = (priorityId) => {
    switch (priorityId) {
      case 0:
        return 'Low';
      case 1:
        return 'Medium';
      case 2:
        return 'High';
      default:
        return 'not found';
    }
  };