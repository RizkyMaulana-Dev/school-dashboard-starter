export function toAttendanceSessionResponse(session: any) {
  return {
    id: session.id,
    title: session.title,
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime,
    schoolClass: session.schoolClass,
    totalRecords: session._count?.records,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export function toAttendanceSessionsResponse(sessions: any[]) {
  return sessions.map(toAttendanceSessionResponse);
}
