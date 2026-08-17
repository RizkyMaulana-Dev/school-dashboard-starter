export interface CreateAttendanceSessionDto {
  title: string;
  date: string | Date;
  startTime?: string | Date;
  endTime?: string | Date;
  schoolClassId: string;
}

export interface UpdateAttendanceSessionDto {
  title?: string;
  date?: string | Date;
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  schoolClassId?: string;
}

export interface AttendanceSessionQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
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
  sessionRecords?: any[];
  createdAt: Date;
  updatedAt: Date;
}
