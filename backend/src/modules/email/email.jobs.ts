export type EmailJobPayloads = {
  confirmEmail: {
    target: string;
    userName: string;
    expireText: string;
    code: string;
  };
  changeEmail: {};
};

export type EmailJobName = keyof EmailJobPayloads;
