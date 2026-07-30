export interface CreateAttendanceDto {
  attendanceSessionId: string;
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  notes?: string;
  verificationData?: Record<string, any>; // JSON
  recordedAt?: string | Date;
}

export interface UpdateAttendanceDto {
  status?: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  notes?: string;
  verificationData?: Record<string, any>;
  recordedAt?: string | Date;
}

export interface AttendanceQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sessionId?: string;
  studentId?: string;
  status?: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  classId?: string; // filter melalui session
  date?: string; // filter tanggal session
  sort?: string;
  order?: "asc" | "desc";
}

export interface AttendanceResponseDto {
  id: string;
  session: {
    id: string;
    title: string;
    date: Date;
    class: {
      id: string;
      name: string;
    };
  };
  student: {
    id: string;
    name: string;
  };
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  recordedAt: Date | null;
  verificationData: any | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
