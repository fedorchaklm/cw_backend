import { EmailEnum } from "../enums/email.enum";

export type EmailDataType = {
    subject: string;
    template: string;
};

export const emailConstants: Record<EmailEnum, EmailDataType> = {
    [EmailEnum.ACTIVATE]: {
        subject: "Activate Account",
        template: "activate",
    },

    [EmailEnum.RECOVERY]: {
        subject: "Recovery password",
        template: "recovery",
    },
};
