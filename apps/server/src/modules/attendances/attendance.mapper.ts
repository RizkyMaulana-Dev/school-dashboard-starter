export function toAttendanceResponse(record: any) {
  return {
    id: record.id,
    session: {
      id: record.session.id,
      title: record.session.title,
      date: record.session.date,
      class: record.session.schoolClass,
    },
    student: record.student,
    status: record.status,
    recordedAt: record.recordedAt,
    verificationData: record.verificationData,
    notes: record.notes,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toAttendancesResponse(records: any[]) {
  return records.map(toAttendanceResponse);
}