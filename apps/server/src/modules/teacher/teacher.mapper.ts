export function toTeacherResponse(teacher: any) {
  return {
    id: teacher.id,
    name: teacher.name,
    gender: teacher.gender,
    createdAt: teacher.createdAt,
    updatedAt: teacher.updatedAt,

    email: teacher.user?.email ?? null,

    classes:
      teacher.classes?.map((schoolClass: any) => ({
        id: schoolClass.id,
        name: schoolClass.name,
      })) ?? [],
  };
}

export function toTeachersResponse(teachers: any[]) {
  return teachers.map(toTeacherResponse);
}
