import { EmailEnum } from "../enums/email.enum";

export type EmailDataType = {
    subject: string;
    template: string;
};

// type EmailConstants<T extends Record<string, string>> = {
//     [K in keyof T]: EmailDataType;
// };

export const emailConstants: Record<EmailEnum, EmailDataType> = {
    // [EmailEnum.WELCOME]: {
    //     subject: "Welcome",
    //     template: "welcome",
    // },

    [EmailEnum.ACTIVATE]: {
        subject: "Activate Account",
        template: "activate",
    },

    [EmailEnum.RECOVERY]: {
        subject: "Recovery password",
        template: "recovery",
    },
};
