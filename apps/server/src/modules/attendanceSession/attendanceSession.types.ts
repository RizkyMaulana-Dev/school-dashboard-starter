export interface CreateAttendanceSessionDto {
  title: string;
  date: string | Date;
  startTime?: string | Date;
  endTime?: string | Date;
  schoolClassId: string;
  teacherId: string;
}

export interface UpdateAttendanceSessionDto {
  title?: string;
  date?: string | Date;
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  schoolClassId?: string;
  teacherId?: string;
}

export interface AttendanceSessionQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  teacherId?: string;
  date?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface AttendanceSessionResponseDto {
  id: string;
  title: string;
  date: Date;
  startTime: Date | null;
  endTime: Date | null;
  schoolClass: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}