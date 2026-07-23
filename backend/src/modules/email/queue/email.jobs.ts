export type EmailJobPayloads = {
  confirmEmail: {
    target: string;
    userName: string;
    ttl: number;
    code: string;
  };
  changeEmail: {};
};

export type EmailJobName = keyof EmailJobPayloads;
