export type EmailJobs = {
  confirmEmail: {
    job: { target: string; userName: string; ttl: number; code: string };
    template: { target: string; userName: string; ttlText: string; code: string };
  };
  changeEmail: {
    job: {};
    template: {};
  };
};

export type EmailJobPayloads = { [K in keyof EmailJobs]: EmailJobs[K]['job'] };
export type EmailTemplatePayloads = { [K in keyof EmailJobs]: EmailJobs[K]['template'] };
export type EmailJobNames = keyof EmailJobs;
