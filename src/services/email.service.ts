import fs from "fs/promises";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import path from "path";

import { config } from "../configs/config";
import { EmailDataType } from "../constants/email.constants";

class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASSWORD,
            },
        });
    }

    private _renderTemplate = async (
        templateName: string,
        context: Record<string, any>,
    ): Promise<string> => {
        const layoutResource = await fs.readFile(
            path.join(process.cwd(), "src", "templates", "base.hbs"),
            "utf8",
        );
        const layoutTemplate = handlebars.compile(layoutResource);
        const templateResource = await fs.readFile(
            path.join(process.cwd(), "src", "templates", `${templateName}.hbs`),
            "utf8",
        );
        const childTemplate = handlebars.compile(templateResource);
        const childHtml = childTemplate(context);
        return layoutTemplate({ body: childHtml });
    };

    // public async sendEmail(): Promise<void> {
    //     await this.transporter.sendMail({
    //         to: "fedorchak.luba@gmail.com",
    //         subject: "Hello",
    //         text: "Hello from node",
    //     });
    // }

    public async sendEmail(
        to: string,
        emailData: EmailDataType,
        context: Record<string, any>,
    ): Promise<void> {
        await this.transporter.sendMail({
            to,
            subject: emailData.subject,
            html: await this._renderTemplate(emailData.template, context),
        });
    }
}

export const emailService = new EmailService();
